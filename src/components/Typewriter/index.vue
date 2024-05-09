<template>
  <div class="inline-block font-bold">
    <p class="inline text-3xl font-bold text-red-300 max-sm:text-xl">
      {{ typedText }}
    </p>
    <span class="relative -top-[2px] text-red-300" :class="{
        'custom-flash': cursorFlash,
      }">|</span>
  </div>
</template>

<script setup lang="ts">
import { useTypewriter } from "@/hooks/useTypewriter.ts";
const { typedText, cursorFlash } = useTypewriter(
  [
    "永远相信美好的事情即将发生。",
    "日落归山海，山海藏深意，你藏在我心里。",
    "我会永远陪着你，直到我们慢慢变老。",
    "我有多喜欢你，可能我自己都描述不出来，就像你是月亮，我是星星，满天星河只为你",
    "我若是游子，你便是人间。",
    "玫瑰是红的，紫罗兰是蓝的，糖是甜的，你也是。",
    "余光是你，余生也是你。",
    "我真想拉起你的手，逃向初晴的天空和田野，不畏缩也不回。",
    "冗长的黑夜里，你是我唯一的光。",
  ],
  100
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
  animation: custom-flash 2.5s infinite;
  /* 这里设置了2秒的动画间隔 */
}
</style>
