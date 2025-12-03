<template>
  <div
    class="flex flex-col items-center justify-center w-screen h-full gap-10 bg-black text-[#ababab] font-bold md:flex-row"
  >
    <div class="relative flex">
      <div
        class="absolute bottom-0 -left-10 w-[32px] text-3xl text-[#ababab] z-50"
      >
        PM
      </div>
      <FlipCard :value="timeArray[0]" />
      <FlipCard :value="timeArray[1]" />
    </div>
    <div class="flex">
      <FlipCard :value="timeArray[2]" />
      <FlipCard :value="timeArray[3]" />
    </div>

    <div class="hidden md:flex">
      <FlipCard :value="timeArray[4]" />
      <FlipCard :value="timeArray[5]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import FlipCard from "@/components/FlipCard/index.vue";
import { ref } from "vue";

const timeArray = ref<number[]>([0, 0, 0, 0, 0, 0]); // HHMMSS

const updateTime = () => {
  const date = new Date();
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();

  // 分解为单个数字
  timeArray.value = [
    Math.floor(h / 10),
    h % 10,
    Math.floor(m / 10),
    m % 10,
    Math.floor(s / 10),
    s % 10,
  ];
};

updateTime();
setInterval(updateTime, 1000);
</script>
