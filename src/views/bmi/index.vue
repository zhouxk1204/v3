<template>
  <div
    class="flex items-center justify-center min-h-screen p-4 font-sans bg-slate-50 md:p-8 text-slate-800"
  >
    <div
      class="flex flex-col w-full max-w-4xl overflow-hidden bg-white shadow-2xl rounded-3xl md:flex-row"
    >
      <div class="p-8 border-r md:w-2/5 bg-slate-100/50 border-slate-100">
        <h2 class="mb-8 text-2xl font-bold">身体数据</h2>

        <div class="mb-8">
          <div class="flex justify-between mb-2">
            <span class="font-medium text-slate-500">身高</span>
            <span class="font-bold text-blue-600"
              >{{ height }} <small>cm</small></span
            >
          </div>
          <input
            type="range"
            v-model="height"
            min="100"
            max="220"
            step="1"
            class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-200 accent-blue-600"
          />
        </div>

        <div class="mb-10">
          <div class="flex justify-between mb-2">
            <span class="font-medium text-slate-500">体重</span>
            <span class="font-bold text-blue-600"
              >{{ weight }} <small>kg</small></span
            >
          </div>
          <input
            type="range"
            v-model="weight"
            min="30"
            max="150"
            step="0.1"
            class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-200 accent-blue-600"
          />
        </div>

        <div
          class="p-4 text-sm text-blue-700 border border-blue-100 bg-blue-50 rounded-2xl"
        >
          💡 拖动滑块实时查看 BMI 变化及其对应的健康状态。
        </div>
      </div>

      <div
        class="relative flex flex-col items-center justify-center p-8 md:w-3/5"
      >
        <div class="mb-4 text-center">
          <span
            class="text-sm font-bold tracking-widest uppercase text-slate-400"
            >你的 BMI 指数</span
          >
          <div class="mt-2 text-6xl font-black tabular-nums">
            {{ displayBmi.toFixed(1) }}
          </div>
          <div
            :style="{ color: currentLevel.color }"
            class="mt-2 text-xl font-bold transition-colors duration-300"
          >
            {{ currentLevel.label }}
          </div>
        </div>

        <div class="relative mt-8 w-80 h-48">
          <!-- 仪表盘 SVG -->
          <svg viewBox="0 0 240 140" class="w-full h-full">
            <!-- 背景半圆弧 (灰色) - 完整的半圆 -->
            <path
              d="M 40 120 A 80 80 0 0 1 200 120"
              fill="none"
              stroke="#e5e7eb"
              stroke-width="24"
              stroke-linecap="round"
            />
            
            <!-- 彩色区域完全覆盖在灰色弧线上 -->
            <!-- 偏瘦区域 (蓝色) 15-18.5 -->
            <path
              d="M 40 120 A 80 80 0 0 1 85.86 54.14"
              fill="none"
              stroke="#3b82f6"
              stroke-width="24"
              stroke-linecap="round"
            />
            
            <!-- 正常区域 (绿色) 18.5-24 -->
            <path
              d="M 85.86 54.14 A 80 80 0 0 1 120 40"
              fill="none"
              stroke="#22c55e"
              stroke-width="24"
              stroke-linecap="round"
            />
            
            <!-- 超重区域 (黄色) 24-28 -->
            <path
              d="M 120 40 A 80 80 0 0 1 154.14 54.14"
              fill="none"
              stroke="#eab308"
              stroke-width="24"
              stroke-linecap="round"
            />
            
            <!-- 肥胖区域 (红色) 28-35 -->
            <path
              d="M 154.14 54.14 A 80 80 0 0 1 200 120"
              fill="none"
              stroke="#ef4444"
              stroke-width="24"
              stroke-linecap="round"
            />
            
            <!-- 数值标签 -->
            <g fill="#6b7280" font-size="16" font-weight="600" text-anchor="middle">
              <text x="25" y="135">15</text>
              <text x="75" y="45">18.5</text>
              <text x="120" y="25">24</text>
              <text x="165" y="45">28</text>
              <text x="215" y="135">35</text>
            </g>
          </svg>

          <!-- 指针 -->
          <div
            ref="pointer"
            class="absolute"
            style="bottom: 28px; left: 50%; transform: translateX(-50%) rotate(-90deg); transform-origin: center bottom;"
          >
            <!-- 指针线 -->
            <div
              class="relative bg-slate-800"
              style="width: 3px; height: 70px; margin: 0 auto; border-radius: 1px;"
            >
              <!-- 指针箭头 -->
              <div
                class="absolute -top-1 left-1/2 transform -translate-x-1/2"
                style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-bottom: 12px solid #1e293b;"
              ></div>
            </div>
          </div>
          
          <!-- 中心圆点 -->
          <div
            class="absolute w-3 h-3 bg-slate-800 rounded-full"
            style="bottom: 25px; left: 50%; transform: translateX(-50%);"
          ></div>
        </div>


        <p
          class="max-w-xs mt-8 text-sm leading-relaxed text-center text-slate-400"
        >
          {{ currentLevel.desc }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { gsap } from "gsap";
import { computed, onMounted, ref, watch } from "vue";

const height = ref(175);
const weight = ref(68);
const pointer = ref(null);
const displayBmi = ref(0);

// BMI 核心逻辑与细分区间配置
const bmiLevels = [
  {
    max: 18.5,
    label: "偏瘦",
    color: "#60A5FA",
    desc: "体重过轻，建议加强营养，适当进行力量训练。",
  },
  {
    max: 24,
    label: "正常",
    color: "#34D399",
    desc: "非常棒！你的体重处于理想范围，请继续保持。",
  },
  {
    max: 28,
    label: "超重",
    color: "#FBBF24",
    desc: "体重超标，建议减少高热量食物摄入，增加有氧运动。",
  },
  {
    max: 32,
    label: "肥胖 I 级",
    color: "#FB923C",
    desc: "已有健康风险，建议咨询营养师制定科学减重计划。",
  },
  {
    max: 35,
    label: "肥胖 II 级",
    color: "#F87171",
    desc: "属于高危肥胖，需警惕心血管疾病，积极控制体重。",
  },
  {
    max: 100,
    label: "肥胖 III 级",
    color: "#EF4444",
    desc: "重度肥胖，建议在医生指导下进行医学减重。",
  },
];

const bmiValue = computed(() => {
  const h = height.value / 100;
  return parseFloat((weight.value / (h * h)).toFixed(1));
});

const currentLevel = computed(() => {
  return (
    bmiLevels.find((level) => bmiValue.value < level.max) ||
    bmiLevels[bmiLevels.length - 1]
  );
});

// 将 BMI 映射到旋转角度 (根据图片调整角度范围)
const calculateRotation = (val) => {
  const minBmi = 15;
  const maxBmi = 35;
  let percent = (val - minBmi) / (maxBmi - minBmi);
  percent = Math.max(0, Math.min(1, percent));
  // 从 -90度 (左端) 到 90度 (右端)，总共180度
  return -90 + percent * 180;
};

// 动画函数：带回弹效果
const triggerAnimation = (newVal) => {
  const rotation = calculateRotation(newVal);

  // 指针旋转回弹
  gsap.to(pointer.value, {
    rotation: rotation,
    duration: 1.6,
    ease: "back.out(1.7)", // 核心回弹效果
    transformOrigin: "center bottom", // 以底部为旋转中心
  });

  // 数字平滑滚动
  gsap.to(displayBmi, {
    value: newVal,
    duration: 1.6,
    ease: "power2.out",
  });
};

onMounted(() => triggerAnimation(bmiValue.value));
watch(bmiValue, (newVal) => triggerAnimation(newVal));
</script>

<style>
/* 针对 Range 输入框的简单美化 */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #2563eb;
  cursor: pointer;
  border: 3px solid white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
</style>
