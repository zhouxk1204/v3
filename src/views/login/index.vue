<template>
  <div class="relative gradient-background">
    <img :src="bgUrl" alt="loginBg" class="absolute inset-0 object-cover h-[100dvh] w-screen">
    <h1 class="fixed z-30 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/4">
      <Icon icon="emojione-monotone:peach" width="66" height="66" class="text-gray-200 cursor-pointer"
        @click="onClickLogo" />
    </h1>
    <el-form ref="formRef" :model="loginForm" :rules="rules" size="large"
      class="absolute py-12 px-10 -translate-x-1/2 -translate-y-1/2 shadow-ring w-80 rounded-xl left-1/2 top-1/2 max-sm:w-[80%]">
      <el-form-item prop="email" class="opacity-60">
        <el-input v-model="loginForm.email" placeholder="邮箱" clearable />
      </el-form-item>
      <el-form-item prop="password" class="opacity-60">
        <el-input v-model="loginForm.password" placeholder="密码" type="password" autocomplete="off" show-password
          clearable @keydown.enter="submitForm" />
      </el-form-item>
      <el-button class="w-full" type="primary" @click="submitForm">登录
      </el-button>
    </el-form>

    <div class="absolute left-0 right-0 flex flex-col items-center justify-center gap-1 text-xs text-gray-200 bottom-3">
      <div>
        <a href="https://beian.miit.gov.cn/" target="_blank">蜀ICP备2024053978号</a>
      </div>
      <span>Powered by zhouxk © 2024 </span>
    </div>

  </div>
</template>

<script setup lang="ts">
import { TOKEN } from "@/constants";
import router from "@/router";
import { FormInstance, FormRules } from "element-plus/es/components/form";
import { Md5 } from "ts-md5";
import { ref } from "vue";

interface LoginForm {
  email: string;
  password: string;
}

const bgUrl = localStorage.getItem('loginBg') ?? ''

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
      const res = Md5.hashStr(loginForm.password + loginForm.email);
      if (res === TOKEN) {
        localStorage.setItem("TOKEN", TOKEN);
        ElMessage.success("登录成功！");
        router.replace("/main");
      } else {
        ElMessage.error("邮箱或密码不正确，登录失败！");
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

const onClickLogo = () => {
  router.push('/home')
}
</script>

<style scoped lang="scss">
@keyframes gradient {
  0% {
    background-position: 0% 50%
  }

  50% {
    background-position: 100% 50%
  }

  100% {
    background-position: 0% 50%
  }
}

.gradient-background {
  position: absolute;
  inset: 0;
  // background: linear-gradient(-45deg, #fff1eb 0%, #ace0f9 100%);
  // animation: gradient 7s ease infinite;
  // background-size: 200% 200%;
}

.shadow-ring {
  box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.5);
}
</style>
