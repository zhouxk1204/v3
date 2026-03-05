<template>
  <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
        <h3 class="text-xl font-semibold text-gray-800">搜索结果 (共 {{ totalResults }} 篇)</h3>
      </div>

      <!-- 显示模式切换 -->
      <div class="flex gap-2">
        <button
          @click="$emit('switch-mode', 'original')"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            displayMode === 'original'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
          :disabled="isTranslating"
        >
          原文
        </button>
        <button
          @click="$emit('switch-mode', 'translated')"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            displayMode === 'translated'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
          :disabled="isTranslating"
        >
          翻译
        </button>
        <button
          @click="$emit('switch-mode', 'summary')"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            displayMode === 'summary'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
          :disabled="isTranslating"
        >
          归纳总结
        </button>
      </div>
    </div>

    <!-- 翻译中提示 -->
    <Transition name="fade">
      <div v-if="isTranslating" class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
        <div class="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span class="text-blue-700 text-sm">正在{{ displayMode === 'translated' ? '翻译' : '归纳总结' }}中，请稍候...</span>
      </div>
    </Transition>

    <!-- 文献卡片 -->
    <div class="space-y-4">
      <div
        v-for="(article, index) in articles"
        :key="index"
        class="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
      >
        <div class="flex items-start gap-3">
          <div class="flex-1">
            <!-- PMID 和日期 -->
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-gray-500">
                PMID:
                <a
                  :href="`https://pubmed.ncbi.nlm.nih.gov/${article.PMID}`"
                  target="_blank"
                  class="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {{ article.PMID }}
                </a>
              </span>
              <span v-if="article.PublicationDate" class="text-sm text-gray-500">
                {{ article.PublicationDate }}
              </span>
            </div>

            <!-- 原文模式 -->
            <template v-if="displayMode === 'original'">
              <h4 class="text-lg font-semibold text-gray-800 mb-2">{{ article.ArticleTitle }}</h4>

              <div
                v-if="article.AbstractSections && article.AbstractSections.length > 0"
                class="space-y-2 mb-3"
              >
                <div v-for="(section, sIndex) in article.AbstractSections" :key="sIndex" class="text-sm">
                  <span v-if="section.label" class="font-semibold text-gray-700">{{ section.label }}: </span>
                  <span class="text-gray-600">{{ section.text }}</span>
                </div>
              </div>
            </template>

            <!-- 翻译模式 -->
            <template v-else-if="displayMode === 'translated'">
              <h4 class="text-lg font-semibold text-gray-800 mb-2">
                {{ article.translatedTitle || article.ArticleTitle }}
              </h4>
              <div class="text-sm text-gray-600 mb-3 whitespace-pre-line">
                {{ article.translatedAbstract || '翻译中...' }}
              </div>
            </template>

            <!-- 归纳总结模式 -->
            <template v-else-if="displayMode === 'summary'">
              <div
                v-if="article.summary"
                class="text-sm text-gray-700 prose prose-sm max-w-none"
                v-html="renderMarkdown(article.summary)"
              ></div>
              <div v-else class="text-sm text-gray-500">归纳总结中...</div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="totalPages > 1" class="mt-6 flex justify-center items-center gap-4">
      <button
        @click="$emit('prev-page')"
        :disabled="currentPage === 1 || isSearching"
        class="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
      >
        上一页
      </button>
      <span class="text-gray-700">第 {{ currentPage }} / {{ totalPages }} 页 (共 {{ totalResults }} 篇)</span>
      <button
        @click="$emit('next-page')"
        :disabled="currentPage === totalPages || isSearching"
        class="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked';
import type { Article } from '../types';
import type { DisplayMode } from '../composables/useArticleTranslation';

interface Props {
  articles: Article[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
  displayMode: DisplayMode;
  isTranslating: boolean;
  isSearching: boolean;
}

interface Emits {
  (e: 'switch-mode', mode: DisplayMode): void;
  (e: 'prev-page'): void;
  (e: 'next-page'): void;
}

defineProps<Props>();
defineEmits<Emits>();

const renderMarkdown = (text: string): string => {
  if (!text) return '';
  return marked(text) as string;
};
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

.prose {
  color: #374151;
}

.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3),
.prose :deep(h4) {
  font-weight: 600;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  color: #1f2937;
}

.prose :deep(h1) {
  font-size: 1.25em;
}

.prose :deep(h2) {
  font-size: 1.125em;
}

.prose :deep(h3),
.prose :deep(h4) {
  font-size: 1em;
}

.prose :deep(p) {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.prose :deep(ul),
.prose :deep(ol) {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  padding-left: 1.5em;
}

.prose :deep(li) {
  margin-top: 0.25em;
  margin-bottom: 0.25em;
}

.prose :deep(strong) {
  font-weight: 600;
  color: #1f2937;
}

.prose :deep(code) {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.prose :deep(pre) {
  background-color: #f3f4f6;
  padding: 0.75rem;
  border-radius: 0.375rem;
  overflow-x: auto;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.prose :deep(blockquote) {
  border-left: 3px solid #d1d5db;
  padding-left: 1em;
  color: #6b7280;
  font-style: italic;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
</style>
