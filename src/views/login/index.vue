<template>
  <div
    class="relative flex items-center justify-center w-screen h-screen overflow-hidden bg-bottom bg-cover bg-transition"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
  >
    <el-form
      ref="formRef"
      :model="loginForm"
      size="large"
      :rules="rules"
      class="w-full p-10 pb-8 bg-white rounded-md shadow-2xl bg-opacity-90 xl:w-1/4 lg:w-1/3 md:w-1/2 sm:w-full"
    >
      <h1 class="pb-2 mb-6 text-4xl text-center">🍑</h1>
      <el-form-item prop="email">
        <el-input v-model="loginForm.email" placeholder="邮箱" clearable />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          placeholder="密码"
          type="password"
          autocomplete="off"
          show-password
          clearable
        />
      </el-form-item>
      <el-button
        class="w-full mb-3"
        type="primary"
        @click="submitForm"
        native-type="submit"
        >注册 / 登录
      </el-button>
      <div class="flex justify-center">
        <el-button
          link
          :loading="isLoading"
          @click="onNextBg"
          native-type="button"
          >不喜欢这张背景图，换一张?
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import router from "@/router";
import { FormInstance, FormRules } from "element-plus/es/components/form";
import { ref } from "vue";

interface LoginForm {
  email: string;
  password: string;
}

const loginForm = reactive<LoginForm>({
  password: "",
  email: "",
});

const rules = reactive<FormRules<LoginForm>>({
  email: [
    {
      type: "email",
      message: "请输入正确的邮箱地址",
      trigger: ["submit"],
    },
    {
      required: true,
      message: "邮箱地址不能为空",
      trigger: "submit",
    },
  ],
  password: [
    {
      required: true,
      message: "登录密码不能为空",
      trigger: "submit",
    },
  ],
});

const formRef = ref<FormInstance>();
const submitForm = () => {
  if (!formRef.value) return;
  formRef.value.validate((valid, fields) => {
    if (valid) {
      router.replace("/main");
    } else {
      console.log("error submit!", fields);
    }
  });
};

const getBackgroundImages = () => {
  return Object.keys(
    import.meta.glob("/src/assets/img/bg/*.{png,jpg,gif,svg,avif}")
  ).map((e) => new URL(e, import.meta.url).href);
};

const getRandomBackgroundImage = (): string => {
  const images = getBackgroundImages();
  const index = Math.floor(Math.random() * images.length);
  return images[index];
};

const backgroundImage = ref(getRandomBackgroundImage());

const isLoading = ref(false);
const onNextBg = () => {
  isLoading.value = true;
  const newBg = getRandomBackgroundImage();
  if (backgroundImage.value !== newBg) {
    backgroundImage.value = newBg;
    setTimeout(() => {
      isLoading.value = false;
    }, 3000);
  } else {
    onNextBg();
  }
};
</script>
