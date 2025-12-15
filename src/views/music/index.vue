<template>
  <div class="flex items-center justify-center bg" :style="bgStyle">
    <section class="w-[80vw] sm:w-[24vw]">
      <img
        :src="coverUrl"
        alt="cover"
        class="w-full shadow-2xl select-none rounded-2xl aspect-square"
      />

      <div class="my-5 text-2xl font-bold break-words text-white/90 w-96">
        <h2>Anyone</h2>
        <p class="text-xl text-white/80">Tylor Swift</p>
      </div>

      <Time :current="current" :total="360"></Time>

      <Control v-model="isPlaying" @control="handleControl($event)" class="pt-4 pb-8"></Control>

      <Slider class="w-full" v-model="volume"></Slider>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import Control from "./component/Control/index.vue";
import Slider from "./component/Slider/index.vue";
import Time from "./component/Time/index.vue";
import { PlayerAction } from "./type";

const coverUrl = "https://picsum.photos/800";
const isPlaying = ref(false);
const handleControl = (action: PlayerAction) => {
  console.log("%c Line:34 🎂 action", "color:#7f2b82", action);
};
const current = ref(0);
const timer = setInterval(()=> {
  current.value += 1;
  if(current.value === 360) {
    clearInterval(timer)
  }
}, 1000)

/* ------------------ 样式变量 ------------------ */
const bgStyle = computed(() => ({
  "--bg-image": `url(${coverUrl})`,
}));

const volume = ref<number>(0.5);

</script>
<style lang="scss" scoped>
@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.bg {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.bg::before {
  z-index: -1;
  content: "";
  position: fixed;
  top: -50%;
  left: -50%;
  width: 300%;
  height: 300%;
  overflow: visible;
  background-image: var(--bg-image);
  background-size: cover;
  background-position: center;
  filter: blur(80px);
  animation: rotating 77s linear infinite;
}
</style>
