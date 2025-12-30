<template>
  <loading-screen v-if="loading"></loading-screen>

  <div v-else class="flex items-center justify-center bg" :style="bgStyle">
    <section
      :class="isMobileLandscape ? 'flex px-20 gap-20' : ''"
      class="block w-full px-10 sm:w-2/3 sm:px-0 lg:w-1/3 lg:px-0"
    >
      <!-- 封面 -->
      <div class="flex items-center flex-1">
        <FadeImage
          v-if="currentMeta.coverUrl"
          :src="currentMeta.coverUrl"
          class="shadow-2xl select-none rounded-2xl aspect-square cover"
          :class="{ playing: isPlaying, animated: hasPlayedOnce }"
        />

        <!-- Audio -->
        <audio
          v-if="currentMeta.fileUrl"
          ref="audioRef"
          :src="currentMeta.fileUrl"
          preload="metadata"
          @loadedmetadata="onLoadedMetadata"
          @timeupdate="onTimeUpdate"
          @play="onPlay"
          @pause="onPause"
          @ended="onEnded"
          @waiting="isLoading = true"
          @canplay="isLoading = false"
        />
      </div>
      <div class="flex flex-col justify-center">
        <!-- 标题 -->
        <div class="w-full my-5 text-xl font-bold break-words text-white/90">
          <h2>{{ currentMeta.title }}</h2>
          <p class="text-lg text-white/80">{{ currentMeta.artistName }}</p>
        </div>

        <!-- 时间 -->
        <div class="relative pb-1">
          <Time :current="current" :total="total" />
          <div
            class="absolute bottom-1 left-1/2 scale-75 origin-bottom -translate-x-1/2 flex gap-1 px-2 py-0.5 border-2 border-gray-100/60 rounded-xl"
          >
            <img
              src="../../assets/img/flac.png"
              class="w-6 brightness-0 invert opacity-60"
              alt="无损"
            />
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

        <!-- 音量 -->
        <Slider class="w-full" v-model="volume" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { querySongList } from "@/api/music/song.ts";
import { SongListItem } from "@/types/music/song.ts";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import Control from "./component/Control/index.vue";
import FadeImage from "./component/FadeImage/index.vue";
import Slider from "./component/Slider/index.vue";
import Time from "./component/Time/index.vue";
import { useIsMobileLandscape } from "./hooks/useIsMobileLandscape.ts";
import { PlayerAction } from "./type";

const isMobileLandscape = useIsMobileLandscape();
/* ================== 基础状态 ================== */

const loading = ref(true); // 元数据初始化 loading
const isLoading = ref(false); // 播放缓冲 loading
const isPlaying = ref(false);

const hasPlayedOnce = ref(false);

watch(isPlaying, (playing) => {
  if (playing) {
    hasPlayedOnce.value = true;
  }
});

const audioRef = ref<HTMLAudioElement | null>(null);

const current = ref(0);
const total = ref(0);
const volume = ref(1);

/* ================== 音频列表 ================== */
const audioList = ref<SongListItem[]>([]);

const currentAudioIndex = ref(0);

/* ================== 元数据 ================== */
const currentMeta = computed<SongListItem>(() => {
  return audioList.value[currentAudioIndex.value];
});

/* ================== 背景 ================== */

const bgStyle = computed(() => ({
  "--bg-image": `url(${currentMeta.value.coverUrl})`,
}));

/* ================== 播放控制 ================== */

const playCurrent = async () => {
  const audio = audioRef.value;
  if (!audio) return;

  try {
    isLoading.value = true;
    await audio.play();
    isPlaying.value = true;
  } catch (err) {
    isPlaying.value = false;
    console.error("播放失败:", err);
  } finally {
    isLoading.value = false;
  }
};

const togglePlay = async () => {
  const audio = audioRef.value;
  if (!audio) return;
  audio.paused ? await playCurrent() : audio.pause();
};

const track = async (action: PlayerAction) => {
  const len = audioList.value.length;
  if (!len) return;

  currentAudioIndex.value =
    action === PlayerAction.Prev
      ? (currentAudioIndex.value - 1 + len) % len
      : (currentAudioIndex.value + 1) % len;

  await nextTick();
  await playCurrent();
};

const handleControl = (action: PlayerAction) => {
  action === PlayerAction.Toggle ? togglePlay() : track(action);
};

/* ================== Audio 事件 ================== */

const onLoadedMetadata = () => {
  const audio = audioRef.value;
  if (!audio) return;
  total.value = Math.floor(audio.duration);
  current.value = 0;
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

/* ================== 音量 ================== */

watch(volume, (v) => {
  if (audioRef.value) audioRef.value.volume = v;
});

/* ================== 生命周期 ================== */
const fetchSongs = async () => {
  const res = await querySongList();
  audioList.value = res.data;
  loading.value = false;
};

onMounted(() => {
  fetchSongs();
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
  content: "";
  position: fixed;
  inset: -50%;
  width: 300%;
  height: 300%;
  z-index: -1;
  background-image: var(--bg-image);
  background-size: cover;
  background-position: center;
  filter: blur(80px);
  animation: rotating 77s linear infinite;
}

.cover {
  transform: scale(0.75);
}

/* ▶️ 播放动画：随时可以 */
.cover.playing {
  animation: play-bounce 0.3s ease-out forwards;
}

/* ⏸ 暂停动画：必须 animated 才允许 */
.cover.animated:not(.playing) {
  animation: pause-back 0.2s ease-in forwards;
}

@keyframes play-bounce {
  0% {
    transform: scale(0.75);
  }
  60% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes pause-back {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.75);
  }
}
</style>
