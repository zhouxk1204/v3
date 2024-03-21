<template>
  <AMap :map="map" class="w-full h-[100dvh]"></AMap>
</template>

<script setup lang="ts">
import { IAMap } from '@/components/AMap/index.vue';

// import AMapLoader from '@amap/amap-jsapi-loader';
// import { onMounted, reactive } from 'vue';

// //信息窗体的内容
// var content = [
//   "<div><b>安泰安蓉锦江宾馆(成都一品天下金沙店)</b>",
//   "电话 : 028-87673666 028-87673999",
//   "地址 : 成都市金牛区茶店子正街132号(茶店子地铁站D2口步行390米)</div>",
// ];

const map = ref({
  center: [104.026494, 30.698211], // 地图中心点
  zoom: 18, // 地图级别
  viewMode: '3D',
  endMarker: {
    point: [104.026494, 30.698211],
    content: "<div style='font-size: 12px; color: red; font-weight: bold'>😊安泰安蓉锦江宾馆😊&nbsp;&nbsp;</div>"
  }
} as IAMap)



// const state = reactive<any>({
//   center: [104.026494, 30.698211], // 地图中心点
//   point: [104.026494, 30.698211], // 经纬度-lng lat
//   map: null, // 地图实例
//   marker: null, // 地图icon
//   geocoder: null, // 逆解析实例
//   address: '安泰安蓉锦江宾馆(成都一品天下金沙店)', // 地址
//   weatherCity: '金牛区',
//   weather: null,
// })

// onMounted(() => {
//   initMap()
// })

// /**
//  * DOM初始化完成进行地图初始化
//  */
// const initMap = () => {
//   AMapLoader.load({
//     key: '6e530cf3ebaea4b2b08f359db5e6a072', // 申请好的Web端开发者Key，首次调用 load 时必填
//     version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
//     // 需要使用的的插件列表
//     plugins: [
//       'AMap.Geocoder', // 逆向地理解码插件
//       'AMap.Marker', // 点标记插件
//     ],
//   })
//     .then((AMap) => {
//       //创建 infoWindow 实例
//       var infoWindow = new AMap.InfoWindow({
//         content: content.join("<br>"), //传入字符串拼接的 DOM 元素
//         anchor: "bottom-center",
//         offset: new AMap.Pixel(2, -20),
//       });

//       state.map = new AMap.Map('container', {
//         viewMode: '3D', // 地图视图模式，默认为‘2D’，可选’3D’，选择‘3D’会显示 3D 地图效果。
//         zoom: 18, // 地图显示的缩放级别
//         center: state.center, // 初始化地图中心点位置
//       })

//       infoWindow.open(state.map, state.map.getCenter());

//       // 如果父组件传入了有效值 回显一个icon
//       if (state.point.length > 0) {
//         addMarker(AMap)
//       }
//       // 获取天气
//       getWeather(AMap)
//       // 监听用户的点击事件
//       state.map.on('click', (e: any) => {
//         state.point = [e.lnglat.lng, e.lnglat.lat]
//         // 增加点标记
//         addMarker(AMap)
//         // 获取地址
//         getAddress(AMap)
//       })
//     })
//     .catch((e) => {
//       console.error(e)
//     })
// }

// /**
//  * 增加点标记
//  * @param AMap AMap
//  */
// const addMarker = (AMap: any) => {
//   // 清除其他icon
//   if (state.marker) {
//     state.marker.setMap(null)
//     state.marker = null
//   }
//   // 重新渲染icon
//   state.marker = new AMap.Marker({
//     // icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
//     icon: '/src/assets/img/marker.svg',
//     size: new AMap.Size(32, 32), // 图标大小
//     imageSize: new AMap.Size(32, 32),
//     position: state.point, // icon经纬度
//     anchor: 'bottom-center',
//     // offset: new AMap.Pixel(-28, -60), // icon中心点的偏移量
//     offset: new AMap.Pixel(3, 7), // icon中心点的偏移量
//   })
//   state.marker.setMap(state.map) // 设置icon
// }

// /**
//  * 将经纬度转换为地址
//  * @param AMap AMap
//  */
// const getAddress = (AMap: any) => {
//   // 这里通过高德 SDK 完成。
//   state.geocoder = new AMap.Geocoder({
//     city: '全国', // 地理编码时，设置地址描述所在城市; 默认全国; 可选值：城市名（中文或中文全拼）、citycode、adcode
//     radius: 3000, // 逆地理编码时，以给定坐标为中心点; 默认1000; 取值范围(0-3000)
//     extensions: 'all', // 逆地理编码时，返回信息的详略; 默认值：base，返回基本地址信息; 默认值：base，返回基本地址信息
//   })
//   // 调用逆解析方法 个人开发者调用量上限5000（次/日）
//   state.geocoder.getAddress(state.point, function (status: any, result: any) {
//     if (status === 'complete' && result.regeocode) {
//       state.address = result.regeocode.formattedAddress
//       AMap.plugin('AMap.Weather', function () {
//         if (
//           result.info === 'OK' &&
//           result.regeocode.addressComponent.district
//         ) {
//           state.weatherCity = result.regeocode.addressComponent.district
//           // 获取天气
//           getWeather(AMap)
//         } else {
//           console.error('根据地址查询天气失败，请重新选择！')
//         }
//       })
//     } else {
//       console.error('根据地址查询位置失败，请重新选择！')
//     }
//   })
// }

// /**
//  * 获取天气
//  * @param AMap AMap
//  */
// const getWeather = (AMap: any) => {
//   AMap.plugin('AMap.Weather', function () {
//     const weather = new AMap.Weather()
//     // 执行实时天气信息查询
//     weather.getLive(state.weatherCity, function (err: any, data: any) {
//       if (data) {
//         state.weather = data
//       } else {
//         console.error(err)
//       }
//     })
//   })
// }
</script>

<style lang="scss" scoped>
.container {
  border: 10px solid #ececec;
}

.toolbar {
  position: absolute;
  left: 10px;
  bottom: 10px;
  z-index: 99;
  max-width: 500px;

  .toolbar-item {
    display: flex;
    margin-bottom: 15px;
  }
}

.weather {
  position: absolute;
  right: 10px;
  bottom: 210px;
  z-index: 99;
}


p {
  line-height: 1;
}

a {
  color: crimson;
  text-decoration: none;
}

img {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  pointer-events: none;
}

#gallery {
  position: relative;
  left: calc(-1 * var(--adjust-size));
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  max-width: 100vw;
  padding: 20px;
  -webkit-perspective: 0;
  perspective: 0;
}

#gallery figure:nth-child(7n) {
  --duration: 1s;
  --pin-color: crimson;
}

#gallery figure:nth-child(7n + 1) {
  --duration: 1.8s;
  --pin-color: hotpink;
}

#gallery figure:nth-child(7n + 2) {
  --duration: 1.3s;
  --pin-color: magenta;
}

#gallery figure:nth-child(7n + 3) {
  --duration: 1.5s;
  --pin-color: orangered;
}

#gallery figure:nth-child(7n + 4) {
  --duration: 1.1s;
  --pin-color: darkorchid;
}

#gallery figure:nth-child(7n + 5) {
  --duration: 1.6s;
  --pin-color: deeppink;
}

#gallery figure:nth-child(7n + 6) {
  --duration: 1.2s;
  --pin-color: mediumvioletred;
}

#gallery figure:nth-child(3n) {
  --angle: 3deg;
}

#gallery figure:nth-child(3n + 1) {
  --angle: -3.3deg;
}

#gallery figure:nth-child(3n + 2) {
  --angle: 2.4deg;
}

#gallery figure:nth-child(odd) {
  --direction: alternate;
}

#gallery figure:nth-child(even) {
  --direction: alternate-reverse;
}

#gallery figure {
  --angle: 3deg;
  --count: 5;
  --duration: 1s;
  --delay: calc(-0.5 * var(--duration));
  --direction: alternate;
  --pin-color: red;

  position: relative;
  display: inline-block;
  margin: var(--adjust-size);
  padding: 0.5rem;
  border-radius: 5px;
  box-shadow: 0 7px 8px rgba(0, 0, 0, 0.4);
  width: 100%;
  height: auto;
  text-align: center;
  background-color: ghostwhite;
  background-image: url("https://images.unsplash.com/photo-1629968417850-3505f5180761?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2OTMzMjQ3ODJ8&ixlib=rb-4.0.3&q=80&w=500");
  background-size: cover;
  background-position: center;
  background-blend-mode: multiply;

  transform-origin: center 0.22rem;
  will-change: transform;
  break-inside: avoid;
  overflow: hidden;
  outline: 1px solid transparent;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

#gallery.active figure {
  animation-duration: var(--duration), 1.5s;
  animation-delay: var(--delay),
    calc(var(--delay) + var(--duration) * var(--count));
  animation-timing-function: ease-in-out;
  animation-iteration-count: var(--count), 1;
  animation-direction: var(--direction), normal;
  animation-fill-mode: both;
  animation-name: swing, swingEnd;
}

#gallery figure:after {
  position: absolute;
  top: 0.22rem;
  left: 50%;
  width: 0.7rem;
  height: 0.7rem;
  content: "";
  background: var(--pin-color);
  border-radius: 50%;
  box-shadow: -0.1rem -0.1rem 0.3rem 0.02rem rgba(0, 0, 0, 0.5) inset;
  filter: drop-shadow(0.3rem 0.15rem 0.2rem rgba(0, 0, 0, 0.5));
  transform: translateZ(0);
  z-index: 2;
}

figure img {
  aspect-ratio: 1 /1;
  width: 100%;
  object-fit: cover;
  display: block;
  border-radius: 5px;
  margin-bottom: 10px;
  z-index: 1;
}

figure figcaption {
  font-size: 14px;
  font-weight: 400;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  z-index: 1;
}

figure h2 {
  color: crimson;
  font-size: 22px;
}

figure p {
  font-size: 17px;
}

figure small {
  font-size: 12px;
}

figure>div {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

@keyframes swing {
  0% {
    transform: rotate3d(0, 0, 1, calc(-1 * var(--angle)));
  }

  100% {
    transform: rotate3d(0, 0, 1, var(--angle));
  }
}

@keyframes swingEnd {
  to {
    transform: rotate3d(0, 0, 1, 0deg);
  }
}

#info {
  position: relative;
  text-align: center;
  z-index: 1;
}

#info a {
  font-size: 1.1rem;
}
</style>