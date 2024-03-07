<template>
  <div class="relative">
    <div id="map" class="w-full h-full"></div>
    <div id="panel">
      <div class="amap-call"></div>
    </div>
    <div class="absolute z-10 bottom-8 right-8">
      <el-button type="primary" @click="">
        <Icon icon="eva:navigation-2-fill" width="32" height="32" />
      </el-button>
    </div>
    <!-- 
      <button class="p-1 transition-all rounded shadow-xl" @click="toggleTheme"
        :class="theme === 'normal' ? 'bg-gray-50 text-gray-800 active:bg-gray-100' : 'bg-gray-600 text-gray-100 active:bg-gray-700'">
        <Icon icon="ic:round-light-mode" width="24" height="24" v-if="theme === 'normal'" />
        <Icon icon="ic:round-dark-mode" width="24" height="24" v-else />
      </button> -->
    <!-- <el-button type="primary" @click="openFullScreen1">
        As a directive
      </el-button> -->
    <!-- <a
        href="https://uri.amap.com/navigation?from=116.478346,39.997361,我的位置&to=116.32810279404168,39.90083463437583,北京市丰台区北京西站&mode=car&policy=0&src=&coordinate=&callnative=0">高德WEB</a>
      <a
        href="iosamap://path?sourceApplication=applicationName&sid=&slat=39.92848272&slon=116.39560823&sname=A&did=&dlat=39.98848272&dlon=116.47560823&dname=B&dev=0&t=0">高德IOS</a> -->
    <!-- </div> -->
  </div>
</template>

<script setup lang='ts'>
import { AMAP_KEY } from '@/constants';
import AMapLoader from '@amap/amap-jsapi-loader';
import { onMounted } from 'vue';

// const fullscreenLoading = ref(false)

interface Marker {
  point: number[];
  content?: string[];
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


const aMap = ref<any>(null);
// const geolocation = ref<any>(null);

const initAMap = () => {
  AMapLoader.load({
    key: AMAP_KEY, // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    // 需要使用的的插件列表
    plugins: [
      'AMap.Geocoder', // 逆向地理解码插件
      'AMap.Marker', // 点标记插件
      'AMap.Geolocation',
      'AMap.Driving',
    ],
  }).then((AMap) => {

    const map = new AMap.Map('map', {
      viewMode: props.map.viewMode ?? '2D',
      zoom: props.map.zoom ?? 17, // 地图显示的缩放级别
      center: props.map.center, // 初始化地图中心点位置
      buildingAnimation: true,
      pitch: props.map.pitch ?? 10,
    })
    aMap.value = map;

    //构造路线导航类
    const driving = new AMap.Driving({
      map: map,
      panel: "panel"
    });


    const geolocation = new AMap.Geolocation({
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
    })

    // map.addControl(geolocation);

    const { endMarker } = props.map;
    if (endMarker) {
      map.add([createEndMarker(AMap, endMarker.point)]);
    }

    map.on('click', () => {
      const loading = ElLoading.service({
        lock: true,
        text: '正在打开高德地图',
        background: 'rgba(0, 0, 0, 0.1)',
      })

      driving.search(new AMap.LngLat(116.379028, 39.865042), new AMap.LngLat(116.427281, 39.903719), (status: any, result: any) => {
        // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
        if (status === 'complete') {
          ElMessage.success('绘制驾车路线完成')
        } else {
          ElMessage.error('获取驾车数据失败：' + result)
        }
      });



      //   geolocation.getCurrentPosition((status: string, result: any) => {
      //     let [lng, lat] = [-1, -1];
      //     if (status == "complete") {
      //       lng = result.position.lng;
      //       lat = result.position.lat;

      //       const device = detectDevice();
      //       const from = `${lng},${lat},我的位置`
      //       console.log("%c Line:108 🥪 lng", "color:#93c0a4", lng);
      //       console.log("%c Line:108 🥛 lat", "color:#7f2b82", lat);
      //       const to = '104.026494,30.698211,安泰安蓉锦江宾馆(成都一品天下金沙店)'; // address：目的地
      //       if (device === 'iOS') {
      //         const [longitude, latitude, name] = to.split(',');
      //         window.open(`iosamap://path?sourceApplication=mhc&sid=&slat=${lat}&slon=${lng}&sname=A&dlat=${latitude}&dlon=${longitude}&dname=${name}&dev=0&t=0`, '_blank');
      //       } else if (device === 'pc') {
      //         window.open(`https://uri.amap.com/navigation?from=${from}&to=${to}&mode=car&policy=0&src=&coordinate=&callnative=0`, '_blank');
      //       }
      //     } else {
      //       ElMessage.error('定位失败!');
      //     }
      loading.close();
      //   });
    });
  }).catch((e) => {
    console.error(e)
  })
}

const detectDevice = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'iOS';
  } else if (/android/.test(userAgent)) {
    return 'Android';
  } else {
    return 'pc';
  }
}

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

const theme = ref<'normal' | 'dark'>('normal');
const toggleTheme = () => {
  if (aMap.value) {
    if (theme.value === 'normal') {
      aMap.value.setMapStyle('amap://styles/dark');
      theme.value = 'dark';
    } else {
      aMap.value.setMapStyle('amap://styles/normal');
      theme.value = 'normal';
    }
  }
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

// const showError = (error: any) => {
//   switch (error.code) {
//     case error.PERMISSION_DENIED:
//       errorMessage.value = "User denied the request for Geolocation.";
//       break;
//     case error.POSITION_UNAVAILABLE:
//       errorMessage.value = "Location information is unavailable.";
//       break;
//     case error.TIMEOUT:
//       errorMessage.value = "The request to get user location timed out.";
//       break;
//     case error.UNKNOWN_ERROR:
//       errorMessage.value = "An unknown error occurred.";
//       break;
//   }
// };
</script>

<style lang="scss" scoped>
#panel {
  position: fixed;
  background-color: white;
  max-height: 90%;
  overflow-y: auto;
  top: 10px;
  left: 10px;
  width: 280px;


}
</style>