<template>
  <div class="h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 overflow-auto">
    <div class="max-w-5xl mx-auto">
      <!-- 标题 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">AI写作风格检测与人类化改写</h1>
        <p class="text-gray-600">智能分析AI写作痕迹，一键转换为自然人类化表达</p>
      </div>

      <!-- 主要内容区 -->
      <div class="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <!-- 文本输入区 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            输入文本
            <span class="text-gray-400 text-xs ml-2">({{ inputText.length }} 字)</span>
          </label>
          <textarea v-model="inputText" placeholder="请输入需要分析或改写的文本..."
            class="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
            :disabled="isAnalyzing || isRewriting"></textarea>
        </div>

        <!-- 场景选择 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-3">改写场景</label>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <button v-for="scene in scenes" :key="scene.value" @click="selectedScene = scene.value" :class="[
              'px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
              selectedScene === scene.value
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]" :disabled="isAnalyzing || isRewriting">
              {{ scene.label }}
            </button>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex gap-4">
          <button @click="analyzeStyle" :disabled="!inputText.trim() || isAnalyzing || isRewriting"
            class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
            <Icon v-if="isAnalyzing" icon="line-md:loading-twotone-loop" width="20" />
            <span>{{ isAnalyzing ? '分析中...' : '分析AI写作风格' }}</span>
          </button>
          <button @click="rewriteText" :disabled="!inputText.trim() || isAnalyzing || isRewriting"
            class="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
            <Icon v-if="isRewriting" icon="line-md:loading-twotone-loop" width="20" />
            <span>{{ isRewriting ? '改写中...' : '按场景一键改写' }}</span>
          </button>
        </div>
      </div>

      <!-- 改写结果区 -->
      <div v-if="rewrittenText" class="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Icon icon="mdi:file-document-edit" width="24" class="text-indigo-600" />
            改写后的文本
          </h2>
          <button @click="copyToClipboard"
            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-all flex items-center gap-2">
            <Icon :icon="copied ? 'mdi:check' : 'mdi:content-copy'" width="18" />
            {{ copied ? '已复制' : '复制' }}
          </button>
        </div>
        <div class="prose max-w-none">
          <div class="whitespace-pre-wrap text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
            {{ rewrittenText }}
          </div>
        </div>
      </div>

      <!-- 分析结果区 -->
      <div v-if="analysisResult" class="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Icon icon="mdi:chart-line" width="24" class="text-blue-600" />
          AI写作风格分析结果
        </h2>

        <!-- AI指数饼图 -->
        <div v-if="aiScore !== null"
          class="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 animate__animated animate__fadeIn">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 text-center">AI写作指数</h3>
          <div class="flex flex-col md:flex-row items-center gap-6">
            <!-- 饼图 -->
            <div class="w-full md:w-1/2">
              <div ref="pieChartRef" class="h-64"></div>
            </div>

            <!-- 图例和说明 -->
            <div class="w-full md:w-1/2 space-y-4">
              <div class="flex items-center gap-3">
                <div class="w-4 h-4 rounded-full bg-red-500"></div>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <span class="font-medium text-gray-700">AIGC特征</span>
                    <span class="text-lg font-bold text-red-600">{{ aiScore }}%</span>
                  </div>
                  <p class="text-sm text-gray-500 mt-1">AI生成内容的典型特征</p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-4 h-4 rounded-full bg-green-500"></div>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <span class="font-medium text-gray-700">人类写作</span>
                    <span class="text-lg font-bold text-green-600">{{ 100 - aiScore }}%</span>
                  </div>
                  <p class="text-sm text-gray-500 mt-1">自然人类化的表达方式</p>
                </div>
              </div>

              <!-- 评级 -->
              <div class="mt-4 p-4 bg-white rounded-lg border-2" :class="getScoreColor(aiScore).border">
                <div class="flex items-center gap-2 mb-2">
                  <Icon :icon="getScoreIcon(aiScore)" width="20" :class="getScoreColor(aiScore).text" />
                  <span class="font-semibold" :class="getScoreColor(aiScore).text">
                    {{ getScoreLevel(aiScore) }}
                  </span>
                </div>
                <p class="text-sm text-gray-600">{{ getScoreDescription(aiScore) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 量化指标详情 -->
        <div v-if="metrics" class="mb-6 animate__animated animate__fadeIn">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Icon icon="mdi:chart-box" width="20" class="text-indigo-600" />
            量化指标分析
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="config in metricsConfig" :key="config.key"
              class="bg-white rounded-lg p-4 border-2 transition-all hover:shadow-md" :class="metrics[config.key as keyof AnalysisMetrics] !== undefined
                ? getMetricColor(metrics[config.key as keyof AnalysisMetrics], config.ideal)
                : 'border-gray-200'">
              <div class="flex items-start justify-between mb-2">
                <div class="flex items-center gap-2">
                  <Icon :icon="config.icon" width="20" />
                  <span class="font-medium text-gray-800">{{ config.name }}</span>
                </div>
                <span class="text-lg font-bold">
                  {{ metrics[config.key as keyof AnalysisMetrics] !== undefined
                    ? metrics[config.key as keyof AnalysisMetrics] + config.unit
                    : '--' }}
                </span>
              </div>

              <!-- 进度条 -->
              <div v-if="metrics[config.key as keyof AnalysisMetrics] !== undefined"
                class="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div class="absolute top-0 left-0 h-full transition-all duration-500" :style="{
                  width: `${metrics[config.key as keyof AnalysisMetrics]}%`,
                  backgroundColor: getMetricBarColor(metrics[config.key as keyof AnalysisMetrics], config.ideal)
                }"></div>
                <!-- 理想范围标记 -->
                <div class="absolute top-0 h-full bg-blue-200 opacity-30" :style="{
                  left: `${config.ideal.min}%`,
                  width: `${config.ideal.max - config.ideal.min}%`
                }"></div>
              </div>
              <div v-else class="w-full h-2 bg-gray-100 rounded-full mb-2"></div>

              <p class="text-xs text-gray-600 mb-1">{{ config.description }}</p>
              <p class="text-xs text-gray-500">
                理想范围: {{ config.ideal.min }}-{{ config.ideal.max }}{{ config.unit }}
              </p>
            </div>
          </div>
        </div>

        <!-- 分析中且未获取到分数时的提示 -->
        <div v-else-if="isAnalyzing" class="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
          <div class="flex items-center justify-center gap-3 text-gray-600">
            <Icon icon="line-md:loading-twotone-loop" width="24" />
            <span>正在分析AI写作指数...</span>
          </div>
        </div>

        <!-- 详细分析 -->
        <div class="prose max-w-none markdown">
          <div class="text-gray-700 leading-relaxed" v-html="renderMarkdown(removeMetricsFromText(analysisResult))">
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script setup lang="ts">
import { PieChart } from 'echarts/charts';
import {
  LegendComponent,
  TitleComponent,
  TooltipComponent
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-light.css';
import { marked } from 'marked';

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout
]);

const inputText = ref('');
const selectedScene = ref('general');
const analysisResult = ref('');
const rewrittenText = ref('');
const isAnalyzing = ref(false);
const isRewriting = ref(false);
const copied = ref(false);
const aiScore = ref<number | null>(null);
const pieChartRef = ref<HTMLElement>();
let chartInstance: echarts.ECharts | null = null;

// 量化指标
interface AnalysisMetrics {
  vocabularyFormality: number;      // 用词正式度 (0-100)
  sentenceComplexity: number;       // 句式复杂度 (0-100)
  logicalStructure: number;         // 逻辑结构化 (0-100)
  emotionalExpression: number;      // 情感表达度 (0-100)
  personalStyle: number;            // 个人风格化 (0-100)
  naturalTransition: number;        // 自然过渡度 (0-100)
  vocabularyDiversity: number;      // 词汇多样性 (0-100)
  templatePattern: number;          // 模板化程度 (0-100)
}

const metrics = ref<AnalysisMetrics | null>(null);

// 指标配置（名称、描述、理想范围）
const metricsConfig = [
  {
    key: 'vocabularyFormality',
    name: '用词正式度',
    description: '词汇的正式程度，过高表示过于书面化',
    ideal: { min: 30, max: 60 },
    unit: '分',
    icon: 'mdi:book-alphabet'
  },
  {
    key: 'sentenceComplexity',
    name: '句式复杂度',
    description: '句子结构的复杂程度，过高表示过于工整',
    ideal: { min: 40, max: 70 },
    unit: '分',
    icon: 'mdi:format-text'
  },
  {
    key: 'logicalStructure',
    name: '逻辑结构化',
    description: '内容组织的条理性，过高表示过于程式化',
    ideal: { min: 50, max: 80 },
    unit: '分',
    icon: 'mdi:file-tree'
  },
  {
    key: 'emotionalExpression',
    name: '情感表达度',
    description: '情感色彩的丰富程度，越高越好',
    ideal: { min: 60, max: 100 },
    unit: '分',
    icon: 'mdi:emoticon-happy'
  },
  {
    key: 'personalStyle',
    name: '个人风格化',
    description: '个性化表达的程度，越高越好',
    ideal: { min: 60, max: 100 },
    unit: '分',
    icon: 'mdi:account-star'
  },
  {
    key: 'naturalTransition',
    name: '自然过渡度',
    description: '段落间过渡的自然程度，越高越好',
    ideal: { min: 70, max: 100 },
    unit: '分',
    icon: 'mdi:transit-connection-variant'
  },
  {
    key: 'vocabularyDiversity',
    name: '词汇多样性',
    description: '用词的丰富程度，越高越好',
    ideal: { min: 60, max: 100 },
    unit: '分',
    icon: 'mdi:palette'
  },
  {
    key: 'templatePattern',
    name: '模板化程度',
    description: '使用模板化表达的程度，越低越好',
    ideal: { min: 0, max: 30 },
    unit: '分',
    icon: 'mdi:file-document-multiple'
  }
];

const scenes = [
  { label: '论文', value: 'paper' },
  { label: '通用降AI', value: 'general' },
  { label: '自媒体', value: 'media' },
  { label: '职场', value: 'workplace' },
  { label: '营销', value: 'marketing' },
  { label: '学生作文', value: 'essay' }
];

// 场景对应的提示词
const scenePrompts: Record<string, string> = {
  paper: `
请将文本改写为更接近真实学术写作的自然表达，在保持专业性和严谨性的前提下：
- 句式不要过度工整，允许长短句混合
- 避免明显模板化表达（如“首先、其次、此外、总之”等）
- 保留学术术语，但整体读起来更像研究者本人撰写
- 减弱“说明书/报告腔”，让表达更自然流畅
- 不改变原意，不新增无关内容
请直接输出改写后的文本。
  `.trim(),

  general: `
请将文本改写为更接近真实人类自然书写风格，以降低AI写作痕迹：
- 打破句式规律，避免连续多句结构相似
- 减少模板化和过度中性的表达
- 可适度加入自然过渡或轻微主观语气
- 读起来像真人写作，而不是说明书或总结报告
- 保留原有含义，不要扩写过多新内容
请直接输出改写后的文本。
  `.trim(),

  media: `
请将文本改写成更像真人自媒体作者的表达方式：
- 语言自然、生动，避免“官方腔”和模板化表达
- 句式有节奏变化，不要整齐划一
- 可适当加入轻微情绪或个人视角，增强亲和力
- 保留核心信息，不夸大、不虚构
- 避免明显AI生成痕迹
请直接输出改写后的文本。
  `.trim(),

  workplace: `
请将文本改写为更符合真实职场沟通风格的表达：
- 专业但不死板，像同事之间的正式沟通
- 表达简洁清楚，避免过度“汇报腔”或模板化表述
- 句式自然，有变化，不要整齐对称
- 保留关键信息和逻辑，不要空话套话
- 避免明显AI写作风格
请直接输出改写后的文本。
  `.trim(),

  marketing: `
请将文本改写成更像真人撰写的营销文案：
- 语言有亲和力，避免生硬的“广告模板句式”
- 句式自然，有节奏变化
- 突出卖点，但不要过度堆砌口号式表达
- 可加入贴近生活的表达方式，增强真实感
- 避免明显AI生成痕迹
请直接输出改写后的文本。
  `.trim(),

  essay: `
请将文本改写成更像学生本人写的作文风格：
- 用词自然朴实，不必刻意“高级”
- 句式有变化，允许略显随意
- 可适度加入个人感受或思考，但不脱离原意
- 避免范文感和模板化表达
- 保留原有主题和中心思想
请直接输出改写后的文本。
  `.trim()
};


// 渲染饼图
const renderPieChart = (score: number) => {
  if (!pieChartRef.value) {
    return;
  }

  // 如果已经有实例，先销毁
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }

  chartInstance = echarts.init(pieChartRef.value);

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}%'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'center',
          formatter: () => {
            return `{a|${score}%}\n{b|AI指数}`;
          },
          rich: {
            a: {
              fontSize: 32,
              fontWeight: 'bold',
              color: score > 50 ? '#ef4444' : '#22c55e',
              lineHeight: 40
            },
            b: {
              fontSize: 14,
              color: '#6b7280',
              lineHeight: 20
            }
          }
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 36,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          {
            value: score,
            name: 'AIGC特征',
            itemStyle: { color: '#ef4444' }
          },
          {
            value: 100 - score,
            name: '人类写作',
            itemStyle: { color: '#22c55e' }
          }
        ]
      }
    ]
  };

  chartInstance.setOption(option);
};

// 从分析结果中提取AI分数和指标
const extractAIScore = (text: string): number | null => {
  // 优先匹配明确的格式
  const patterns = [
    /AI化程度[：:]\s*(\d+)\s*分/i,
    /AI指数[：:]\s*(\d+)/i,
    /整体评分[：:]\s*(\d+)/i,
    /评分[：:]\s*(\d+)\s*[分\/]/i,
    /得分[：:]\s*(\d+)/i,
    /^(\d+)\s*分/m,  // 行首的分数
    /分数[：:]\s*(\d+)/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const score = parseInt(match[1]);
      if (score >= 0 && score <= 100) {
        return score;
      }
    }
  }

  return null;
};

// 从分析结果中提取量化指标
const extractMetrics = (text: string): AnalysisMetrics | null => {
  const metricsData: Partial<AnalysisMetrics> = {};

  // 定义各个指标的匹配模式（更宽松的匹配，支持多种格式）
  const patterns: Record<keyof AnalysisMetrics, RegExp> = {
    vocabularyFormality: /用词正式度\s*[^\d]{0,3}\s*(\d+)\s*分?/i,
    sentenceComplexity: /句式复杂度\s*[^\d]{0,3}\s*(\d+)\s*分?/i,
    logicalStructure: /逻辑结构化\s*[^\d]{0,3}\s*(\d+)\s*分?/i,
    emotionalExpression: /情感表达度\s*[^\d]{0,3}\s*(\d+)\s*分?/i,
    personalStyle: /个人风格化\s*[^\d]{0,3}\s*(\d+)\s*分?/i,
    naturalTransition: /自然过渡度\s*[^\d]{0,3}\s*(\d+)\s*分?/i,
    vocabularyDiversity: /词汇多样性\s*[^\d]{0,3}\s*(\d+)\s*分?/i,
    templatePattern: /模板化程度\s*[^\d]{0,3}\s*(\d+)\s*分?/i,
  };

  let foundCount = 0;

  // 使用全局匹配，确保能找到所有指标
  for (const [key, pattern] of Object.entries(patterns)) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const value = parseInt(match[1]);
      if (value >= 0 && value <= 100) {
        metricsData[key as keyof AnalysisMetrics] = value;
        foundCount++;
      } else {
        console.warn(`✗ ${key} 值超出范围: ${value}`);
      }
    } else {
      console.warn(`✗ 未找到 ${key}`);
      // 检查文本中是否包含该关键词
      const keywordMap: Record<string, string> = {
        vocabularyFormality: '用词正式度',
        sentenceComplexity: '句式复杂度',
        logicalStructure: '逻辑结构化',
        emotionalExpression: '情感表达度',
        personalStyle: '个人风格化',
        naturalTransition: '自然过渡度',
        vocabularyDiversity: '词汇多样性',
        templatePattern: '模板化程度'
      };
      const keyword = keywordMap[key];
      if (text.includes(keyword)) {
        const index = text.indexOf(keyword);
        const context = text.substring(Math.max(0, index - 10), Math.min(text.length, index + 60));
        console.log(`  文本中包含"${keyword}"，上下文: "${context}"`);
      }
    }
  }

  // 如果至少找到6个指标，认为提取成功
  if (foundCount >= 6) {
    return metricsData as AnalysisMetrics;
  }

  console.warn('提取失败：指标数量不足');
  return null;
};

// 从文本中移除量化指标部分（更强大的过滤）
const removeMetricsFromText = (text: string): string => {
  // 方法1: 查找"详细分析："标题，移除之前的所有内容
  const detailedAnalysisIndex = text.indexOf('详细分析：');
  if (detailedAnalysisIndex !== -1) {
    // 从"详细分析："之后开始（包含标题）
    const result = text.substring(detailedAnalysisIndex).trim();
    return result;
  } else {
    return "";
  }
};

// 判断指标是否在理想范围内
const isInIdealRange = (value: number, ideal: { min: number; max: number }): boolean => {
  return value >= ideal.min && value <= ideal.max;
};

// 获取指标状态颜色
const getMetricColor = (value: number, ideal: { min: number; max: number }) => {
  if (isInIdealRange(value, ideal)) {
    return 'text-green-600 bg-green-50 border-green-200';
  } else if (value < ideal.min - 20 || value > ideal.max + 20) {
    return 'text-red-600 bg-red-50 border-red-200';
  } else {
    return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  }
};

// 获取指标进度条颜色
const getMetricBarColor = (value: number, ideal: { min: number; max: number }): string => {
  if (isInIdealRange(value, ideal)) {
    return '#22c55e'; // green
  } else if (value < ideal.min - 20 || value > ideal.max + 20) {
    return '#ef4444'; // red
  } else {
    return '#eab308'; // yellow
  }
};

// 获取评分等级
const getScoreLevel = (score: number): string => {
  if (score >= 80) return '高度AI化';
  if (score >= 60) return '明显AI特征';
  if (score >= 40) return '中等AI特征';
  if (score >= 20) return '轻微AI特征';
  return '接近人类写作';
};

// 获取评分描述
const getScoreDescription = (score: number): string => {
  if (score >= 80) return '文本具有非常明显的AI生成特征，建议进行深度改写';
  if (score >= 60) return '文本有较多AI痕迹，建议进行改写优化';
  if (score >= 40) return '文本有一定AI特征，可适当调整表达方式';
  if (score >= 20) return '文本较为自然，仅有少量AI特征';
  return '文本表达自然流畅，接近人类写作风格';
};

// 获取评分颜色
const getScoreColor = (score: number) => {
  if (score >= 80) return { text: 'text-red-600', border: 'border-red-200' };
  if (score >= 60) return { text: 'text-orange-600', border: 'border-orange-200' };
  if (score >= 40) return { text: 'text-yellow-600', border: 'border-yellow-200' };
  if (score >= 20) return { text: 'text-blue-600', border: 'border-blue-200' };
  return { text: 'text-green-600', border: 'border-green-200' };
};

// 获取评分图标
const getScoreIcon = (score: number): string => {
  if (score >= 80) return 'mdi:alert-circle';
  if (score >= 60) return 'mdi:alert';
  if (score >= 40) return 'mdi:information';
  if (score >= 20) return 'mdi:check-circle';
  return 'mdi:check-circle';
};

// 监听 aiScore 变化，渲染饼图
watch(aiScore, (newScore) => {
  if (newScore !== null) {
    nextTick(() => {
      renderPieChart(newScore);
    });
  }
});

// 窗口大小变化时重新渲染
onMounted(() => {
  window.addEventListener('resize', () => {
    if (chartInstance) {
      chartInstance.resize();
    }
  });
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose();
  }
  window.removeEventListener('resize', () => { });
});

// 渲染 Markdown
const renderMarkdown = (content: string) => {
  let html = marked(content) as string;

  // 替换代码块，添加语言标签和复制按钮
  html = html.replace(/<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g, (_match, language, code) => {
    return `
      <pre><div class="flex items-center justify-between px-4 py-2 text-xs bg-gray-100">
        <span>${language}</span>
        <button class="copy-btn" data-clipboard-text="${code}">复制</button>
      </div><code class="language-${language}">${code}</code></pre>
    `;
  });

  // 高亮代码块
  nextTick(() => {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach((block: any) => {
      if (!block.hasAttribute('data-highlighted')) {
        hljs.highlightBlock(block);
      }
    });
  });

  return html;
};

// 分析AI写作风格
const analyzeStyle = async () => {
  if (!inputText.value.trim()) return;

  isAnalyzing.value = true;
  analysisResult.value = '';
  aiScore.value = null;
  metrics.value = null;

  try {
    const response = await fetch(import.meta.env.APP_API_BASE_URL + '/chat/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        context: [
          {
            role: 'system',
            content: `你是一个专业的AI写作风格分析专家。请按以下格式分析文本：

第一部分（量化指标，必须严格按照以下格式，每行一个指标）：
AI化程度：XX分
用词正式度：XX分
句式复杂度：XX分
逻辑结构化：XX分
情感表达度：XX分
个人风格化：XX分
自然过渡度：XX分
词汇多样性：XX分
模板化程度：XX分

详细分析：
1. 用词特征分析
2. 句式结构分析
3. 逻辑组织分析
4. 情感表达分析
5. 改进建议

评分标准：
- 用词正式度：0-100分，30-60为理想范围（过高表示过于书面化）
- 句式复杂度：0-100分，40-70为理想范围（过高表示过于工整）
- 逻辑结构化：0-100分，50-80为理想范围（过高表示过于程式化）
- 情感表达度：0-100分，60-100为理想范围（越高越好）
- 个人风格化：0-100分，60-100为理想范围（越高越好）
- 自然过渡度：0-100分，70-100为理想范围（越高越好）
- 词汇多样性：0-100分，60-100为理想范围（越高越好）
- 模板化程度：0-100分，0-30为理想范围（越低越好）

重要：
1. 必须在开头就给出所有9个量化指标，格式必须严格遵守"指标名：XX分"
2. 量化指标后必须写"详细分析："作为标题（注意冒号）
3. 所有指标都必须给出具体分数，不能遗漏`,
            reasoning_content: ''
          },
          {
            role: 'user',
            content: `请分析以下文本的AI写作风格特征：\n\n${inputText.value}`,
            reasoning_content: ''
          }
        ],
        model: 'deepseek-chat',
        temperature: 1.0
      })
    });

    const reader = response.body?.getReader();
    if (!reader) throw new Error('无法读取响应');

    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let detailedAnalysisStarted = false;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data:')) {
          const jsonString = line.replace('data: ', '').trim();
          if (jsonString === '[DONE]') continue;

          try {
            const data = JSON.parse(jsonString);
            const content = data?.choices?.[0]?.delta?.content || '';
            if (content) {
              analysisResult.value += content;

              // 检测是否出现"详细分析"标题
              if (!detailedAnalysisStarted && analysisResult.value.includes('详细分析')) {
                detailedAnalysisStarted = true;

                // 一次性提取所有指标
                if (aiScore.value === null) {
                  const score = extractAIScore(analysisResult.value);
                  if (score !== null) {
                    aiScore.value = score;
                  }
                }

                if (metrics.value === null) {
                  const extractedMetrics = extractMetrics(analysisResult.value);
                  if (extractedMetrics) {
                    metrics.value = extractedMetrics;
                  }
                }
              }
            }
          } catch (e) {
            console.error('解析错误:', e);
          }
        }
      }
    }

    // 如果前面没有提取到，尝试从完整文本中提取
    if (aiScore.value === null) {
      const score = extractAIScore(analysisResult.value);
      aiScore.value = score !== null ? score : 50;
    }

    if (metrics.value === null) {
      const extractedMetrics = extractMetrics(analysisResult.value);
      if (extractedMetrics) {
        metrics.value = extractedMetrics;
      } else {
        console.warn('未能提取到指标');
      }
    }
  } catch (error) {
    analysisResult.value = '分析失败，请稍后重试';
  } finally {
    isAnalyzing.value = false;
  }
};

// 按场景改写文本
const rewriteText = async () => {
  if (!inputText.value.trim()) return;

  isRewriting.value = true;
  rewrittenText.value = '';

  try {
    const scenePrompt = scenePrompts[selectedScene.value];

    const response = await fetch(import.meta.env.APP_API_BASE_URL + '/chat/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        context: [
          {
            role: 'system',
            content: `你是一个专业的文本改写专家。请将AI生成的文本改写为更自然、更人性化的表达。改写要求：${scenePrompt}。注意：1. 保持原文核心意思不变 2. 去除AI痕迹和模板化表达 3. 增加自然过渡和个人色彩 4. 使用更生动、更贴近人类的表达方式 5. 直接输出改写后的文本，不要添加任何解释说明。`,
            reasoning_content: ''
          },
          {
            role: 'user',
            content: `请将以下文本改写为${scenes.find(s => s.value === selectedScene.value)?.label}风格：\n\n${inputText.value}`,
            reasoning_content: ''
          }
        ],
        model: 'deepseek-chat',
        temperature: 1.3
      })
    });

    const reader = response.body?.getReader();
    if (!reader) throw new Error('无法读取响应');

    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data:')) {
          const jsonString = line.replace('data: ', '').trim();
          if (jsonString === '[DONE]') continue;

          try {
            const data = JSON.parse(jsonString);
            const content = data?.choices?.[0]?.delta?.content || '';
            if (content) {
              rewrittenText.value += content;
            }
          } catch (e) {
            console.error('解析错误:', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('改写失败:', error);
    rewrittenText.value = '改写失败，请稍后重试';
  } finally {
    isRewriting.value = false;
  }
};

// 复制到剪贴板
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(rewrittenText.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (error) {
    console.error('复制失败:', error);
  }
};
</script>

<style scoped>
.prose {
  max-width: 100%;
}

/* Markdown 样式 */
.markdown :deep(h1),
.markdown :deep(h2),
.markdown :deep(h3),
.markdown :deep(h4),
.markdown :deep(h5),
.markdown :deep(h6) {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 600;
  line-height: 1.25;
}

.markdown :deep(h1) {
  font-size: 1.875rem;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.markdown :deep(h2) {
  font-size: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.markdown :deep(h3) {
  font-size: 1.25rem;
}

.markdown :deep(p) {
  margin-top: 0.75em;
  margin-bottom: 0.75em;
  line-height: 1.75;
}

.markdown :deep(ul),
.markdown :deep(ol) {
  margin-top: 0.75em;
  margin-bottom: 0.75em;
  padding-left: 1.5em;
}

.markdown :deep(li) {
  margin-top: 0.25em;
  margin-bottom: 0.25em;
}

.markdown :deep(code) {
  background-color: #f3f4f6;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
  font-family: 'Courier New', monospace;
}

.markdown :deep(pre) {
  background-color: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
  margin-top: 1em;
  margin-bottom: 1em;
}

.markdown :deep(pre code) {
  background-color: transparent;
  padding: 0;
  border-radius: 0;
  font-size: 0.875rem;
}

.markdown :deep(blockquote) {
  border-left: 4px solid #e5e7eb;
  padding-left: 1rem;
  margin-left: 0;
  margin-top: 1em;
  margin-bottom: 1em;
  color: #6b7280;
  font-style: italic;
}

.markdown :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1em;
  margin-bottom: 1em;
}

.markdown :deep(th),
.markdown :deep(td) {
  border: 1px solid #e5e7eb;
  padding: 0.5rem 1rem;
  text-align: left;
}

.markdown :deep(th) {
  background-color: #f9fafb;
  font-weight: 600;
}

.markdown :deep(a) {
  color: #3b82f6;
  text-decoration: underline;
}

.markdown :deep(a:hover) {
  color: #2563eb;
}

.markdown :deep(strong) {
  font-weight: 600;
}

.markdown :deep(em) {
  font-style: italic;
}

.markdown :deep(hr) {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin-top: 2em;
  margin-bottom: 2em;
}

.markdown :deep(.copy-btn) {
  background-color: #3b82f6;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s;
}

.markdown :deep(.copy-btn:hover) {
  background-color: #2563eb;
}
</style>
