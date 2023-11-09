<template>
  <div class="text-3xl">
    <p
      class="inline font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
    >
      {{ typedText }}
    </p>
    <span
      class="relative -top-[2px]"
      :class="{
        'custom-flash': cursorFlash,
      }"
      >|</span
    >
  </div>
</template>

<script setup lang="ts">
import { useTypewriter } from "@/hooks/useTypewriter.ts";
const { typedText, cursorFlash } = useTypewriter(
  [
    "别更新了，学不动了。",
    "清一下缓存再试试。",
    "我本地没有问题。",
    "扫码提需求，谢谢。",
  ],
  180
);
</script>
<style lang="scss" scoped>
/* 自定义 CSS 样式 */
@keyframes custom-flash {
  0%,
  50% {
    opacity: 1;
  }
  25%,
  75% {
    opacity: 0;
  }
}

/* 使用自定义动画类 */
.custom-flash {
  animation: custom-flash 2.5s infinite; /* 这里设置了2秒的动画间隔 */
}
</style>
