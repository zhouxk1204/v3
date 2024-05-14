<template>
  <div class="relative w-screen overflow-hidden h-100dvh" @wheel="onWheel($event)" :class="direction"
    @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd"
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
import { onMounted } from "vue";

// 获取 assets/img/rose路径下的所有图片
const imgList: string[] = [];
let i = 1;
while (i < 4) {
  imgList.push(new URL(`../../assets/img/love/${i}.jpg`, import.meta.url).href);
  i++;
}

const index = 0;
const curIndex = index > -1 ? index : 1
const currentIndex = ref(curIndex);

const prev = ref('');
const cur = ref(imgList[curIndex]);
const next = ref('');

/**
 * 滑动后，刷新图片路径
 * @param {number} index 
 */
const refresh = (index: number) => {
  const prevIndex = index === 0 ? imgList.length - 1 : index - 1;
  const nextIndex = index === imgList.length - 1 ? 0 : index + 1;
  prev.value = imgList[prevIndex];
  next.value = imgList[nextIndex];
}

refresh(curIndex);

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
    const index = currentIndex.value === imgList.length - 1 ? 0 : currentIndex.value + 1;
    currentIndex.value = index;
    cur.value = imgList[index];
    refresh(index);
  } else if (direction.value == 'up') {
    // 上滑时，下标为0，设置为末尾下标
    const index = currentIndex.value === 0 ? imgList.length - 1 : currentIndex.value - 1;
    currentIndex.value = index;
    cur.value = imgList[index];
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

#mouse-scroll {
  position: fixed;
  margin: auto;
  left: 50%;
  bottom: 30px;
  -webkit-transform: translateX(-50%);
  z-index: 9999;
}

#mouse-scroll .mouse {
  height: 21px;
  width: 14px;
  border-radius: 10px;
  -webkit-transform: none;
  -ms-transform: none;
  transform: none;
  border: 2px solid #ffffff;
  top: 170px;
}

#mouse-scroll .mouse-in {
  height: 5px;
  width: 2px;
  display: block;
  margin: 5px auto;
  background: #ffffff;
  position: relative;
  -webkit-animation: animated-mouse 1.2s ease infinite;
}

#mouse-scroll .down-arrow-1,
#mouse-scroll .down-arrow-2,
#mouse-scroll .down-arrow-3 {
  -webkit-animation: mouse-scroll 1s infinite;
  -moz-animation: mouse-scroll 1s infinite;
}

#mouse-scroll .down-arrow-1 {
  margin-top: 6px;
}

#mouse-scroll .down-arrow-2 {
  -webkit-animation-delay: .2s;
  -moz-animation-delay: .2s;
  -webkit-animation-direction: alternate;
}

#mouse-scroll .down-arrow-3 {
  -webkit-animation-delay: .3s;
  -moz-animation-dekay: .3s;
  -webkit-animation-direction: alternate;
}

#mouse-scroll span {
  display: block;
  width: 5px;
  height: 5px;
  -ms-transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
  transform: rotate(45deg);
  border-right: 2px solid #fff;
  border-bottom: 2px solid #fff;
  margin: 0 0 3px 5px;
}


@-webkit-keyframes animated-mouse {
  0% {
    opacity: 1;
    -webkit-transform: translateY(0);
    -ms-transform: translateY(0);
    transform: translateY(0);
  }

  100% {
    opacity: 0;
    -webkit-transform: translateY(6px);
    -ms-transform: translateY(6px);
    transform: translateY(6px);
  }
}

@-webkit-keyframes mouse-scroll {
  0% {
    opacity: 1;
  }

  50% {
    opacity: .5;
  }

  100% {
    opacity: 1;
  }
}

@keyframes mouse-scroll {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 1;
  }
}

.hover-underline-animation {
  display: inline-block;
  position: relative;
  color: rgb(229 231 235);
}

.hover-underline-animation::after {
  content: '';
  position: absolute;
  width: 100%;
  transform: scaleX(0);
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: rgb(229 231 235);
  transform-origin: bottom right;
  transition: transform 0.25s ease-out;
}

.hover-underline-animation:hover::after {
  transform: scaleX(1);
  transform-origin: bottom left;
}
</style>