<template>
  <div class="bg-gradient-to-br from-slate-50 to-blue-50 h-screen overflow-auto">
    <div class="max-w-7xl mx-auto py-8 px-4 pb-32">
      <!-- 头部标题 -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-3 mb-4">
          <div class="text-4xl">🔬</div>
          <div>
            <h1 class="text-3xl font-bold text-gray-800">AI 课题科研助手</h1>
            <p class="text-gray-500 text-sm mt-1">PubMed 可视化检索式构建与文献检索</p>
          </div>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div class="space-y-6">
        <!-- 输入区域 -->
        <TopicInput
          v-model:topic="paperStore.topic"
          v-model:keywords="paperStore.keywords"
          v-model:clinical-observation="paperStore.clinicalObservation"
          :is-generating="isGenerating"
          @generate="handleGenerateConceptBlocks"
          @clear="handleClear"
        />

        <!-- 可视化检索式构建器 -->
        <ConceptBlockEditor
          v-if="conceptBlocks.length > 0"
          :blocks="conceptBlocks"
          :new-keyword-text="newKeywordText"
          :generated-term="generatedTerm"
          :is-searching="isSearching"
          @add-block="addConceptBlock"
          @delete-block="deleteConceptBlock"
          @toggle-collapse="toggleCollapse"
          @update:new-keyword="newKeywordText = $event"
          @add-keyword="addKeywordToBlock"
          @delete-keyword="deleteKeyword"
          @drag-start="onDragStart"
          @drag-end="onDragEnd"
          @drop="onDrop"
          @update:block-name="updateBlockName"
          @update:block-operator="updateBlockOperator"
          @update:keyword-text="updateKeywordText"
          @update:keyword-field="updateKeywordField"
          @update:keyword-operator="updateKeywordOperator"
          @copy-term="handleCopyTerm"
          @export-pubmed="handleExportToPubMed"
          @search="handleSearchPubMed"
        />

        <!-- 文献列表区域 -->
        <ArticleList
          v-if="pubmedResults.length > 0"
          :articles="pubmedResults"
          :total-results="totalResults"
          :current-page="currentPage"
          :total-pages="totalPages"
          :display-mode="displayMode"
          :is-translating="isTranslating"
          :is-searching="isSearching"
          @switch-mode="switchDisplayMode"
          @prev-page="prevPage"
          @next-page="nextPage"
        />
      </div>

      <!-- 全屏 Loading 遮罩 -->
      <LoadingModal
        :show="isGenerating || isSearching"
        :title="loadingTitle"
        :message="loadingMessage"
        :tips="loadingTips"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { usePaperStore } from '@/store/paper.store';
import { ElMessage } from 'element-plus';
import { SAVE_DEBOUNCE_MS } from './constants';
import { generateConceptBlocksAI, translateKeywordsAI } from './services/ai.service';
import { useArticleTranslation } from './composables/useArticleTranslation';
import { useConceptBlocks } from './composables/useConceptBlocks';
import { useCopyToClipboard } from './composables/useCopyToClipboard';
import { usePubMedSearch } from './composables/usePubMedSearch';
import ArticleList from './components/ArticleList.vue';
import ConceptBlockEditor from './components/ConceptBlockEditor.vue';
import LoadingModal from './components/LoadingModal.vue';
import TopicInput from './components/TopicInput.vue';

// 使用 Pinia store
const paperStore = usePaperStore();

// 使用 composables
const {
  conceptBlocks,
  newKeywordText,
  addConceptBlock,
  deleteConceptBlock,
  toggleCollapse,
  addKeywordToBlock,
  deleteKeyword,
  onDragStart,
  onDragEnd,
  onDrop,
  generateTerm,
  clearConceptBlocks,
  collectAllKeywords
} = useConceptBlocks();

const { isSearching, pubmedResults, totalResults, currentPage, totalPages, searchPubMed, nextPage, prevPage, clearResults } = usePubMedSearch();

const { displayMode, isTranslating, switchDisplayMode } = useArticleTranslation(pubmedResults);

const { copyWithMessage } = useCopyToClipboard();

// 生成状态
const isGenerating = ref(false);

// 监听输入变化，自动保存到 localStorage（防抖）
let saveTimer: NodeJS.Timeout | null = null;
watch(
  () => [paperStore.topic, paperStore.keywords, paperStore.clinicalObservation],
  () => {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      paperStore.saveToStorage();
    }, SAVE_DEBOUNCE_MS);
  },
  { deep: true }
);

// 实时生成检索式
const generatedTerm = computed(() => {
  return generateTerm(conceptBlocks.value, false);
});

// Loading 状态
const loadingTitle = computed(() => {
  return isSearching.value ? '正在搜索 PubMed...' : 'AI 正在生成检索概念块...';
});

const loadingMessage = computed(() => {
  return isSearching.value ? '正在翻译关键词并获取文献数据...' : '正在分析课题并构建检索概念';
});

const loadingTips = computed(() => {
  return isSearching.value
    ? ['💡 每页显示 5 篇文献，按需加载']
    : ['💡 AI 会自动生成概念块和相关关键词', '📋 您可以可视化编辑检索式'];
});

// 生成概念块
const handleGenerateConceptBlocks = async () => {
  if (!paperStore.topic.trim() || !paperStore.keywords.trim()) {
    ElMessage.warning('请填写课题名称和关键词');
    return;
  }

  isGenerating.value = true;
  clearConceptBlocks();
  clearResults();

  try {
    const blocks = await generateConceptBlocksAI(
      paperStore.topic,
      paperStore.keywords,
      paperStore.clinicalObservation
    );

    conceptBlocks.value = blocks;
    ElMessage.success('概念块生成成功！');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '未知错误';
    ElMessage.error('生成失败：' + message);
  } finally {
    isGenerating.value = false;
  }
};

// 清空输入
const handleClear = () => {
  paperStore.clearAll();
};

// 更新概念块名称
const updateBlockName = (blockId: string, value: string) => {
  const block = conceptBlocks.value.find(b => b.id === blockId);
  if (block) block.name = value;
};

// 更新概念块操作符
const updateBlockOperator = (blockId: string, value: 'AND' | 'OR') => {
  const block = conceptBlocks.value.find(b => b.id === blockId);
  if (block) block.operator = value;
};

// 更新关键词文本
const updateKeywordText = (blockId: string, keywordId: string, value: string) => {
  const block = conceptBlocks.value.find(b => b.id === blockId);
  if (block) {
    const keyword = block.keywords.find(k => k.id === keywordId);
    if (keyword) keyword.text = value;
  }
};

// 更新关键词字段
const updateKeywordField = (blockId: string, keywordId: string, value: 'Mesh' | 'tiab' | 'tw') => {
  const block = conceptBlocks.value.find(b => b.id === blockId);
  if (block) {
    const keyword = block.keywords.find(k => k.id === keywordId);
    if (keyword) keyword.field = value;
  }
};

// 更新关键词操作符
const updateKeywordOperator = (blockId: string, keywordId: string, value: 'OR' | 'NOT') => {
  const block = conceptBlocks.value.find(b => b.id === blockId);
  if (block) {
    const keyword = block.keywords.find(k => k.id === keywordId);
    if (keyword) keyword.operator = value;
  }
};

// 复制检索式
const handleCopyTerm = async () => {
  if (!generatedTerm.value) return;

  try {
    await copyWithMessage(generatedTerm.value, '检索式已复制到剪贴板！');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '未知错误';
    ElMessage.error('复制失败：' + message);
  }
};

// 导出到 PubMed
const handleExportToPubMed = async () => {
  if (!generatedTerm.value) return;

  try {
    // 翻译为英文
    const keywords = collectAllKeywords(conceptBlocks.value);
    const translations = await translateKeywordsAI(keywords);

    // 生成英文检索式
    const englishTerm = generateTerm(conceptBlocks.value, true, translations);

    if (!englishTerm) {
      ElMessage.error('翻译关键词失败，请重试');
      return;
    }

    const encodedTerm = encodeURIComponent(englishTerm);
    const pubmedUrl = `https://pubmed.ncbi.nlm.nih.gov/?term=${encodedTerm}`;

    window.open(pubmedUrl, '_blank');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '未知错误';
    ElMessage.error('导出失败：' + message);
  }
};

// 搜索 PubMed
const handleSearchPubMed = async () => {
  if (!generatedTerm.value) return;

  try {
    // 翻译为英文
    const keywords = collectAllKeywords(conceptBlocks.value);
    const translations = await translateKeywordsAI(keywords);

    // 生成英文检索式
    const englishTerm = generateTerm(conceptBlocks.value, true, translations);

    if (!englishTerm) {
      ElMessage.error('翻译关键词失败，请重试');
      return;
    }

    await searchPubMed(englishTerm);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '未知错误';
    ElMessage.error('搜索失败：' + message);
  }
};
</script>
