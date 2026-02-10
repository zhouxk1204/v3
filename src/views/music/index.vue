<template>
  <loading-screen v-if="loading"></loading-screen>

  <div v-else class="flex items-center justify-center bg" :style="bgStyle">
    <!-- Audio 元素 - 移到外层，确保在两个界面都存在 -->
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

    <!-- 播放器界面 -->
    <section
      :class="isMobileLandscape ? 'flex px-20 gap-20' : ''"
      class="block w-full px-10 sm:w-4/5 sm:px-0 lg:w-1/3 lg:px-0"
    >
      <!-- 封面 -->
      <div class="flex items-center flex-1 sm:p-6">
        <FadeImage
          v-if="currentMeta.coverUrl"
          :src="currentMeta.coverUrl"
          class="w-full shadow-2xl select-none rounded-2xl aspect-square cover"
          :class="{ playing: isPlaying, animated: hasPlayedOnce }"
        />
      </div>
      <div class="flex flex-col justify-center">
        <!-- 标题 -->
        <div class="w-full my-5 text-xl font-bold break-words">
          <h2 class="text-white drop-shadow-lg">
            {{ currentMeta?.title || "加载中..." }}
          </h2>
          <p class="text-sm text-white/70 drop-shadow-lg">
            {{ currentMeta?.artistName || "未知歌手" }}
          </p>
        </div>

        <!-- 时间 -->
        <div class="relative pb-1">
          <Time :current="current" :total="total" />
          <div
            class="absolute bottom-1 left-1/2 scale-75 origin-bottom -translate-x-1/2 flex gap-1 px-2 py-0.5 border-2 border-white/60 rounded-xl bg-black/20 backdrop-blur-sm"
          >
            <img
              src="../../assets/img/flac.png"
              class="w-6 brightness-0 invert drop-shadow-lg"
              alt="无损"
            />
            <span class="text-xs font-bold text-white drop-shadow-lg"
              >高品质</span
            >
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

        <!-- 播放列表按钮 -->
        <div class="flex justify-center mt-4">
          <button
            @click="showPlaylist = true"
            class="flex items-center justify-center w-12 h-12 transition-all duration-200 rounded-full hover:bg-black/30"
            :class="showPlaylist ? 'bg-black/20 backdrop-blur-sm' : ''"
          >
            <Icon
              icon="formkit:list"
              width="36"
              class="text-white drop-shadow-lg"
            />
          </button>
        </div>
      </div>
    </section>

    <!-- 播放列表 Sheet -->
    <Transition name="sheet" appear>
      <div
        v-if="showPlaylist"
        class="playlist-sheet"
        @click.self="showPlaylist = false"
      >
        <!-- Sheet 内容 -->
        <div class="playlist-sheet-content">
          <!-- 歌曲列表 -->
          <div
            class="flex-1 px-4 py-4 overflow-y-auto sm:px-6 lg:px-8 sm:py-6 lg:py-8"
          >
            <div class="space-y-1">
              <div
                v-for="(song, index) in audioList"
                :key="song.id"
                @click="switchToSong(index)"
                class="flex items-center gap-3 p-2 transition-all duration-200 rounded-lg cursor-pointer"
                :class="[
                  index === currentAudioIndex
                    ? 'bg-black/20 backdrop-blur-sm'
                    : 'hover:bg-black/10',
                ]"
              >
                <!-- 歌曲封面 -->
                <div class="relative flex-shrink-0 w-10 h-10">
                  <img
                    v-if="song.coverUrl"
                    :src="song.coverUrl"
                    :alt="song.title"
                    class="object-cover w-full h-full rounded"
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

                  <!-- 播放图标覆盖在封面上 -->
                  <div
                    v-if="index === currentAudioIndex && isPlaying"
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
                  <h3
                    class="text-sm font-medium text-white truncate drop-shadow-lg"
                  >
                    {{ song.title }}
                  </h3>
                  <p class="text-xs text-white truncate drop-shadow-lg">
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
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { querySongList } from "@/api/music/song.ts";
import { SongListItem } from "@/types/music/song.ts";
import { replaceCosUrlsInArray } from "@/utils/cos.ts";
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
const showPlaylist = ref(false); // 控制显示播放列表

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
  if (!audioList.value || audioList.value.length === 0) {
    return {
      id: "",
      title: "加载中...",
      artistName: "未知歌手",
      duration: 0,
      fileUrl: "",
      coverUrl: "",
    };
  }
  return audioList.value[currentAudioIndex.value] || audioList.value[0];
});

/* ================== 背景 ================== */

const bgStyle = computed(() => ({
  "--bg-image": `url(${currentMeta.value.coverUrl})`,
}));

/* ================== 播放控制 ================== */

const playCurrent = async () => {
  const audio = audioRef.value;
  if (!audio) {
    console.error("音频元素不存在");
    return;
  }

  try {
    isLoading.value = true;
    console.log("开始播放:", currentMeta.value.title);
    await audio.play();
    isPlaying.value = true;
    console.log("播放成功");
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

/* ================== 播放列表功能 ================== */

// 切换到指定歌曲
const switchToSong = async (index: number) => {
  console.log("切换到歌曲:", index, audioList.value[index]?.title);

  // 切换到新歌曲
  currentAudioIndex.value = index;

  // 等待 DOM 更新
  await nextTick();

  // 等待音频元素加载
  const audio = audioRef.value;
  if (!audio) {
    console.error("音频元素未找到");
    return;
  }

  // 重新加载音频源
  audio.load();

  // 等待元数据加载完成后播放
  const playWhenReady = () => {
    audio.removeEventListener("loadedmetadata", playWhenReady);
    playCurrent();
  };

  audio.addEventListener("loadedmetadata", playWhenReady);
};

// 格式化时长显示
const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
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
  const songs = replaceCosUrlsInArray(res.data, ['coverUrl', 'fileUrl']);
  audioList.value = songs;
  loading.value = false;
};

onMounted(() => {
  fetchSongs();
});
</script>

<style scoped lang="scss">
@keyframes rotating {
  from {
    transform: rotate(0deg) scale(1.2);
  }
  to {
    transform: rotate(360deg) scale(1.2);
  }
}

@keyframes floating {
  0%,
  100% {
    transform: rotate(0deg) scale(1.2) translateX(0px) translateY(0px);
  }
  25% {
    transform: rotate(90deg) scale(1.3) translateX(20px) translateY(-10px);
  }
  50% {
    transform: rotate(180deg) scale(1.1) translateX(0px) translateY(20px);
  }
  75% {
    transform: rotate(270deg) scale(1.4) translateX(-20px) translateY(-10px);
  }
}

.bg {
  position: fixed;
  inset: 0;
  overflow: hidden;
}

.bg::before {
  content: "";
  position: fixed;
  inset: -100%;
  width: 400%;
  height: 400%;
  z-index: -2;
  background-image: var(--bg-image);
  background-size: cover;
  background-position: center;
  filter: blur(100px) saturate(1.5) brightness(0.7);
  animation: floating 120s ease-in-out infinite;
}

.bg::after {
  content: "";
  position: fixed;
  inset: -80%;
  width: 360%;
  height: 360%;
  z-index: -1;
  background-image: var(--bg-image);
  background-size: cover;
  background-position: center;
  filter: blur(80px) saturate(1.2) brightness(0.5);
  animation: rotating 90s linear infinite reverse;
  opacity: 0.8;
}

/* 播放列表 Sheet */
.playlist-sheet {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: flex-end;
}

.playlist-sheet-content {
  width: 100%;
  max-height: 80vh;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 20px 20px 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Vue过渡动画 */
.sheet-enter-active,
.sheet-leave-active {
  transition: all 0.3s ease;
}

.sheet-enter-from {
  opacity: 0;
  transform: translateY(100%);
}

.sheet-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

.sheet-enter-to,
.sheet-leave-from {
  opacity: 1;
  transform: translateY(0);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.cover {
  transform: scale(0.75);
  transition: opacity 0.3s ease-in-out;
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
