<template>
  <div
    class="relative w-screen h-screen overflow-hidden bg-center bg-no-repeat bg-cover"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
  >
    <form
      v-show="isBoxVisible"
      class="absolute w-1/3 p-10 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl top-1/3 left-1/2"
    >
      <h1 class="pb-2 mb-6 text-4xl text-center border-b border-gray-200">
        🐶🐷
      </h1>
      <FormItem title="邮箱" :required="false">
        <Input></Input>
      </FormItem>
      <label for=""></label>

      <FormItem title="密码" :required="false">
        <Input type="password"></Input>
      </FormItem>

      <div class="flex items-center mb-4">
        <input
          type="checkbox"
          id="autoLogin"
          class="w-[16px] h-[16px] text-xl text-blue-400 mr-1"
        />
        <label for="autoLogin" class="text-sm text-gray-400 select-none"
          >自动登录</label
        >
      </div>

      <Button type="primary" class="h-12">登入</Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const getBackgroundImages = () => {
  return Object.keys(import.meta.glob("@/assets/img/bg/*.{png,jpg,gif,svg}"));
};

const getRandomBackgroundImage = (): string => {
  const images = getBackgroundImages();
  const index = Math.floor(Math.random() * images.length);
  return images[index];
};

const backgroundImage = ref(getRandomBackgroundImage());

const isBoxVisible = ref(false);
setTimeout(() => {
  isBoxVisible.value = true;
}, 300);
</script>
<style lang="scss" scoped>
/* 添加 Tailwind CSS 的高度过渡类 */
.height-transition-enter-active,
.height-transition-leave-active {
  transition: height 0.5s ease-in-out;
}
.height-transition-enter,
.height-transition-leave-to {
  height: 0;
  overflow: hidden;
}
</style>
