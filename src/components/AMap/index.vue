<template>
  <div class="flex flex-col">
    <div id="map" class="relative flex-1 w-full">
      <template v-if="isMapLoaded">
        <el-button
          class="border w-[30px] h-[30px] absolute z-10 top-4 left-[20px] navigate flex items-center justify-center"
          @click="onBack" v-show="isNavigate">
          <el-icon color="#000">
            <ArrowLeftBold />
          </el-icon>
        </el-button>
        <el-button
          class="border w-[30px] h-[30px] absolute z-10 bottom-24 right-[20px] navigate flex items-center justify-center"
          @click="onNavigate" v-show="!isNavigate">
          <el-icon color="#000">
            <Position />
          </el-icon>
        </el-button>
      </template>
    </div>

    <div id="panel" class="w-full overflow-x-hidden overflow-y-auto bg-white max-h-[300px] transition-all"
      v-show="isMapLoaded">
      <div class="amap-call"></div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { AMAP_KEY } from '@/constants';
import AMapLoader from '@amap/amap-jsapi-loader';
import { ArrowLeftBold, Position } from '@element-plus/icons-vue';
import { onMounted, ref } from 'vue';

interface Marker {
  point: number[];
  content?: string;
}

export interface IAMap {
  center: number[]; // 地图中心坐标
  zoom?: number; // 缩放级别
  viewMode?: '2D' | '3D'; // // 地图视图模式，默认为‘2D’，可选’3D’，选择‘3D’会显示 3D 地图效果。
  pitch?: number; // 视角
  endMarker?: Marker
}
const props = defineProps<{
  map: IAMap
}>()

onMounted(() => {
  initAMap()
})


const mapRef = ref<any>(null);
const geolocationRef = ref<any>(null);
const AMapRef = ref<any>(null);
const drivingRef = ref<any>(null);
const isMapLoaded = ref<boolean>(false);
const isNavigate = ref<boolean>(false);

const initAMap = () => {
  const loading = ElLoading.service({
    lock: true,
    text: '加载地图中，请稍后...',
    background: "rgba(0, 0, 0, 0.2)",
  })
  AMapLoader.load({
    key: AMAP_KEY, // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    // 需要使用的的插件列表
    plugins: [
      'AMap.Geocoder', // 逆向地理解码插件
      'AMap.Marker', // 点标记插件
      'AMap.Geolocation',
      'AMap.Driving',
      'AMap.ToolBar'
    ],
  }).then((AMap) => {

    const map = new AMap.Map('map', {
      viewMode: props.map.viewMode ?? '2D',
      zoom: props.map.zoom ?? 17, // 地图显示的缩放级别
      center: props.map.center, // 初始化地图中心点位置
      buildingAnimation: true,
      pitch: props.map.pitch ?? 10,
    });

    AMapRef.value = AMap;
    mapRef.value = map;

    geolocationRef.value = new AMap.Geolocation({
      enableHighAccuracy: true, //  是否使用高精度定位，默认:true
      timeout: 10000, //  超过10秒后停止定位，默认：无穷大
      maximumAge: 0, // 定位结果缓存0毫秒，默认：0
      convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
      showButton: true, //  显示定位按钮，默认：true
      buttonPosition: 'LB',  // 定位按钮停靠位置，默认：'LB'，左下角
      buttonOffset: new AMap.Pixel(10, 20), //  定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
      showMarker: true, //  定位成功后在定位到的位置显示点标记，默认：true
      showCircle: true, //  定位成功后用圆圈表示定位精度范围，默认：true
      panToLocation: true,  //  定位成功后将定位到的位置作为地图中心点，默认：true
      zoomToAccuracy: true  //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
    });

    const { endMarker } = props.map;
    if (endMarker) {
      map.add([createEndMarker(AMap, endMarker.point)]);
      //创建 infoWindow 实例
      const { content = '' } = endMarker;
      if (content.length > 0) {
        const infoWindow = new AMap.InfoWindow({
          content, //传入字符串拼接的 DOM 元素
          anchor: "bottom-center",
          offset: new AMap.Pixel(0, -30),
        });
        infoWindow.open(map, map.getCenter());
      }
    }

    // 工具栏
    map.addControl(new AMap.ToolBar({
      // 简易缩放模式，默认为 false
      liteStyle: false
    }));

    // 地图加载完成事件
    map.on('complete', function () {
      loading.close();
      isMapLoaded.value = true;
    });
  });
}

// const detectDevice = () => {
//   const userAgent = navigator.userAgent.toLowerCase();
//   if (/iphone|ipad|ipod/.test(userAgent)) {
//     return 'iOS';
//   } else if (/android/.test(userAgent)) {
//     return 'Android';
//   } else {
//     return 'pc';
//   }
// }

// 创建一个 icon
const createEndMarker = (AMap: any, point: number[]) => {
  const endIcon = new AMap.Icon({
    size: new AMap.Size(25, 34),
    image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
    imageSize: new AMap.Size(135, 40),
    imageOffset: new AMap.Pixel(-95, -3)
  });

  // 将 icon 传入 marker
  const endMarker = new AMap.Marker({
    position: new AMap.LngLat(point[0], point[1]),
    icon: endIcon,
    offset: new AMap.Pixel(-13, -30)
  });
  return endMarker;
}

// 
const onNavigate = () => {
  const loading = ElLoading.service({
    lock: true,
    text: '正在规划驾车路线...',
    background: "rgba(0, 0, 0, 0.2)",
  })
  //构造路线导航类
  drivingRef.value = new AMapRef.value.Driving({
    map: mapRef.value,
    panel: "panel",
    // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
    policy: AMapRef.value.DrivingPolicy.LEAST_TIME
  });
  geolocationRef.value.getCurrentPosition((status: string, result: any) => {
    let [lng, lat] = [-1, -1];
    if (status == "complete") {
      lng = result.position.lng;
      lat = result.position.lat;
      // 116.303843, 39.983412
      drivingRef.value.search(new AMapRef.value.LngLat(lng, lat), new AMapRef.value.LngLat(props.map.center[0], props.map.center[1]), (status: any, result: any) => {
        // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
        if (status === 'complete') {
          ElMessage.success('驾车路线获取成功！');
          isNavigate.value = true;
        } else {
          ElMessage.error('驾车路线获取失败：' + result)
        }
        loading.close();
      });
      // const device = detectDevice();
      // const from = `${lng},${lat},我的位置`
      // const to = '104.026494,30.698211,安泰安蓉锦江宾馆(成都一品天下金沙店)'; // address：目的地
      // if (device === 'iOS') {
      //   const [longitude, latitude, name] = to.split(',');
      //   window.open(`iosamap://path?sourceApplication=mhc&sid=&slat=${lat}&slon=${lng}&sname=A&dlat=${latitude}&dlon=${longitude}&dname=${name}&dev=0&t=0`, '_blank');
      // } else if (device === 'pc') {
      //   window.open(`https://uri.amap.com/navigation?from=${from}&to=${to}&mode=car&policy=0&src=&coordinate=&callnative=0`, '_blank');
      // }
    } else {
      ElMessage.error('定位失败!');
      loading.close();
    }
  });
}

const onBack = () => {
  // 清除规划的路线
  isNavigate.value = false;
  drivingRef.value.clear();
  mapRef.value.setCenter(props.map.center);
  setTimeout(() => {
    mapRef.value.setZoom(18);
  }, 1200);
}
// const location = ref([-1, -1]);
// const errorMessage = ref('');


// const showPosition = (position: { coords: { latitude: number; longitude: number; }; }) => {
//   location.value = [position.coords.longitude, position.coords.latitude];
//   // const from = `139.762662,35.693785,我的位置`;
//   console.log("%c Line:144 🍕 location.value", "color:#465975", location.value);
//   const to = '104.026494,30.698211,安泰安蓉锦江宾馆(成都一品天下金沙店)'; // address：目的地
//   const from = '116.32810279404168,39.90083463437583,北京市丰台区北京西站'; // address：目的地
//   //  116.32810279404168,39.90083463437583,北京市丰台区北京西站
//   // 116.478346,39.997361,我的位置
//   window.open(`https://uri.amap.com/navigation?from=${from}&to=${to}&mode=car&policy=0&src=&coordinate=&callnative=0`, '_blank');
// };
</script>
<style lang="scss" scoped>
.navigate {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 0 3px rgba(0, 0, 0, .5);
}
</style>