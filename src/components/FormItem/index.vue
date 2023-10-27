<template>
  <div class="flex flex-col mb-4">
    <h2 class="mb-1 text-sm">
      {{ title }}<span v-if="required" class="text-xl text-red-500">*</span>
    </h2>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    required?: boolean;
  }>(),
  {
    title: "title",
    required: true,
  }
);
</script>
<style scoped></style>
