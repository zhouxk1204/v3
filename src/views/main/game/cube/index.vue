<template>
  <div class="flex items-center h-full">
    <div
      class="flex items-center justify-center flex-1 w-full h-full perspective"
    >
      <div
        class="relative transition-all duration-700 origin-center preserve-3d"
        :style="{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${0}deg) translateZ(${
            (-blockSize * order) / 2
          }px)`,
          width: `${blockSize * order}px`,
          height: `${blockSize * order}px`,
          transformOrigin: `${(blockSize * order) / 2}px ${
            (blockSize * order) / 2
          }px ${(-blockSize * order) / 2}px`,
        }"
      >
        <div
          class="absolute top-0 left-0 transition-all preserve-3d rounded-2xl"
          v-for="block in blocks"
          :style="{
            transformOrigin: block.origin,
            width: `${blockSize}px`,
            height: `${blockSize}px`,
            transform: `translateX(${
              block.translate.x * blockSize
            }px) translateY(${block.translate.y * blockSize}px) translateZ(${
              -(block.translate.z - 1) * blockSize
            }px) rotateX(${block.rotate.x}deg) rotateY(${block.rotate.y}deg)`,
            'transition-duration': `${block.duration}ms`,
          }"
          @mousedown="handleMouseDown"
          @mouseup="handleMouseUp($event, block)"
        >
          <div
            v-for="area in block.areas"
            class="block-shadow absolute top-0 left-0 w-full h-full p-[10px] overflow-hidden rounded-xl bg-black"
            :class="area.direct"
            :style="{
              transform: area.translate,
            }"
          >
            <div
              class="flex items-center justify-center w-full h-full shadow-2xl select-none rounded-2xl"
              :style="{ background: area.background }"
            >
              <!-- {{
                area.direct +
                ":" +
                (block.translate.x +
                  "-" +
                  block.translate.y +
                  "-" +
                  block.translate.z)
              }} -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-1">
      <div class="flex">
        <Button>1</Button>
        <Button>2</Button>
        <Button>3</Button>
        <Button>4</Button>
      </div>
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
import { ref } from "vue";

// 方向
const isMouseDown = ref(false);
const startX = ref(0);
const startY = ref(0);
const direction = ref("");

const handleMouseDown = (event: any) => {
  isMouseDown.value = true;
  startX.value = event.clientX;
  startY.value = event.clientY;
};

const handleMouseUp = (event: any, block: any) => {
  if (isMouseDown.value) {
    isMouseDown.value = false;
    const deltaX = event.clientX - startX.value;
    const deltaY = event.clientY - startY.value;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction.value = deltaX > 0 ? "right" : "left";
    } else {
      direction.value = deltaY > 0 ? "down" : "up";
    }
    move(block);
  }
};

const getBlockOrigin = (x: number, y: number, z: number): string => {
  const nx = (blockSize * order) / 2 - blockSize * x;
  const ny = (blockSize * order) / 2 - blockSize * y;
  const nz = blockSize * (z - 1);
  return `${nx}px ${ny}px ${nz}px`;
};

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

const getBlockAreaTranslateStyle = (direct: string): string => {
  const translate: any = {
    Up: `translateY(-${blockSize}px) translateZ(${
      blockSize / 2
    }px) rotateX(90deg)`,
    Down: `translateY(${blockSize}px) translateZ(${
      blockSize / 2
    }px) rotateX(-90deg)`,
    Left: `translateX(-${blockSize}px) translateZ(${
      blockSize / 2
    }px) rotateY(-90deg)`,
    Right: `translateX(-${blockSize}px) translateZ(${
      blockSize / 2
    }px) rotateY(90deg) translateZ(${blockSize * 2}px) `,
    Front: `translateZ(${blockSize / 2}px)`,
    Back: `translateZ(-${blockSize / 2}px)`,
  };
  return translate[direct];
};

const getBlockStyle = (direct: string) => {
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
    translate: getBlockAreaTranslateStyle(direct),
    background: background[direct],
  };
};

const createCube = () => {
  const blocks = [];
  for (let x = 0; x < order; x++) {
    for (let y = 0; y < order; y++) {
      for (let z = 0; z < order; z++) {
        blocks.push({
          translate: {
            x,
            y,
            z,
          },
          areas: getBlockAreas(x, y, z),
          rotate: {
            x: 0,
            y: 0,
            z: 0,
          },
          origin: getBlockOrigin(x, y, z),
          duration: 0,
        });
      }
    }
  }
  return blocks;
};
const blocks = ref(createCube());

const rotateX = ref(-25);
const rotateY = ref(-25);

const onUp = () => {
  rotateX.value += 180;
};

const onDown = () => {
  rotateX.value -= 180;
};

const onRight = () => {
  rotateY.value += 90;
};

const onLeft = () => {
  rotateY.value -= 90;
};

const move = (block: any) => {
  if (direction.value === "right") {
    blocks.value.forEach((e) => {
      if (e.translate.y === block.translate.y) {
        e.rotate.y += 90;
        e.duration = 500;
        setTimeout(() => {
          const oldx = e.translate.x;
          const oldz = e.translate.z;
          e.translate.z = oldx;
          e.translate.x = order - 1 - oldz;
          e.rotate.y = 0;
          for (let item of e.areas) {
            if (item.direct === "Left") {
              item.direct = "Front";
            } else if (item.direct === "Front") {
              item.direct = "Right";
            } else if (item.direct === "Right") {
              item.direct = "Back";
            } else if (item.direct === "Back") {
              item.direct = "Left";
            }
            item.translate = getBlockAreaTranslateStyle(item.direct);
          }
          e.origin = getBlockOrigin(
            e.translate.x,
            e.translate.y,
            e.translate.z
          );
          e.duration = 0;
        }, 1000);
      }
    });
  } else if (direction.value === "left") {
    blocks.value.forEach((e) => {
      if (e.translate.y === block.translate.y) {
        e.rotate.y -= 90;
        e.duration = 500;
        setTimeout(() => {
          const oldx = e.translate.x;
          const oldz = e.translate.z;
          e.translate.z = order - 1 - oldx;
          e.translate.x = oldz;
          e.rotate.y = 0;
          for (let item of e.areas) {
            if (item.direct === "Left") {
              item.direct = "Back";
            } else if (item.direct === "Back") {
              item.direct = "Right";
            } else if (item.direct === "Right") {
              item.direct = "Front";
            } else if (item.direct === "Front") {
              item.direct = "Left";
            }
            item.translate = getBlockAreaTranslateStyle(item.direct);
          }
          e.origin = getBlockOrigin(
            e.translate.x,
            e.translate.y,
            e.translate.z
          );
          e.duration = 0;
        }, 1000);
      }
    });
  } else if (direction.value === "up") {
    blocks.value.forEach((e) => {
      if (e.translate.x === block.translate.x) {
        e.rotate.x += 90;
        e.duration = 500;
        setTimeout(() => {
          const oldy = e.translate.y;
          const oldz = e.translate.z;
          e.translate.y = oldz;
          e.translate.z = order - 1 - oldy;
          e.rotate.x = 0;
          for (let item of e.areas) {
            if (item.direct === "Up") {
              item.direct = "Back";
            } else if (item.direct === "Back") {
              item.direct = "Down";
            } else if (item.direct === "Down") {
              item.direct = "Front";
            } else if (item.direct === "Front") {
              item.direct = "Up";
            }
            item.translate = getBlockAreaTranslateStyle(item.direct);
          }
          e.origin = getBlockOrigin(
            e.translate.x,
            e.translate.y,
            e.translate.z
          );
          e.duration = 0;
        }, 1000);
      }
    });
  } else if (direction.value === "down") {
    blocks.value.forEach((e) => {
      if (e.translate.x === block.translate.x) {
        e.rotate.x -= 90;
        e.duration = 500;
        setTimeout(() => {
          const oldy = e.translate.y;
          const oldz = e.translate.z;
          e.translate.z = oldy;
          e.translate.y = order - 1 - oldz;
          e.rotate.x = 0;
          for (let item of e.areas) {
            if (item.direct === "Up") {
              item.direct = "Front";
            } else if (item.direct === "Front") {
              item.direct = "Down";
            } else if (item.direct === "Down") {
              item.direct = "Back";
            } else if (item.direct === "Back") {
              item.direct = "Up";
            }
            item.translate = getBlockAreaTranslateStyle(item.direct);
          }
          e.origin = getBlockOrigin(
            e.translate.x,
            e.translate.y,
            e.translate.z
          );
          e.duration = 0;
        }, 1000);
      }
    });
  }
};
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
