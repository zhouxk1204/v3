<template>
  <div>
    <span
      v-for="(word, index) in words"
      :style="{ 'animation-delay': `${0.1 * index}s` }"
      class="text-6xl font-bold inline-block mr-[.2em] overflow-hidden h-[1.2em] leading-[3.2em] animate-fade-in"
      >{{ word }}</span
    >
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  text: string;
}>();

const words = computed(() => {
  return props.text.split(" ");
});
</script>
