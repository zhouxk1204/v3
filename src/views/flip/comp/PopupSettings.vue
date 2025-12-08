<template>
  <div
    class="fixed top-0 right-0 z-50 h-full p-5 overflow-y-auto bg-white shadow-xl w-80 dark:bg-[#17171d] dark:text-white"
  >
    <h2 class="mb-6 text-xl font-bold">设置</h2>

    <!-- ===================== 模式选择 ===================== -->
    <section class="mb-8 space-y-3">
      <div class="text-lg font-bold">模式选择</div>

      <label class="flex items-center gap-3">
        <input type="radio" value="time" v-model="mode" />
        <span>时间模式</span>
      </label>

      <label class="flex items-center gap-3">
        <input type="radio" value="countdown" v-model="mode" />
        <span>倒计时模式</span>
      </label>
    </section>

    <!-- ===================== 时间模式 ===================== -->
    <section v-if="mode === 'time'" class="mb-8 space-y-5">
      <div class="text-lg font-bold">时间模式设置</div>

      <label class="flex items-center justify-between">
        <span class="font-medium">24 小时制</span>
        <input
          type="checkbox"
          class="switch"
          v-model="localData.timeConfig.is24Hour"
        />
      </label>
    </section>

    <!-- ===================== 倒计时模式 ===================== -->
    <section v-if="mode === 'countdown'" class="mb-8 space-y-5">
      <div class="text-lg font-bold">倒计时设置</div>

      <div>
        <label class="font-medium">目标时间</label>
        <input
          type="datetime-local"
          class="w-full p-2 mt-1 bg-gray-100 rounded dark:bg-gray-700"
          v-model="targetTimeInput"
        />
      </div>

      <label class="flex items-center justify-between">
        <span class="font-medium">结束后显示烟花</span>
        <input
          type="checkbox"
          class="switch"
          v-model="localData.countdownConfig.showFireworks"
        />
      </label>

      <div>
        <label class="font-medium"
          >烟花持续时间：{{ localData.countdownConfig.duration }} 秒</label
        >
        <input
          type="range"
          min="1"
          max="60"
          v-model.number="localData.countdownConfig.duration"
          class="w-full"
        />
      </div>
    </section>

    <!-- ===================== 通用设置 ===================== -->
    <section class="mb-8 space-y-5">
      <div class="text-lg font-bold">通用设置</div>

      <div>
        <label class="font-medium"
          >卡片间距：{{ localData.commonConfig.gap }}</label
        >
        <input
          type="range"
          min="10"
          max="100"
          v-model.number="localData.commonConfig.gap"
          class="w-full"
        />
      </div>

      <div>
        <label class="font-medium">底部文案</label>
        <textarea
          class="w-full p-2 mt-1 bg-gray-100 rounded dark:bg-[#343745]"
          rows="3"
          v-model="localData.commonConfig.slogn"
        ></textarea>
      </div>

      <div>
        <label class="font-medium"
          >整体缩放：{{ localData.commonConfig.size }}</label
        >
        <input
          type="range"
          min="0.5"
          max="1"
          step="0.1"
          v-model.number="localData.commonConfig.size"
          class="w-full"
        />
      </div>
    </section>

    <!-- ===================== 按钮 ===================== -->
    <div class="flex justify-end gap-3 mt-10">
      <button
        class="px-4 py-2 font-medium text-gray-700 bg-gray-200 rounded tex-xl dark:bg-gray-700 dark:text-gray-200"
        @click="reset"
      >
        取消
      </button>

      <button
        class="px-6 py-2 font-medium text-white bg-blue-500 rounded tex-xl"
        @click="confirm"
      >
        确定
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: { type: Object, required: true },
});

const emit = defineEmits(["update:modelValue", "confirm", "cancel"]);

// 本地副本（真正用于编辑）
const localData = ref(JSON.parse(JSON.stringify(props.modelValue)));

// 取消时恢复初始值
function reset() {
  emit("cancel");
}

// 点击确定才真的 emit
function confirm() {
  emit("update:modelValue", JSON.parse(JSON.stringify(localData.value)));
  emit("confirm");
}

// mode 双向绑定
const mode = ref(localData.value.mode);
watch(mode, (val) => (localData.value.mode = val));

// datetime-local 处理
const targetTimeInput = ref("");

function updateTargetTimeInput() {
  const ts = localData.value.countdownConfig.targetTime;
  targetTimeInput.value = formatTimestampToInput(ts);
}

const formatTimestampToInput = (timestamp: number) => {
  const d = new Date(timestamp);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    d.getFullYear() +
    "-" +
    pad(d.getMonth() + 1) +
    "-" +
    pad(d.getDate()) +
    "T" +
    pad(d.getHours()) +
    ":" +
    pad(d.getMinutes())
  );
};

updateTargetTimeInput();

// input → 保存为 timestamp
watch(targetTimeInput, (val) => {
  localData.value.countdownConfig.targetTime = new Date(val).getTime();
});
</script>

<style scoped>
.switch {
  @apply relative w-12 h-6 bg-gray-400 rounded-full transition-all cursor-pointer appearance-none;
}
.switch:checked {
  @apply bg-blue-500;
}
.switch::after {
  content: "";
  @apply absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all;
}
.switch:checked::after {
  @apply translate-x-6;
}
</style>
