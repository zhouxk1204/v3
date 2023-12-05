<template>
  <div
    class="bg-[#f9ffe7] relative"
    :style="{ width: boardSize + 'px', height: boardSize + 'px' }"
  >
    <div
      class="absolute left-0 right-0 h-4 bg-gray-300"
      :style="{ top: (index - 1) * blockSize + (index - 1) * space + 'px' }"
      v-for="index of defaultSize + 1"
      :key="index"
    ></div>
    <div
      class="absolute top-0 bottom-0 bg-gray-300"
      :style="{
        left: (index - 1) * blockSize + (index - 1) * space + 'px',
        width: space + 'px',
      }"
      v-for="index of defaultSize + 1"
      :key="index"
    ></div>
    <template v-for="item in matrix">
      <transition>
        <div
          :style="{
            top: `${item.row * blockSize + (item.row + 1) * space}px`,
            left: `${item.col * blockSize + (item.col + 1) * space}px`,
            'background-color': color[item.val],
            width: blockSize + 'px',
            height: blockSize + 'px',
          }"
          class="absolute flex items-center justify-center text-6xl font-bold text-white zoom-out"
        >
          {{ item.val }}
        </div>
      </transition>
    </template>
  </div>

  <Button @click="newEl">new</Button>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Direction, MatrixElement } from "./type";

const space = 16;
const blockSize = 100;
const boardSize = 100 * 4 + 5 * 16;

const color: any = {
  0: "#f9ffe7",
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
    row: radom(defaultSize),
    col: radom(defaultSize),
    val: [2, 4][Math.round(Math.random())],
  };
};

const radomCoordinate = () => {
  const result = [];
  while (result.length < 2) {
    const cell = getRadomCell();
    if (result.length === 1) {
      if (result[0].row !== cell.row || result[0].col !== cell.col) {
        if (result[0].val + cell.val !== 8) {
          result.push(cell);
        }
      }
    } else {
      result.push(cell);
    }
  }
  return result;
};

const newGame = (): MatrixElement[] => {
  // const data = radomCoordinate();
  // const matrix = [];
  // for (let row = 0; row < size; row++) {
  //   for (let col = 0; col < size; col++) {
  //     const hasValue = data.find((e) => e.row === row && e.col === col);
  //     const val = hasValue ? hasValue.val : 0;
  //     matrix.push({
  //       row,
  //       col,
  //       val,
  //     });
  //   }
  // }
  return radomCoordinate();
};

const matrix = ref(newGame());
console.log("%c Line:111 🍐 matrix", "color:#93c0a4", matrix);

// const nextUnNullableValue = (
//   xC: number,
//   yC: number,
//   direction: "up" | "left" | "right" | "down"
// ) => {
//   const { x, y } = next[direction](xC, yC);
//   if (isCoordinateExist(x, y)) {
//     const cell = matrix.value[x][y];
//     if (cell.val === 0) {
//       nextUnNullableValue(x, y, direction);
//     } else {
//       return matrix.value[x][y];
//     }
//   } else {
//     return null;
//   }
// };

// const next = (x: number, y: number) => {
//   return {
//     up: () => {return {x: x-1,y}},
//     left: () => {return {x: x,y -1}},
//     right: () => {return {x: x,y+1}},
//     down: () => {return {x: x+1,y}},
//   }
// }

const move = (direction: Direction) => {
  for (let item of matrix.value) {
    const { row, col, value } = item;
    const nextItem = getNextMatrixElement(row, col, direction);
  }

  // for (let i = 0; i < defaultSize; i++) {
  //   for (let j = 0; j < defaultSize; j++) {
  //     const curEl = matrix.value[i][j];
  //     if (curEl.val !== 0) {
  //       const nextEl = findNextUnZeroValue(i, j, direction);
  //       if (!nextEl) {
  //         curEl.row = defaultSize - 1;
  //       } else {
  //         if (curEl.val === nextEl.val) {
  //           nextEl.val *= 2;
  //           curEl.row = nextEl.row;
  //           curEl.val = 0;
  //         } else {
  //           curEl.row = nextEl.row - 1;
  //         }
  //       }
  //     }
  //   }
  // }
  // const el = generateElement(getExistList());
  // matrix.value[el.row][el.col] = el;
};

const next = {
  ArrowUp: (x: number, y: number) => {
    return { x: x - 1, y };
  },
  ArrowLeft: (x: number, y: number) => {
    return { x, y: y - 1 };
  },
  ArrowRight: (x: number, y: number) => {
    return { x, y: y + 1 };
  },
  ArrowDown: (x: number, y: number) => {
    return { x: x + 1, y };
  },
};

const isCoordinateExist = (x: number, y: number) => {
  if (x < 0 || x > defaultSize - 1) return false;
  if (y < 0 || y > defaultSize - 1) return false;
  return true;
};

const getNextMatrixElement = (
  row: number,
  col: number,
  direction: Direction
) => {
  const { x, y } = next[direction](row, col);
  if (!isCoordinateExist(x, y)) {
    return null;
  }
  return getMatrixElement(x, y);
};

const generateElement = (existList: any[]): MatrixElement => {
  const row = radom(defaultSize);
  const col = radom(defaultSize);
  if (existList.find((e) => e.row === row && e.col === col)) {
    return generateElement(existList);
  } else {
    return {
      row,
      col,
      val: [2, 4][Math.round(Math.random())],
    };
  }
};

const getMatrixElement = (
  row: number,
  col: number
): MatrixElement | undefined => {
  return matrix.value.find((e) => e.row === row && e.col === col);
};
// const getExistList = () => {
//   if (matrix.value.length > 0) {
//     const existList = matrix.value
//       .flat(1)
//       .filter((e) => e.val > 0)
//       .map((e) => {
//         return { row: e.row, col: e.col };
//       });
//     return existList;
//   }
//   return [];
// };

onMounted(() => {
  // document.onkeydown = (keyboardEvent: KeyboardEvent) => {
  //   console.log("%c Line:231 🍧 keyboardEvent", "color:#6ec1c2", keyboardEvent);
  //   // move(keyboardEvent.code as Direction);
  // };
});

const newEl = () => {
  if (matrix.value.length < Math.pow(defaultSize, 2)) {
    matrix.value.push(generateElement(matrix.value));
  }
};
</script>
<style lang="scss" scoped>
.zoom-out {
  animation: zoom 0.3s ease-in-out;
}

@keyframes zoom {
  0% {
    transform: scale(0.3);
    transform-origin: center;
  }
  70% {
    transform: scale(1.2);
    transform-origin: center;
  }
  100% {
    transform: scale(1);
    transform-origin: center;
  }
}
</style>
