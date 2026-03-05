<template>
  <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
    <div class="flex items-center gap-3 mb-6">
      <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
      <h3 class="text-xl font-semibold text-gray-800">输入课题信息</h3>
    </div>

    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">课题名称 <span class="text-red-500">*</span></label>
      <input
        :value="topic"
        @input="$emit('update:topic', ($event.target as HTMLInputElement).value)"
        type="text"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        placeholder="例如：老年患者 PACU 躁动护理"
      />
    </div>

    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">关键词 <span class="text-red-500">*</span></label>
      <textarea
        :value="keywords"
        @input="$emit('update:keywords', ($event.target as HTMLTextAreaElement).value)"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
        placeholder="例如：PACU, emergence agitation, nursing"
        rows="3"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">临床观察 <span class="text-gray-500 font-normal">(可选)</span></label>
      <textarea
        :value="clinicalObservation"
        @input="$emit('update:clinicalObservation', ($event.target as HTMLTextAreaElement).value)"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
        placeholder="例如：术后老年患者拔管躁动明显..."
        rows="3"
      />
    </div>

    <div class="mt-6 flex justify-center gap-4">
      <button
        class="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
        :disabled="isGenerating || !hasRequiredFields"
        @click="$emit('generate')"
      >
        <span v-if="!isGenerating" class="flex items-center gap-2">
          <span class="text-xl">✨</span>
          生成检索概念块
        </span>
        <span v-else class="flex items-center gap-2">
          <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          生成中...
        </span>
      </button>

      <button
        v-if="hasAnyContent"
        @click="$emit('clear')"
        class="px-6 py-4 bg-gray-500 text-white font-semibold rounded-xl shadow-lg hover:bg-gray-600 transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <span class="text-xl">🗑️</span>
        清空
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  topic: string;
  keywords: string;
  clinicalObservation: string;
  isGenerating: boolean;
}

interface Emits {
  (e: 'update:topic', value: string): void;
  (e: 'update:keywords', value: string): void;
  (e: 'update:clinicalObservation', value: string): void;
  (e: 'generate'): void;
  (e: 'clear'): void;
}

const props = defineProps<Props>();
defineEmits<Emits>();

const hasRequiredFields = computed(() => {
  return props.topic.trim() && props.keywords.trim();
});

const hasAnyContent = computed(() => {
  return props.topic || props.keywords || props.clinicalObservation;
});
</script>
