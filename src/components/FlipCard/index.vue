<template>
  <div
    class="relative bg-black select-none rounded-xl perspective-midrange font-flip"
    :style="style"
    :class="{ active: flipping }"
  >
    <div class="absolute left-0 z-40 w-full h-1 -translate-y-1/2 bg-inherit top-1/2">&nbsp;</div>
    <div :num="current" class="face"></div>
    <div :num="next" class="back"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

const props = defineProps<{
  value: number; // 外部传入数字
}>();

const aspectRatio = 3 / 5;
const fontRatio = 1;
const width = ref(128);
const height = computed(() => Math.floor(width.value / aspectRatio));
const fontSize = computed(() => Math.floor(height.value / fontRatio));

const current = ref(props.value); // 初始即同步
const next = ref(props.value); // 初始即同步
const flipping = ref(false);

const style = computed(() => {
  return {
    width: `${width.value}px`,
    height: `${height.value}px`,
    lineHeight: `${height.value}px`,
    fontSize: `${fontSize.value}px`,
  };
});

// 当 value 变化时再触发翻牌动画
watch(
  () => props.value,
  (newVal) => {
    if (newVal === current.value) return;

    next.value = newVal;
    flipping.value = true;

    setTimeout(() => {
      current.value = newVal;
      flipping.value = false;
    }, 600);
  },
  { immediate: false }
);
</script>
<style lang="scss" scoped>
.face {
  @apply before:z-30 before:text-center before:content-[attr(num)] before:absolute before:left-0 before:right-0 before:bg-black before:overflow-hidden before:top-0 before:bottom-1/2 before:rounded-t-[10px];
  @apply after:z-10 after:text-center after:content-[attr(num)] after:absolute after:left-0 after:right-0 after:bg-black after:overflow-hidden after:top-1/2 after:bottom-0 after:rounded-b-[10px] after:leading-[0px];
}

.active .face::before {
  transform-origin: 50% 100%;
  animation: frontFlipDown 600ms ease-in-out both;
  backface-visibility: hidden;
  line-height: inherit;
}

.active .back:after {
  animation: backFlipDown 600ms ease-in-out both;
}

@keyframes frontFlipDown {
  0% {
    transform: rotateX(0deg);
  }

  100% {
    transform: rotateX(-180deg);
  }
}

@keyframes backFlipDown {
  0% {
    transform: rotateX(180deg);
  }

  100% {
    transform: rotateX(0deg);
  }
}

.back {
  @apply before:z-10 before:text-center before:content-[attr(num)] before:absolute before:left-0 before:right-0 before:bg-black before:overflow-hidden before:top-0 before:bottom-1/2 before:rounded-t-[10px];
  @apply after:z-20 after:text-center after:content-[attr(num)] after:absolute after:left-0 after:right-0 after:bg-black after:overflow-hidden after:top-1/2 after:bottom-0 after:rounded-b-[10px] after:leading-[0px];
  &:after {
    transform-origin: 50% 0%;
    transform: rotateX(180deg);
  }
  &::before {
    line-height: inherit;
  }
}

/* 通用优化 */
.face::before,
.face::after,
.back::before,
.back::after {
  transform-style: preserve-3d;
  will-change: transform, opacity;
}
</style>
