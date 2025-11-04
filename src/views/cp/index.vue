<template>
  <div
    class="flex flex-col items-center w-full h-full gap-5 mx-auto md:flex-row bg-gray-50 md:px-10 md:gap-10"
  >
    <!-- 标题与地图 -->
    <section class="md:w-[45%] w-full">
      <h1
        class="md:hidden flex items-center justify-center w-full h-[60px] bg-white text-2xl font-bold"
      >
        全国车牌归属地查询
      </h1>
      <div
        id="amap"
        class="md:flex-1 aspect-[4/3] md:rounded-lg md:shadow-xl border-2"
      ></div>
    </section>

    <!-- 当前选中的省份与地区展示 -->
    <div class="flex flex-col items-center flex-1 gap-10">
      <section class="flex flex-col items-center justify-center gap-5">
        <strong
          class="flex gap-5 text-5xl font-bold leading-none tracking-tight text-gray-900"
        >
          <div
            class="w-[2ch] text-center border-2 border-gray-500 aspect-square flex items-center justify-center rounded-lg"
          >
            {{ currentProvincePlate?.prefix }}
          </div>
          <span
            class="w-[2ch] text-center border-2 border-gray-500 aspect-square flex items-center justify-center rounded-lg"
            >{{ currentArea?.code }}</span
          >
        </strong>
        <strong
          class="flex flex-col items-center justify-center gap-5 text-xl"
          v-if="currentProvincePlate"
        >
          <span class="text-blue-700">
            {{ currentProvincePlate?.province }} {{ currentArea?.name }}
          </span>
          <span class="px-10 text-sm text-gray-400">{{
            currentArea?.remark
          }}</span>
        </strong>
      </section>

      <!-- 省份与地区选择 -->
      <section class="flex flex-wrap items-center justify-center gap-4 mx-auto">
        <!-- 已选省份 → 显示城市按钮 -->
        <template v-if="currentProvincePlate">
          <button
            v-for="area in currentProvincePlate.area"
            :key="area.code"
            type="button"
            @click="onClickArea(area)"
            :title="area.name || area.code"
            :aria-pressed="currentArea === area"
            :class="[
              'py-2.5 px-5 md:px-6 me-2 mb-2 text-sm md:text-xl font-bold border border-gray-200 rounded-lg',
              currentArea === area
                ? 'bg-blue-50 text-blue-700 ring-2 ring-blue-100'
                : 'bg-white hover:bg-gray-100 hover:text-blue-700'
            ]"
          >
            {{ area.code }}
          </button>
        </template>

        <!-- 未选省份 → 显示省份简称按钮 -->
        <template v-else>
          <button
            v-for="plate in provincePlates"
            :key="plate.prefix"
            type="button"
            @click="onClickPlate(plate)"
            :title="plate.province || plate.prefix"
            class="py-2.5 px-5 me-2 mb-2 text-sm font-bold bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700"
          >
            {{ plate.prefix }}
          </button>
        </template>
      </section>

      <!-- 返回按钮 -->
      <button
        v-if="currentArea"
        @click="onClickBack"
        type="button"
        class="flex justify-center w-[200px] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="square"
            stroke-width="2"
            d="M5.75 7H14a6 6 0 0 1 0 12H6.5M8 10.5L4.5 7L8 3.5"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AMAP_KEY } from "@/constants";
import AMapLoader from "@amap/amap-jsapi-loader";
import { Area, ProvincePlate, provincePlateArray } from "./data";

// ==================== 省份与地区逻辑 ====================

// 当前选中省份与地区
const currentProvincePlate = ref<ProvincePlate | null>(null);
const currentArea = ref<Area | null>(null);

// 所有省份数据
const provincePlates: ProvincePlate[] = provincePlateArray;

// 点击省份 → 展示城市列表
const onClickPlate = (item: ProvincePlate) => {
  currentProvincePlate.value = item;
};

// 点击城市 → 绘制行政区边界
const onClickArea = (area: Area) => {
  currentArea.value = area;
  if (!isAMapLoaded.value) return;
  drawBounds(area.name, AMapRef.value);
};

// 返回上一级
const onClickBack = () => {
  currentArea.value = null;
  currentProvincePlate.value = null;
};

// ==================== 地图初始化逻辑 ====================

const AMapRef = ref<any>(null); // AMap 主对象引用
const map = ref<any>(null); // 地图实例
const district = ref<any>(null); // 行政区查询实例
const polygon = ref<any>(null); // 边界多边形实例
const geolocationRef = ref<any>(null); // 定位插件实例
const isAMapLoaded = ref<boolean>(false); // 标记地图是否加载完成
const level = ref("city"); // 默认行政区级别

/**
 * 初始化高德地图
 */
const initAMap = () => {
  const loading = ElLoading.service({
    lock: true,
    text: "地图加载中，请稍后...",
    background: "rgba(0, 0, 0, 0.2)",
  });

  AMapLoader.load({
    key: AMAP_KEY,
    version: "2.0",
    plugins: [
      "AMap.DistrictSearch",
      "AMap.Polygon",
      "AMap.ToolBar",
      "AMap.Geolocation",
    ],
  })
    .then((AMap) => {
      // 创建地图实例
      map.value = new AMap.Map("amap", {
        viewMode: "3D",
        zoom: 10,
        zooms: [2, 30],
        center: [116.397428, 39.90923], // 默认北京中心点
      });

      AMapRef.value = AMap;

      // 初始化定位插件
      geolocationRef.value = new AMap.Geolocation({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
        convert: true,
        showButton: true,
        buttonPosition: "LB",
        buttonOffset: new AMap.Pixel(10, 20),
        showMarker: true,
        showCircle: true,
        panToLocation: true,
        zoomToAccuracy: true,
      });

      // 添加工具条控件（包含缩放）
      map.value.addControl(
        new AMap.ToolBar({
          position: { top: "10px", left: "10px" },
          liteStyle: false,
        })
      );

      // 自动定位
      locate();

      isAMapLoaded.value = true;
      loading.close();
    })
    .catch((err) => {
      console.error("地图加载失败：", err);
      loading.close();
    });
};

// ==================== 行政区边界逻辑 ====================

/**
 * 绘制行政区边界
 */
const drawBounds = (name: string, AMap: any) => {
  if (!district.value) {
    district.value = new AMap.DistrictSearch({
      subdistrict: 1,
      extensions: "all",
      level: level.value,
    });
  }

  district.value.level = level.value;

  district.value.search(name, (_: any, result: any) => {
    if (polygon.value) {
      map.value.remove(polygon.value);
      polygon.value = null;
    }

    if (!result?.districtList?.[0]) {
      console.warn("⚠️ 请正确填写名称或更新其他名称");
      return;
    }

    const bounds = result.districtList[0].boundaries;
    if (bounds) {
      const paths = bounds.map((b: any) => [b]);
      polygon.value = new AMap.Polygon({
        strokeWeight: 4,
        path: paths,
        fillOpacity: 0.2,
        fillColor: "#80d8ff",
        strokeColor: "#0091ea",
      });

      map.value.add(polygon.value);
      map.value.setFitView(polygon.value, false, [20, 20, 20, 20]);
    }
  });
};

// ==================== 定位逻辑 ====================

/**
 * 获取当前位置并居中地图
 */
const locate = () => {
  if (!geolocationRef.value) {
    console.warn("⚠️ 定位插件未初始化");
    return;
  }

  geolocationRef.value.getCurrentPosition((status: string, result: any) => {
    console.log("定位状态：", status, result);
    if (status === "complete") {
      console.log("✅ 定位成功");
      map.value.setZoomAndCenter(14, result.position);
    } else {
      console.warn("❌ 定位失败：", result);
    }
  });
};

// ==================== 启动地图 ====================
initAMap();
</script>
