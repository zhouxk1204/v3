<template>
  <div class="relative overflow-auto h-dvh">
    <div class="fixed bottom-[5px] px-3 w-full z-10">
      <MiniPlayer coverUrl="" :state="'pause'" title="123"></MiniPlayer>
    </div>
    <nav>
      <header
        class="flex items-center justify-center border-b-2 shadow-sm h-11 border-b-black/5"
      >
        <a href="#">
          <span class="font-bold text-[15px]">Music</span>
        </a>
      </header>
    </nav>
    <div
      class="flex flex-col items-center gap-[18px] sm:gap-8 pb-0 pt-10 sm:p-10 sm:flex-row"
    >
      <div
        class="w-[270px] aspect-square flex-none shadow-[0_10px_20px_0_rgba(0,0,0,0.1)] border-2 rounded-[10px] overflow-hidden"
      >
        <img
          src="https://is1-ssl.mzstatic.com/image/thumb/Features116/v4/e3/6e/33/e36e33de-da6c-71e8-dc2e-fae168c924ba/47a3c06a-ab88-4d36-a040-41d730e71d45.png/610x610cc.webp"
          alt="cover"
          class="object-cover w-full h-full"
        />
      </div>
      <div class="flex flex-col items-center sm:items-start">
        <div>
          <h1 class="text-[26px] leading-[26px] text-black/85 font-bold">
            Favourite Songs
          </h1>
          <h2
            class="text-[26px] leading-[26px] text-[#D60017] py-1 cursor-pointer hover:underline text-center sm:text-left"
          >
            周小康
          </h2>
          <p class="text-xs font-bold text-center sm:text-left text-black/55">
            UPDATED TODAY
          </p>
        </div>
        <p
          class="text-[13px] text-black/55 mt-3 sm:mt-7 line-clamp-3 text-center sm:text-left px-6 sm:px-0"
        >
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </p>

        <div class="flex gap-4 mt-4 sm:mt-9">
          <button
            class="flex items-center justify-center gap-1 px-4 rounded-md bg-[#d60017] text-white text-[13px] h-[28px]"
          >
            <Icon icon="f7:play-fill" width="16"></Icon>
            <span>播放</span>
          </button>
          <button
            class="flex items-center justify-center gap-1 px-4 rounded-md bg-[#d60017] text-white text-[13px] h-[28px]"
          >
            <Icon icon="f7:play-fill" width="16"></Icon>
            <span>随机播放</span>
          </button>
        </div>
      </div>
    </div>
    <div class="w-full px-4 pt-8 sm:px-10">
      <div class="text-xs text-black/55 font-[600] h-8 hidden sm:flex">
        <span class="flex-[3] flex items-center">Song</span>
        <span class="flex-[2] border-l pl-3 flex items-center">Artist</span>
        <span class="flex-[2] border-l pl-3 flex items-center">Album</span>
        <span class="flex items-center flex-1 pl-3 border-l">Time</span>
      </div>
      <div
        @click="onClickListItem(index)"
        class="flex items-center p-2 hover:bg-black/5 group rounded-[5px] text-[13px]"
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
        <div class="flex-[3] flex items-center gap-3">
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
    <section class="pt-3 pb-24 pl-[25px]">
      <p class="pt-[45px] text-black/55 pl-3 text-[13px]">
        {{ audioList.length }} songs, 2 hours 27 minutes
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { querySongList } from "@/api/music/song";
import { SongListItem } from "@/types/music/song";
  
const selectIndex = ref(-1);
const playingIndex = ref(-1);
const isLoading = ref(false); // 当前是否在加载音频
const isPlaying = ref(false); // 当前是否在播放

const audioList = ref<SongListItem[]>([]);
const initMusicList = async () => {
  const res = await querySongList();
  audioList.value = res.data;
};

initMusicList();

const secondsToMmSs = (seconds: number): string => {
  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;
  return `${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
};

const onClickListItem = (index: number) => {
  selectIndex.value = index;
  console.log(
    "%c Line:169 🍫 selectIndex.value",
    "color:#3f7cff",
    selectIndex.value
  );
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

  // 切歌
  selectIndex.value = index;
  playingIndex.value = index;
  // await loadAndPlay(index);
};

const play = () => {
  isPlaying.value = true;
};

const pause = () => {
  isPlaying.value = false;
};
</script>
