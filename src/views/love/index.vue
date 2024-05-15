<template>
  <div v-if="imgList.length > 0" class="relative w-screen overflow-hidden h-100dvh" @wheel="onWheel($event)"
    :class="direction" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd"
    @transitionend="onTransitionend">
    <div class="absolute top-0 left-0 z-10 w-full h-0 overflow-hidden prev">
      <img :src="prev" class="absolute top-0 left-0 w-screen h-100dvh -translate-y-[10%] object-cover">
    </div>
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden">
      <img :src="cur" class="absolute top-0 left-0 object-cover w-screen h-100dvh">
    </div>
    <div class="absolute bottom-0 left-0 z-10 w-full h-0 overflow-hidden next ">
      <img :src="next" class="absolute bottom-0 left-0 w-screen h-100dvh translate-y-[10%] object-cover">
    </div>
  </div>
</template>

<script setup lang='ts'>
import { getFileList } from "@/api/file.api";
import { onMounted } from "vue";

const imgList = ref<string[]>([]);
const index = 0;
const curIndex = index > -1 ? index : 1
const currentIndex = ref(curIndex);

const prev = ref('');
const cur = ref('');
const next = ref('');

/**
 * 滑动后，刷新图片路径
 * @param {number} index 
 */
const refresh = (index: number) => {
  const prevIndex = index === 0 ? imgList.value.length - 1 : index - 1;
  const nextIndex = index === imgList.value.length - 1 ? 0 : index + 1;
  prev.value = imgList.value[prevIndex];
  next.value = imgList.value[nextIndex];
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

onMounted(() => {
  setInterval(() => {
    direction.value = 'down'
  }, 7000)
});

/**
 * 过渡完成事件
 */
const onTransitionend = () => {
  if (direction.value == 'down') {
    // 下滑时，下标为末尾，设置为0
    const index = currentIndex.value === imgList.value.length - 1 ? 0 : currentIndex.value + 1;
    currentIndex.value = index;
    cur.value = imgList.value[index];
    refresh(index);
  } else if (direction.value == 'up') {
    // 上滑时，下标为0，设置为末尾下标
    const index = currentIndex.value === 0 ? imgList.value.length - 1 : currentIndex.value - 1;
    currentIndex.value = index;
    cur.value = imgList.value[index];
    refresh(index);
  }
  // 过渡完成
  isAnimate = false;
  // 重置滚动区域方向
  direction.value = 'init';
}

// 定义初始触摸位置的引用
const startX: Ref<number | null> = ref(null);
const startY: Ref<number | null> = ref(null);
const handleTouchStart = (event: TouchEvent) => {
  // 记录初始触摸位置
  startX.value = event.touches[0].clientX;
  startY.value = event.touches[0].clientY;
};

const handleTouchMove = (event: TouchEvent) => {
  event.preventDefault();
  if (!startX.value || !startY.value) return;

  const currentX = event.touches[0].clientX;
  const currentY = event.touches[0].clientY;

  const deltaX = currentX - startX.value;
  const deltaY = currentY - startY.value;
  isAnimate = true;
  // 判断是向上滑动还是向下滑动
  if (Math.abs(deltaY) > Math.abs(deltaX)) {
    if (deltaY > 0) {
      // 向下滑动
      direction.value = 'up';
    } else {
      // 向上滑动
      direction.value = 'down';

    }
  }
  // 清除初始触摸位置
  startX.value = null;
  startY.value = null;
};

// 处理触摸结束事件
const handleTouchEnd = () => {
  // 清除初始触摸位置
  startX.value = null;
  startY.value = null;
};

const getAllFileList = async () => {
  const data = await getFileList();
  imgList.value = data.data.map(el => el.url);
  cur.value = imgList.value[curIndex];
  refresh(curIndex);
}

getAllFileList();

</script>

<style scoped lang="scss">
.h-100dvh {
  height: 100dvh;
}

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