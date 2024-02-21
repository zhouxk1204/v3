<template>
  <div class="relative bg-transparent">
    <transition :name="transition">
      <img
        :src="imageSrc"
        :key="index"
        class="absolute object-cover w-full h-full overflow-hidden shadow-2xl"
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
  transform: scale(0.85);
}

.scale-out-enter {
  transform: scale(1);
  opacity: 0.2;
}

.scale-out-enter-active {
  transition: all 1s ease-in-out;
}
.scale-out-leave-active {
  transition: all 1s ease-in-out;
}

.scale-out-leave-to {
  transform: scale(1.05);
  opacity: 0;
}

.scale-in-enter-from {
  opacity: 0;
  transform: scale(1.05);
}

.scale-in-enter {
  transform: scale(1);
  opacity: 0.2;
}

.scale-in-enter-active {
  transition: all 3s ease-in-out;
}
.scale-in-leave-active {
  transition: all 3s ease-in-out;
}

.scale-in-leave-to {
  transform: scale(0.85);
  opacity: 0;
}
</style>
