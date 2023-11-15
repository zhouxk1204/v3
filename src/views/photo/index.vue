<template>
  <div
    class="relative w-screen h-screen overflow-hidden"
    @keydown="handleKeyDown"
    @wheel="handleDebouncedWheel"
    ref="swipeBox"
    tabindex="0"
  >
    <!-- 轮播 -->
    <div class="flex w-screen h-screen" v-for="image in data">
      <div
        v-for="(img, i) in image"
        class="bg-center h-screen w-1/3 transition-transform ease-in-out duration-[2000ms]"
        :style="{
          'background-image': `url(${img})`,
          'background-position': (-100 / 3) * (i + 1) + 'vw',
          transform:
            i === 1
              ? `translateY(-${100 * currentCenter}vh)`
              : `translateY(-${100 * currentSide}vh)`,
        }"
      ></div>
    </div>
    <!-- 标题 -->
    <h1
      class="absolute z-50 text-5xl text-center text-white -translate-x-1/2 -translate-y-1/2 pointer-events-none top-1/2 left-1/2 mix-blend-overlay"
    >
      love is everywhere
    </h1>
    <!-- tips -->
    <div
      class="absolute w-full text-sm text-center text-white mix-blend-overlay bottom-12"
    >
      <p>
        You can press
        <kbd
          class="inline-flex items-center justify-center w-4 h-4 mr-1 border border-white rounded"
          >▲</kbd
        >
        <kbd
          class="inline-flex items-center justify-center w-4 h-4 border border-white rounded"
          >▼</kbd
        >
        on your keyboard or swipe up/down to navigate. Mouse wheel works too.
      </p>
    </div>
    <!--  -->
    <div class="absolute text-white right-3 top-1/2">
      <Icon
        icon="quill:inline-up"
        :width="40"
        class="relative transition-transform duration-1000 ease-out translate-y-0 active:-translate-y-10 hover:scale-150"
        @click="up"
      ></Icon>
      <Icon
        icon="quill:inline-down"
        :width="40"
        class="relative transition-transform duration-1000 ease-out translate-y-0 active:translate-y-10 hover:scale-150"
        @click="down"
      ></Icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

const images = [
  "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80",
  "https://images.unsplash.com/photo-1544198365-f5d60b6d8190?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2700&q=80",
];

const getBackgroundImages = () => {
  return Object.keys(
    import.meta.glob("@/assets/img/photo/*.{png,jpg,gif,svg,avif}")
  );
};

const swipeBox = ref();
onMounted(() => {
  // 自动聚焦
  swipeBox.value.focus();
});

/**
 * 生成轮播二维数组
 * @param {string[]} images
 * @returns {string[][]} 轮播二维数组
 */
const generateImageArray = (images: string[]): string[][] => {
  return images.map((el, i) => {
    return new Array(3)
      .fill(0)
      .map((_, j) => (j === 1 ? images[images.length - 1 - i] : el));
  });
};

const data = generateImageArray(images);

const currentSide = ref(0);
const currentCenter = ref(data.length - 1);
/**
 * 向下轮播
 */
const down = () => {
  if (currentSide.value === data.length - 1) return;
  currentSide.value += 1;
  currentCenter.value -= 1;
};

/**
 * 向上轮播
 */
const up = () => {
  if (currentSide.value <= 0) return;
  currentSide.value -= 1;
  currentCenter.value += 1;
};

/**
 * 方向键事件
 * @param event
 */
const handleKeyDown = (event: any) => {
  if (event.key === "ArrowUp") {
    // 处理上方向键按下事件
    up();
  } else if (event.key === "ArrowDown") {
    // 处理下方向键按下事件
    down();
  }
};

/**
 * 滚轮事件
 * @param event
 */
let scrollTimeout: NodeJS.Timeout;
const handleDebouncedWheel = (event: any) => {
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }

  scrollTimeout = setTimeout(() => {
    if (event.deltaY > 0) {
      // 处理向下滚动事件
      down();
    } else if (event.deltaY < 0) {
      // 处理向上滚动事件
      up();
    }
  }, 200); // 设置等待时间，单位为毫秒
};
</script>
