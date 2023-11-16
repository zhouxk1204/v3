<template>
  <div class="fixed bottom-5 right-5">
    <audio ref="audioElement" :src="audioSrc"></audio>
    <div>
      <div
        class="z-20 flex items-center overflow-hidden bg-white border shadow-2xl rounded-2xl"
      >
        <div class="flex items-center justify-center flex-none w-12 pl-2">
          <img
            src="https://alikinvv.github.io/minimal-player/build/img/album.jpg"
            :style="{ 'animation-play-state': isPlay ? 'running' : 'paused' }"
            :class="{ 'shadow-2xl ': isPlay }"
            class="transition-all ease-in-out rounded-full animation-rotated"
            alt="album"
          />
        </div>
        <div class="flex p-2 overflow-hidden select-none">
          <template v-for="item in icons">
            <div
              class="flex items-center justify-center w-10 h-10 text-gray-300 rounded-md cursor-pointer hover:text-white hover:bg-gray-300"
              @click="onClickButton(item.key)"
            >
              <Icon :icon="item.icon" width="24"></Icon>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const audioSrc =
  "http://music.dawnfoxes.com/_fxs_/_upls_/_sngs_/USA/khalid-angels.mp3";

const isPlay = ref(false);

const icons = computed(() => {
  if (isPlay.value) {
    return [
      {
        key: "prev",
        icon: "tabler:player-track-prev-filled",
      },
      {
        key: "pause",
        icon: "tabler:player-pause-filled",
      },
      {
        key: "next",
        icon: "tabler:player-track-next-filled",
      },
    ];
  } else {
    return [
      {
        key: "prev",
        icon: "tabler:player-track-prev-filled",
      },
      {
        key: "play",
        icon: "tabler:player-play-filled",
        visible: true,
      },
      {
        key: "next",
        icon: "tabler:player-track-next-filled",
      },
    ];
  }
});

const onClickButton = (key: string) => {
  if (key === "play") {
    isPlay.value = true;
  } else if (key === "pause") {
    isPlay.value = false;
  }
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
</style>
