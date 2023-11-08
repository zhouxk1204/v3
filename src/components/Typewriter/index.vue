<template>
  <div class="text-3xl">
    <p class="inline font-bold text-blue-500 transition-all">{{ typedText }}</p>
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
  "最美的相遇，不言过往；最好的离别，不问归期。",
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
