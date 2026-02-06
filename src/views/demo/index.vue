<template>
  <div class="flex flex-col h-full bg-black/20">
    <div ref="miniRef" class="px-10 fixed top-0 left-0 w-full">
      <div class="flex gap-5 items-center">
        <div ref="coverRef2" class="w-20 h-20 flex-none" @click="isShowMini = false">
          <img :src="currentMeta.coverUrl" class="w-full select-none rounded-[4px] aspect-square cover" />
        </div>
        <section ref="miniInfo" class="w-full">
          <AppleMarqueeTitle class="text-white drop-shadow-lg font-bold" :title="currentMeta.title"></AppleMarqueeTitle>
          <p class="text-sm text-white/70 drop-shadow-lg">{{ currentMeta.artistName }}</p>
        </section>
      </div>
      <div ref="playListRef" class="overflow-y-auto h-[360px] hide-scrollbar">
        <PlayModeSelector v-model="playMode" />
        <!-- 歌曲列表 -->
        <SongList :songs="audioList" :current-index="currentAudioIndex" :is-playing="isPlaying"
          @select="switchToSong" />
      </div>
    </div>

    <div class="px-10 flex flex-col gap-5 pt-10">
      <img id="cover" ref="coverRef" :src="currentMeta.coverUrl"
        class="w-full shadow-2xl select-none rounded-[12px] aspect-square cover" />

      <div ref="info">
        <AppleMarqueeTitle class="text-white drop-shadow-lg font-bold text-2xl" :title="currentMeta.title">
        </AppleMarqueeTitle>
        <p class="text-lg text-white/70 drop-shadow-lg">{{ currentMeta.artistName }}</p>
      </div>

      <PlayControl class="pt-4 pb-8" :loading="isLoading" :playing="isPlaying" @control="handleControl" />
      <div class="flex justify-center mt-4">
        <button @click="toggleMini()"
          class="flex items-center justify-center w-12 h-12 transition-all duration-200 rounded-full hover:bg-black/30"
          :class="isShowMini ? 'bg-black/20 backdrop-blur-sm' : ''">
          <Icon icon="formkit:list" width="44" class="text-white drop-shadow-lg" />
        </button>
      </div>
    </div>
    <!-- Audio 元素 - 移到外层，确保在两个界面都存在 -->
    <audio v-if="currentMeta.fileUrl" ref="audioRef" :src="currentMeta.fileUrl" preload="metadata"
      @loadedmetadata="onLoadedMetadata" @timeupdate="onTimeUpdate" @play="onPlay" @pause="onPause" @ended="onEnded"
      @waiting="isLoading = true" @canplay="isLoading = false" />
  </div>
</template>
<script setup lang="ts">
import { querySongList } from '@/api/music/song';
import { SongListItem } from '@/types/music/song';
import gsap from 'gsap';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import AppleMarqueeTitle from './components/AppleMarqueeTitle.vue';
import PlayControl, { PlayerAction } from './components/PlayControl.vue';
import PlayModeSelector, { type PlayMode } from './components/PlayModeSelector.vue';
import SongList from './components/SongList.vue';

const isLoading = ref(false); // 播放缓冲 loading
const audioRef = ref<HTMLAudioElement | null>(null);
const current = ref(0);
const total = ref(0);

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
  if (playMode.value === 'repeat-song') {
    // 单曲循环：重新播放当前歌曲
    const audio = audioRef.value;
    if (audio) {
      audio.currentTime = 0;
      playCurrent();
    }
  } else if (playMode.value === 'shuffle') {
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
  const res = await querySongList();
  audioList.value = res.data;
};

// ==================== 动画常量 ====================
const ANIMATION = {
  // 播放/暂停动画
  PAUSE_SCALE: 0.8,           // 暂停时的缩放比例
  PLAY_DURATION: 0.4,         // 播放/暂停动画时长
  PLAY_BOUNCE: 3,             // 播放恢复时的回弹强度

  // Mini 模式动画
  MINI_DURATION: 0.45,        // Mini 模式切换动画时长
  MINI_OPACITY_DELAY: 0.35,   // Mini 显示延迟
  MINI_OPACITY_DURATION: 0.15, // Mini 透明度动画时长

  // Info 动画
  INFO_DURATION: 0.5,         // Info 移动动画时长
  INFO_RESTORE_DURATION: 0.3, // Info 恢复动画时长

  // MiniInfo 动画
  MINI_INFO_OFFSET: 30,       // MiniInfo 默认向下偏移
  MINI_INFO_DURATION: 0.3,    // MiniInfo 动画时长

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

// 初始化 miniRef 的位置
onMounted(() => {
  fetchSongs();

  if (playListRef.value) {
    gsap.set(playListRef.value, {
      y: ANIMATION.PLAY_LIST_OFFSET,
      opacity: 0
    });
  }

  if (miniRef.value) {
    gsap.set(miniRef.value, {
      y: ANIMATION.MINI_INFO_OFFSET,
      opacity: 0
    });
  }

  if (coverRef.value) {
    // 暂停：缩小
    gsap.to(coverRef.value, {
      scale: ANIMATION.PAUSE_SCALE,
      transformOrigin: 'center center',
      duration: 0,
      ease: 'power2.inOut'
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
      transformOrigin: 'center center',
      duration: ANIMATION.PLAY_DURATION,
      ease: `back.out(${ANIMATION.PLAY_BOUNCE})`
    });
  } else {
    // 暂停：缩小
    gsap.to(coverRef.value, {
      scale: ANIMATION.PAUSE_SCALE,
      transformOrigin: 'center center',
      duration: ANIMATION.PLAY_DURATION,
      ease: 'power2.inOut'
    });
  }
});

const togglePlay = () => {
  // if (isShowMini.value) return;
  isPlaying.value = !isPlaying.value;
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
        transformOrigin: 'center center',
        duration: ANIMATION.MINI_DURATION,
        ease: 'power2.inOut',
        onComplete: () => {
          // 动画完成后设置为透明
          gsap.set(el, { opacity: 0 });
          gsap.set(coverRef2.value, { opacity: 1 });
        }
      });
    }
    // 播放态：top-left → top-left
    else {
      gsap.set(el, { transformOrigin: 'top left' });

      const rect1TL = el.getBoundingClientRect();
      const rect2TL = coverRef2.value.getBoundingClientRect();

      const dx = rect2TL.left - rect1TL.left;
      const dy = rect2TL.top - rect1TL.top;
      const scaleTL = rect2TL.width / rect1TL.width;

      gsap.to(el, {
        x: `+=${dx}`,
        y: `+=${dy}`,
        scale: `*=${scaleTL}`,
        borderRadius: '12px', // 固定 12px 圆角
        transformOrigin: 'top left',
        duration: ANIMATION.MINI_DURATION,
        ease: 'power2.inOut',
        onComplete: () => {
          // 动画完成后设置为透明
          gsap.set(el, { opacity: 0 });
          if (coverRef2.value) {
            gsap.set(coverRef2.value, { opacity: 1 });
          }
        }
      });
    }

    // Mini 区域淡入
    gsap.to(miniRef.value, {
      opacity: 1,
      delay: ANIMATION.MINI_OPACITY_DELAY,
      duration: ANIMATION.MINI_OPACITY_DURATION
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
        ease: 'power2.inOut'
      });

      // miniInfo 从下向上渐显
      gsap.to(miniInfo.value, {
        y: 0,
        opacity: 1,
        duration: ANIMATION.MINI_INFO_DURATION,
        ease: 'power2.inOut',
        delay: ANIMATION.INFO_DURATION * 0.5 // info 动画进行到一半时开始
      });

      gsap.to(playListRef.value, {
        y: 0,
        opacity: 1,
        duration: ANIMATION.PLAY_LIST_DURATION,
        ease: 'power2.inOut',
        delay: ANIMATION.MINI_DURATION * 0.5 // info 动画进行到一半时开始
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
        ease: 'power2.inOut'
      });
    }

    gsap.to(playListRef.value, {
      y: ANIMATION.PLAY_LIST_OFFSET,
      opacity: 0,
      duration: ANIMATION.PLAY_LIST_DURATION,
      ease: 'power2.inOut'
    });

    gsap.to(el, {
      x: 0,
      y: 0,
      scale: isPlaying.value ? 1 : ANIMATION.PAUSE_SCALE,
      transformOrigin: isPlaying.value ? 'top left' : 'center center',
      duration: ANIMATION.MINI_DURATION,
      ease: 'power2.inOut',
    });

    // Info 恢复
    if (info.value) {
      gsap.to(info.value, {
        y: 0,
        opacity: 1,
        duration: ANIMATION.INFO_RESTORE_DURATION,
        ease: 'power2.inOut',
        delay: 0.1
      });
    }

    isShowMini.value = false;
  }
};

/* ================== 播放模式 ================== */
const playMode = ref<PlayMode>('repeat-list');
</script>
<style scoped lang="scss">
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE / Edge */
  scrollbar-width: none;     /* Firefox */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;             /* Chrome / Safari */
}
</style>
