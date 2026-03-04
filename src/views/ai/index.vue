<template>
  <div class="h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 overflow-auto">
    <div class="max-w-7xl mx-auto">
      <!-- 头部 -->
      <div class="text-center mb-16">
        <h1 class="text-5xl font-bold text-gray-800 mb-4">AI 工具导航</h1>
        <p class="text-lg text-gray-600">智能工具，让生活更简单</p>
      </div>

      <!-- 工具分类 -->
      <div v-for="category in categories" :key="category.name" class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
          <span class="w-1 h-6 bg-blue-500 mr-3 rounded"></span>
          {{ category.name }}
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
    name: '🔬 学术科研',
    tools: [
      {
        id: 'research-assistant',
        name: 'AI 课题科研助手',
        description: 'PubMed 可视化检索式构建与文献检索，支持中文关键词自动翻译',
        icon: '📚',
        route: '/research-assistant',
        color: 'from-blue-500 to-indigo-500'
      }
    ]
  },
  {
    name: '✍️ 文本处理',
    tools: [
      {
        id: 'ai-detector',
        name: 'AI 写作检测',
        description: '智能分析 AI 写作痕迹，一键转换为自然人类化表达',
        icon: '🔍',
        route: '/ai-detector',
        color: 'from-purple-400 to-pink-400'
      },
      {
        id: 'subtitle-translator',
        name: 'SRT 字幕翻译',
        description: '日文 → 中文 AI 智能翻译，支持批量处理',
        icon: '🎬',
        route: '/subtitle-translator',
        color: 'from-blue-400 to-cyan-400'
      }
    ]
  },
  {
    name: '🏥 健康生活',
    tools: [
      {
        id: 'kidney-stone-analyzer',
        name: '肾结石饮食分析',
        description: '分析饮食模式与肾结石风险，提供科学营养建议',
        icon: '💊',
        route: '/kidney-stone-analyzer',
        color: 'from-green-400 to-teal-400'
      },
      {
        id: 'name-generator',
        name: '智能取名助手',
        description: '根据父母姓名与风格，生成带寓意的好名字',
        icon: '👶',
        route: '/name-generator',
        color: 'from-orange-400 to-red-400'
      }
    ]
  },
  {
    name: '💻 开发工具',
    tools: [
      {
        id: 'json-prompt-generator',
        name: 'JSON Prompt 生成器',
        description: '智能生成结构化 JSON Prompt，提升 AI 对话质量',
        icon: '⚙️',
        route: '/json-prompt-generator',
        color: 'from-indigo-400 to-purple-400'
      }
    ]
  },
  {
    name: '🤖 AI 对话',
    tools: [
      {
        id: 'peach-ai',
        name: 'Peach AI',
        description: '智能对话助手，支持多轮对话和上下文理解',
        icon: '🍑',
        route: '/peach-ai',
        color: 'from-pink-400 to-rose-400'
      }
    ]
  }
]);

const navigateToTool = (route: string) => {
  router.push(route);
};
</script>
