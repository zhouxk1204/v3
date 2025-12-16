<template>
  <div class="flex items-center justify-center bg" :style="bgStyle">
    <section class="w-[80vw] sm:w-[24vw]">
      <!-- 封面 -->
      <fade-image :src="currentMeta.cover" class="w-full transition-transform shadow-2xl select-none rounded-2xl aspect-square" :style="{
        transform: isPlaying ? 'scale(1)' : 'scale(0.75)'
      }"></fade-image>

      <!-- Audio -->
      <audio
        v-if="currentAudio"
        ref="audioRef"
        :src="currentAudio"
        preload="metadata"
        @loadedmetadata="onLoadedMetadata"
        @timeupdate="onTimeUpdate"
        @play="onPlay"
        @pause="onPause"
        @ended="onEnded"
        @waiting="isLoading = true"
        @canplay="isLoading = false"
      />

      <!-- 标题 -->
      <div class="my-5 text-xl font-bold break-words text-white/90 w-96">
        <h2>{{ currentMeta.title }}</h2>
        <p class="text-lg text-white/80">{{ currentMeta.artist }}</p>
      </div>

      <!-- 时间 -->
      <div class="relative pb-1">
        <Time :current="current" :total="total" />
        <div class="absolute bottom-0 flex gap-1 item-center px-2 py-0.5 overflow-hidden -translate-x-1/2 border-2 border-gray-100/60 rounded-xl left-1/2 scale-75">
          <img src="../../assets/img/flac.png" alt="flac" srcset="" class="w-6 brightness-0 invert opacity-60">
          <span class="text-xs font-bold text-gray-100/60">无损</span>
        </div>
      </div>

      <!-- 控制 -->
      <Control
        class="pt-4 pb-8"
        :loading="isLoading"
        :playing="isPlaying"
        @control="handleControl"
      />
      <!-- <Icon icon="mdi:shuffle-variant" width="25" />
      <Icon icon="mdi:repeat-one" width="25" />
      <Icon icon="mdi:loop" width="25" /> -->
      <!-- 音量 -->
      <Slider class="w-full" v-model="volume" />
    </section>
  </div>
</template>

<script setup lang="ts">
import type { AudioMeta } from "@/components/MusicPlayer/type";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import Control from "./component/Control/index.vue";
import FadeImage from "./component/FadeImage/index.vue";
import Slider from "./component/Slider/index.vue";
import Time from "./component/Time/index.vue";
import { PlayerAction } from "./type";

/* ------------------ 基础状态 ------------------ */
const audioRef = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);
const isLoading = ref(false);
const current = ref(0);
const total = ref(0);
const volume = ref(0.5);

/* ------------------ 背景 ------------------ */
const bgStyle = computed(() => ({
  "--bg-image": `url(${currentMeta.value.cover})`,
}));

/* ------------------ 音频列表 ------------------ */
const audios = ref<string[]>(
  Object.values(
    import.meta.glob('@/assets/audio/*.flac', {
      eager: true,
      query: '?url',
      import: 'default',
    })
  )
)
const currentAudioIndex = ref(0); 

const currentAudio = computed((): string => {
  return audios.value[currentAudioIndex.value] || "";
});

/* ------------------ 元数据 ------------------ */
const currentMeta = ref<AudioMeta>({
  title: "unknown title",
  artist: "unknown artist",
  cover: "",
});

const audioMetaList = ref<AudioMeta[]>([]);

/* ------------------ 控制逻辑 ------------------ */
const handleControl = (action: PlayerAction) => {
  if (action === PlayerAction.Toggle) togglePlay();
  else track(action);
};

const togglePlay = async () => {
  const audio = audioRef.value;
  if (!audio) return;

  try {
    if (audio.paused) {
      isLoading.value = true;
      await audio.play();
    } else {
      audio.pause();
    }
  } catch (err) {
    console.error("播放失败:", err);
  }
};

/* ------------------ Audio 事件 ------------------ */
const onLoadedMetadata = () => {
  const audio = audioRef.value;
  if (!audio) return;

  total.value = Math.floor(audio.duration);
  current.value = 0;
  getAudioMeta();
};

const onTimeUpdate = () => {
  const audio = audioRef.value;
  if (!audio) return;

  current.value = Math.floor(audio.currentTime);
};

const onPlay = () => {
  isPlaying.value = true;
  isLoading.value = false;
};

const onPause = () => {
  isPlaying.value = false;
};

const onEnded = () => {
  track(PlayerAction.Next);
};

/* ------------------ 音量 ------------------ */
watch(volume, (v) => {
  if (audioRef.value) audioRef.value.volume = v;
});

/* ------------------ 切歌 ------------------ */
const track = async (action: PlayerAction) => {
  if (action === PlayerAction.Prev) {
    currentAudioIndex.value =
      currentAudioIndex.value > 0
        ? currentAudioIndex.value - 1
        : audios.value.length - 1;
  } else {
    currentAudioIndex.value =
      currentAudioIndex.value < audios.value.length - 1
        ? currentAudioIndex.value + 1
        : 0;
  }

  await nextTick();

  const audio = audioRef.value;
  if (audio) {
    try {
      isPlaying.value = true;
      await audio.play();
    } catch (e) {
      isPlaying.value = false;
      console.error(e);
    }
  }
};

/* ------------------ 读取 FLAC 元信息 ------------------ */
const getAudioMeta = () => {
  const audioUrl = audioRef.value?.src;
  if (!audioUrl) return;

  const cache = audioMetaList.value[currentAudioIndex.value];
  if (cache) {
    currentMeta.value = cache;
    return;
  }

  (window as any).jsmediatags.read(audioUrl, {
    onSuccess: (tag: any) => {
      const { title, artist, picture } = tag.tags;

      const meta: AudioMeta = {
        title: title || "unknown title",
        artist: artist || "unknown artist",
        cover: "",
      };

      if (picture) {
        const buffer = new Uint8Array(picture.data);
        const blob = new Blob([buffer], { type: picture.format });
        meta.cover = URL.createObjectURL(blob);
      }

      currentMeta.value = meta;
      audioMetaList.value[currentAudioIndex.value] = meta;
    },
    onError: (err: any) => {
      console.error("读取音频信息失败:", err);
    },
  });
};

onMounted(() => {
  if (audioRef.value) audioRef.value.volume = volume.value;
});
</script>

<style scoped lang="scss">
@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.bg {
  position: fixed;
  inset: 0;
}

.bg::before {
  z-index: -1;
  content: "";
  position: fixed;
  inset: -50%;
  width: 300%;
  height: 300%;
  background-image: var(--bg-image);
  background-size: cover;
  background-position: center;
  filter: blur(80px);
  animation: rotating 77s linear infinite;
}
</style>
