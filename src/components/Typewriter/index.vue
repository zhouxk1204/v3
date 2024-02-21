<template>
  <div class="inline-block font-bold">
    <p class="inline">
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
    // "自从你出现后，我才知道原来有人爱是那么的美好",
    // "雾起时，我就在你的怀里，雾散后，却是一生",
    // "我会永远陪着你，直到我们慢慢变老",
    // "我有多喜欢你，可能我自己都描述不出来，就像你是月亮，我是星星，满天星河只为你",
    // "我若是游子，你便是人间",
    // "玫瑰是红的，紫罗兰是蓝的，糖是甜的，你也是",
    // "余光是你，余生也是你",
    // "我真想拉起你的手，逃向初晴的天空和田野，不畏缩也不回",
    // "冗长的黑夜里，你是我唯一的光"
    "Life is the flower for which love is the honey.", // 生命如花，爱情如蜜
    "Love without end hath no end.",
    "Love's tongue is in the eyes.",
    "At the touch of love everyone becomes a poet.",
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
  animation: custom-flash 2.5s infinite; /* 这里设置了2秒的动画间隔 */
}
</style>
