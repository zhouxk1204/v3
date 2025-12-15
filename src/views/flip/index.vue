<template>
  <div
    class="flex flex-col items-center justify-center w-screen h-full gap-8 font-bold dark:bg-black"
  >
    <h1 class="text-xl font-bold text-black sm:text-2xl dark:text-white">
      {{ currentDate }}
    </h1>
    <!-- 时间显示 -->
    <div
      @click="isShowSettings = true"
      class="flex items-center"
      :style="{
        gap: settings.commonConfig.gap + 'px',
        flexDirection: isMobile && !isMobileLandscape ? 'column' : 'row',
      }"
    >
      <div class="relative flex overflow-hidden rounded-2xl">
        <div
          class="absolute z-30 text-black transition-all left-2 dark:text-white"
          :class="isAM && !settings.timeConfig.is24Hour ? 'top-0' : 'bottom-0'"
          :style="{ fontSize: cardWidth / 5 + 'px' }"
          v-if="settings.mode === 'time' && !settings.timeConfig.is24Hour"
        >
          {{ isAM ? "AM" : "PM" }}
        </div>

        <FlipCard :value="timeArray[0]" :width="cardWidth" />
        <FlipCard :value="timeArray[1]" :width="cardWidth" />
      </div>

      <div class="flex overflow-hidden rounded-2xl">
        <FlipCard :value="timeArray[2]" :width="cardWidth" />
        <FlipCard :value="timeArray[3]" :width="cardWidth" />
      </div>

      <div
        class="flex overflow-hidden rounded-2xl"
        v-if="isMobileLandscape || !isMobile"
      >
        <FlipCard :value="timeArray[4]" :width="cardWidth" />
        <FlipCard :value="timeArray[5]" :width="cardWidth" />
      </div>
    </div>

    <!-- 自定义文字 -->
    <div class="px-10 text-xl font-bold text-black sm:text-2xl dark:text-white">
      {{ displaySlogan }}
    </div>

    <!-- 烟花 -->
    <Fireworks
      v-if="settings.mode === 'countdown' && isShowFireworks"
      :options="fireworksOptions"
      class="absolute top-0 left-0 w-full h-full pointer-events-none z-[9999]"
    />

    <PopupSettings
      v-if="isShowSettings"
      v-model="settings"
      @cancel="isShowSettings = false"
      @confirm="onConfirm"
    />
  </div>
</template>
<script setup lang="ts">
import FlipCard from "@/components/FlipCard/index.vue";
import { Fireworks, FireworksOptions } from "@fireworks-js/vue";
import dayjs from "dayjs";
import { computed, onMounted, onUnmounted, ref, watchEffect } from "vue";
import PopupSettings from "./comp/PopupSettings.vue";
import { Settings } from "./type";
import { getDateStr } from "./utils";
const currentDate = ref("");

const displaySlogan = computed(() => {
  const list = settings.value.commonConfig.specialSlogans || [];
  if (!list.length) return settings.value.commonConfig.slogn;

  const today = dayjs().format("YYYY-MM-DD");

  const hit = list.find((item) => item.date === today);

  return hit?.text || settings.value.commonConfig.slogn;
});

/* ------------------------------
   Popup 控制 & 全局设置
------------------------------ */
const isShowSettings = ref(false);

const settings = ref<Settings>({
  mode: "time",
  commonConfig: {
    gap: 40,
    slogn: "每个羽翼的扇动，都是对过往的告别，飞向那座山，拥抱自我。",
    size: 1,
    specialSlogans: [],
  },
  timeConfig: {
    is24Hour: false,
  },
  countdownConfig: {
    targetTime: new Date().getTime(),
    showFireworks: true,
    duration: 10,
  },
});

/* ------------------------------
   时间显示
------------------------------ */
const timeArray = ref([0, 0, 0, 0, 0, 0]);
const hour = ref(0);

const isAM = computed(() => hour.value < 12);

/* ------------------------------
   烟花效果控制
------------------------------ */
const isShowFireworks = ref(false);
const fireworksOptions: FireworksOptions = {
  acceleration: 1.15,
  friction: 0.97,
  particles: 500,
  explosion: 10,
  gravity: 0.98,
  flickering: 50,
  brightness: { min: 50, max: 80 },
};

const triggerFireworks = () => {
  isShowFireworks.value = true;
  setTimeout(() => {
    isShowFireworks.value = false;
    settings.value.mode = "time";
  }, settings.value.countdownConfig.duration * 1000);
};

/* ------------------------------
   更新：倒计时模式
------------------------------ */
const updateCountdown = () => {
  const now = Date.now();
  let diff = Math.max(
    0,
    Math.floor((settings.value.countdownConfig.targetTime - now) / 1000)
  );

  if (diff === 0 && settings.value.countdownConfig.showFireworks) {
    triggerFireworks();
  }

  const h = Math.floor(diff / 3600);
  diff %= 3600;
  const m = Math.floor(diff / 60);
  const s = diff % 60;

  timeArray.value = [
    Math.floor(h / 10),
    h % 10,
    Math.floor(m / 10),
    m % 10,
    Math.floor(s / 10),
    s % 10,
  ];
};

/* ------------------------------
   更新：时间模式
------------------------------ */
const updateTimeMode = () => {
  const now = new Date();
  const h = now.getHours();
  hour.value = h;

  const displayHour = settings.value.timeConfig.is24Hour ? h : h % 12 || 12;

  timeArray.value = [
    Math.floor(displayHour / 10),
    displayHour % 10,
    Math.floor(now.getMinutes() / 10),
    now.getMinutes() % 10,
    Math.floor(now.getSeconds() / 10),
    now.getSeconds() % 10,
  ];
};

/* ------------------------------
   主循环：根据 mode 自动更新
------------------------------ */
const updateTime = () => {
  currentDate.value = getDateStr(dayjs());
  settings.value.mode === "countdown" ? updateCountdown() : updateTimeMode();
};

updateTime();
setInterval(updateTime, 1000);

/* ------------------------------
   屏幕大小相关
------------------------------ */
const isMobile = ref(false);
const isLandscape = ref(false);

const updateDeviceState = () => {
  // 判断是否为移动端
  isMobile.value = window.matchMedia("(max-width: 768px)").matches;

  // 判断横屏（比 innerWidth/height 可靠）
  const orientation = screen.orientation?.type || "";
  isLandscape.value = orientation.includes("landscape");
};

// 初始化执行
updateDeviceState();

// 监听屏幕旋转
window.addEventListener("orientationchange", () => {
  setTimeout(updateDeviceState, 150); // 给旋转动画一点时间
});

// 监听窗口变化（如浏览器大小变化）
window.addEventListener("resize", () => {
  updateDeviceState();
});

const isMobileLandscape = computed(() => isMobile.value && isLandscape.value);
/* ------------------------------
   卡片宽度计算
------------------------------ */
const cardWidth = ref(0);

const calcCardCount = () => {
  let count = 6; // HHMMSS

  if (isMobile.value && !isMobileLandscape.value) {
    count = 2; // 手机竖屏
  }
  return count;
};

const computeWidth = () => {
  const containerWidth = window.innerWidth;
  const cardCount = calcCardCount();
  const gap = settings.value.commonConfig.gap;

  const totalGap =
    isMobile.value && !isMobileLandscape.value ? gap * cardCount : gap * 3;

  cardWidth.value =
    ((containerWidth - totalGap) / cardCount) *
    settings.value.commonConfig.size;
};

// 自动根据 settings 更新卡片尺寸（更智能）
watchEffect(() => computeWidth());

/* ------------------------------
   Popup confirm
------------------------------ */
const onConfirm = () => {
  isShowSettings.value = false;
  computeWidth();
};

/* ------------------------------
   监听窗口变化
------------------------------ */
onMounted(() => {
  computeWidth();
  window.addEventListener("resize", computeWidth);
});

onUnmounted(() => {
  window.removeEventListener("resize", computeWidth);
});
</script>
