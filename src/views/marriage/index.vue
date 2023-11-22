<template>
  <div class="flex items-center w-screen h-screen overflow-hidden">
    <img
      src="https://images.unsplash.com/photo-1487530811176-3780de880c2d"
      alt=""
      class="object-cover w-1/2 h-full"
    />
    <div class="flex-1">
      <div class="flex items-center justify-center font-teko">
        <h1 class="tracking-wide text-7xl">ZHOUXK</h1>
        <span class="mx-3 text-5xl">&</span>
        <h1 class="tracking-wide text-7xl">XIAOZT</h1>
      </div>

      <div class="my-6 text-2xl tracking-wide text-center font-teko">
        {{ date }}
      </div>

      <div class="flex font-arvo" id="box">
        <div class="flex-1 text-center">
          <p class="text-xl">{{ days }}</p>
          <h2 class="mt-2 text-sm">DAYS</h2>
        </div>
        <div class="flex-1 text-center">
          <p class="text-xl">{{ hours }}</p>
          <h2 class="mt-2 text-sm">HOURS</h2>
        </div>
        <div class="flex-1 text-center">
          <p class="text-xl">{{ minutes }}</p>
          <h2 class="mt-2 text-sm">MINUTES</h2>
        </div>
        <div class="flex-1 text-center">
          <p class="text-xl">{{ remainingSeconds }}</p>
          <h2 class="mt-2 text-sm">SECONDS</h2>
        </div>
      </div>

      <hr class="w-[70%] mx-[15%] my-6" />
    </div>
  </div>
</template>

<script setup lang="ts">
import * as dayjs from "dayjs";
import { ref } from "vue";

const date = dayjs("2024-05-19").format("dddd MMMM D, YYYY");
const days = ref(0);
const hours = ref(0);
const minutes = ref(0);
const remainingSeconds = ref(0);
setInterval(() => {
  const seconds = Math.abs(dayjs().diff(date, "second"));
  days.value = Math.floor(seconds / (24 * 3600));
  hours.value = Math.floor((seconds % (24 * 3600)) / 3600);
  minutes.value = Math.floor((seconds % 3600) / 60);
  remainingSeconds.value = Math.floor(seconds % 60);
}, 1000);
</script>
<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css?family=Arvo|Cookie|Josefin+Sans|Lora|Roboto+Slab:300|Sanchez|Teko:500");

.font-teko {
  font-family: "Teko", sans-serif;
}

.font-arvo {
  font-family: "Arvo", serif;
}
</style>
