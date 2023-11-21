<template>
  <div class="relative w-16 h-16 bg-transparent">
    <transition :name="transition">
      <img
        :src="imageSrc"
        :key="index"
        class="absolute object-cover w-full h-full overflow-hidden rounded-full shadow-2xl"
      />
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const transition = ref("scale-out");

const props = defineProps<{
  imageSrc: string;
  index: number;
}>();

watch(
  () => props.index,
  (newValue, oldValue) => {
    if (Math.abs(newValue - oldValue) > 1) {
      return;
    } else {
      transition.value = newValue > oldValue ? "scale-in" : "scale-out";
    }
  }
);
</script>

<style scoped>
.scale-out-enter-from {
  opacity: 0;
  transform: scale(0.55);
}

.scale-out-enter {
  transform: scale(1);
  opacity: 0.5;
}

.scale-out-enter-active {
  transition: all 0.3s ease-in-out;
}
.scale-out-leave-active {
  transition: all 0.3s ease-in-out;
}

.scale-out-leave-to {
  transform: scale(1.2);
  opacity: 0;
}

.scale-in-enter-from {
  opacity: 0;
  transform: scale(1.2);
}

.scale-in-enter {
  transform: scale(1);
  opacity: 0.5;
}

.scale-in-enter-active {
  transition: all 0.3s ease-in-out;
}
.scale-in-leave-active {
  transition: all 0.3s ease-in-out;
}

.scale-in-leave-to {
  transform: scale(0.55);
  opacity: 0;
}
</style>
