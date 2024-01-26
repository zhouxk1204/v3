<template>
  <div class="box">
    <div
      class="wall"
      :style="{
        '--count': colCount,
      }"
    >
      <div class="flex line" v-for="(item, i) in arr">
        <div
          v-for="j in item"
          class="flex-none item"
          :class="{ 'zoom-out': around.includes(`${i}-${j}`) }"
          @mouseover="handleMouseOver(i, j, item)"
        >
          <img :src="'https://picsum.photos/200?random=' + i + j" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const colCount = ref<number>(15);
const rowCount = ref<number>(22);
const arr = computed(() => {
  return new Array(rowCount.value)
    .fill(colCount.value)
    .map((e, i) => (i % 2 !== 0 ? e + 1 : e));
});

const around = ref<string[]>([]);

const aroundCell = (row: number, col: number) => {
  return {
    left: `${row}-${col - 1}`,
    right: `${row}-${col + 1}`,
    topLeft: `${row - 1}-${row % 2 == 0 ? col : col - 1}`,
    topright: `${row - 1}-${row % 2 == 0 ? col + 1 : col}`,
    bottomLeft: `${row + 1}-${row % 2 == 0 ? col : col - 1}`,
    bottomRight: `${row + 1}-${row % 2 == 0 ? col + 1 : col}`,
  };
};

const isExist = (pos: string, currentCount: number, currentRow: number) => {
  const [row, col] = pos.split("-").map((e) => +e);
  if (currentRow !== row) {
    if (currentCount === colCount.value) {
      currentCount += 1;
    } else {
      currentCount -= 1;
    }
  }
  return row >= 0 && col > 0 && row < rowCount.value - 1 && col <= currentCount;
};

const handleMouseOver = (row: number, col: number, colCount: number) => {
  around.value = Object.values(aroundCell(row, col)).filter((e) =>
    isExist(e, colCount, row)
  );
};
</script>
<style lang="scss" scoped>
$size: calc(100vw / var(--count));

.box {
  display: flex;
}
.wall {
  height: 100%;
  overflow-x: hidden;
  & > .line {
    &:nth-child(even) {
      transform: translateX(calc(#{$size} / -2));
    }

    & > .item {
      width: $size;
      height: $size;
      margin-top: calc(#{$size} / -6);
      filter: grayscale(0.8);
      transition: all 0.5s ease;
      clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%);
      &:hover {
        filter: grayscale(0);
        transform: scale(1.3);
        transform-origin: center center;
      }
      &.zoom-out {
        transform: scale(0.7);
        transform-origin: center center;
      }
    }
  }
}
</style>
