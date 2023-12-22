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
          class="absolute top-0 left-0 transition-all duration-700 preserve-3d rounded-2xl"
          v-for="block in blocks"
          :style="{
            transformOrigin: block.origin,
            width: `${blockSize}px`,
            height: `${blockSize}px`,
            transform: `translateX(${
              block.translate.x * blockSize
            }px) translateY(${block.translate.y * blockSize}px) translateZ(${
              -(block.translate.z - 1) * blockSize
            }px) rotateY(${block.rotate.y}deg`,
          }"
          @mousedown="handleMouseDown"
          @mouseup="handleMouseUp($event, block)"
        >
          <div
            @click="onMouseDown($event, block)"
            v-for="area in block.areas"
            class="block-shadow absolute top-0 left-0 w-full h-full p-[10px] overflow-hidden rounded-xl bg-black"
            :class="area.direct"
            :style="{
              transform: area.translate,
            }"
          >
            <div
              class="flex items-center justify-center w-full h-full shadow-2xl rounded-2xl"
              :style="{ background: area.background }"
            >
              <!-- {{
                block.translate.x +
                "-" +
                block.translate.y +
                "-" +
                block.translate.z
              }} -->
            </div>
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
    console.log(
      "%c Line:98 🍑 direction.value",
      "color:#2eafb0",
      direction.value
    );
    move(block);
  }
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

const getBlockStyle = (direct: string) => {
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
    translate: translate[direct],
    background: background[direct],
  };
};

const createCube = () => {
  const blocks = [];
  for (let x = 0; x < order; x++) {
    for (let y = 0; y < order; y++) {
      for (let z = 0; z < order; z++) {
        let origin = "";
        if (x === order - 1) {
          origin = "-50px 150px -100px";
          if (z === 2) {
            origin = "-50px 150px 100px";
          }
        }
        if (x === 0) {
          origin = "150px -150px -100px";
          if (z === 2) {
            origin = "150px -150px 100px";
          }
        }

        if (x === 1 && z === 0) {
          origin = "50px 150px -100px";
        }

        if (x === 2 && z === 1) {
          origin = "-50px 150px 0px";
        }

        if (x === 1 && z === 2) {
          origin = "50px 150px 100px";
        }

        if (x === 0 && z === 1) {
          origin = "150px 150px 0px";
        }

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
          origin,
        });
      }
    }
  }
  return blocks;
};
const blocks = ref(createCube());

const rotateX = ref(-25);
const rotateY = ref(-25);
const rotateZ = ref(0);

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

const onMouseDown = (event: any, block: any) => {
  event.preventDefault();
  event.stopPropagation();
  console.log(
    "%c Line:218 🍊 block.translate",
    "color:#ffdd4d",
    block.translate
  );
  blocks.value.forEach((e) => {
    if (e.translate.y === block.translate.y) {
      e.rotate.y = 90 + e.rotate.y;
      console.log("%c Line:219 🍿 e", "color:#e41a6a", e);
    }
  });
};

const move = (block: any) => {
  if (direction.value === "right") {
    blocks.value.forEach((e) => {
      if (e.translate.y === block.translate.y) {
        e.rotate.y += 90;
      }
    });
  } else if (direction.value === "left") {
    blocks.value.forEach((e) => {
      if (e.translate.y === block.translate.y) {
        e.rotate.y -= 90;
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
  box-shadow: 0 0 2px 4px #080e16;
}
</style>
