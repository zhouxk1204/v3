<template>
  <div class="relative">
    <div class="grid grid-cols-4 grid-rows-4 gap-4 w-[400px] bg-[#9a9a95] p-4">
      <template v-for="index of defaultSize">
        <div
          v-for="index2 of defaultSize"
          class="bg-[#f9ffe7] rounded-sm w-20 h-20"
        >
          <div>&nbsp;</div>
        </div>
      </template>
    </div>

    <template v-for="row in matrix">
      <template v-for="item in row">
        <span
          :style="{
            transform: `translateY(${dir}px)`,
            top: `${item.x * 96 + 16}px`,
            left: `${item.y * 96 + 16}px`,
            'background-color': item.bgc,
          }"
          class="absolute inline-flex items-center justify-center w-20 h-20 text-6xl font-bold text-white transition-all translate-y-20"
        >
          {{ item.value }}
        </span>
      </template>
    </template>
  </div>

  <Button @click="down">down</Button>
</template>

<script setup lang="ts">
import { ref } from "vue";

const color: any = {
  2: "#f6c659",
  4: "#dd5471",
  8: "#4998a8",
  16: "#4998a8",
  32: "#4998a8",
  128: "#4998a8",
  256: "#4998a8",
  512: "#4998a8",
  1024: "#4998a8",
  2048: "#4998a8",
};

const defaultSize = 4; // 4 * 4

const radom = (range: number) => {
  return Math.floor(Math.random() * range);
};

const getRadomCell = () => {
  return {
    x: radom(defaultSize),
    y: radom(defaultSize),
    value: [2, 4][Math.round(Math.random())],
  };
};

const radomCoordinate = () => {
  const result = [];
  while (result.length < 2) {
    const cell = getRadomCell();
    if (result.length === 1) {
      if (result[0].x !== cell.x || result[0].y !== cell.y) {
        if (result[0].value + cell.value !== 8) {
          result.push(cell);
        }
      }
    } else {
      result.push(cell);
    }
  }
  return result;
};

const newGame = (size: number) => {
  const data = radomCoordinate();
  const matrix = [];
  for (let x = 0; x < size; x++) {
    const row = [];
    for (let y = 0; y < size; y++) {
      const hasValue = data.find((e) => e.x === x && e.y === y);
      const value = hasValue ? hasValue.value : 0;
      row.push({
        x,
        y,
        value,
        bgc: color[value],
      });
    }
    matrix.push(row);
  }

  return matrix;
};

const matrix = ref(newGame(defaultSize));

const dir = ref(0);
const isCoordinateExist = (x: number, y: number) => {
  if (x < 0 || x > defaultSize) return false;
  if (y < 0 || y > defaultSize) return false;
  return true;
};

const next = {
  up: (x: number, y: number) => {
    return { x: x - 1, y };
  },
  left: (x: number, y: number) => {
    return { x, y: y - 1 };
  },
  right: (x: number, y: number) => {
    return { x, y: y + 1 };
  },
  down: (x: number, y: number) => {
    return { x: x + 1, y };
  },
};

const nextUnNullableValue = (
  xC: number,
  yC: number,
  direction: "up" | "left" | "right" | "down"
) => {
  const { x, y } = next[direction](xC, yC);
  if (isCoordinateExist(x, y)) {
    const cell = matrix.value[x][y];
    if (cell.value === 0) {
      nextUnNullableValue(x, y, direction);
    } else {
      return matrix.value[x][y];
    }
  } else {
    return null;
  }
};

// const next = (x: number, y: number) => {
//   return {
//     up: () => {return {x: x-1,y}},
//     left: () => {return {x: x,y -1}},
//     right: () => {return {x: x,y+1}},
//     down: () => {return {x: x+1,y}},
//   }
// }

const down = () => {
  const j = 0;
  for (let i = 0; i < 4; i++) {
    const cur = matrix.value[i][j];
    if (cur.value !== 0) {
      const next = nextUnNullableValue(i, j, "down");
      if (next) {
        if (cur.value === next.value) {
          next.value *= 2;
        } else {
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped></style>
