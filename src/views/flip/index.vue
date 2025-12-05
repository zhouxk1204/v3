<template>
  <div
    class="flex flex-col items-center justify-center w-screen h-full gap-8 font-bold dark:bg-black"
  >
    <button
      type="button"
      class="fixed p-2 text-gray-600 transition-transform duration-300 border-2 border-solid rounded-full top-2 right-2 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:animate-spin dark:border-gray-600"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M19.14 12.94c.04-.3.06-.61.06-.94c0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6s3.6 1.62 3.6 3.6s-1.62 3.6-3.6 3.6"
        />
      </svg>
    </button>

    <!-- 时间显示 -->
    <div
      class="flex flex-col items-center md:flex-row"
      :style="{ gap: gap / 2 + 'px' }"
    >
      <div class="relative flex overflow-hidden rounded-2xl">
        <div
          class="absolute z-30 text-black transition-all left-2 dark:text-white"
          :class="isAM && !is24Hour ? 'top-0' : 'bottom-0'"
          :style="{ fontSize: cardWidth / 5 + 'px' }"
          v-if="mode === 'time' && !is24Hour"
        >
          {{ isAM ? "AM" : "PM" }}
        </div>

        <FlipCard :value="timeArray[0]" :width="cardWidth" />
        <FlipCard :value="timeArray[1]" :width="cardWidth" />
      </div>

      <div class="flex overflow-hidden rounded-2xl">
        <FlipCard :value="timeArray[2]" :width="cardWidth" />
        <FlipCard :value="timeArray[3]" :width="cardWidth" />
      </div>

      <div class="hidden overflow-hidden rounded-2xl md:flex">
        <FlipCard :value="timeArray[4]" :width="cardWidth" />
        <FlipCard :value="timeArray[5]" :width="cardWidth" />
      </div>
    </div>

    <!-- 自定义文字 -->
    <div class="text-xl text-[#ababab] px-10">{{ customText }}</div>

    <!-- 烟花 -->
    <Fireworks
      v-if="showFireworks"
      :options="fireworksOptions"
      class="absolute top-0 left-0 w-full h-full pointer-events-none z-[9999]"
    />
  </div>
</template>

<script setup lang="ts">
import FlipCard from "@/components/FlipCard/index.vue";
import { Fireworks, FireworksOptions } from "@fireworks-js/vue";
import { computed, ref } from "vue";
const mode = ref<"time" | "countdown">("time");

const is24Hour = ref(false); // 小时制
const customText = ref(
  "每个羽翼的扇动，都是对过往的告别，飞向那座山，拥抱自我。"
); // 自定义文字

const timeArray = ref([0, 0, 0, 0, 0, 0]);
const hour = ref(0);

const showFireworks = ref(false);
const fireworksOptions: FireworksOptions = {
  acceleration: 1.15,
  friction: 0.97,
  particles: 500,
  explosion: 10,
  gravity: 0.98,
  flickering: 50,
  brightness: { min: 50, max: 80 },
  rocketsPoint: { min: 20, max: 80 },
};

const isAM = computed(() => hour.value < 12);

// 更新时钟或倒计时
const updateTime = () => {
  const now = new Date();
  const h = now.getHours();
  hour.value = h;
  const displayHour = is24Hour.value ? h : h % 12 || 12;
  timeArray.value = [
    Math.floor(displayHour / 10),
    displayHour % 10,
    Math.floor(now.getMinutes() / 10),
    now.getMinutes() % 10,
    Math.floor(now.getSeconds() / 10),
    now.getSeconds() % 10,
  ];
};

updateTime();
setInterval(updateTime, 1000);

const gap = ref(50); // 可配置间隔(px)
const cardWidth = ref(0);
const computeWidth = () => {
  const containerWidth = window.innerWidth;
  const isMobile = containerWidth < 768;
  const N = isMobile ? 2 : 6;
  const G = isMobile ? gap.value * N : 3.5 * gap.value;
  cardWidth.value = (containerWidth - G) / N;
};

// 初始化 + 监听 resize
onMounted(() => {
  computeWidth();
  window.addEventListener("resize", computeWidth);
});

onUnmounted(() => {
  window.removeEventListener("resize", computeWidth);
});
</script>
