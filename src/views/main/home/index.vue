<template>
  <div class="reactive">
    <!-- <Typewriter class="text-4xl text-red-300"></Typewriter> -->
    <!-- <FillUp text="Love to the depths, is lonely." class="text-7xl"></FillUp> -->
    <StepFadeIn :text="text" class="text-red-300"></StepFadeIn>
  </div>
</template>

<script setup lang="ts">
const text =
  "There were a sensitivity and a beauty to her that have nothing to do with looks. She was one to be listened to, whose words were so easy to take to heart.";
</script>
