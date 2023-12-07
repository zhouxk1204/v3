<template>
  <div class="h-full bg-[#efefef] p-20 w-full">
    <div
      class="border border-r-[#716f64] border-b-[#716f64] border-t-[#f1efe2] border-l-[#f1efe2]"
      :style="{ width: 29 + 20 * 16 + 'px' }"
    >
      <div
        class="border border-r-[#aca899] border-b-[#aca899] border-t-white border-l-white"
      >
        <div class="p-[1px] bg-[#ece9d8]">
          <!-- title -->
          <div class="w-full title-bar">&nbsp;</div>
          <!-- menu -->
          <div class="w-full h-5 border border-t-white">
            <div
              class="hover:bg-[#4069bf] hover:text-white px-1 text-xs h-full w-11 flex items-center justify-center"
            >
              Game
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
                <div class="face" :class="face" @click="onClickFace"></div>
                <!-- timer -->
                <div
                  class="border border-l-[#808080] border-t-[#808080] border-r-white border-b-white"
                >
                  <div class="flex">
                    <div
                      class="num"
                      v-for="num in timerNums"
                      :style="{ 'background-position': nums[+num] }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <!--  -->
            <div
              class="border-[3px] border-r-white border-b-white border-t-[#7d7d7d] border-l-[#7d7d7d] flex flex-wrap"
            >
              <template v-for="index in 20">
                <div class="flex-none cell mine" v-for="index2 in 20"></div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Face } from "./type";

const face = ref<Face>("smile");
const onClickFace = () => {
  face.value = "smile";
};

const getNumberArray = (num: number, range: number = 3) => {
  let numStr = num.toString();
  if (numStr.length < range) {
    numStr = new Array(range - numStr.length).fill(0).join("") + numStr;
  }
  return numStr.split("");
};

const mine = ref(10);
const mineNums = computed(() => {
  return getNumberArray(mine.value);
});

const timer = ref<number>(0);
const timerNums = computed(() => {
  return getNumberArray(timer.value);
});
let interval: NodeJS.Timeout | null = null;
/**
 * Start timer
 */
const startTimer = (): void => {
  interval = setInterval(() => {
    timer.value += 1;
  }, 1000);
};

/**
 * Stop timer
 */
const stopTimer = (): void => {
  interval && clearInterval(interval);
};

startTimer();

const numWidth = 13;
const nums: string[] = [];
for (let i = 0; i < 11; i++) {
  nums.push(`${-i * numWidth}px 0px`);
}

// face
const faceWidth = 26;
const faces: string[] = [];
for (let i = 0; i < 5; i++) {
  faces.push(`${-i * faceWidth}px -55px`);
}
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
  &:active {
    background-position: 0 -23px;
  }
}

$mines-expressions: (
  "mines-n": 0,
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
@each $expression, $position in $mine-expressions {
  .#{$expression} {
    background-position: $position * -16px -39px;
  }
}
</style>
