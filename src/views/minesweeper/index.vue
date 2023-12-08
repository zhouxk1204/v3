<template>
  <div class="h-full bg-[#efefef] p-20 w-full">
    <div
      class="border border-r-[#716f64] border-b-[#716f64] border-t-[#f1efe2] border-l-[#f1efe2]"
      :style="{ width: 29 + gameBoardCol * 16 + 'px' }"
    >
      <div
        class="border border-r-[#aca899] border-b-[#aca899] border-t-white border-l-white"
      >
        <div class="p-[1px] bg-[#ece9d8]">
          <!-- title -->
          <div class="w-full title-bar">&nbsp;</div>
          <!-- menu -->
          <div class="relative w-full h-5 border border-t-white">
            <div
              class="hover:bg-[#4069bf] hover:text-white px-1 text-xs h-full w-11 flex items-center justify-center"
              @click="onClickMenu"
              :class="isShowMenu ? 'bg-[#4069bf] text-white' : ''"
            >
              Game
            </div>
            <div
              v-show="isShowMenu"
              class="absolute top-5 left-0 w-32 bg-white border border-[#aca899] text-xs p-[2px]"
            >
              <ul>
                <li
                  class="py-1 pl-4 pr-1 hover:bg-[#4069bf] hover:text-white"
                  @click="onClickFace"
                >
                  New
                </li>
                <li class="bg-[#aba89a] h-[1px] m-1"></li>
                <li
                  @click="onClickLevel(item)"
                  class="py-1 pl-4 pr-1"
                  :class="
                    currentLevel === item
                      ? 'check'
                      : 'hover:bg-[#4069bf] hover:text-white'
                  "
                  v-for="item in Object.keys(level)"
                  :key="item"
                >
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>
          <!-- board -->
          <div
            class="p-[7px] border-t-[3px] border-l-[3px] border-t-white border-l-white bg-[#bdbdbd]"
          >
            <!-- info -->
            <div
              class="px-[5px] py-[3px] border-2 border-l-[#7d7d7d] border-t-[#7d7d7d] border-r-white border-b-white bg-[#bdbdbd] mb-[7px]"
            >
              <div class="flex items-center justify-between">
                <!-- mines count -->
                <div
                  class="border border-l-[#808080] border-t-[#808080] border-r-white border-b-white"
                >
                  <div class="flex">
                    <div
                      class="num"
                      v-for="num in mineNums"
                      :class="'num-' + num"
                    ></div>
                  </div>
                </div>
                <!-- face -->
                <div
                  class="face"
                  :class="isWin ? 'success' : face"
                  @click="onClickFace"
                ></div>
                <!-- timer -->
                <div
                  class="border border-l-[#808080] border-t-[#808080] border-r-white border-b-white"
                >
                  <div class="flex">
                    <div
                      class="num"
                      :class="'num-' + num"
                      v-for="num in timerNums"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <!--  -->
            <div
              class="border-[3px] border-r-white border-b-white border-t-[#7d7d7d] border-l-[#7d7d7d] flex flex-wrap"
            >
              <div
                class="flex-none cell"
                v-for="cell in gameBoard"
                :class="
                  cell.status +
                  (cell.around > -1
                    ? ' mines-' + cell.around
                    : cell.isActive
                    ? ' active'
                    : '')
                "
                @mouseup="onMouseUp(cell, $event)"
                @mousedown="onMouseDown(cell, $event)"
                @contextmenu="onContextmenu"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Cell, Face } from "./type";

const isShowMenu = ref(false);
const currentLevel = ref("Beginner");
const level: any = {
  Beginner: {
    row: 9,
    col: 9,
    mine: 10,
  },
  Intermediate: {
    row: 16,
    col: 16,
    mine: 40,
  },
  Expert: {
    row: 16,
    col: 30,
    mine: 99,
  },
};

const onClickMenu = () => {
  isShowMenu.value = !isShowMenu.value;
};

const isGameOver = ref<boolean>(false);
const gameBoard = ref<Cell[]>([]);
const gameBoardRow = ref<number>(9);
const gameBoardCol = ref<number>(9);

const face = ref<Face>("smile");
const onClickFace = () => {
  if (isShowMenu.value) {
    isShowMenu.value = false;
  }
  face.value = "smile";
  isGameOver.value = false;
  mineTemp.value = mine.value;
  resetGame();
  resetTimer();
};

const getNumberArray = (num: number, range: number = 3) => {
  let numStr = Math.abs(num).toString();
  const arr = numStr.split("");
  if (arr.length < range) {
    const prefixArray = new Array(range - numStr.length).fill(0);
    if (num < 0) {
      prefixArray[0] = "n";
    }
    return prefixArray.concat(arr);
  } else {
    return arr;
  }
};

const mine = ref<number>(10);
const mineTemp = ref(mine.value);
const mineNums = computed(() => {
  return getNumberArray(mineTemp.value);
});

const isWin = computed(() => {
  if (gameBoard.value.length > 0) {
    const isOpenedList = gameBoard.value.filter((el) => el.status == "opened");
    return (
      isOpenedList.length ===
        gameBoardRow.value * gameBoardCol.value - mine.value &&
      isOpenedList.every((el) => !el.isMine)
    );
  } else {
    return false;
  }
});

const timer = ref<number>(0);
const timerNums = computed(() => {
  return getNumberArray(timer.value);
});

const getAroundCellListAndMineCount = (cell: Cell): [number, Cell[]] => {
  const { row, col } = cell;
  const cellList = [];
  let mineCount = 0;
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (i == row && j == col) {
        continue;
      }
      const aroundCell = gameBoard.value.find(
        (el) => el.row == i && el.col == j
      );
      if (aroundCell) {
        if (aroundCell.status !== "opened") {
          cellList.push(aroundCell);
        }
        if (aroundCell.isMine) {
          mineCount += 1;
        }
      }
    }
  }
  return [mineCount, cellList];
};

/**
 * 挖格子
 * @param {Cell} cell
 */
const dig = (cell: Cell): void => {
  const [count, aroundCellList] = getAroundCellListAndMineCount(cell);
  cell.around = count;
  cell.status = "opened";
  if (count === 0) {
    aroundCellList.forEach((el) => {
      el.status = "opened";
      dig(el);
    });
  }
};

/**
 * 开始计时
 */
let interval: NodeJS.Timeout | null = null;
const startTimer = (): void => {
  if (!interval) {
    timer.value += 1;
    interval = setInterval(() => {
      timer.value += 1;
    }, 1000);
  }
};

/**
 * 暂停计时
 */
const stopTimer = (): void => {
  interval && clearInterval(interval);
  interval = null;
};

/**
 * 重置计时
 */
const resetTimer = (): void => {
  stopTimer();
  timer.value = 0;
};

/**
 * 右键菜单阻止默认事件
 * @param event
 */
const onContextmenu = (event: any) => {
  event.preventDefault();
};

/**
 * 初始化地雷
 */
const initMines = (): void => {
  let i = 0;
  while (true) {
    let row = Math.round(Math.random() * gameBoardRow.value - 1);
    let col = Math.round(Math.random() * gameBoardCol.value - 1);
    const cell = gameBoard.value.find((el) => el.row === row && el.col === col);

    if (cell?.isMine === false) {
      cell.isMine = true;
      i += 1;
    }

    if (i === mine.value) {
      break;
    }
  }
};

/**
 * 初始化方格
 */
const initBoard = (): void => {
  for (let i = 0; i < gameBoardRow.value; i++) {
    for (let j = 0; j < gameBoardCol.value; j++) {
      gameBoard.value.push({
        row: i,
        col: j,
        status: "covered",
        around: -1,
        isMine: false,
        isActive: false,
      });
    }
  }
};

/**
 * 初始化游戏
 */
const initGame = (): void => {
  gameBoard.value = [];
  // 初始化方格
  initBoard();
  // 初始化地雷
  initMines();

  if (face.value !== "smile") {
    face.value = "smile";
  }
};
initGame();

/**
 * 重置游戏
 */
const resetGame = (): void => {
  gameBoard.value.forEach((e) => {
    e.status = "covered";
    e.around = -1;
    e.isMine = false;
  });
  initMines();
};

/**
 * Click cell by Mouse
 * @param {MouseEvent} event
 */
const onMouseUp = (cell: Cell, event: MouseEvent): void => {
  event.preventDefault();

  if (isGameOver.value || isWin.value) return;

  face.value = "smile";

  const { button } = event;
  // left mouse button
  if (button === 0) {
    cell.isActive = false;

    startTimer();

    if (cell.isMine) {
      cell.status = "mine-hit";
      gameBoard.value
        .filter((e) => e.isMine)
        .forEach((el) => {
          if (el.row !== cell.row || el.col !== cell.col) {
            el.status = "mine";
          }
        });

      isGameOver.value = true;
      face.value = "failed";
      stopTimer();
    } else {
      dig(cell);
    }
  } else if (button === 2) {
    if (cell.status === "covered") {
      cell.status = "flag";
      mineTemp.value -= 1;
      getNumberArray(mineTemp.value);
    } else if (cell.status === "flag") {
      mineTemp.value += 1;
      getNumberArray(mineTemp.value);
      cell.status = "question";
    } else if (cell.status === "question") {
      cell.status = "covered";
    }
  }
};

const onMouseDown = (cell: Cell, event: MouseEvent) => {
  // 鼠标左键按下，触发激活状态
  if (event.button === 0 && cell.status === "covered") {
    cell.isActive = true;
    face.value = "surprise";
  }
};

const onClickLevel = (key: string) => {
  currentLevel.value = key;
  const { row, col } = level[key];
  gameBoardRow.value = row;
  gameBoardCol.value = col;
  mine.value = level[key].mine;
  mineTemp.value = level[key].mine;
  initGame();
  isShowMenu.value = !isShowMenu.value;
};
</script>
<style lang="scss" scoped>
.face,
.num,
.cell {
  background: url("../../assets/img/minesweeper.png") no-repeat;
  display: inline-block;
}

.title-bar {
  background: #3d95ff url("../../assets/img/minesweeper.png") no-repeat;
  background-position: 0 -84px;
  height: 25px;
  width: 100%;
}

.face {
  width: 26px;
  height: 26px;
  &:active {
    background-position: -26px -55px;
  }
}

.num {
  width: 13px;
  height: 23px;
}

$num-expressions: (
  "num-0": 0,
  "num-1": 1,
  "num-2": 2,
  "num-3": 3,
  "num-4": 4,
  "num-5": 5,
  "num-6": 6,
  "num-7": 7,
  "num-8": 8,
  "num-9": 9,
  "num-n": 10,
);
@each $expression, $position in $num-expressions {
  .#{$expression} {
    background-position: $position * -13px 0px;
  }
}

$face-expressions: (
  "smile": 0,
  "surprise": 2,
  "failed": 3,
  "success": 4,
);

@each $expression, $position in $face-expressions {
  .#{$expression} {
    background-position: $position * -26px -55px;
  }
}

.cell {
  width: 16px;
  height: 16px;
}

$mines-expressions: (
  "mines-0": 0,
  "mines-1": 1,
  "mines-2": 2,
  "mines-3": 3,
  "mines-4": 4,
  "mines-5": 5,
  "mines-6": 6,
  "mines-7": 7,
  "mines-8": 8,
);
@each $expression, $position in $mines-expressions {
  .#{$expression} {
    background-position: $position * -16px -23px;
  }
}

$mine-expressions: (
  "covered": 0,
  "flag": 1,
  "mine-hit": 2,
  "mine": 4,
  "question": 5,
);

.covered.active {
  background-position: 0 -23px;
}
@each $expression, $position in $mine-expressions {
  .#{$expression} {
    background-position: $position * -16px -39px;
  }
}

.check {
  background: url("../../assets/img/minesweeper.png") no-repeat;
  background-position: -136px -41px;
  &:hover {
    background-color: #4069bf;
    color: white;
    background-position: -136px -69px;
  }
}
</style>
