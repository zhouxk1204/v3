<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center">
        <div class="mb-6">
          <div class="w-20 h-20 mx-auto mb-4 relative">
            <div class="w-full h-full border-4 border-blue-200 rounded-full"></div>
            <div class="absolute inset-0 w-full h-full border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <div class="text-2xl mb-2">🤖</div>
        </div>

        <div class="space-y-3">
          <h3 class="text-xl font-semibold text-gray-800">
            {{ title }}
          </h3>
          <p class="text-gray-600">
            {{ message }}
          </p>

          <div class="text-xs text-gray-500 mt-4 space-y-1">
            <p v-for="tip in tips" :key="tip">{{ tip }}</p>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  show: boolean;
  title: string;
  message: string;
  tips?: string[];
}

withDefaults(defineProps<Props>(), {
  tips: () => []
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
