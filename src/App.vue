<template>
  <div :class="{ dark: isDarkMode }" class="absolute inset-0 fullscreen">
    <el-config-provider :locale="locale">
      <router-view></router-view>
    </el-config-provider>
  </div>
</template>

<script setup lang="ts">
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { ref } from "vue";
const locale = zhCn;
const isDarkMode = ref<boolean>(false);

import { onBeforeUnmount, onMounted } from "vue";

function setVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

onMounted(() => {
  setVh();
  window.addEventListener("resize", setVh);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", setVh);
});
</script>
