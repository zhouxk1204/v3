<template>
  <div
    class="relative flex items-center justify-center w-screen h-screen overflow-hidden bg-bottom bg-cover bg-transition"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
  >
    <form
      class="p-10 bg-white rounded-lg shadow-2xl opacity-0 min-w-[400px]"
      :class="{
        'animate__animated animate__fadeInUp animate__delay-02s': isMounted,
      }"
    >
      <h1
        class="pb-2 mb-6 text-4xl text-center border-b border-gray-200 dark:border-dark-300"
      >
        🐶🐷
      </h1>
      <FormItem title="邮箱" :required="false">
        <Input v-model="form.email"></Input>
      </FormItem>
      <label for=""></label>

      <FormItem title="密码" :required="false">
        <Input type="password" v-model="form.password"></Input>
      </FormItem>

      <div class="flex items-center mb-4">
        <input
          type="checkbox"
          id="autoLogin"
          class="w-[16px] h-[16px] text-xl text-blue-400 mr-1"
          v-model="form.autoLogin"
        />
        <label
          for="autoLogin"
          class="text-sm text-gray-400 select-none"
          :class="{ 'text-gray-600': form.autoLogin }"
          >自动登录</label
        >
      </div>

      <Button type="primary" class="h-12" @click="submit">注册 / 登录</Button>

      <div
        class="flex items-center justify-center h-6 mt-2 text-gray-400 cursor-pointer"
      >
        <span @click="onNextBg()" v-show="isNextBgBtnVisible"
          >不喜欢这张背景图，换一张?</span
        >
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import router from "@/router";
import { onMounted, ref } from "vue";

const form = ref({
  email: "",
  password: "",
  autoLogin: false,
});

const getBackgroundImages = () => {
  return Object.keys(
    import.meta.glob("@/assets/img/bg/*.{png,jpg,gif,svg,avif}")
  ).map(e => new URL(e, import.meta.url).href);
};

const getRandomBackgroundImage = (): string => {
  const images = getBackgroundImages();
  const index = Math.floor(Math.random() * images.length);
  return images[index];
};

const backgroundImage = ref(getRandomBackgroundImage());

const isNextBgBtnVisible = ref(true);
const onNextBg = () => {
  isNextBgBtnVisible.value = false;
  const newBg = getRandomBackgroundImage();
  if (backgroundImage.value !== newBg) {
    backgroundImage.value = newBg;
    setTimeout(() => {
      isNextBgBtnVisible.value = true;
    }, 4000);
  } else {
    onNextBg();
  }
};

const isMounted = ref(false);
onMounted(() => {
  isMounted.value = true;
});

const submit = () => {
  router.push("/main/home");
};
</script>
<style lang="scss" scoped>
.animate__delay-02s {
  animation-delay: 0.3s;
}
</style>
