<template>
  <div class="flex items-center justify-center gap-5 px-4 pt-6 pb-4">
    <!-- 列表循环 -->
    <button
      @click="handleModeChange('repeat-list')"
      class="flex items-center justify-center px-4 py-1 transition-all duration-200 rounded-full"
      :class="
        modelValue === 'repeat-list'
          ? 'bg-white/30 backdrop-blur-sm'
          : 'bg-white/10 hover:bg-white/20'
      "
    >
      <Icon
        icon="iconamoon:playlist-repeat-list"
        width="24"
        class="text-white drop-shadow-lg"
      />
    </button>

    <!-- 随机播放 -->
    <button
      @click="handleModeChange('shuffle')"
      class="flex items-center justify-center px-4 py-1 transition-all duration-200 rounded-full"
      :class="
        modelValue === 'shuffle'
          ? 'bg-white/30 backdrop-blur-sm'
          : 'bg-white/10 hover:bg-white/20'
      "
    >
      <Icon
        icon="iconamoon:playlist-shuffle"
        width="24"
        class="text-white drop-shadow-lg"
      />
    </button>

    <!-- 单曲循环 -->
    <button
      @click="handleModeChange('repeat-song')"
      class="flex items-center justify-center px-4 py-1 transition-all duration-200 rounded-full"
      :class="
        modelValue === 'repeat-song'
          ? 'bg-white/30 backdrop-blur-sm'
          : 'bg-white/10 hover:bg-white/20'
      "
    >
      <Icon
        icon="iconamoon:playlist-repeat-song"
        width="24"
        class="text-white drop-shadow-lg"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
export type PlayMode = 'repeat-list' | 'shuffle' | 'repeat-song';

defineProps<{
  modelValue: PlayMode;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: PlayMode];
}>();

const handleModeChange = (mode: PlayMode) => {
  emit('update:modelValue', mode);
};
</script>
