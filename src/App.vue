<template>
  <div
    :class="{ dark: isDarkMode }"
    class="flex flex-col w-screen h-screen overflow-hidden dark:bg-dark"
  >
    <header>
      <Toggle v-model="isDarkMode"></Toggle>
      {{ isDarkMode }}
    </header>
    <div class="flex-1">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const isDarkMode = ref<boolean>(false);
</script>
