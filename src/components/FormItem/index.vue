<template>
  <div class="mb-4 flex flex-col">
    <h2 class="mb-1 text-sm">{{ title }}</h2>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";

withDefaults(defineProps<{
    title: string,
}>(),{
    title: 'title',
})

</script>
<style scoped></style>
