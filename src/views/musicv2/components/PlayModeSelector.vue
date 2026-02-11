<template>
  <div class="flex items-center justify-between pt-3 pb-4">
    <span class="text-white drop-shadow-lg font-bold text-[17px]"
      >接下来播放</span
    >
    <div class="flex gap-3">
      <!-- 列表循环 -->
      <button
        @click="handleModeChange('repeat-list')"
        class="flex items-center justify-center transition-all duration-200 rounded w-7 h-7"
        :class="
          modelValue === 'repeat-list'
            ? 'bg-white/40 backdrop-blur-sm'
            : 'bg-white/0 hover:bg-white/20'
        "
      >
        <svg
          width="32"
          height="28"
          viewBox="0 0 32 28"
          xmlns="http://www.w3.org/2000/svg"
          class="text-white drop-shadow-lg"
        >
          <path
            d="M9.545 14.272a.856.856 0 00.863-.855v-.448c0-1.004.706-1.677 1.785-1.677h5.005v1.362c0 .407.258.664.673.664a.745.745 0 00.49-.183l2.581-2.166c.316-.266.316-.69 0-.955l-2.581-2.183a.745.745 0 00-.49-.183c-.415 0-.672.258-.672.665v1.294h-4.881c-2.217 0-3.628 1.254-3.628 3.213v.597c0 .474.382.855.855.855zm4.864 5.952c.407 0 .664-.257.664-.664v-1.303h4.881c2.225 0 3.628-1.254 3.628-3.213v-.597a.854.854 0 10-1.71 0v.448c0 1.004-.714 1.677-1.793 1.677h-5.006v-1.353c0-.407-.257-.664-.664-.664a.767.767 0 00-.498.182l-2.573 2.175c-.324.257-.315.68 0 .946l2.573 2.192a.807.807 0 00.498.174z"
            fill="currentColor"
            fill-rule="nonzero"
          />
        </svg>
      </button>

      <!-- 随机播放 -->
      <button
        @click="handleModeChange('shuffle')"
        class="flex items-center justify-center transition-all duration-200 rounded w-7 h-7"
        :class="
          modelValue === 'shuffle'
            ? 'bg-white/30 backdrop-blur-sm'
            : 'bg-white/0 hover:bg-white/20'
        "
      >
        <svg
          width="32"
          height="28"
          viewBox="0 0 32 28"
          xmlns="http://www.w3.org/2000/svg"
          class="text-white drop-shadow-lg"
        >
          <path
            d="M20.767 20.44a.81.81 0 00.49-.183l2.58-2.174c.316-.266.316-.681 0-.955l-2.58-2.183a.81.81 0 00-.49-.183c-.415 0-.673.258-.673.673v1.245h-1.162c-.739 0-1.195-.233-1.718-.847l-1.527-1.801 1.527-1.81c.54-.63.946-.847 1.677-.847h1.203v1.279c0 .407.258.664.673.664a.801.801 0 00.49-.174l2.58-2.175c.316-.266.316-.69 0-.955l-2.58-2.183a.761.761 0 00-.49-.183c-.415 0-.673.258-.673.665v1.386h-1.212c-1.228 0-1.992.34-2.863 1.386l-1.412 1.668-1.469-1.751c-.805-.946-1.569-1.303-2.747-1.303H8.896c-.53 0-.896.348-.896.838s.365.838.896.838h1.437c.697 0 1.162.225 1.685.847l1.519 1.801-1.52 1.81c-.53.623-.954.847-1.643.847H8.896c-.53 0-.896.348-.896.838s.365.838.896.838h1.536c1.179 0 1.901-.356 2.706-1.303l1.478-1.751 1.444 1.718c.822.98 1.627 1.336 2.822 1.336h1.212v1.412c0 .415.258.672.673.672z"
            fill="currentColor"
            fill-rule="nonzero"
          />
        </svg>
      </button>

      <!-- 单曲循环 -->
      <button
        @click="handleModeChange('repeat-song')"
        class="flex items-center justify-center transition-all duration-200 rounded w-7 h-7"
        :class="
          modelValue === 'repeat-song'
            ? 'bg-white/30 backdrop-blur-sm'
            : 'bg-white/0 hover:bg-white/20'
        "
      >
        <svg
          width="32"
          height="28"
          viewBox="0 0 32 28"
          xmlns="http://www.w3.org/2000/svg"
          class="text-white drop-shadow-lg"
        >
          <path
            d="M22.752 12.313c.473 0 .747-.257.747-.771V8.503c0-.54-.357-.904-.888-.904-.44 0-.698.14-1.038.398l-.838.656c-.2.15-.266.299-.266.473 0 .257.19.465.498.465.133 0 .24-.042.349-.125l.614-.514h.058v2.59c0 .514.274.771.764.771zm-13.207 1.96a.84.84 0 00.863-.856v-.448c0-1.004.706-1.677 1.785-1.677h3.403v1.362c0 .407.258.664.673.664a.745.745 0 00.49-.183l2.581-2.166c.316-.266.316-.69 0-.955L16.76 7.831a.745.745 0 00-.49-.183c-.415 0-.673.258-.673.665v1.294h-3.278c-2.217 0-3.628 1.254-3.628 3.213v.597c0 .49.374.855.855.855zm4.864 5.951c.407 0 .664-.257.664-.664v-1.303h4.881c2.225 0 3.628-1.254 3.628-3.213v-.597a.838.838 0 00-.855-.855.833.833 0 00-.855.855v.448c0 1.004-.714 1.677-1.793 1.677h-5.006v-1.353c0-.407-.257-.664-.664-.664a.767.767 0 00-.498.182l-2.573 2.175c-.324.257-.315.68 0 .946l2.573 2.192a.807.807 0 00.498.174z"
            fill="currentColor"
            fill-rule="nonzero"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
export type PlayMode = "repeat-list" | "shuffle" | "repeat-song";

defineProps<{
  modelValue: PlayMode;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: PlayMode];
}>();

const handleModeChange = (mode: PlayMode) => {
  emit("update:modelValue", mode);
};
</script>
