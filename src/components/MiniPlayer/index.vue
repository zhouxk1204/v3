<template>
  <div
    class="bg-white shadow-[0_0_8px_rgba(0,0,0,0.2)] rounded-[14px] w-full h-14 flex items-center justify-between pl-2 pr-[15px]"
  >
    <div class="flex items-center gap-4">
      <img
        v-if="!error"
        class="w-10 h-10 rounded-[5px]"
        :src="coverUrl"
        alt="cover"
        @error="onError()"
      />
      <div
        v-else
        class="w-10 h-10 bg-[#e6e6e6] flex items-center justify-center rounded-[5px] border-[#d5d5d5] border"
      >
        <Icon icon="tdesign:music-filled" class="text-[#a6a6a6]"></Icon>
      </div>
      <p class="text-black/90 text-[15px] font-medium">{{ title }}</p>
    </div>

    <div class="flex items-center gap-3 text-2xl" :class="title ? 'text-[#1f1f1f]' : 'text-[#a6a6a6]'">
      <!-- 播放/暂停按钮 -->
      <button @click="onClickItem(PlayerAction.Toggle)" class="w-8 h-7 flex items-center justify-center">
        <!-- 暂停图标 -->
        <svg v-if="state === 'play'" viewBox="0 0 32 28" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
          <path d="M13.293 22.772c.955 0 1.436-.481 1.436-1.436V6.677c0-.98-.481-1.427-1.436-1.427h-2.457c-.954 0-1.436.473-1.436 1.427v14.66c-.008.954.473 1.435 1.436 1.435h2.457zm7.87 0c.954 0 1.427-.481 1.427-1.436V6.677c0-.98-.473-1.427-1.428-1.427h-2.465c-.955 0-1.428.473-1.428 1.427v14.66c0 .954.473 1.435 1.428 1.435h2.465z" fill="currentColor" fill-rule="nonzero"></path>
        </svg>
        <!-- 播放图标 -->
        <!-- <svg v-else viewBox="0 0 32 28" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
          <path d="M18.14 20.68c.365 0 .672-.107 1.038-.323l8.508-4.997c.623-.365.938-.814.938-1.37 0-.564-.307-.988-.938-1.361l-8.508-4.997c-.366-.216-.68-.324-1.046-.324-.73 0-1.337.556-1.337 1.569v4.773c-.108-.399-.406-.73-.904-1.021L7.382 7.632c-.357-.216-.672-.324-1.037-.324-.73 0-1.345.556-1.345 1.569v10.235c0 1.013.614 1.569 1.345 1.569.365 0 .68-.108 1.037-.324l8.509-4.997c.49-.29.796-.631.904-1.038v4.79c0 1.013.615 1.569 1.345 1.569z" fill="currentColor" fill-rule="nonzero"></path>
        </svg> -->
        <svg v-else viewBox="0 0 32 28" xmlns="http://www.w3.org/2000/svg"><path d="M10.345 23.287c.415 0 .763-.15 1.22-.407l12.742-7.404c.838-.481 1.178-.855 1.178-1.46 0-.599-.34-.972-1.178-1.462L11.565 5.158c-.457-.265-.805-.407-1.22-.407-.789 0-1.345.606-1.345 1.57V21.71c0 .971.556 1.577 1.345 1.577z" fill-rule="nonzero"></path></svg>
      </button>
      
      <!-- 下一首按钮 -->
      <button @click="onClickItem(PlayerAction.Next)" class="w-8 h-7 flex items-center justify-center">
        <svg width="32" height="28" viewBox="0 0 32 28" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
          <path d="M18.14 20.68c.365 0 .672-.107 1.038-.323l8.508-4.997c.623-.365.938-.814.938-1.37 0-.564-.307-.988-.938-1.361l-8.508-4.997c-.366-.216-.68-.324-1.046-.324-.73 0-1.337.556-1.337 1.569v4.773c-.108-.399-.406-.73-.904-1.021L7.382 7.632c-.357-.216-.672-.324-1.037-.324-.73 0-1.345.556-1.345 1.569v10.235c0 1.013.614 1.569 1.345 1.569.365 0 .68-.108 1.037-.324l8.509-4.997c.49-.29.796-.631.904-1.038v4.79c0 1.013.615 1.569 1.345 1.569z" fill="currentColor" fill-rule="nonzero"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlayerAction } from "@/views/music/type";

const error = ref(false);

const props = defineProps<{
  coverUrl: string;
  state: "pause" | "play";
  title: string;
}>();

const emit = defineEmits<{
  (e: "toggle"): void;
  (e: "next"): void;
}>();

// 监听 coverUrl 变化，重置错误状态
watch(() => props.coverUrl, () => {
  error.value = false;
});

const onError = () => {
  error.value = true;
};

const onClickItem = (action: PlayerAction) => {
  if (action === PlayerAction.Toggle) {
    emit("toggle");
  } else if (action === PlayerAction.Next) {
    emit("next");
  }
};
</script>
