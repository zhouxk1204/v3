<template>
  <div class="flex items-center justify-center w-full h-full">
    <div>
      <div
        class="flex items-center justify-between mb-4"
        :style="{ width: boardSize + 'px' }"
      >
        <h1 class="font-bold text-7xl text-[#756e66]">2048</h1>
        <div class="bg-[#bbada0] rounded-md inline-block px-2 py-1 font-bold">
          <div class="text-[#ebe3da]">SCORE</div>
          <div class="text-2xl text-center text-white">{{ score }}</div>
        </div>
      </div>
      <div
        class="bg-[#b9ada1] relative rounded-md overflow-hidden grid grid-cols-4 grid-rows-4"
        :style="{
          width: boardSize + 'px',
          height: boardSize + 'px',
          gap: space + 'px',
          padding: space + 'px',
        }"
      >
        <div
          :style="{
            width: blockSize + 'px',
            height: blockSize + 'px',
          }"
          v-for="index in defaultSize * defaultSize"
          :key="index"
          class="bg-[#cac1b5] rounded-md"
        >
          &nbsp;
        </div>
        <template v-for="item in matrix">
          <transition>
            <div
              :style="{
                top: `${item.row * blockSize + (item.row + 1) * space}px`,
                left: `${item.col * blockSize + (item.col + 1) * space}px`,
                width: blockSize + 'px',
                height: blockSize + 'px',
                'z-index': item.val,
                'background-color': color[item.val],
                color:
                  item.val === 0
                    ? 'transparent'
                    : item.val < 8
                    ? '#756e66'
                    : '#f8f6f2',
              }"
              class="absolute flex items-center justify-center text-6xl font-bold transition-all rounded-md m-el zoom-out"
            >
              {{ item.val }}
            </div>
          </transition>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Direction, MatrixElement } from "./type";

const space = 16;
const blockSize = 100;
const boardSize = 100 * 4 + 5 * 16;

const color: any = {
  0: "transparent",
  2: "#eee4da",
  4: "#ede0c8",
  8: "#f2b179",
  16: "#f59563",
  32: "#f67c5f",
  64: "#f65e3b",
  128: "#f65e3b",
  256: "#4998a8",
  512: "#4998a8",
  1024: "#4998a8",
  2048: "#4998a8",
};

const defaultSize = 4; // 4 * 4
const score = ref(0);

const matrix = ref<MatrixElement[]>([]);

/**
 * 随机数 0 ～ range(包括)
 * @param {number} range
 * @returns {number} 随机数
 */
const random = (range: number = 1): number => {
  return Math.round(Math.random() * range);
};

/**
 * 随机行号，列号
 * @param {number} range
 * @returns {number} 行号，列号
 */
const randomPosition = (): number => {
  return random(defaultSize - 1);
};

/**
 * 判断元素坐标是否越界
 * @param {number} row 行号
 * @param {number} col 列号
 * @returns {boolean} true: 下标没越界; false: 下标越界
 */
const isMatrixElementExist = (row: number, col: number): boolean => {
  return row >= 0 && row < defaultSize && col >= 0 && col < defaultSize;
};

/**
 * 在空余位置生成一个元素
 * @returns {MatrixElement} 元素
 */
const generateMatrixElement = (): MatrixElement => {
  let row = randomPosition();
  let col = randomPosition();

  while (
    matrix.value.find((el) => el.row === row && el.col === col && el.val > 0)
  ) {
    row = randomPosition();
    col = randomPosition();
  }

  return {
    row,
    col,
    val: [2, 4][random()],
  };
};

// 下个元素的位置
const nextMatrixElementPosition = {
  ArrowUp: (row: number, col: number) => {
    return { row: row + 1, col };
  },
  ArrowLeft: (row: number, col: number) => {
    return { row, col: col + 1 };
  },
  ArrowRight: (row: number, col: number) => {
    return { row, col: col - 1 };
  },
  ArrowDown: (row: number, col: number) => {
    return { row: row - 1, col };
  },
};

/**
 * 根据行号，列号获取元素
 * @param {number} row 行号
 * @param {number} col 列号
 * @returns {MatrixElement | undefined} 元素
 */
const getMatrixElement = (
  row: number,
  col: number
): MatrixElement | undefined => {
  return matrix.value.filter(
    (e) => e.row == row && e.col === col && e.val > 0
  )[0];
};

/**
 * 根据行号，寻找下一个非0的元素
 * @param {number} row 行号
 * @param {number} col 列号
 * @returns { MatrixElement | undefined } 元素
 */
const getNextMatrixElement = (
  row: number,
  col: number,
  direction: Direction
): MatrixElement | undefined => {
  const nextRow = nextMatrixElementPosition[direction](row, col).row;
  const nextCol = nextMatrixElementPosition[direction](row, col).col;
  if (!isMatrixElementExist(nextRow, nextCol)) return;

  const nextMatrixElement = getMatrixElement(nextRow, nextCol);

  if (nextMatrixElement) {
    return nextMatrixElement;
  } else {
    return getNextMatrixElement(nextRow, nextCol, direction);
  }
};

/**
 * 新开游戏
 */
const newGame = (): void => {
  matrix.value = [];
  let i = 0;
  while (i < 2) {
    matrix.value.push(generateMatrixElement());
    i++;
  }
};
newGame();

/**
 * 合并计算
 * @param {number} row 行号
 * @param {number} col 列号
 */
const calculate = (row: number, col: number, direction: Direction): void => {
  // 下标是否越界判断
  if (!isMatrixElementExist(row, col)) return;

  const curr = getMatrixElement(row, col);

  const next = getNextMatrixElement(row, col, direction);

  if (!curr) {
    // 当前元素为空，获取下一个非空，将其移动到当前位置
    if (next) {
      next.row = row;
      next.col = col;
      calculate(row, col, direction);
    }
  } else {
    // 当前元素不为空，下一个非空存在
    if (next) {
      // 想同时，合并，当前值*2，将下一个坐标传入
      if (curr.val === next.val) {
        matrix.value.push({
          row,
          col,
          val: curr.val * 2,
        });
        // 统计分数
        score.value += curr.val * 2;
        // 移动和清空
        next.row = row;
        next.col = col;
        next.val = 0;
        curr.val = 0;
        // 下一个元素再计算
        const nextRow = nextMatrixElementPosition[direction](row, col).row;
        const nextCol = nextMatrixElementPosition[direction](row, col).col;
        calculate(nextRow, nextCol, direction);
      } else {
        const nextRow = nextMatrixElementPosition[direction](row, col).row;
        const nextCol = nextMatrixElementPosition[direction](row, col).col;
        next.row = nextRow;
        next.col = nextCol;
        calculate(nextRow, nextCol, direction);
      }
    }
  }
};

/**
 * 移动
 * @param {Direction} direction
 */
const move = (direction: Direction): void => {
  for (let j = 0; j < defaultSize; j++) {
    if (direction === "ArrowUp") {
      calculate(0, j, direction);
    } else if (direction === "ArrowDown") {
      calculate(defaultSize - 1, j, direction);
    } else if (direction === "ArrowLeft") {
      calculate(j, 0, direction);
    } else if (direction === "ArrowRight") {
      calculate(j, defaultSize - 1, direction);
    }
  }
};

onMounted(() => {
  document.onkeydown = (keyboardEvent: KeyboardEvent) => {
    if (
      ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(
        keyboardEvent.code
      )
    ) {
      move(keyboardEvent.code as Direction);
      if (
        matrix.value.filter((e) => e.val > 0).length <
        defaultSize * defaultSize
      ) {
        matrix.value.push(generateMatrixElement());
        setTimeout(() => {
          const elements = document.getElementsByClassName("m-el");
          const elementsArray = Array.from(elements);
          // Iterate through the elements
          elementsArray.forEach((element) => {
            // Check if innerHTML is "0"
            if (element.innerHTML.trim() === "0") {
              element.parentNode?.removeChild(element);
            }
          });
        }, 250);
      }
    }
  };
});
</script>
<style lang="scss" scoped>
.zoom-out {
  animation: zoom 0.3s ease-in-out;
}

@keyframes zoom {
  0% {
    transform: scale(0.8);
    transform-origin: center;
  }
  75% {
    transform: scale(1.1);
    transform-origin: center;
  }
  100% {
    transform: scale(1);
    transform-origin: center;
  }
}
</style>
