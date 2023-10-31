<template>
  <div :class="{ 'animate__animated animate__fadeInUp': isAnimate }">
    Example
  </div>
  <Button class="w-14" @click="test">ok</Button>

  <!-- <Button>ok</Button>
  <Button type="primary">primary</Button>
  <Button type="success">success</Button>
  <Button type="danger">danger</Button>
  <Record></Record> -->
</template>

<script setup lang="ts">
import { ref } from "vue";

const isAnimate = ref(false);

const test = () => {
  isAnimate.value = true;
};
</script>
