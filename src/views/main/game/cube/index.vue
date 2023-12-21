<template>
  <div class="flex items-center h-full">
    <div
      class="flex items-center justify-center flex-1 w-full h-full perspective"
    >
      <div
        class="relative origin-center preserve-3d backface-hidden transition-all"
        :style="{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
          width: `${blockSize * order}px`,
          height: `${blockSize * order}px`,
          transformOrigin: `50% 50% ${(-blockSize * order) / 2}px `,
        }"
      >
        <div
          class="absolute top-0 left-0 preserve-3d backface-hidden rounded-2xl"
          v-for="block in blocks"
          :style="{
            width: `${blockSize}px`,
            height: `${blockSize}px`,
            transform: `translateX(${block.x * blockSize}px) translateY(${
              block.y * blockSize
            }px) translateZ(${-block.z * blockSize}px)`,
          }"
        >
          <div
            v-for="area in block.areas"
            class="block-shadow absolute top-0 left-0 w-full h-full p-[10px] overflow-hidden bg-[#080e16] rounded-xl"
            :class="area.direct"
            :style="{
              transform: area.transform,
            }"
          >
            <div
              :style="{ 'background-color': area.background }"
              class="w-full h-full shadow-2xl rounded-2xl"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-1">
      <div class="flex flex-col w-[120px] items-center">
        <Button icon="icon-park-solid:up-two" @click="onUp"></Button>
        <div class="flex justify-between w-full">
          <Button icon="icon-park-solid:left-two" @click="onLeft"></Button>
          <Button icon="icon-park-solid:right-two" @click="onRight"></Button>
        </div>
        <Button icon="icon-park-solid:down-two" @click="onDown"></Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const order = 3;
const blockSize = 100;

const getBlockAreas = (x: number, y: number, z: number) => {
  const areas = [];
  if (x === 0) {
    areas.push(getBlockStyle("Left"));
  }
  if (x === order - 1) {
    areas.push(getBlockStyle("Right"));
  }
  if (y === 0) {
    areas.push(getBlockStyle("Up"));
  }
  if (y === order - 1) {
    areas.push(getBlockStyle("Down"));
  }
  if (z === 0) {
    areas.push(getBlockStyle("Front"));
  }
  if (z === order - 1) {
    areas.push(getBlockStyle("Back"));
  }
  return areas;
};

const getBlockStyle = (direct: string) => {
  const transforms: any = {
    Up: `translateY(-${blockSize}px) rotateX(90deg) `,
    Down: `translateY(${blockSize}px) rotateX(-90deg)`,
    Left: `translateX(-${blockSize}px) rotateY(-90deg)`,
    Right: `translateX(-${blockSize}px) rotateY(90deg) translateZ(200px)`,
    Front: `translateZ(0)`,
    Back: `translateZ(-${blockSize}px)`,
  };
  const background: any = {
    Up: "#fff",
    Down: "#d17f30",
    Left: "#7fad46",
    Right: "#4a8399",
    Front: "#bf402c",
    Back: "#f9ec67",
  };
  return {
    direct,
    transform: transforms[direct],
    background: background[direct],
  };
};

const createCube = () => {
  const blocks = [];
  for (let x = 0; x < order; x++) {
    for (let y = 0; y < order; y++) {
      for (let z = 0; z < order; z++) {
        blocks.push({
          x,
          y,
          z,
          areas: getBlockAreas(x, y, z),
        });
      }
    }
  }
  return blocks;
};
const blocks = createCube();

const rotateX = ref(155);
const rotateY = ref(45);
const rotateZ = ref(0);

const onUp = () => {
  rotateZ.value -= 90;
}

const onDown = () => {
  rotateZ.value += 90;
}

const onRight = () => {
 rotateY.value +=90;
}

const onLeft = () => {
 rotateY.value -=90;
}
</script>
<style lang="scss" scoped>
.perspective {
  perspective: 2000px;
}

.preserve-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
  background-color: #080e16;
}

.Up {
  transform-origin: bottom;
}
.Down {
  transform-origin: top;
}
.Left {
  transform-origin: right;
}
.Right {
  transform-origin: left;
}

.block-shadow {
  box-shadow: 0 0 3px 4px #080e16;
}
</style>
