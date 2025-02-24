<template>
  <div class="flex items-center justify-center w-full h-full select-none bg-[#faf8f0]">
    <div>
      <div class="flex justify-between items-center mb-4" :style="{ width: boardSize + 'px' }">
        <h1 class="font-bold text-7xl text-[#756e66]">2048</h1>
        <div class="flex gap-2">
          <div class="bg-[#bbada0] rounded-md inline-block px-2 py-1 font-bold">
            <div class="text-[#ebe3da]">SCORE</div>
            <div class="text-2xl text-center text-white">{{ score }}</div>
          </div>
        </div>
      </div>
      <div class="flex items-center mb-4" :style="{ width: boardSize + 'px' }">
        <div class="text-2xl text-[#54381d] break-words flex-1">
          Join the numbers and<br />get to the <strong>2048 tile!</strong>
        </div>
        <button
          class="bg-[#7d6f60] px-5 py-3 text-2xl text-white rounded hover:bg-[#65594d] active:bg-[#564c42] outline-none border-none"
          @click="reload">
          New Game
        </button>
      </div>
      <div class="bg-[#b9ada1] relative rounded-md overflow-hidden grid grid-cols-4 grid-rows-4 shadow-sm" :style="{
        width: boardSize + 'px',
        height: boardSize + 'px',
        gap: space + 'px',
        padding: space + 'px',
      }">
        <div v-if="isWin || isLose"
          class="absolute top-0 left-0 z-[9999] w-full h-full bg-opacity-50 flex justify-center items-center"
          :class="{ ' bg-yellow-500': isWin, 'bg-[#ece4db]': isLose }">
          <div>
            <h1 class="mb-6 text-4xl text-center text-[#756e66] select-none">
              {{ isWin ? "You Win!" : isLose ? "Game Over!" : "233" }}
            </h1>
            <div class="flex justify-center">
              <button v-if="isWin"
                class="px-3 py-2 mr-5 text-xl text-gray-100 bg-yellow-800 rounded hover:bg-yellow-700 active:bg-yellow-900"
                @click="closeWinPop">
                Keep going
              </button>
              <button
                class="px-3 py-2 text-xl text-gray-100 bg-yellow-800 rounded hover:bg-yellow-700 active:bg-yellow-900"
                @click="reload">
                Try again
              </button>
            </div>
          </div>
        </div>
        <div :style="{
          width: blockSize + 'px',
          height: blockSize + 'px',
        }" v-for="index in defaultSize * defaultSize" :key="index" class="bg-[#cac1b5] rounded-md">
          &nbsp;
        </div>
        <template v-for="item in matrix">
          <div :style="{
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
          }" class="flex absolute justify-center items-center font-bold rounded-md transition-all" :class="item.val === 0 ? 'm-el' : item.val > 100 ? 'text-4xl' : 'text-6xl'
        ">
            {{ item.val }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from "lodash";
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

const isWin = ref(false);
const closeWinPop = () => {
  isWin.value = false;
};

const isLose = ref(false);

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

  if (matrix.value.length > 0) {
    while (
      matrix.value.find((el) => el.row === row && el.col === col && el.val > 0)
    ) {
      row = randomPosition();
      col = randomPosition();
    }
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
  isWin.value = false;
  isLose.value = false;
  score.value = 0;
  matrix.value = [];
  let i = 0;
  while (i < 2) {
    const el = generateMatrixElement();
    matrix.value.push(el);
    i++;
  }
};
newGame();

const reload = () => {
  location.reload();
};

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

        // 胜利条件
        if (curr.val * 2 === 2048) {
          isWin.value = true;
        }

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
      const temp = _.cloneDeep(matrix.value);


      move(keyboardEvent.code as Direction);

      if (!isSameAfterMove(temp, matrix.value)) {
        setTimeout(() => {
          const el = generateMatrixElement();
          matrix.value.push(el);
        }, 200);
        setTimeout(() => {
          const elements = document.getElementsByClassName("m-el");
          const elementsArray = Array.from(elements);
          elementsArray.forEach((element) => {
            if (element.innerHTML.trim() === "0") {
              element.parentNode?.removeChild(element);
            }
          });
        }, 500);
      }
    }
  };
});

const isSameAfterMove = (arr1: MatrixElement[], arr2: MatrixElement[]): boolean => {
  return _.isEqual(_.sortBy(arr1), _.sortBy(arr2));
}

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
