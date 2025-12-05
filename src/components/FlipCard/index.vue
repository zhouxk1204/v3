<template>
  <div class="flip-card" :style="style" :class="{ active: flipping }">
    <div class="divider">&nbsp;</div>
    <div :num="current" class="face"></div>
    <div :num="next" class="back"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

const props = defineProps<{
  value: number; // 外部传入数字
  width: number; // 卡片宽度
}>();

const aspectRatio = 3 / 5;
const fontRatio = 1;
const height = computed(() => Math.floor(props.width / aspectRatio));
const fontSize = computed(() => Math.floor(height.value / fontRatio));

const current = ref(props.value); // 初始即同步
const next = ref(props.value); // 初始即同步
const flipping = ref(false);

const style = computed(() => {
  return {
    width: `${props.width}px`,
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
.flip-card {
  position: relative;
  background: var(--flip-bg);
  user-select: none;
  border-radius: 0.75rem;
  font-family: "helvetica", sans-serif;
  perspective: 1200px;
  color: var(--flip-text);
}

.divider {
  position: absolute;
  left: 0;
  z-index: 40;
  width: 100%;
  height: 0.25rem; // h-1
  top: 50%;
  transform: translateY(-50%);
  background: inherit;
}

/* 公共结构 */
%half-block {
  position: absolute;
  left: 0;
  right: 0;
  background: var(--flip-bg);
  overflow: hidden;
  text-align: center;
  color: inherit;
}

.face {
  &::before {
    @extend %half-block;
    z-index: 30;
    content: attr(num);
    top: 0;
    bottom: 50%;
  }

  &::after {
    @extend %half-block;
    z-index: 10;
    content: attr(num);
    top: 50%;
    bottom: 0;
    line-height: 0;
  }
}

.back {
  &::before {
    @extend %half-block;
    z-index: 10;
    content: attr(num);
    top: 0;
    bottom: 50%;
    line-height: inherit;
  }

  &::after {
    @extend %half-block;
    z-index: 20;
    content: attr(num);
    top: 50%;
    bottom: 0;
    line-height: 0;
    transform-origin: 50% 0%;
    transform: rotateX(180deg);
  }
}

/* 激活动画 */
.flip-card.active {
  .face::before {
    transform-origin: 50% 100%;
    animation: frontFlipDown 600ms ease-in-out both;
    backface-visibility: hidden;
    line-height: inherit;
  }

  .back::after {
    animation: backFlipDown 600ms ease-in-out both;
  }
}

/* 动画 */
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

/* 优化 */
.face::before,
.face::after,
.back::before,
.back::after {
  transform-style: preserve-3d;
  will-change: transform, opacity;
}
</style>
