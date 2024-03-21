<template>
  <div :class="{ dark: isDarkMode }" class="absolute inset-0 h-[100dvh]">
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
</script>
