<template>
  <div class="overflow-auto h-[100dvh]">
    <div class="flex gap-8 p-10">
      <div class="w-[270px] aspect-square flex-none">
        <img
          src="https://picsum.photos/270"
          alt="cover"
          class="shadow-radiosity rounded-[10px] w-full h-full object-cover"
        />
      </div>
      <div class="flex flex-col justify-end">
        <div>
          <h1 class="text-[26px] text-black/85 font-bold">MY FAVORITE SONGS</h1>
          <h2
            class="text-[26px] text-[#D60017] py-1 cursor-pointer hover:underline"
          >
            ZHOUXIAOKANG
          </h2>
          <p class="text-xs font-bold">POP · 2025</p>
        </div>
        <p class="text-[13px] text-black/55 mt-7 line-clamp-3">
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

        <div class="flex gap-4 mt-9">
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
    <div class="w-full px-10 pt-4">
      <div class="flex text-xs text-[rgba(0, 0, 0, .56)] font-[600] h-8">
        <span class="flex-[3]">Song</span>
        <span class="flex-[2]">Artist</span>
        <span class="flex-1">Time</span>
      </div>
      <div class="flex items-center p-2 hover:bg-black/5 group rounded-[5px] text-[13px]" v-for="item in mockList">
        <div class="flex-[3] flex items-center gap-3">
          <div class="relative">
            <img
            :src="item.cover"
            alt="cover"
            height="40px"
            width="40px"
            class="rounded-[5px]"
            />
            <div class="absolute inset-0 hidden bg-[rgba(0,0,0,.45)] group-hover:block rounded-[5px] overflow-hidden">
              <button class="flex items-center justify-center w-full h-full text-white">
                <Icon icon="tabler:player-play-filled" width="16" />
              </button>
            </div>
          </div>
          <p class="text-[rgba(0, 0, 0, .56)] font-[600]">
            {{ item.title }}
          </p>
        </div>
        <span class="flex-[2]"> {{ item.artist }}</span>
        <div class="flex-1">
          <time>{{ item.duration }}</time>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const mockList = [
  {
    cover: "https://picsum.photos/46?random=1",
    title: "All I Want for Christmas Is You",
    artist: "Mariah Carey",
    duration: "4:01",
  },
  {
    cover: "https://picsum.photos/46?random=2",
    title: "Love Story",
    artist: "Taylor Swift",
    duration: "3:45",
  },
  {
    cover: "https://picsum.photos/46?random=3",
    title: "Hello",
    artist: "Adele",
    duration: "5:12",
  },
  {
    cover: "https://picsum.photos/46?random=4",
    title: "Uptown Funk",
    artist: "Bruno Mars",
    duration: "3:18",
  },
  {
    cover: "https://picsum.photos/46?random=5",
    title: "Shape of You",
    artist: "Ed Sheeran",
    duration: "4:29",
  },
  {
    cover: "https://picsum.photos/46?random=6",
    title: "Diamonds",
    artist: "Rihanna",
    duration: "3:56",
  },
  {
    cover: "https://picsum.photos/46?random=7",
    title: "Sorry",
    artist: "Justin Bieber",
    duration: "4:08",
  },
  {
    cover: "https://picsum.photos/46?random=8",
    title: "Bad Romance",
    artist: "Lady Gaga",
    duration: "3:34",
  },
  {
    cover: "https://picsum.photos/46?random=9",
    title: "Blinding Lights",
    artist: "The Weeknd",
    duration: "4:22",
  },
  {
    cover: "https://picsum.photos/46?random=10",
    title: "Happier Than Ever",
    artist: "Billie Eilish",
    duration: "3:59",
  },
];
</script>
<style lang="scss" scoped></style>
