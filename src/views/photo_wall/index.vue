<template>
  <div
    class="container"
    :style="{
      '--count': count,
    }"
  >
    <div class="flex line" v-for="(item, i) in arr">
      <div
        v-for="j in item"
        class="flex-none item"
        @mouseover="handleMouseOver(i, j)"
      >
        <img :src="'https://picsum.photos/200?random=' + i + j" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const count = ref<number>(9);

const arr = computed(() => {
  return new Array(12)
    .fill(count.value)
    .map((e, i) => (i % 2 !== 0 ? e + 1 : e));
});

const around = ref<string[]>([]);

const handleMouseOver = (row: number, col: number) => {
  console.log("%c Line:32 🥟 row", "color:#f5ce50", row);
  console.log("%c Line:32 🍻 col", "color:#fca650", col);
  // const left = [row, col - 1];
  // const right = [row, col + 1];
  // const topLeft = [row - 1, col];
  // const topright = [row - 1, col + 1];
  // const bottomRight = [row + 1, col + 1];
  // const bottomLeft = [row + 1, col];
};

const isRange = (row, col, count, line) => {
  return row > 0 && col > 0 && row < line - 1 && col < count - 1;
};
</script>
<style lang="scss" scoped>
$size: calc(100vw / var(--count));

.container > .line {
  margin-top: calc(#{$size} / -6);
  &:nth-child(even) {
    transform: translateX(calc(#{$size} / -2));
  }

  & > .item {
    width: $size;
    height: $size;
    clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%);
    &:hover {
      transform: scale(1.5);
      transform-origin: center center;
      transition: all 0.3s ease;
    }
  }
}
</style>
