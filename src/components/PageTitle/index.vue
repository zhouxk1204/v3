<template>
  <div
    class="flex items-end justify-between pb-2 mb-3 border-b dark:border-dark-200"
  >
    <h1 class="text-2xl font-bold dark:text-dark-100">{{ title }}</h1>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
  }>(),
  {
    title: "title",
  }
);
</script>
<style lang="scss" scoped></style>
