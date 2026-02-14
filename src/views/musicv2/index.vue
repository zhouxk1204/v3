<template>
  <loading-screen v-if="isInitialLoading"></loading-screen>

  <div class="flex justify-center h-full bg-black/20 bg" :style="bgStyle">
    <div class="flex flex-col w-full h-full" :style="{ maxWidth }">
      <div
        ref="miniRef"
        class="fixed top-0 left-0 flex flex-col items-center w-full"
      >
        <div
          class="flex items-center w-full gap-4 px-8 pb-1"
          :style="{ maxWidth }"
        >
          <div ref="coverRef2" class="w-[60px] h-[60px] flex-none">
            <img
              :src="currentMeta.coverUrl"
              class="w-full select-none rounded-[5px] aspect-square shadow-2xl"
            />
          </div>
          <section ref="miniInfo" class="w-full">
            <AppleMarqueeTitle
              class="text-white drop-shadow-lg font-bold text-[17px]"
              :title="currentMeta.title"
            ></AppleMarqueeTitle>
            <p class="text-[17px] text-white/70 drop-shadow-lg">
              {{ currentMeta.artistName }}
            </p>
          </section>
        </div>
        <div
          ref="playListRef"
          class="w-full px-8 overflow-y-auto hide-scrollbar"
          :style="{ maxHeight: playListMaxHeight, maxWidth }"
        >
          <PlayModeSelector v-model="playMode" />
          <SongList
            :songs="audioList"
            :current-index="currentAudioIndex"
            :is-playing="isPlaying"
            @select="switchToSong"
          />
        </div>
      </div>

      <div class="flex flex-col gap-4 px-8 pt-10">
        <img
          ref="coverRef"
          :src="currentMeta.coverUrl"
          class="w-full shadow-2xl select-none rounded-[10px] aspect-square"
          @load="onCoverLoad"
          @error="onCoverError"
        />

        <div ref="info">
          <AppleMarqueeTitle
            class="text-white drop-shadow-lg font-bold text-[17px]"
            :title="currentMeta.title"
          >
          </AppleMarqueeTitle>
          <p class="text-[17px] text-white/70 drop-shadow-lg">
            {{ currentMeta.artistName }}
          </p>
        </div>

        <div>
          <div class="relative pb-1" ref="playTimeRef">
            <PlayTime :current="current" :total="total" />
            <div
              class="absolute bottom-1 left-1/2 scale-75 origin-bottom -translate-x-1/2 flex gap-1 px-2 py-0.5 border-2 border-white/60 rounded-xl backdrop-blur-sm"
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

          <PlayControl
            class="py-4"
            :loading="isLoading"
            :playing="isPlaying"
            @control="handleControl"
          />
          <VolumeBar class="w-full" v-model="volume" />
          <div class="flex justify-center mt-4">
            <button
              @click="toggleMini()"
              class="flex items-center justify-center w-12 h-12 transition-all duration-200 rounded-full"
              :class="isShowMini ? 'bg-black/20 backdrop-blur-sm' : ''"
            >
              <Icon
                icon="formkit:list"
                width="36"
                class="text-white drop-shadow-lg"
              />
            </button>
          </div>
        </div>
      </div>
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
  </div>
</template>
<script setup lang="ts">
import { querySongList } from "@/api/music/song";
import { SongListItem } from "@/types/music/song";
import { buildCosUrlsInArray } from "@/utils/cos";
import gsap from "gsap";
import _ from "lodash";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import AppleMarqueeTitle from "./components/AppleMarqueeTitle.vue";
import PlayControl, { PlayerAction } from "./components/PlayControl.vue";
import PlayModeSelector, {
  type PlayMode,
} from "./components/PlayModeSelector.vue";
import PlayTime from "./components/PlayTime.vue";
import SongList from "./components/SongList.vue";
import VolumeBar from "./components/VolumeBar.vue";

const isLoading = ref(false); // 播放缓冲 loading
const isInitialLoading = ref(true); // 初始加载状态
const audioRef = ref<HTMLAudioElement | null>(null);
const current = ref(0);
const total = ref(0);
const volume = ref(1);
const maxWidth = "600px";

// 加载状态追踪
const loadingState = ref({
  songsLoaded: false,
  coverLoaded: false,
});

// 检查是否全部加载完成
const checkLoadingComplete = () => {
  if (loadingState.value.songsLoaded && loadingState.value.coverLoaded) {
    // 延迟一点让用户看到加载完成
    setTimeout(() => {
      isInitialLoading.value = false;
    }, 500);
  }
};

const bgStyle = computed(() => ({
  "--bg-image": `url(${currentMeta.value.coverUrl})`,
}));

// 切换到指定歌曲
const switchToSong = async (index: number) => {
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

/* ================== 音频列表 ================== */
const originalAudioList = ref<SongListItem[]>([]); // 原始列表
const audioList = ref<SongListItem[]>([]); // 显示列表

const currentAudioIndex = ref(-1);

/* ================== 元数据 ================== */
const currentMeta = computed<SongListItem>(() => {
  if (audioList.value.length === 0 || currentAudioIndex.value < 0) {
    return {
      id: "",
      title: "加载中...",
      artistName: "未知歌手",
      duration: 0,
      fileUrl: "",
      coverUrl: "",
    };
  }
  return audioList.value[currentAudioIndex.value];
});

/* ================== Audio 事件 ================== */

const onCoverLoad = () => {
  loadingState.value.coverLoaded = true;
  checkLoadingComplete();
};

const onCoverError = () => {
  if (!isInitialLoading.value) {
    console.error("封面加载失败");
  }
  loadingState.value.coverLoaded = true; // 即使失败也标记为完成
  checkLoadingComplete();
};

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
  if (playMode.value === "repeat-song") {
    // 单曲循环：重新播放当前歌曲
    const audio = audioRef.value;
    if (audio) {
      audio.currentTime = 0;
      playCurrent();
    }
  } else if (playMode.value === "shuffle") {
    // 随机播放：随机选择一首歌曲
    const len = audioList.value.length;
    if (len > 1) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * len);
      } while (randomIndex === currentAudioIndex.value);
      currentAudioIndex.value = randomIndex;
      nextTick().then(() => playCurrent());
    } else {
      track("next");
    }
  } else {
    // 列表循环：播放下一首
    track("next");
  }
};

const handleControl = (action: PlayerAction) => {
  console.log(action);
  action === "toggle" ? togglePlay() : track(action);
};

const track = async (action: PlayerAction) => {
  const len = audioList.value.length;
  if (!len) return;

  currentAudioIndex.value =
    action === "prev"
      ? (currentAudioIndex.value - 1 + len) % len
      : (currentAudioIndex.value + 1) % len;

  await nextTick();
  await playCurrent();
};

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

const fetchSongs = async () => {
  try {
    const res = await querySongList();
    const list = res.data as SongListItem[];
    if (list.length === 0) {
      loadingState.value.songsLoaded = true; // 没有歌曲也标记为完成
      checkLoadingComplete();
      return;
    }
    const songs = buildCosUrlsInArray(list, ["coverUrl", "fileUrl"]);
    audioList.value = songs; // 初始化显示列表
    originalAudioList.value = _.cloneDeep(songs); // 保存原始列表
    currentAudioIndex.value = 0; // 默认选中第一首
    loadingState.value.songsLoaded = true;
    checkLoadingComplete();
  } catch (error) {
    console.error("加载歌曲失败:", error);
    loadingState.value.songsLoaded = true; // 即使失败也标记为完成
    checkLoadingComplete();
  }
};

// ==================== 动画常量 ====================
const ANIMATION = {
  // 播放/暂停动画
  PAUSE_SCALE: 0.8, // 暂停时的缩放比例
  PLAY_DURATION: 0.4, // 播放/暂停动画时长
  PLAY_BOUNCE: 3, // 播放恢复时的回弹强度

  // Mini 模式动画
  MINI_DURATION: 0.45, // Mini 模式切换动画时长
  MINI_OPACITY_DELAY: 0.35, // Mini 显示延迟
  MINI_OPACITY_DURATION: 0.15, // Mini 透明度动画时长

  // Info 动画
  INFO_DURATION: 0.5, // Info 移动动画时长
  INFO_RESTORE_DURATION: 0.3, // Info 恢复动画时长

  // MiniInfo 动画
  MINI_INFO_OFFSET: 30, // MiniInfo 默认向下偏移
  MINI_INFO_DURATION: 0.3, // MiniInfo 动画时长

  // PlayList
  PLAY_LIST_OFFSET: 50,
  PLAY_LIST_DURATION: 0.3,
} as const;

// ==================== 状态管理 ====================
const isPlaying = ref(false);
const isShowMini = ref(false);

// ==================== DOM 引用 ====================
const coverRef = ref<HTMLImageElement | null>(null);
const coverRef2 = ref<HTMLDivElement | null>(null);
const miniRef = ref<HTMLDivElement | null>(null);
const info = ref<HTMLDivElement | null>(null);
const miniInfo = ref<HTMLElement | null>(null);
const playListRef = ref<HTMLElement | null>(null);
const playTimeRef = ref<HTMLDivElement | null>(null);

// 计算播放列表的最大高度（防止遮挡 PlayTime）
const playListMaxHeight = ref("320px");

const updatePlayListHeight = () => {
  if (!playTimeRef.value || !playListRef.value) return;

  // 获取 playTimeRef 的顶部位置
  const timeRect = playTimeRef.value.getBoundingClientRect();

  // 计算可用高度 = PlayTime 顶部 - 播放列表顶部 - 间距
  const availableHeight = timeRect.top - 120;

  playListMaxHeight.value = `${Math.max(200, availableHeight)}px`; // 最小 200px
};

// 初始化 miniRef 的位置
onMounted(() => {
  fetchSongs();
  // 媒体键
  setupMediaSession();

  if (playListRef.value) {
    gsap.set(playListRef.value, {
      y: ANIMATION.PLAY_LIST_OFFSET,
      opacity: 0,
    });
  }

  if (miniRef.value) {
    gsap.set(miniRef.value, {
      y: ANIMATION.MINI_INFO_OFFSET,
      opacity: 0,
    });
  }

  // 初始化播放列表高度
  nextTick(() => {
    updatePlayListHeight();
  });

  // 监听窗口大小变化
  window.addEventListener("resize", updatePlayListHeight);

  if (coverRef.value) {
    // 暂停：缩小
    gsap.to(coverRef.value, {
      scale: ANIMATION.PAUSE_SCALE,
      transformOrigin: "center center",
      duration: 0,
      ease: "power2.inOut",
    });
  }

  if (coverRef2.value) {
    gsap.to(coverRef2.value, {
      opacity: 0,
      duration: 0,
    });
  }
});

// ==================== 播放/暂停切换 ====================
// 监听 isPlaying 变化，自动执行动画
watch(isPlaying, (playing) => {
  if (isShowMini.value || !coverRef.value) return;

  if (playing) {
    // 播放：恢复并回弹
    gsap.to(coverRef.value, {
      scale: 1,
      transformOrigin: "center center",
      duration: ANIMATION.PLAY_DURATION,
      ease: `back.out(${ANIMATION.PLAY_BOUNCE})`,
    });
  } else {
    // 暂停：缩小
    gsap.to(coverRef.value, {
      scale: ANIMATION.PAUSE_SCALE,
      transformOrigin: "center center",
      duration: ANIMATION.PLAY_DURATION,
      ease: "power2.inOut",
    });
  }
});

// 监听封面 URL 变化，重置加载状态（切歌时）
watch(
  () => currentMeta.value.coverUrl,
  () => {
    if (!isInitialLoading.value) {
      // 只在初始加载完成后才重置（避免影响初始加载）
      loadingState.value.coverLoaded = false;
    }
  },
);

const togglePlay = () => {
  const audio = audioRef.value;
  if (!audio) return;

  if (isPlaying.value) {
    audio.pause();
  } else {
    playCurrent();
  }
};

// ==================== Mini 模式切换 ====================
const toggleMini = () => {
  if (!coverRef.value || !coverRef2.value || !miniRef.value) return;

  const el = coverRef.value;

  if (!isShowMini.value) {
    // 展开到 Mini 模式
    const rect1 = el.getBoundingClientRect();
    const rect2 = coverRef2.value.getBoundingClientRect();

    // 计算中心点
    const c1x = rect1.left + rect1.width / 2;
    const c1y = rect1.top + rect1.height / 2;
    const c2x = rect2.left + rect2.width / 2;
    const c2y = rect2.top + rect2.height / 2;

    const deltaX = c2x - c1x;
    const deltaY = c2y - c1y;
    const scaleRatio = rect2.width / rect1.width;

    // 暂停态：center → center
    if (!isPlaying.value) {
      gsap.to(el, {
        x: `+=${deltaX}`,
        y: `+=${deltaY}`,
        scale: `*=${scaleRatio}`,
        transformOrigin: "center center",
        duration: ANIMATION.MINI_DURATION,
        ease: "power2.inOut",
        onComplete: () => {
          // 动画完成后设置为透明
          gsap.set(el, { opacity: 0 });
          gsap.set(coverRef2.value, { opacity: 1 });
        },
      });
    }
    // 播放态
    else {
      const rect1TL = el.getBoundingClientRect();
      const rect2TL = coverRef2.value.getBoundingClientRect();

      // 计算两个元素中心点的差值
      const center1X = rect1TL.left + rect1TL.width / 2;
      const center1Y = rect1TL.top + rect1TL.height / 2;
      const center2X = rect2TL.left + rect2TL.width / 2;
      const center2Y = rect2TL.top + rect2TL.height / 2;

      const dx = center2X - center1X;
      const dy = center2Y - center1Y;
      const scaleTL = rect2TL.width / rect1TL.width;

      gsap.to(el, {
        x: `+=${dx}`,
        y: `+=${dy}`,
        scale: `*=${scaleTL}`,
        borderRadius: "12px", // 固定 12px 圆角
        transformOrigin: "center center",
        duration: ANIMATION.MINI_DURATION,
        ease: "power2.inOut",
        onComplete: () => {
          // 动画完成后设置为透明
          gsap.set(el, { opacity: 0 });
          if (coverRef2.value) {
            gsap.set(coverRef2.value, { opacity: 1 });
          }
        },
      });
    }

    // Mini 区域淡入
    gsap.to(miniRef.value, {
      opacity: 1,
      delay: ANIMATION.MINI_OPACITY_DELAY,
      duration: ANIMATION.MINI_OPACITY_DURATION,
    });

    // Info 移动并透明
    if (info.value && miniInfo.value) {
      const infoRect = info.value.getBoundingClientRect();
      const miniInfoRect = miniInfo.value.getBoundingClientRect();
      const deltaY = miniInfoRect.top - infoRect.top;

      gsap.to(info.value, {
        y: deltaY,
        opacity: 0,
        duration: ANIMATION.INFO_DURATION,
        ease: "power2.inOut",
      });

      // miniInfo 从下向上渐显
      gsap.to(miniInfo.value, {
        y: 0,
        opacity: 1,
        duration: ANIMATION.MINI_INFO_DURATION,
        ease: "power2.inOut",
        delay: ANIMATION.INFO_DURATION * 0.5, // info 动画进行到一半时开始
      });

      gsap.to(playListRef.value, {
        y: 0,
        opacity: 1,
        duration: ANIMATION.PLAY_LIST_DURATION,
        ease: "power2.inOut",
        delay: ANIMATION.MINI_DURATION * 0.5, // info 动画进行到一半时开始
        onStart: () => {
          // 动画开始时更新播放列表高度
          nextTick(() => updatePlayListHeight());
        },
      });
    }

    isShowMini.value = true;
  } else {
    // 恢复正常模式
    // cover 先变为不透明再运动
    gsap.set(coverRef2.value, { opacity: 0 });
    gsap.set(el, { opacity: 1 });

    // miniInfo 向下渐隐
    if (miniInfo.value) {
      gsap.to(miniInfo.value, {
        y: ANIMATION.MINI_INFO_OFFSET,
        opacity: 0,
        duration: ANIMATION.MINI_INFO_DURATION,
        ease: "power2.inOut",
      });
    }

    gsap.to(playListRef.value, {
      y: ANIMATION.PLAY_LIST_OFFSET,
      opacity: 0,
      duration: ANIMATION.PLAY_LIST_DURATION,
      ease: "power2.inOut",
    });

    gsap.to(el, {
      x: 0,
      y: 0,
      scale: isPlaying.value ? 1 : ANIMATION.PAUSE_SCALE,
      transformOrigin: isPlaying.value ? "center center" : "center center",
      duration: ANIMATION.MINI_DURATION,
      ease: "power2.inOut",
    });

    // Info 恢复
    if (info.value) {
      gsap.to(info.value, {
        y: 0,
        opacity: 1,
        duration: ANIMATION.INFO_RESTORE_DURATION,
        ease: "power2.inOut",
        delay: 0.1,
      });
    }

    isShowMini.value = false;
  }
};

/* ================== 播放模式 ================== */
const playMode = ref<PlayMode>("repeat-list");

// 监听播放模式变化，更新播放列表顺序
watch(playMode, (mode) => {
  if (mode === "shuffle") {
    const list = [...originalAudioList.value];

    const currentIndex = currentAudioIndex.value;
    const currentSong =
      currentIndex >= 0 ? audioList.value[currentIndex] : null;

    // Fisher-Yates 洗牌
    const shuffle = (arr: any[]) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };

    if (currentSong) {
      // 1️⃣ 有正在播放的歌：当前歌曲置顶，其余随机
      const rest = list.filter((song) => song.id !== currentSong.id);
      const shuffledRest = shuffle(rest);

      audioList.value = [currentSong, ...shuffledRest];
      currentAudioIndex.value = 0;
    } else {
      // 2️⃣ 没有正在播放：全量随机
      audioList.value = shuffle(list);
      currentAudioIndex.value = 0;
    }
  } else {
    // 🔁 恢复顺序播放
    const currentSong = audioList.value[currentAudioIndex.value] ?? null;

    audioList.value = [...originalAudioList.value];

    if (currentSong) {
      currentAudioIndex.value = audioList.value.findIndex(
        (song) => song.id === currentSong.id,
      );
    } else {
      currentAudioIndex.value = 0;
    }
  }
});

watch(
  () => currentMeta.value?.coverUrl,
  (cover) => {
    if (cover) {
      setFavicon(cover);
    }
  },
);

const setFavicon = (url: string) => {
  let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;

  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    document.head.appendChild(link);
  }

  // 防缓存（很关键，不然可能不刷新）
  link.href = `${url}?t=${Date.now()}`;
};

const setupMediaSession = () => {
  if (!("mediaSession" in navigator)) return;

  navigator.mediaSession.setActionHandler("play", togglePlay);
  navigator.mediaSession.setActionHandler("pause", togglePlay);
  navigator.mediaSession.setActionHandler("nexttrack", () => track("next"));
  navigator.mediaSession.setActionHandler("previoustrack", () => track("prev"));

  // 可选：快进/快退
  navigator.mediaSession.setActionHandler("seekforward", () => {
    if (audioRef.value) audioRef.value.currentTime += 10;
  });
  navigator.mediaSession.setActionHandler("seekbackward", () => {
    if (audioRef.value) audioRef.value.currentTime -= 10;
  });
};
</script>
<style scoped lang="scss">
.hide-scrollbar {
  -ms-overflow-style: none; /* IE / Edge */
  scrollbar-width: none; /* Firefox */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome / Safari */
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
  filter: blur(100px) saturate(1.5) brightness(1.2);
  animation: floating 70s ease-in-out infinite;
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
  filter: blur(80px) saturate(1.5) brightness(1.2);
  animation: rotating 70s linear infinite reverse;
  opacity: 0.8;
}
</style>
