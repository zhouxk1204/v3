<template>
  <div class="relative h-dvh flex flex-col">
    <!-- Audio Element -->
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

    <div class="fixed bottom-[5px] px-3 w-full z-10">
      <MiniPlayer
        :coverUrl="currentMeta.coverUrl"
        :state="isPlaying ? 'play' : 'pause'"
        :title="currentMeta.title || ''"
        @toggle="onMiniPlayerToggle"
        @next="onMiniPlayerNext"
      ></MiniPlayer>
    </div>
    <nav class="sticky top-0 bg-white z-10">
      <header
        class="flex items-center justify-center border-b-2 shadow-sm h-11 border-b-black/5"
      >
        <a href="#">
          <span class="font-bold text-lg">Music</span>
        </a>
      </header>
    </nav>
    <div class="flex-1 overflow-auto">
      <div
        class="flex flex-col items-center gap-[18px] sm:gap-8 pb-0 pt-10 sm:p-10 sm:flex-row"
      >
        <div
          class="w-[270px] aspect-square flex-none shadow-[0_10px_20px_0_rgba(0,0,0,0.1)] border-2 rounded-[10px] overflow-hidden"
        >
          <img
            src="./favourite.webp"
            alt="cover"
            class="object-cover w-full h-full"
          />
        </div>
        <div class="flex flex-col items-center sm:items-start">
          <div>
            <h1
              class="text-[26px] leading-[26px] text-black/85 font-bold flex items-center gap-1"
            >
              <span>喜爱歌曲</span>
              <span class="text-[#d60017]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 64 64"
                  width="14"
                  height="14"
                  class="svelte-17bwnrw"
                >
                  <path
                    fill="currentColor"
                    d="M13.559 60.051c1.102.86 2.5.565 4.166-.645l14.218-10.455L46.19 59.406c1.666 1.21 3.037 1.505 4.166.645 1.102-.833 1.344-2.204.672-4.166l-5.618-16.718 14.353-10.32c1.666-1.183 2.338-2.42 1.908-3.764-.43-1.29-1.693-1.935-3.763-1.908l-17.605.108-5.348-16.8C34.308 4.496 33.34 3.5 31.944 3.5c-1.372 0-2.34.995-2.984 2.984L23.61 23.283l-17.605-.108c-2.07-.027-3.333.618-3.763 1.908-.457 1.344.242 2.58 1.909 3.763l14.352 10.321-5.617 16.718c-.672 1.962-.43 3.333.672 4.166Z"
                  ></path>
                </svg>
              </span>
            </h1>
            <h2
              class="text-[26px] leading-[26px] text-[#D60017] py-1 cursor-pointer hover:underline text-center sm:text-left"
            >
              周小康
            </h2>
            <p
              class="text-xs font-bold text-center sm:text-left text-black/55 pt-[5px]"
            >
              今日更新
            </p>
          </div>
          <div class="flex gap-4 mt-4 sm:mt-9">
            <button
              @click="onPlayAll"
              class="flex items-center justify-center gap-1 px-4 rounded-md bg-[#d60017] text-white text-[13px] h-[28px] min-w-32"
            >
              <Icon icon="f7:play-fill" width="16"></Icon>
              <span>播放</span>
            </button>
            <button
              @click="onPlayRandom"
              class="flex items-center justify-center gap-1 px-4 rounded-md bg-[#d60017] text-white text-[13px] h-[28px] min-w-32"
            >
              <Icon icon="f7:shuffle" width="16"></Icon>
              <span>随机播放</span>
            </button>
          </div>
        </div>
      </div>
      <div class="w-full px-4 pt-8 sm:px-10">
        <div class="text-xs text-black/55 font-[600] h-8 hidden sm:flex">
          <span class="flex-[3] flex items-center">歌曲</span>
          <span class="flex-[2] border-l pl-3 flex items-center">Artist</span>
          <span class="flex-[2] border-l pl-3 flex items-center">Album</span>
          <span class="flex items-center flex-1 pl-3 border-l">Time</span>
        </div>
        <div
          @click="onClickListItem(index)"
          class="flex items-center p-2 ml-2 hover:bg-black/5 group rounded-[6px] text-[13px] relative"
          v-for="(music, index) in audioList"
          :style="{
            backgroundColor:
              selectIndex === index
                ? '#D60017'
                : index % 2 === 0
                  ? 'rgba(0,0,0,0.015)'
                  : '#fff',
          }"
        >
          <div class="absolute -left-[15px] top-1/2 -translate-y-1/2">
            <span class="text-[#d60017]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 64"
                width="9"
                height="9"
                class="svelte-17bwnrw"
              >
                <path
                  fill="currentColor"
                  d="M13.559 60.051c1.102.86 2.5.565 4.166-.645l14.218-10.455L46.19 59.406c1.666 1.21 3.037 1.505 4.166.645 1.102-.833 1.344-2.204.672-4.166l-5.618-16.718 14.353-10.32c1.666-1.183 2.338-2.42 1.908-3.764-.43-1.29-1.693-1.935-3.763-1.908l-17.605.108-5.348-16.8C34.308 4.496 33.34 3.5 31.944 3.5c-1.372 0-2.34.995-2.984 2.984L23.61 23.283l-17.605-.108c-2.07-.027-3.333.618-3.763 1.908-.457 1.344.242 2.58 1.909 3.763l14.352 10.321-5.617 16.718c-.672 1.962-.43 3.333.672 4.166Z"
                ></path>
              </svg>
            </span>
          </div>
          <div class="flex-[4] flex items-center gap-3">
            <div class="relative">
              <img
                :src="music.coverUrl"
                alt="cover"
                height="40px"
                width="40px"
                class="rounded-[5px]"
              />
              <div
                v-if="selectIndex === index || playingIndex === index"
                @click="onClickCover($event, index)"
                class="absolute inset-0 bg-black/40 rounded-[5px] overflow-hidden flex items-center justify-center"
              >
                <!-- loading -->
                <Icon
                  v-if="isLoading && playingIndex === index"
                  icon="line-md:loading-twotone-loop"
                  width="18"
                  class="text-white"
                />

                <!-- pause -->
                <Icon
                  v-else-if="isPlaying && playingIndex === index"
                  icon="tabler:player-pause-filled"
                  width="18"
                  class="text-white"
                />

                <!-- play -->
                <Icon
                  v-else
                  icon="tabler:player-play-filled"
                  width="18"
                  class="text-white"
                />
              </div>
            </div>
            <p class="text-black/85 font-[600] flex flex-col">
              <span
                class="text-[13px]"
                :class="selectIndex === index ? 'text-white' : 'text-black/85'"
                >{{ music.title }}</span
              >
              <span
                class="sm:hidden text-[13px]"
                :class="selectIndex === index ? 'text-white' : 'text-black/55'"
                >{{ music.artistName }}</span
              >
            </p>
          </div>
          <span
            class="flex-[2] pl-3 hidden sm:flex"
            :class="selectIndex === index ? 'text-white' : 'text-black/55'"
          >
            {{ music.artistName }}</span
          >
          <span class="flex-[2] text-black/55 pl-3"></span>
          <div
            class="flex-1 pl-3"
            :class="selectIndex === index ? 'text-white' : 'text-black/55'"
          >
            <time>{{ secondsToMmSs(music.duration) }}</time>
          </div>
        </div>
      </div>
      <section class="pb-12 pt-10 pl-10 bg-white">
        <p class="text-black/55 text-[13px]">
          {{ audioList.length }}&nbsp;首歌曲、{{
            totalDuration.hours
          }}&nbsp;小时&nbsp;{{ totalDuration.minutes }}&nbsp;分钟
        </p>
      </section>
      <footer class="h-36 bg-[#fafafa] px-4 py-6">
        <span class="text-[10px] text-black/55"
          >Powered By Zhouxk © {{ currentYear }}</span
        >
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { querySongList } from "@/api/music/song";
import { SongListItem } from "@/types/music/song";
import { buildCosUrlsInArray } from "@/utils/cos";

const selectIndex = ref(-1);
const playingIndex = ref(-1);
const isLoading = ref(false); // 当前是否在加载音频
const isPlaying = ref(false); // 当前是否在播放
const audioRef = ref<HTMLAudioElement>();
const currentTime = ref(0); // 当前播放时间（秒）
const isRandomMode = ref(false); // 是否随机播放模式

// 当前播放的歌曲元数据
const currentMeta = ref<{
  fileUrl: string;
  coverUrl: string;
  title: string;
  artistName: string;
  duration: number;
}>({
  fileUrl: "",
  coverUrl: "",
  title: "",
  artistName: "",
  duration: 0,
});

const audioList = ref<SongListItem[]>([]);
const initMusicList = async () => {
  const res = await querySongList();
  const songs = buildCosUrlsInArray(res.data, ["coverUrl", "fileUrl"]);
  audioList.value = songs;
};

initMusicList();

const secondsToMmSs = (seconds: number): string => {
  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;
  return `${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
};

const totalDuration = computed(() => {
  const totalSeconds = audioList.value.reduce(
    (sum, music) => sum + music.duration,
    0,
  );
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return { hours, minutes };
});

const currentYear = new Date().getFullYear();

const onClickListItem = (index: number) => {
  selectIndex.value = index;
};

const onClickCover = async (event: Event, index: number) => {
  event.stopPropagation();

  // 如果点的是当前播放的歌 → 切换播放/暂停
  if (playingIndex.value === index) {
    if (isPlaying.value) {
      pause();
    } else {
      play();
    }
    return;
  }

  // 切歌 - 先更新选中状态
  selectIndex.value = index;

  // 如果是第一次播放或切换歌曲，加载并播放
  playingIndex.value = index;
  await loadAndPlay(index);
};

const loadAndPlay = async (index: number) => {
  const music = audioList.value[index];
  if (!music) return;

  // 更新当前歌曲元数据
  currentMeta.value = {
    fileUrl: music.fileUrl,
    coverUrl: music.coverUrl || "",
    title: music.title,
    artistName: music.artistName || "",
    duration: music.duration,
  };

  console.log("更新 currentMeta:", currentMeta.value);

  // 等待下一帧，确保 audio 元素已创建
  await nextTick();

  if (audioRef.value) {
    isLoading.value = true;
    try {
      await audioRef.value.load();
      await audioRef.value.play();
    } catch (error) {
      console.error("播放失败:", error);
      isLoading.value = false;
    }
  }
};

const play = () => {
  audioRef.value?.play();
};

const pause = () => {
  audioRef.value?.pause();
};

// Audio 事件处理
const onLoadedMetadata = () => {
  console.log("音频元数据加载完成");
};

const onTimeUpdate = () => {
  if (audioRef.value) {
    currentTime.value = audioRef.value.currentTime;
    console.log("当前播放时间:", secondsToMmSs(Math.floor(currentTime.value)));
  }
};

const onPlay = () => {
  isPlaying.value = true;
  isLoading.value = false;
};

const onPause = () => {
  isPlaying.value = false;
};

const onEnded = () => {
  isPlaying.value = false;
  // 可以在这里实现自动播放下一首
};

// MiniPlayer 事件处理
const onMiniPlayerToggle = () => {
  if (isPlaying.value) {
    pause();
  } else {
    play();
  }
};

const onMiniPlayerNext = () => {
  // 根据播放模式选择下一首
  let nextIndex: number;

  if (isRandomMode.value) {
    // 随机模式：随机选择一首歌（排除当前播放的）
    nextIndex = getRandomIndex(playingIndex.value);
  } else {
    // 顺序模式：播放下一首
    nextIndex = playingIndex.value + 1;
    if (nextIndex >= audioList.value.length) {
      nextIndex = 0; // 循环到第一首
    }
  }

  selectIndex.value = nextIndex;
  playingIndex.value = nextIndex;
  loadAndPlay(nextIndex);
};

// 获取随机索引（排除当前索引）
const getRandomIndex = (excludeIndex: number): number => {
  if (audioList.value.length <= 1) return 0;

  let randomIndex: number;
  do {
    randomIndex = Math.floor(Math.random() * audioList.value.length);
  } while (randomIndex === excludeIndex);

  return randomIndex;
};

// 播放全部（从第一首开始）
const onPlayAll = () => {
  isRandomMode.value = false;
  selectIndex.value = 0;
  playingIndex.value = 0;
  loadAndPlay(0);
};

// 随机播放
const onPlayRandom = () => {
  isRandomMode.value = true;
  const randomIndex = Math.floor(Math.random() * audioList.value.length);
  selectIndex.value = randomIndex;
  playingIndex.value = randomIndex;
  loadAndPlay(randomIndex);
};
</script>
