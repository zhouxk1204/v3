<template>
  <div class="fixed bottom-5 right-5">
    <audio
      class="hidden"
      v-if="currentAudio.length > 0"
      ref="audioRef"
      :src="currentAudio"
    ></audio>
    <div>
      <div
        class="z-20 flex items-center overflow-hidden border shadow bg-opacity-5 rounded-2xl"
      >
        <div class="flex items-center justify-center flex-none pl-2 w-14">
          <img
            :src="meta.cover"
            :style="{ 'animation-play-state': isPlay ? 'running' : 'paused' }"
            :class="{ 'shadow-2xl': isPlay }"
            class="transition-all ease-in-out border rounded-full animation-rotated"
            alt="album"
          />
        </div>
        <div class="pl-2">
          <div class="text-sm text-gray-500">{{ meta.title }}</div>
          <div class="mt-1 text-xs text-gray-400">{{ meta.artist }}</div>
        </div>
        <div class="p-2">
          <div class="flex justify-between overflow-hidden select-none">
            <template v-for="item in icons">
              <div
                class="flex items-center justify-center w-8 h-8 text-gray-300 rounded-md cursor-pointer hover:text-white hover:bg-gray-300"
                @click="onAction(item.action)"
              >
                <Icon :icon="item.icon" width="24"></Icon>
              </div>
            </template>
          </div>
          <div class="flex items-center">
            <div
              @click="onMute"
              class="mr-1 flex items-center justify-center p-[2px] text-gray-300 rounded-md cursor-pointer hover:text-white hover:bg-gray-300"
            >
              <Icon class="w-5 h-5" icon="ic:round-volume-mute"></Icon>
            </div>
            <input
              v-model="volume"
              type="range"
              min="0"
              max="1"
              :style="{
                width: '60px',
                background: `linear-gradient(to right, #9ca3af 0%, #9ca3af ${
                  volume * 100
                }%, #d1d5db ${volume * 100}%,  #d1d5db 100%)`,
              }"
              step="0.1"
              @input="handleVolumeChange"
            />
            <div
              @click="onMax"
              class="flex items-center justify-center text-gray-300 rounded-md cursor-pointer p-[2px] hover:text-white hover:bg-gray-300 ml-1"
            >
              <Icon class="w-5 h-5" icon="ic:round-volume-up"></Icon>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Action, NEXT, PAUSE, PLAY, PREV } from "./type";

const audioRef = ref<HTMLAudioElement>();
const audios = ref<string[]>([]);
const currentAudioIndex = ref<number>(0);
const currentAudio = computed(() => {
  return audios.value.length > 0 ? audios.value[currentAudioIndex.value] : "";
});

const meta = ref({
  title: "",
  artist: "",
  cover: "",
});

const audioContext = import.meta.glob("@/assets/audio/*.mp3");
audios.value = Object.keys(audioContext);

onMounted(() => {
  getAudioMeta();
  setVolume();
});

const volume = ref(0.2);
const handleVolumeChange = () => {
  setVolume();
};

const setVolume = () => {
  if (audioRef.value) {
    audioRef.value.volume = volume.value;
  }
};

const onMute = () => {
  volume.value = 0;
  setVolume();
};

const onMax = () => {
  volume.value = 1;
  setVolume();
};

/**
 * 播放 or 暂停
 */
const isPlay = ref(false);
const togglePlay = () => {
  const audioDom = audioRef.value;
  if (audioDom) {
    if (isPlay.value) {
      audioDom.pause();
    } else {
      audioDom.play();
    }
    isPlay.value = !isPlay.value;
  }
};

/**
 * 上一曲 or 下一曲
 * @param {Action} action
 */
const track = (action: Action) => {
  if (action === PREV) {
    currentAudioIndex.value -= 1;
  } else if (action === NEXT) {
    currentAudioIndex.value += 1;
  }
};

const icons = computed(() => {
  return [
    {
      action: PREV,
      icon: "tabler:player-track-prev-filled",
    },
    {
      action: isPlay.value ? PLAY : PAUSE,
      icon: `tabler:player-${isPlay.value ? "pause" : "play"}-filled`,
    },
    {
      action: NEXT,
      icon: "tabler:player-track-next-filled",
    },
  ];
});

/**
 *
 * @param {Action} action
 */
const onAction = (action: Action) => {
  if (action === PLAY || action === PAUSE) {
    togglePlay();
  } else {
    track(action);
  }
};

// const handleFileChange = (event: any) => {
//   const fileInput = event.target as HTMLInputElement;
//   const file = fileInput.files?.[0];
//   if (file) {
//     parseMetadata(file);
//   }
// };
// const parseMetadata = async (file: File) => {
//   const jsmediatags = window.jsmediatags;
//   jsmediatags.read(file, {
//     onSuccess: (tag) => {
//       const { title, artist, picture } = tag.tags;
//       meta.value.title = title ?? "unknown title";
//       meta.value.artist = artist ?? "unknown artist";
//       if (picture) {
//         const arrayBuffer = new Uint8Array(picture.data).buffer;
//         // Create a Blob from the picture data
//         const blob = new Blob([arrayBuffer], { type: picture.format });
//         // Create a URL for the Blob
//         const imgUrl = URL.createObjectURL(blob);
//         meta.value.cover = imgUrl;
//       }
//     },
//     onError: (error) => {
//       console.error("Error parsing metadata:", error);
//     },
//   });
// };

const getAudioMeta = async () => {
  const audioUrl = audioRef.value?.src;
  window.jsmediatags.read(audioUrl, {
    onSuccess: (tag) => {
      const { title, artist, picture } = tag.tags;
      meta.value.title = title ?? "unknown title";
      meta.value.artist = artist ?? "unknown artist";
      if (picture) {
        const arrayBuffer = new Uint8Array(picture.data).buffer;
        // Create a Blob from the picture data
        const blob = new Blob([arrayBuffer], { type: picture.format });
        // Create a URL for the Blob
        const imgUrl = URL.createObjectURL(blob);
        meta.value.cover = imgUrl;
      }
    },
    onError: function (error) {
      console.log("Error reading tags:", error.type, error.info);
    },
  });
};
</script>

<style lang="scss" scoped>
.shadow-bar {
  box-shadow: 0 30px 56px 6px rgba(0, 0, 0, 0.1);
}

.animation-rotated {
  transform-origin: center;
  animation: 3s rotate infinite linear;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

input[type="range"] {
  appearance: none;
  width: 100%;
  height: 7px;
  background: #d1d5db;
  border-radius: 5px;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 0;
  height: 0;
  background: #9ca3af;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-runnable-track {
  border-radius: 5px;
  height: 7px;
  z-index: 1;
}
</style>
