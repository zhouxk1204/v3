<template>
  <div class="relative w-screen h-screen overflow-hidden" @wheel="onWheel($event)" :class="direction"
    @transitionend="onTransitionend">
    <div class="absolute top-0 left-0 z-10 w-full h-0 overflow-hidden prev">
      <img :src="prev" class="absolute top-0 left-0 w-screen h-screen -translate-y-[10%] object-cover">
      <div class="absolute top-0 left-0 flex items-center justify-center w-full h-screen">
        <div class="p-5 text-6xl text-white mix-blend-overlay">
          {{ prevWord }}
        </div>
      </div>
    </div>
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden">
      <img :src="cur" class="absolute top-0 left-0 object-cover w-screen h-screen">
      <div class="absolute top-0 left-0 flex items-center justify-center w-full h-screen">
        <div class="p-5 text-6xl text-white mix-blend-overlay">
          {{ curWord }}
        </div>
      </div>
    </div>
    <div class="absolute bottom-0 left-0 z-10 w-full h-0 overflow-hidden next ">
      <img :src="next" class="absolute bottom-0 left-0 w-screen h-screen translate-y-[10%] object-cover">
      <div class="absolute bottom-0 left-0 flex items-center justify-center w-full h-screen">
        <div class="p-5 text-6xl text-white mix-blend-overlay">
          {{ nextWord }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
// 获取 assets/img/rose路径下的所有图片
const imgList = Object.keys(
  import.meta.glob("/src/assets/img/bg/*.{png,jpg,gif,svg,avif}")
);

const wordList = [
  "I will follow you to the end of time",
  "Love without end hath no end.",
  "Love is the greatest refreshment in life。",
  "Love's tongue is in the eyes.",
  "Love is a fire which burns unseen。",
  "Distance makes the hearts grow fonder。"
]

const prev = ref(imgList[0]);
const cur = ref(imgList[1]);
const next = ref(imgList[2]);

const prevWord = ref(wordList[0]);
const curWord = ref(wordList[1]);
const nextWord = ref(wordList[2]);

const currentIndex = ref(1);
/**
 * 滑动后，刷新图片路径
 * @param {number} index 
 */
const refresh = (index: number) => {
  currentIndex.value = index;
  const prevIndex = index === 0 ? imgList.length - 1 : index - 1;
  const nextIndex = index === imgList.length - 1 ? 0 : index + 1;
  prev.value = imgList[prevIndex];
  cur.value = imgList[index];
  next.value = imgList[nextIndex];
  prevWord.value = wordList[prevIndex];
  curWord.value = wordList[index];
  nextWord.value = wordList[nextIndex];
}

// 是否正在过渡动画中
let isAnimate = false;
// 滚动方向
type Direction = 'up' | 'down' | 'init';
let direction = ref<Direction>('init');

/**
 * 滚轮事件
 * @param event 
 */
const onWheel = (event: unknown) => {
  if (isAnimate) return;
  const deltaY = (event as WheelEvent).deltaY;

  if (deltaY === 0 || isAnimate) return;

  isAnimate = true;

  if (deltaY > 0) {
    direction.value = 'down';
  } else if (deltaY < 0) {
    direction.value = 'up';
  }
}

/**
 * 过渡完成事件
 */
const onTransitionend = () => {
  if (direction.value == 'down') {
    // 下滑时，下标为末尾，设置为0
    const index = currentIndex.value === imgList.length - 1 ? 0 : currentIndex.value + 1
    refresh(index);
  } else if (direction.value == 'up') {
    // 上滑时，下标为0，设置为末尾下标
    const index = currentIndex.value === 0 ? imgList.length - 1 : currentIndex.value - 1
    refresh(index);
  }
  // 过渡完成
  isAnimate = false;
  // 重置滚动区域方向
  direction.value = 'init';
}
</script>
<style scoped lang="scss">
.down .next,
.up .prev {
  height: 100vh;
  transition: 1s ease-in-out;

  img {
    transform: translateY(0);
    transition: 1s ease-in-out;
  }
}
</style>