<template>
  <div class="flex items-center max-[450px]:flex-col max-[450px]:pb-10 max-[450px]:gap-3">
    <button
      class="absolute px-2 py-1 text-white border rounded-md select-none right-1 top-1 active:bg-gray-50 active:bg-opacity-20"
      @click="login">{{ token.length > 0 ? 'START' : 'SIGN IN' }}</button>

    <img class="object-cover w-1/2 max-[450px]:w-full" :src="roseImgSrc" alt="rose" />

    <div class="flex flex-col flex-1 gap-3 px-5 max-[450px]:px-0">
      <div class="flex items-center justify-center gap-3 text-7xl font-teko max-[450px]:text-5xl">
        <h1 class="tracking-wide">ZHOUXK</h1>
        <span class="text-5xl max-[450px]:text-3xl">&</span>
        <h1 class="tracking-wide">XIAOZT</h1>
      </div>

      <div class="text-2xl tracking-wide text-center font-teko">
        Sunday May 19, 2024
      </div>

      <div class="flex justify-center">
        <div class="flex items-center gap-4 font-arvo">
          <div v-for="item in Object.values(time)" class="flex flex-col items-center gap-1">
            <p class="text-xl">{{ item.value }}</p>
            <h2 class="text-sm">{{ item.label }}</h2>
          </div>
        </div>
      </div>

      <hr />

      <div class="flex justify-center overflow-x-hidden">
        <Typewriter class="font-arvo"></Typewriter>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from "@/router";
import dayjs from "dayjs";
import { ref } from "vue";

const roseImgSrc =
  "https://images.unsplash.com/photo-1503652601-557d07733ddc?q=80&w=1536&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const time = ref({
  days: {
    label: 'DAYS',
    value: 0,
  },
  hours: {
    label: 'HOURS',
    value: 0,
  },
  minutes: {
    label: 'MINUTES',
    value: 0,
  },
  seconds: {
    label: 'SECONDS',
    value: 0,
  },
})

setInterval(() => {
  const seconds = Math.abs(dayjs().diff("Sunday May 19, 2024", "second"));
  time.value.days.value = Math.floor(seconds / (24 * 3600));
  time.value.hours.value = Math.floor((seconds % (24 * 3600)) / 3600);
  time.value.minutes.value = Math.floor((seconds % 3600) / 60);
  time.value.seconds.value = Math.floor(seconds % 60);
}, 1000);

const login = () => {
  router.push("/login");
}

const token = localStorage.getItem("TOKEN") ?? '';
</script>
