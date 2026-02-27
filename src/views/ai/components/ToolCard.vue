<template>
  <div
    class="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-2"
    @click="$emit('click')"
  >
    <!-- 渐变背景 -->
    <div :class="['absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300', tool.color]"></div>
    
    <!-- 内容 -->
    <div class="relative p-3">
      <!-- 图标和标题 -->
      <div class="flex items-center mb-2">
        <div class="text-2xl mr-2 transition-transform duration-300">
          {{ tool.icon }}
        </div>
        <h3 class="text-base font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
          {{ tool.name }}
        </h3>
      </div>
      
      <!-- 描述 -->
      <p class="text-gray-600 text-xs leading-relaxed">
        {{ tool.description }}
      </p>
      
      <!-- 箭头指示 -->
      <div class="mt-2 flex items-center text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span class="text-xs font-medium">立即使用</span>
        <svg class="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </div>
    </div>
    
    <!-- 装饰圆点 -->
    <div class="absolute top-4 right-4 w-2 h-2 bg-gray-200 rounded-full group-hover:bg-blue-400 transition-colors"></div>
  </div>
</template>

<script setup lang="ts">
interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

defineProps<{
  tool: Tool;
}>();

defineEmits<{
  (e: 'click'): void;
}>();
</script>
