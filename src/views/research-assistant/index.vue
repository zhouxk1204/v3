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
        <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
            <h3 class="text-xl font-semibold text-gray-800">输入课题信息</h3>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">课题名称 <span class="text-red-500">*</span></label>
            <input v-model="paperStore.topic" type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="例如：老年患者 PACU 躁动护理" />
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">关键词 <span class="text-red-500">*</span></label>
            <textarea v-model="paperStore.keywords"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
              placeholder="例如：PACU, emergence agitation, nursing" rows="3" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">临床观察 <span class="text-gray-500 font-normal">(可选)</span></label>
            <textarea v-model="paperStore.clinicalObservation"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
              placeholder="例如：术后老年患者拔管躁动明显..." rows="3" />
          </div>

          <div class="mt-6 flex justify-center gap-4">
            <button
              class="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
              :disabled="isGenerating || !paperStore.topic.trim() || !paperStore.keywords.trim()" @click="generateConceptBlocks">
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
              v-if="paperStore.topic || paperStore.keywords || paperStore.clinicalObservation"
              @click="paperStore.clearAll"
              class="px-6 py-4 bg-gray-500 text-white font-semibold rounded-xl shadow-lg hover:bg-gray-600 transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2">
              <span class="text-xl">🗑️</span>
              清空
            </button>
          </div>
        </div>

        <!-- 可视化检索式构建器 -->
        <div v-if="conceptBlocks.length > 0" class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
              <h3 class="text-xl font-semibold text-gray-800">可视化检索式构建</h3>
            </div>
            <button @click="addConceptBlock"
              class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
              + 添加概念块
            </button>
          </div>

          <!-- 概念块列表 -->
          <div class="space-y-4">
            <div v-for="(block, blockIndex) in conceptBlocks" :key="block.id"
              class="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              
              <!-- 概念块头部 -->
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                  <button @click="toggleCollapse(block.id)" class="text-gray-500 hover:text-gray-700">
                    <span v-if="block.collapsed">▶</span>
                    <span v-else>▼</span>
                  </button>
                  <input v-model="block.name" type="text"
                    class="text-lg font-semibold text-gray-800 border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none px-2 py-1"
                    placeholder="概念名称" />
                  <span class="text-sm text-gray-500">({{ block.keywords.length }} 个关键词)</span>
                </div>
                
                <div class="flex items-center gap-2">
                  <!-- 概念块间的逻辑操作符 -->
                  <select v-if="blockIndex > 0" v-model="block.operator"
                    class="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    title="与前一个概念块的逻辑关系">
                    <option value="AND">同时满足</option>
                    <option value="OR">或者满足</option>
                  </select>
                  <button @click="deleteConceptBlock(block.id)"
                    class="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm">
                    删除块
                  </button>
                </div>
              </div>

              <!-- 关键词列表 -->
              <div v-if="!block.collapsed" class="space-y-2">
                <div v-for="(keyword, kwIndex) in block.keywords" :key="keyword.id"
                  draggable="true"
                  @dragstart="onDragStart(block.id, keyword.id)"
                  @dragend="onDragEnd"
                  @dragover.prevent
                  @drop="onDrop(block.id, kwIndex)"
                  class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-move">
                  
                  <!-- 拖拽手柄 -->
                  <span class="text-gray-400">⋮⋮</span>
                  
                  <!-- 关键词文本 -->
                  <input v-model="keyword.text" type="text"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    placeholder="关键词" />
                  
                  <!-- 字段选择 -->
                  <select v-model="keyword.field"
                    class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    title="选择搜索字段">
                    <option value="Mesh">主题词</option>
                    <option value="tiab">标题+摘要</option>
                    <option value="tw">全文</option>
                  </select>
                  
                  <!-- 操作符选择 -->
                  <select v-if="kwIndex > 0" v-model="keyword.operator"
                    class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    title="与前一个关键词的逻辑关系">
                    <option value="OR">或者满足</option>
                    <option value="NOT">排除</option>
                  </select>
                  
                  <!-- 删除按钮 -->
                  <button @click="deleteKeyword(block.id, keyword.id)"
                    class="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm">
                    ×
                  </button>
                </div>

                <!-- 添加关键词 -->
                <div class="flex gap-2 mt-3">
                  <input v-model="newKeywordText" type="text" @keyup.enter="addKeywordToBlock(block.id)"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                    placeholder="输入新关键词，按回车添加..." />
                  <button @click="addKeywordToBlock(block.id)"
                    class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
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
                <p><span class="font-semibold">� 字段说明：</span></p>
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
                  <button @click="copyTerm"
                    class="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                    复制
                  </button>
                  <button @click="exportToPubmed"
                    class="px-3 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm">
                    导出到 PubMed
                  </button>
                </div>
              </div>
              <div class="text-sm text-gray-700 font-mono break-all whitespace-pre-wrap">{{ generatedTerm || '请添加关键词...' }}</div>
            </div>
          </div>

          <!-- 搜索按钮 -->
          <div class="flex justify-center mt-6">
            <button @click="searchPubmed" :disabled="isSearching || !generatedTerm"
              class="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2">
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

        <!-- 文献列表区域 -->
        <div v-if="pubmedResults.length > 0" class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
              <h3 class="text-xl font-semibold text-gray-800">搜索结果 (共 {{ totalResults }} 篇)</h3>
            </div>
            
            <!-- 显示模式切换 -->
            <div class="flex gap-2">
              <button 
                @click="switchDisplayMode('original')"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  displayMode === 'original' 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
                :disabled="isTranslating">
                原文
              </button>
              <button 
                @click="switchDisplayMode('translated')"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  displayMode === 'translated' 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
                :disabled="isTranslating">
                翻译
              </button>
              <button 
                @click="switchDisplayMode('summary')"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  displayMode === 'summary' 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
                :disabled="isTranslating">
                归纳总结
              </button>
            </div>
          </div>

          <!-- 翻译中提示 -->
          <div v-if="isTranslating" class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
            <div class="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span class="text-blue-700 text-sm">正在{{ displayMode === 'translated' ? '翻译' : '归纳总结' }}中，请稍候...</span>
          </div>

          <!-- 文献卡片 -->
          <div class="space-y-4">
            <div v-for="(article, index) in pubmedResults" :key="index"
              class="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
              <div class="flex items-start gap-3">
                <div class="flex-1">
                  <!-- PMID 和日期 -->
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-gray-500">PMID: 
                      <a :href="`https://pubmed.ncbi.nlm.nih.gov/${article.PMID}`" 
                         target="_blank" 
                         class="text-blue-600 hover:text-blue-800 hover:underline">
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
                    
                    <div v-if="article.AbstractSections && article.AbstractSections.length > 0" class="space-y-2 mb-3">
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
                      v-html="renderMarkdown(article.summary)">
                    </div>
                    <div v-else class="text-sm text-gray-500">归纳总结中...</div>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <!-- 分页 -->
          <div v-if="totalPages > 1" class="mt-6 flex justify-center items-center gap-4">
            <button @click="prevPage" :disabled="currentPage === 1 || isSearching"
              class="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors">
              上一页
            </button>
            <span class="text-gray-700">第 {{ currentPage }} / {{ totalPages }} 页 (共 {{ totalResults }} 篇)</span>
            <button @click="nextPage" :disabled="currentPage === totalPages || isSearching"
              class="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors">
              下一页
            </button>
          </div>
        </div>
      </div>

      <!-- 全屏 Loading 遮罩 -->
      <div v-if="isGenerating || isSearching"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
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
              {{ isSearching ? '正在搜索 PubMed...' : 'AI 正在生成检索概念块...' }}
            </h3>
            <p class="text-gray-600">
              {{ isSearching ? '正在翻译关键词并获取文献数据...' : '正在分析课题并构建检索概念' }}
            </p>

            <div class="text-xs text-gray-500 mt-4 space-y-1">
              <p v-if="isSearching">💡 每页显示 5 篇文献，按需加载</p>
              <p v-else>💡 AI 会自动生成概念块和相关关键词</p>
              <p>📋 您可以可视化编辑检索式</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { chatCompletions } from '@/api/deepseek/index.api';
import { usePaperStore } from '@/store/paper.store';
import { marked } from 'marked';
import { computed, ref, watch } from 'vue';
import { compactPrompt, generateConceptBlocksPrompt, summarizeArticlePrompt, translateArticlePrompt, translateKeywordsPrompt } from './prompt';
import type { AbstractSection, Article, ConceptBlock, DisplayMode } from './types';

// 使用 Pinia store
const paperStore = usePaperStore();

// 监听输入变化，自动保存到 localStorage（防抖）
let saveTimer: NodeJS.Timeout | null = null;
watch(
  () => [paperStore.topic, paperStore.keywords, paperStore.clinicalObservation],
  () => {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      paperStore.saveToStorage();
    }, 500); // 500ms 防抖
  },
  { deep: true }
);

// 渲染 Markdown
const renderMarkdown = (text: string): string => {
  if (!text) return '';
  return marked(text) as string;
};

// 格式化日期：将 "2024-May-09" 转换为 "2024-05-09" 或 "2024-05"
const formatPublicationDate = (year: string, month: string, day?: string): string => {
  const monthMap: Record<string, string> = {
    'Jan': '01', 'January': '01',
    'Feb': '02', 'February': '02',
    'Mar': '03', 'March': '03',
    'Apr': '04', 'April': '04',
    'May': '05',
    'Jun': '06', 'June': '06',
    'Jul': '07', 'July': '07',
    'Aug': '08', 'August': '08',
    'Sep': '09', 'September': '09',
    'Oct': '10', 'October': '10',
    'Nov': '11', 'November': '11',
    'Dec': '12', 'December': '12'
  };

  let formattedDate = year;
  
  if (month) {
    // 如果月份是英文名称，转换为数字
    const monthNum = monthMap[month] || month.padStart(2, '0');
    formattedDate += '-' + monthNum;
    
    if (day) {
      formattedDate += '-' + day.padStart(2, '0');
    }
  }
  
  return formattedDate;
};

const isGenerating = ref(false);
const isSearching = ref(false);

// 概念块列表
const conceptBlocks = ref<ConceptBlock[]>([]);

// 新增关键词输入
const newKeywordText = ref('');

// PubMed 搜索结果
const pubmedResults = ref<Article[]>([]);
const totalResults = ref(0);
const resultsPerPage = 5;
const currentPage = ref(1);
const pmidList = ref<string[]>([]);

// 显示模式
const displayMode = ref<DisplayMode>('original');
const isTranslating = ref(false);

// 拖拽相关
const draggedKeyword = ref<{ blockId: string; keywordId: string } | null>(null);

const API_KEY = 'fcf657ff78e5f612a9e31d3f11d2f24ed308';

// 生成概念块
const generateConceptBlocks = async () => {
  if (!paperStore.topic.trim() || !paperStore.keywords.trim()) {
    alert('请填写课题名称和关键词');
    return;
  }

  isGenerating.value = true;
  conceptBlocks.value = [];
  pubmedResults.value = [];

  try {
    const response = await chatCompletions({
      context: [
        {
          role: 'system',
          content: compactPrompt(generateConceptBlocksPrompt.system)
        },
        {
          role: 'user',
          content: compactPrompt(generateConceptBlocksPrompt.user(
            paperStore.topic,
            paperStore.keywords,
            paperStore.clinicalObservation
          ))
        }
      ],
      model: 'deepseek-chat',
      temperature: 0.5
    }, 60000);

    const result = response?.choices?.[0]?.message?.content || '';

    if (result) {
      const jsonMatch = result.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const concepts = JSON.parse(jsonMatch[0]);
        
        conceptBlocks.value = concepts.map((concept: any, index: number) => ({
          id: `block-${Date.now()}-${index}`,
          name: concept.name,
          keywords: concept.keywords.map((kw: any, kwIndex: number) => ({
            id: `kw-${Date.now()}-${index}-${kwIndex}`,
            text: kw.text,
            field: kw.field || 'tiab',
            operator: 'OR'
          })),
          collapsed: false,
          operator: 'AND'
        }));
      }
    }
  } catch (error: any) {
    console.error('生成失败：', error);
    alert('生成失败：' + (error.message || error));
  } finally {
    isGenerating.value = false;
  }
};

// 添加新概念块
const addConceptBlock = () => {
  conceptBlocks.value.push({
    id: `block-${Date.now()}`,
    name: '新概念',
    keywords: [],
    collapsed: false,
    operator: 'AND'
  });
};

// 删除概念块
const deleteConceptBlock = (blockId: string) => {
  conceptBlocks.value = conceptBlocks.value.filter(b => b.id !== blockId);
};

// 切换概念块折叠状态
const toggleCollapse = (blockId: string) => {
  const block = conceptBlocks.value.find(b => b.id === blockId);
  if (block) {
    block.collapsed = !block.collapsed;
  }
};

// 添加关键词到指定概念块
const addKeywordToBlock = (blockId: string) => {
  if (!newKeywordText.value.trim()) return;
  
  const block = conceptBlocks.value.find(b => b.id === blockId);
  if (block) {
    block.keywords.push({
      id: `kw-${Date.now()}`,
      text: newKeywordText.value.trim(),
      field: 'tiab',
      operator: 'OR'
    });
    newKeywordText.value = '';
  }
};

// 删除关键词
const deleteKeyword = (blockId: string, keywordId: string) => {
  const block = conceptBlocks.value.find(b => b.id === blockId);
  if (block) {
    block.keywords = block.keywords.filter(k => k.id !== keywordId);
  }
};

// 拖拽开始
const onDragStart = (blockId: string, keywordId: string) => {
  draggedKeyword.value = { blockId, keywordId };
};

// 拖拽结束
const onDragEnd = () => {
  draggedKeyword.value = null;
};

// 放置
const onDrop = (targetBlockId: string, targetIndex: number) => {
  if (!draggedKeyword.value) return;
  
  const sourceBlock = conceptBlocks.value.find(b => b.id === draggedKeyword.value!.blockId);
  const targetBlock = conceptBlocks.value.find(b => b.id === targetBlockId);
  
  if (!sourceBlock || !targetBlock) return;
  
  const keywordIndex = sourceBlock.keywords.findIndex(k => k.id === draggedKeyword.value!.keywordId);
  if (keywordIndex === -1) return;
  
  const [keyword] = sourceBlock.keywords.splice(keywordIndex, 1);
  targetBlock.keywords.splice(targetIndex, 0, keyword);
  
  draggedKeyword.value = null;
};

// 实时生成 PubMed 检索式
const generatedTerm = computed(() => {
  if (conceptBlocks.value.length === 0) return '';
  
  const blockTerms = conceptBlocks.value.map((block, blockIndex) => {
    if (block.keywords.length === 0) return '';
    
    const keywordTerms = block.keywords.map((keyword, kwIndex) => {
      const prefix = kwIndex > 0 ? ` ${keyword.operator} ` : '';
      return `${prefix}"${keyword.text}"[${keyword.field}]`;
    }).join('');
    
    const blockTerm = block.keywords.length > 1 ? `(${keywordTerms})` : keywordTerms;
    const operator = blockIndex > 0 ? ` ${block.operator} ` : '';
    
    return `${operator}${blockTerm}`;
  }).filter(t => t).join('');
  
  return blockTerms;
});

// 复制检索式
const copyTerm = async () => {
  if (!generatedTerm.value) return;
  
  try {
    await navigator.clipboard.writeText(generatedTerm.value);
    alert('检索式已复制到剪贴板！');
  } catch (error) {
    alert('复制失败，请手动复制');
  }
};

// 导出到 PubMed
const exportToPubmed = async () => {
  if (!generatedTerm.value) return;
  
  try {
    // 翻译为英文
    const englishTerm = await translateKeywordsToEnglish();
    
    if (!englishTerm) {
      alert('翻译关键词失败，请重试');
      return;
    }
    
    const encodedTerm = encodeURIComponent(englishTerm);
    const pubmedUrl = `https://pubmed.ncbi.nlm.nih.gov/?term=${encodedTerm}`;
    
    window.open(pubmedUrl, '_blank');
  } catch (error) {
    console.error('导出失败：', error);
    alert('导出失败，请重试');
  }
};

// 翻译关键词为英文（用于 PubMed 搜索）
const translateKeywordsToEnglish = async (): Promise<string> => {
  if (conceptBlocks.value.length === 0) return '';
  
  try {
    // 收集所有中文关键词
    const allKeywords = conceptBlocks.value.flatMap(block => 
      block.keywords.map(kw => kw.text)
    );
    
    // 批量翻译
    const response = await chatCompletions({
      context: [
        {
          role: 'system',
          content: compactPrompt(translateKeywordsPrompt.system)
        },
        {
          role: 'user',
          content: compactPrompt(translateKeywordsPrompt.user(allKeywords))
        }
      ],
      model: 'deepseek-chat',
      temperature: 0.3
    }, 60000);

    const result = response?.choices?.[0]?.message?.content || '';
    
    if (result) {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const translations = JSON.parse(jsonMatch[0]);
        
        // 构建英文检索式
        const blockTerms = conceptBlocks.value.map((block, blockIndex) => {
          if (block.keywords.length === 0) return '';
          
          const keywordTerms = block.keywords.map((keyword, kwIndex) => {
            const englishText = translations[keyword.text] || keyword.text;
            const prefix = kwIndex > 0 ? ` ${keyword.operator} ` : '';
            return `${prefix}"${englishText}"[${keyword.field}]`;
          }).join('');
          
          const blockTerm = block.keywords.length > 1 ? `(${keywordTerms})` : keywordTerms;
          const operator = blockIndex > 0 ? ` ${block.operator} ` : '';
          
          return `${operator}${blockTerm}`;
        }).filter(t => t).join('');
        
        return blockTerms;
      }
    }
    
    // 如果翻译失败，返回原始检索式
    return generatedTerm.value;
    
  } catch (error: any) {
    console.error('翻译失败：', error);
    // 翻译失败时返回原始检索式
    return generatedTerm.value;
  }
};

// 搜索 PubMed
const searchPubmed = async () => {
  if (!generatedTerm.value) return;

  isSearching.value = true;
  pubmedResults.value = [];
  currentPage.value = 1;

  try {
    // 先翻译关键词为英文
    const englishTerm = await translateKeywordsToEnglish();
    
    if (!englishTerm) {
      alert('翻译关键词失败，请重试');
      return;
    }

    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(englishTerm)}&retmax=100&retmode=json&api_key=${API_KEY}`;

    const searchResponse = await fetch(searchUrl);
    const searchResult = await searchResponse.json();

    totalResults.value = parseInt(searchResult.esearchresult.count);
    pmidList.value = searchResult.esearchresult.idlist || [];

    if (pmidList.value.length === 0) {
      alert('未找到相关文献');
      return;
    }

    await fetchPageData(1);

  } catch (error: any) {
    console.error('搜索失败：', error);
    alert('搜索失败：' + (error.message || error));
  } finally {
    isSearching.value = false;
  }
};

// 获取指定页的数据
const fetchPageData = async (page: number) => {
  isSearching.value = true;
  
  try {
    const startIndex = (page - 1) * resultsPerPage;
    const endIndex = Math.min(startIndex + resultsPerPage, pmidList.value.length);
    const pagePmids = pmidList.value.slice(startIndex, endIndex);

    if (pagePmids.length === 0) {
      pubmedResults.value = [];
      return;
    }

    const idParam = pagePmids.join(',');
    const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${idParam}&retmode=xml&api_key=${API_KEY}`;

    const fetchResponse = await fetch(fetchUrl);
    const fetchText = await fetchResponse.text();

    const articles = parsePubmedXml(fetchText);
    pubmedResults.value = articles;

    if (displayMode.value === 'translated') {
      await translateArticles();
    } else if (displayMode.value === 'summary') {
      await summarizeArticles();
    }

  } catch (error: any) {
    console.error('获取数据失败：', error);
    alert('获取数据失败：' + (error.message || error));
  } finally {
    isSearching.value = false;
  }
};

// 解析 PubMed XML
const parsePubmedXml = (xmlText: string): Article[] => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  const articles: Article[] = [];

  const articleNodes = xmlDoc.getElementsByTagName('PubmedArticle');

  for (let i = 0; i < articleNodes.length; i++) {
    const articleNode = articleNodes[i];

    const pmidNode = articleNode.getElementsByTagName('PMID');
    const pmid = pmidNode.length > 0 ? pmidNode[0].textContent || '' : '';

    const titleNode = articleNode.getElementsByTagName('ArticleTitle');
    const title = titleNode.length > 0 ? titleNode[0].textContent || '' : '';

    const abstractNodes = articleNode.getElementsByTagName('Abstract');
    let abstractSections: AbstractSection[] = [];
    
    if (abstractNodes.length > 0) {
      const abstractTextNodes = abstractNodes[0].getElementsByTagName('AbstractText');
      
      for (let j = 0; j < abstractTextNodes.length; j++) {
        const textNode = abstractTextNodes[j];
        const label = textNode.getAttribute('Label') || '';
        const text = textNode.textContent || '';
        
        if (text) {
          abstractSections.push({ label, text });
        }
      }
    }

    const authorNodes = articleNode.getElementsByTagName('Author');
    const authors: string[] = [];
    for (let j = 0; j < authorNodes.length; j++) {
      const lastName = authorNodes[j].getElementsByTagName('LastName');
      const foreName = authorNodes[j].getElementsByTagName('ForeName');

      if (lastName.length > 0 && foreName.length > 0) {
        authors.push(`${lastName[0].textContent} ${foreName[0].textContent}`);
      }
    }

    const journalNode = articleNode.getElementsByTagName('Journal');
    const journalTitle = journalNode.length > 0
      ? journalNode[0].getElementsByTagName('Title')[0]?.textContent || ''
      : '';

    const pubDateNodes = articleNode.getElementsByTagName('PubDate');
    let publicationDate = '';
    if (pubDateNodes.length > 0) {
      const yearNodes = pubDateNodes[0].getElementsByTagName('Year');
      const monthNodes = pubDateNodes[0].getElementsByTagName('Month');
      const dayNodes = pubDateNodes[0].getElementsByTagName('Day');

      if (yearNodes.length > 0) {
        const year = yearNodes[0].textContent || '';
        const month = monthNodes.length > 0 ? monthNodes[0].textContent || '' : '';
        const day = dayNodes.length > 0 ? dayNodes[0].textContent || '' : '';
        
        publicationDate = formatPublicationDate(year, month, day);
      }
    }

    articles.push({
      PMID: pmid,
      ArticleTitle: title,
      AbstractSections: abstractSections,
      Authors: authors.join(', '),
      Journal: journalTitle,
      PublicationDate: publicationDate
    });
  }

  return articles;
};

// 翻译文章
const translateArticles = async () => {
  if (pubmedResults.value.length === 0) return;
  
  isTranslating.value = true;
  
  try {
    for (const article of pubmedResults.value) {
      if (article.translatedTitle && article.translatedAbstract) {
        continue;
      }

      let abstractText = '';
      if (article.AbstractSections && article.AbstractSections.length > 0) {
        abstractText = article.AbstractSections
          .map((section: AbstractSection) => `${section.label ? section.label + ': ' : ''}${section.text}`)
          .join('\n\n');
      }

      const response = await chatCompletions({
        context: [
          {
            role: 'system',
            content: compactPrompt(translateArticlePrompt.system)
          },
          {
            role: 'user',
            content: compactPrompt(translateArticlePrompt.user(article.ArticleTitle, abstractText))
          }
        ],
        model: 'deepseek-chat',
        temperature: 0.3
      }, 60000);

      const result = response?.choices?.[0]?.message?.content || '';
      
      if (result) {
        const titleMatch = result.match(/【标题】\s*([\s\S]*?)(?=【摘要】|$)/);
        const abstractMatch = result.match(/【摘要】\s*([\s\S]*?)$/);
        
        article.translatedTitle = titleMatch ? titleMatch[1].trim() : article.ArticleTitle;
        article.translatedAbstract = abstractMatch ? abstractMatch[1].trim() : abstractText;
      }
    }
  } catch (error: any) {
    console.error('翻译失败：', error);
    alert('翻译失败：' + (error.message || error));
  } finally {
    isTranslating.value = false;
  }
};

// 归纳总结文章
const summarizeArticles = async () => {
  if (pubmedResults.value.length === 0) return;
  
  isTranslating.value = true;
  
  try {
    for (const article of pubmedResults.value) {
      if (article.summary) {
        continue;
      }

      let abstractText = '';
      if (article.AbstractSections && article.AbstractSections.length > 0) {
        abstractText = article.AbstractSections
          .map((section: AbstractSection) => `${section.label ? section.label + ': ' : ''}${section.text}`)
          .join('\n\n');
      }

      const response = await chatCompletions({
        context: [
          {
            role: 'system',
            content: compactPrompt(summarizeArticlePrompt.system)
          },
          {
            role: 'user',
            content: compactPrompt(summarizeArticlePrompt.user(article.ArticleTitle, abstractText))
          }
        ],
        model: 'deepseek-chat',
        temperature: 0.3
      }, 60000);

      const result = response?.choices?.[0]?.message?.content || '';
      
      if (result) {
        article.summary = result.trim();
      }
    }
  } catch (error: any) {
    console.error('总结失败：', error);
    alert('总结失败：' + (error.message || error));
  } finally {
    isTranslating.value = false;
  }
};

// 切换显示模式
const switchDisplayMode = async (mode: DisplayMode) => {
  displayMode.value = mode;
  
  if (mode === 'translated' && pubmedResults.value.length > 0) {
    await translateArticles();
  } else if (mode === 'summary' && pubmedResults.value.length > 0) {
    await summarizeArticles();
  }
};

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(pmidList.value.length / resultsPerPage);
});

// 下一页
const nextPage = async () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    await fetchPageData(currentPage.value);
  }
};

// 上一页
const prevPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    await fetchPageData(currentPage.value);
  }
};
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

/* Markdown 样式 */
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

.prose :deep(em) {
  font-style: italic;
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
