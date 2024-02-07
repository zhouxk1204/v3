<template>
  <div
    class="flex items-center justify-between border-b border-[#e8e8e8] pb-[5px] px-5 text-[#c6c6c6]"
  >
    <div class="flex items-center gap-2 cursor-pointer">
      <Icon icon="lets-icons:sort-random-light" :width="20" />
      <Icon icon="tabler:player-track-prev-filled" :width="20" />
      <Icon
        :icon="isPlaying ? 'iconoir:pause-solid' : 'iconoir:play-solid'"
        :width="30"
      />
      <Icon icon="tabler:player-track-next-filled" :width="20" />
      <Icon icon="cil:loop" :width="20" />
    </div>
    <div class="flex h-12">
      <div
        class="relative flex items-center justify-center w-12 h-12 text-3xl bg-[#e9e9e9] border border-[#d2d2d2] cover cursor-pointer hover:border-[#a2a2a2]"
      >
        <Icon icon="fluent:music-note-2-16-filled" color="#dcdcdc" />
        <div class="hidden">
          <div
            class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30"
          >
            <Icon
              icon="teenyicons:expand-alt-solid"
              color="white"
              :rotate="3"
            />
          </div>
        </div>
      </div>
      <div
        class="flex items-center justify-center w-96 border border-[#e5e5e5] border-l-0"
      >
        <Icon icon="ic:baseline-apple" class="text-2xl" color="#707070" />
      </div>
    </div>
    <div class="flex items-center gap-8">
      <Icon icon="tabler:menu-2" color="#c6c6c6" width="20" height="20" />
      <button
        class="bg-[#c42926] rounded-md h-7 text-white px-3 text-[13px] flex items-center gap-1"
      >
        <Icon icon="heroicons:user-16-solid" height="16" />
        登录
      </button>
    </div>
  </div>

  <div class="p-10">
    <h1 class="border-b border-[#e8e8e8] pb-[5px] text-3xl font-bold">浏览</h1>

    <div class="pt-11">
      <h2 class="flex items-center gap-[2px] font-bold cursor-pointer">
        最新音乐
        <Icon
          icon="icon-park-outline:right"
          color="#c6c6c6"
          width="20"
          height="20"
        />
      </h2>
      <div class="flex gap-5 pt-3 cursor-pointer">
        <div v-for="item in audioInfoList" class="w-1/6">
          <div
            class="relative overflow-hidden rounded-lg shadow-xl music-cover aspect-square"
          >
            <img :src="item.cover" alt="" srcset="" />
            <div
              class="absolute top-0 left-0 hidden w-full h-full bg-black bg-opacity-30"
            >
              <div
                @click="play(item)"
                class="bg-[#cccbcc] rounded-full inline-block p-[6px] absolute left-[10px] bottom-[10px] hover:bg-[#c42926]"
              >
                <Icon icon="iconoir:play-solid" color="#fff" :width="20" />
              </div>
              <div
                class="bg-[#cccbcc] rounded-full inline-block p-[6px] absolute right-[10px] bottom-[10px] hover:bg-[#c42926]"
              >
                <Icon icon="solar:menu-dots-bold" color="#fff" :width="20" />
              </div>
            </div>
          </div>
          <div class="mt-1 text-xs">
            <div class="text-[#000000E0] hover:underline">
              {{ item.title }}
            </div>
            <div class="text-[#0000008F] hover:underline">
              {{ item.artist }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AudioInfo } from "@/types";
import { createURL } from "@/utils";
import { onMounted, ref } from "vue";

const audioFiles = import.meta.glob("@/assets/audio/*.mp3");
const audioFileKeys = Object.keys(audioFiles).map((path) => createURL(path));

const audioInfoList = ref<AudioInfo[]>([]);
const currentAudioInfo = ref<AudioInfo>();
const isPlaying = ref<boolean>(false);

const getMusicInfo = async (path: string) => {
  (window as any).jsmediatags.read(path, {
    onSuccess: (tag: any) => {
      const {
        title = "unknown title",
        artist = "unknown artist",
        picture,
      } = tag.tags;

      const audioInfo: AudioInfo = {
        url: path,
        title,
        artist,
        cover: "",
      };

      if (picture) {
        const arrayBuffer = new Uint8Array(picture.data).buffer;
        // Create a Blob from the picture data
        const blob = new Blob([arrayBuffer], { type: picture.format });
        // Create a URL for the Blob
        audioInfo.cover = URL.createObjectURL(blob);
      }
      audioInfoList.value.push(audioInfo);
      console.log(
        "%c Line:126 🍅 audioInfoList",
        "color:#fca650",
        audioInfoList
      );
    },
    onError: function (error: any) {
      console.error("本地音乐信息获取失败:", error.type, error.info);
    },
  });
};

onMounted(() => {
  for (let path of audioFileKeys) {
    getMusicInfo(path);
  }
});

const play = (audioInfo: AudioInfo) => {
  currentAudioInfo.value = audioInfo;
  isPlaying.value = true;
  console.log(
    "%c Line:158 🍪 currentAudioInfo.value",
    "color:#f5ce50",
    currentAudioInfo.value
  );
};
</script>
<style scoped lang="scss">
.cover:hover > div,
.music-cover:hover > div {
  display: block;
}
</style>
