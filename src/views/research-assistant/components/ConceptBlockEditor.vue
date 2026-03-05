<template>
  <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
        <h3 class="text-xl font-semibold text-gray-800">可视化检索式构建</h3>
      </div>
      <button
        @click="$emit('add-block')"
        class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
      >
        + 添加概念块
      </button>
    </div>

    <!-- 概念块列表 -->
    <div class="space-y-4">
      <div
        v-for="(block, blockIndex) in blocks"
        :key="block.id"
        class="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
      >
        <!-- 概念块头部 -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <button
              @click="$emit('toggle-collapse', block.id)"
              class="text-gray-500 hover:text-gray-700"
            >
              <span v-if="block.collapsed">▶</span>
              <span v-else>▼</span>
            </button>
            <input
              :value="block.name"
              @input="$emit('update:block-name', block.id, ($event.target as HTMLInputElement).value)"
              type="text"
              class="text-lg font-semibold text-gray-800 border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none px-2 py-1"
              placeholder="概念名称"
            />
            <span class="text-sm text-gray-500">({{ block.keywords.length }} 个关键词)</span>
          </div>

          <div class="flex items-center gap-2">
            <!-- 概念块间的逻辑操作符 -->
            <select
              v-if="blockIndex > 0"
              :value="block.operator"
              @change="$emit('update:block-operator', block.id, ($event.target as HTMLSelectElement).value as 'AND' | 'OR')"
              class="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-blue-500"
              title="与前一个概念块的逻辑关系"
            >
              <option value="AND">同时满足</option>
              <option value="OR">或者满足</option>
            </select>
            <button
              @click="$emit('delete-block', block.id)"
              class="w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              ×
            </button>
          </div>
        </div>

        <!-- 关键词列表 -->
        <div v-if="!block.collapsed" class="space-y-2">
          <div
            v-for="(keyword, kwIndex) in block.keywords"
            :key="keyword.id"
            draggable="true"
            @dragstart="$emit('drag-start', block.id, keyword.id)"
            @dragend="$emit('drag-end')"
            @dragover.prevent
            @drop="$emit('drop', block.id, kwIndex)"
            class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-move"
          >
            <!-- 拖拽手柄 -->
            <span class="text-gray-400">⋮⋮</span>

            <!-- 关键词文本 -->
            <input
              :value="keyword.text"
              @input="$emit('update:keyword-text', block.id, keyword.id, ($event.target as HTMLInputElement).value)"
              type="text"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="关键词"
            />

            <!-- 字段选择 -->
            <select
              :value="keyword.field"
              @change="$emit('update:keyword-field', block.id, keyword.id, ($event.target as HTMLSelectElement).value as 'Mesh' | 'tiab' | 'tw')"
              class="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-blue-500"
              title="选择搜索字段"
            >
              <option value="Mesh">主题词</option>
              <option value="tiab">标题+摘要</option>
              <option value="tw">全文</option>
            </select>

            <!-- 操作符选择 -->
            <select
              v-if="kwIndex > 0"
              :value="keyword.operator"
              @change="$emit('update:keyword-operator', block.id, keyword.id, ($event.target as HTMLSelectElement).value as 'OR' | 'NOT')"
              class="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-blue-500"
              title="与前一个关键词的逻辑关系"
            >
              <option value="OR">或者满足</option>
              <option value="NOT">排除</option>
            </select>

            <!-- 删除按钮 -->
            <button
              @click="$emit('delete-keyword', block.id, keyword.id)"
              class="w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              ×
            </button>
          </div>

          <!-- 添加关键词 -->
          <div class="flex gap-2 mt-3">
            <input
              :value="newKeywordText"
              @input="$emit('update:new-keyword', ($event.target as HTMLInputElement).value)"
              @keyup.enter="$emit('add-keyword', block.id)"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
              placeholder="输入新关键词，按回车添加..."
            />
            <button
              @click="$emit('add-keyword', block.id)"
              class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
            >
              添加
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 实时生成的检索式预览 -->
    <div class="mt-6 space-y-3">
      <!-- 字段说明 -->
      <div class="p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <div class="text-xs text-gray-600 space-y-1">
          <p><span class="font-semibold">📋 字段说明：</span></p>
          <p>• <span class="font-medium">主题词 (Mesh)</span>：医学主题词，标准化的医学术语</p>
          <p>• <span class="font-medium">标题+摘要 (tiab)</span>：在文章标题和摘要中搜索</p>
          <p>• <span class="font-medium">全文 (tw)</span>：在文章全文中搜索</p>
          <p class="mt-2"><span class="font-semibold">🔗 逻辑关系：</span></p>
          <p>• <span class="font-medium">同时满足 (AND)</span>：必须同时满足多个条件</p>
          <p>• <span class="font-medium">或者满足 (OR)</span>：满足任一条件即可</p>
          <p>• <span class="font-medium">排除 (NOT)</span>：排除包含该关键词的文献</p>
        </div>
      </div>

      <!-- 检索式预览 -->
      <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="text-blue-600 font-semibold text-sm">📋 实时生成的检索式（中文预览）</span>
            <span class="text-xs text-blue-500">搜索时自动翻译为英文</span>
          </div>
          <div class="flex gap-2">
            <button
              @click="$emit('copy-term')"
              class="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              复制
            </button>
            <button
              @click="$emit('export-pubmed')"
              class="px-3 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
            >
              导出到 PubMed
            </button>
          </div>
        </div>
        <div class="text-sm text-gray-700 font-mono break-all whitespace-pre-wrap">
          {{ generatedTerm || '请添加关键词...' }}
        </div>
      </div>
    </div>

    <!-- 搜索按钮 -->
    <div class="flex justify-center mt-6">
      <button
        @click="$emit('search')"
        :disabled="isSearching || !generatedTerm"
        class="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
      >
        <span v-if="!isSearching" class="flex items-center gap-2">
          <span class="text-xl">🔍</span>
          搜索文献
        </span>
        <span v-else class="flex items-center gap-2">
          <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          搜索中...
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ConceptBlock } from '../types';

interface Props {
  blocks: ConceptBlock[];
  newKeywordText: string;
  generatedTerm: string;
  isSearching: boolean;
}

interface Emits {
  (e: 'add-block'): void;
  (e: 'delete-block', blockId: string): void;
  (e: 'toggle-collapse', blockId: string): void;
  (e: 'update:new-keyword', value: string): void;
  (e: 'add-keyword', blockId: string): void;
  (e: 'delete-keyword', blockId: string, keywordId: string): void;
  (e: 'drag-start', blockId: string, keywordId: string): void;
  (e: 'drag-end'): void;
  (e: 'drop', blockId: string, targetIndex: number): void;
  (e: 'copy-term'): void;
  (e: 'export-pubmed'): void;
  (e: 'search'): void;
  (e: 'update:block-name', blockId: string, value: string): void;
  (e: 'update:block-operator', blockId: string, value: 'AND' | 'OR'): void;
  (e: 'update:keyword-text', blockId: string, keywordId: string, value: string): void;
  (e: 'update:keyword-field', blockId: string, keywordId: string, value: 'Mesh' | 'tiab' | 'tw'): void;
  (e: 'update:keyword-operator', blockId: string, keywordId: string, value: 'OR' | 'NOT'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
</script>
