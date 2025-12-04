<template>
  <div class="flex flex-col items-center justify-center w-screen h-full gap-6 bg-black text-[#ababab] font-bold">
    <!-- 控制菜单 -->
    <div class="flex flex-col items-center gap-4 md:flex-row">
      <button @click="toggleHourFormat" class="px-4 py-2 bg-gray-700 rounded">
        切换 {{ is24Hour ? '12小时制' : '24小时制' }}
      </button>

      <input type="datetime-local" v-model="targetDateStr" class="px-2 py-1 text-black rounded" />
      <button @click="startCountdown" class="px-4 py-2 bg-green-600 rounded">开始倒计时</button>

      <input
        type="text"
        v-model="customText"
        placeholder="自定义文字"
        class="px-2 py-1 text-black rounded"
      />
    </div>

    <!-- 时间显示 -->
    <div class="flex flex-col items-center gap-10 md:flex-row">
      <div class="relative flex">
        <div
          class="absolute text-3xl text-[#ababab] z-50 transition-all duration-300 -left-10"
          :class="isAM && !is24Hour ? 'top-4' : 'bottom-2'"
          v-if="!is24Hour"
        >
          {{ isAM ? 'AM' : 'PM' }}
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

    <!-- 自定义文字 -->
    <div class="text-xl mt-4 text-[#ababab]">{{ customText }}</div>
    <Fireworks
      v-if="showFireworks"
      :options="fireworksOptions"
      class="absolute top-0 left-0 w-full h-full pointer-events-none z-[9999]"
    />
  </div>
</template>

<script setup lang="ts">
import FlipCard from "@/components/FlipCard/index.vue";
import { Fireworks } from "@fireworks-js/vue";
import { computed, ref } from "vue";

// 控制烟花显示
const showFireworks = ref(false);

// 烟花参数，可自定义
const fireworksOptions = {
  speed: 7,                 // 粒子飞行速度
  acceleration: 1.15,       // 粒子加速度
  friction: 0.9,            // 摩擦系数，越小粒子飞得越远
  particles: 200,           // 每次爆炸产生的粒子数量
  trace: 6,                 // 尾迹长度
  explosion: 10,            // 爆炸数量级
  gravity: 0.12,            // 重力
  flickering: 50,           // 粒子闪烁强度（0~100），不是 boolean
  brightness: { min: 60, max: 100 }, // 亮度范围
};

// --- 基础状态 ---
const timeArray = ref<number[]>([0, 0, 0, 0, 0, 0]);
const hour = ref(0);
const is24Hour = ref(true);
const targetDateStr = ref<string>(''); // 用户选择的目标时间
const customText = ref<string>('');   // 自定义文字
const isCountdown = ref(false);

// --- 计算 AM/PM ---
const isAM = computed(() => hour.value < 12);

// --- 更新显示时间函数 ---
const updateTime = () => {
  const now = new Date();

  if (isCountdown.value && targetDateStr.value) {
    const target = new Date(targetDateStr.value);
    let diff = target.getTime() - now.getTime();

    if (diff <= 0) {
      // 倒计时结束
      isCountdown.value = false;
      diff = 0;

      // 播放烟花
      showFireworks.value = true;

      // 3秒后自动隐藏烟花
      setTimeout(() => {
        showFireworks.value = false;
      }, 1000 * 100);
    }

    // 计算剩余时间
    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // 分解为每位数字
    timeArray.value = [
      Math.floor(hours / 10),
      hours % 10,
      Math.floor(minutes / 10),
      minutes % 10,
      Math.floor(seconds / 10),
      seconds % 10,
    ];
    return;
  }

  // 正常显示时间
  let hourVal = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
  const displayHour = is24Hour.value ? hourVal : hourVal % 12 || 12;

  timeArray.value = [
    Math.floor(displayHour / 10),
    displayHour % 10,
    Math.floor(m / 10),
    m % 10,
    Math.floor(s / 10),
    s % 10,
  ];
};

// --- 切换小时制 ---
const toggleHourFormat = () => {
  is24Hour.value = !is24Hour.value;
};

// --- 开始倒计时 ---
const startCountdown = () => {
  if (targetDateStr.value) {
    isCountdown.value = true;
  }
};

// --- 初始化定时器 ---
updateTime();
setInterval(updateTime, 1000);
</script>
