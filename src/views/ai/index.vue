<template>
  <div class="h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 overflow-auto">
    <div class="max-w-7xl mx-auto">
      <!-- 头部 -->
      <div class="text-center mb-16">
        <h1 class="text-5xl font-bold text-gray-800 mb-4">AI 工具导航</h1>
        <p class="text-lg text-gray-600">智能工具，让生活更简单</p>
      </div>

      <!-- 工具分类 -->
      <div v-for="category in categories" :key="category.name" class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-700 mb-6 flex items-center">
          <span class="w-1 h-6 bg-blue-500 mr-3 rounded"></span>
          {{ category.name }}
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ToolCard
            v-for="tool in category.tools"
            :key="tool.id"
            :tool="tool"
            @click="navigateToTool(tool.route)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ToolCard from './components/ToolCard.vue';

const router = useRouter();

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

interface Category {
  name: string;
  tools: Tool[];
}

const categories = ref<Category[]>([
  {
    name: '📝 内容创作',
    tools: [
      {
        id: 'isai',
        name: 'AI写作检测',
        description: '智能分析AI写作痕迹，一键转换为自然人类化表达',
        icon: '✍️',
        route: '/isai',
        color: 'from-purple-400 to-pink-400'
      }
    ]
  },
  {
    name: '🌐 翻译工具',
    tools: [
      {
        id: 'srt',
        name: 'SRT字幕翻译',
        description: '日文 → 中文 AI 智能翻译，支持批量处理',
        icon: '🎬',
        route: '/srt',
        color: 'from-blue-400 to-cyan-400'
      }
    ]
  },
  {
    name: '🎲 生活助手',
    tools: [
      {
        id: 'name',
        name: '抽卡取名',
        description: '根据父母姓名与风格，生成带寓意的好名字',
        icon: '🎴',
        route: '/name',
        color: 'from-orange-400 to-red-400'
      }
    ]
  }
]);

const navigateToTool = (route: string) => {
  router.push(route);
};
</script>
