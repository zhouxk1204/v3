<template>
  <div class="flex-1 pb-4">
    <div class="space-y-1">
      <div
        v-for="(song, index) in songs"
        :key="song.id"
        @click="$emit('select', index)"
        class="flex items-center gap-3 p-2 transition-all duration-200 rounded cursor-pointer"
        :class="[
          index === currentIndex
            ? 'bg-black/20 backdrop-blur-sm'
            : 'hover:bg-black/10',
        ]"
      >
        <!-- 封面 -->
        <div class="relative flex-shrink-0 w-10 h-10">
          <img
            v-if="song.coverUrl"
            :src="song.coverUrl"
            :alt="song.title"
            class="object-cover w-full h-full rounded pointer-events-none"
          />
          <div
            v-else
            class="flex items-center justify-center w-full h-full rounded bg-black/20 backdrop-blur-sm"
          >
            <Icon
              icon="tabler:music"
              width="16"
              class="text-white drop-shadow-lg"
            />
          </div>

          <!-- 播放图标 -->
          <div
            v-if="index === currentIndex && isPlaying"
            class="absolute inset-0 flex items-center justify-center rounded bg-black/50"
          >
            <Icon
              icon="tabler:volume"
              width="14"
              class="text-white animate-pulse drop-shadow-lg"
            />
          </div>
        </div>

        <!-- 歌曲信息 -->
        <div class="flex-1 min-w-0">
          <h3 class="text-[15px] font-medium text-white truncate drop-shadow-lg">
            {{ song.title }}
          </h3>
          <p class="text-[13px] text-white truncate drop-shadow-lg">
            {{ song.artistName }}
          </p>
        </div>

        <!-- 时长 -->
        <div class="text-xs text-white drop-shadow-lg">
          {{ formatDuration(song.duration) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SongListItem } from '@/types/music/song';

defineProps<{
  songs: SongListItem[];
  currentIndex: number;
  isPlaying: boolean;
}>();

defineEmits<{
  select: [index: number];
}>();

// 格式化时长显示
const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
</script>
