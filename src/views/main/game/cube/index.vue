<template>
  <div class="flex items-center justify-center w-full h-full perspective">
    <div
      class="relative preserve-3d backface-hidden"
      :style="{
        transform: `rotateX(-24deg) rotateY(53deg) rotateZ(0deg)`,
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
          class="block-shadow absolute top-0 left-0 w-full h-full p-[10px] overflow-hidden bg-[#0a1019] rounded-xl"
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
</template>

<script setup lang="ts">
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
    Up: "#f1f1f1",
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
</script>
<style lang="scss" scoped>
.perspective {
  perspective: 1200px;
}

.preserve-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
  background-color: #0a1019;
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
  box-shadow: 0 0 2px 4px #0a1019;
}
</style>
