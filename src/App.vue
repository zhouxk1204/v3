<template>
  <div
    :class="{ dark: isDarkMode }"
    class="relative flex flex-col w-screen h-screen overflow-hidden darkabsolute-alignsolute-aligng-dark"
  >
    <!-- <header class="absolute z-10 left-1 top-1">
      <Toggle v-model="isDarkMode"></Toggle>
    </header> -->
    <div class="flex-1 overflow-y-auto">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const isDarkMode = ref<boolean>(false);
</script>
