<template>
  <div class="bg-gradient-to-br from-slate-50 to-blue-50 h-screen overflow-auto">
    <div class="max-w-4xl mx-auto py-8 px-4 pb-32">
      <!-- 头部标题 -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-3 mb-4">
          <div class="text-4xl">🎬</div>
          <div>
            <h1 class="text-3xl font-bold text-gray-800">SRT 字幕翻译</h1>
            <p class="text-gray-500 text-sm mt-1">日文 → 中文 AI 智能翻译</p>
          </div>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div class="space-y-8">
        <!-- 输入区域 -->
        <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
            <h3 class="text-xl font-semibold text-gray-800">导入字幕文件</h3>
          </div>
          
          <!-- 文件上传区域 -->
          <div 
            class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 mb-6"
            @click="triggerFileInput" 
            @dragover.prevent 
            @drop.prevent="handleDrop"
          >
            <input 
              ref="fileInput" 
              type="file" 
              accept=".srt" 
              @change="handleFileUpload" 
              class="hidden"
            />
            <div class="text-4xl mb-3">📁</div>
            <p class="text-gray-700 font-medium mb-1">点击选择 SRT 文件或拖拽到此处</p>
            <p class="text-gray-500 text-sm">支持 .srt 格式文件</p>
          </div>

          <!-- SRT 文本输入 -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">或直接粘贴 SRT 内容</label>
            <textarea 
              v-model="srtText" 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
              placeholder="粘贴日文 SRT 字幕内容..."
              rows="6"
            />
          </div>

          <!-- 时间轴校对开关 -->
          <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <span class="text-lg">⏱️</span>
                <label class="text-sm font-medium text-gray-700">时间轴校对</label>
              </div>
              <button
                @click="enableFrameRateConversion = !enableFrameRateConversion"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  enableFrameRateConversion ? 'bg-blue-500' : 'bg-gray-300'
                ]"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    enableFrameRateConversion ? 'translate-x-6' : 'translate-x-1'
                  ]"
                />
              </button>
            </div>
            
            <div v-if="enableFrameRateConversion" class="space-y-3 animate-fadeIn">
              <div class="flex items-center gap-4">
                <div class="flex-1">
                  <label class="block text-xs font-medium text-gray-600 mb-1">原始帧率 (fps)</label>
                  <input 
                    v-model.number="originalFps" 
                    type="number"
                    step="0.01"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                    placeholder="30"
                  />
                </div>
                <div class="flex-1">
                  <label class="block text-xs font-medium text-gray-600 mb-1">目标帧率 (fps)</label>
                  <input 
                    type="text"
                    value="29.97"
                    disabled
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-sm text-gray-600"
                  />
                </div>
              </div>
              <p class="text-xs text-gray-600">
                💡 翻译完成后将自动转换时间轴为 29.97 fps
              </p>
            </div>
          </div>

          <!-- 剧情摘要输入 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              剧情摘要 
              <span class="text-gray-500 font-normal">(可选，但推荐填写以提高翻译质量)</span>
            </label>
            <textarea 
              v-model="summaryJa" 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
              placeholder="粘贴日文剧情摘要，有助于提高翻译准确性..."
              rows="3"
            />
          </div>
        </div>

        <!-- 结果区域 -->
        <div v-if="resultSrt || isTranslating" class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
            <h3 class="text-xl font-semibold text-gray-800">翻译结果</h3>
          </div>
          
          <textarea 
            v-model="resultSrt" 
            class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            placeholder="翻译结果将显示在这里..."
            rows="8"
            readonly
          />

          <!-- 转换前后对比 -->
          <div v-if="beforeConversion" class="mt-6 space-y-4">
            <div class="border-t pt-4">
              <h4 class="text-sm font-semibold text-gray-700 mb-3">⏱️ 时间轴转换对比</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- 转换前 -->
                <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-red-600 font-semibold text-sm">转换前 ({{ originalFps }} fps)</span>
                  </div>
                  <div class="text-xs text-gray-700 font-mono whitespace-pre-wrap max-h-40 overflow-y-auto">{{ beforeConversion }}</div>
                </div>
                
                <!-- 转换后 -->
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-green-600 font-semibold text-sm">转换后 (29.97 fps)</span>
                  </div>
                  <div class="text-xs text-gray-700 font-mono whitespace-pre-wrap max-h-40 overflow-y-auto">{{ afterConversion }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作按钮区域 -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button 
            class="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 min-w-[200px]"
            :disabled="isTranslating || !srtText"
            @click="translateAll"
          >
            <span v-if="!isTranslating" class="flex items-center gap-2">
              <span class="text-xl">🚀</span>
              开始翻译
            </span>
            <span v-else class="flex items-center gap-2">
              <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              翻译中...
            </span>
          </button>

          <button 
            v-if="resultSrt && !isTranslating"
            class="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 min-w-[200px]"
            @click="downloadSrt"
          >
            <span class="text-xl">💾</span>
            下载中文字幕
          </button>
        </div>
      </div>
    </div>

    <!-- 全屏 Loading 遮罩 -->
    <div 
      v-if="isTranslating" 
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center">
        <!-- Loading 动画 -->
        <div class="mb-6">
          <div class="w-20 h-20 mx-auto mb-4 relative">
            <div class="w-full h-full border-4 border-blue-200 rounded-full"></div>
            <div class="absolute inset-0 w-full h-full border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <div class="text-2xl mb-2">🤖</div>
        </div>
        
        <!-- 状态信息 -->
        <div class="space-y-3">
          <h3 class="text-xl font-semibold text-gray-800">AI 正在翻译中...</h3>
          <p class="text-gray-600">请耐心等待，不要关闭页面</p>
          
          <!-- 提示信息 -->
          <div class="text-xs text-gray-500 mt-4 space-y-1">
            <p>💡 翻译质量取决于原文内容和剧情摘要</p>
            <p>⏱️ 翻译时间根据字幕长度而定</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { nextTick, ref } from "vue";
import { Temperature, useAiRequest } from "../ai2/useAiRequest";
import { buildTranslatePrompt } from "./utils/prompt";
import { buildSrt, chunkSrtWithContext, parseSrt } from "./utils/srt";

const srtText = ref("");
const summaryJa = ref("");
const resultSrt = ref("");
const isTranslating = ref(false);
const fileInput = ref<HTMLInputElement>();
const originalFps = ref(30);
const beforeConversion = ref("");
const afterConversion = ref("");
const enableFrameRateConversion = ref(false);

const { getResult, abortRequest } = useAiRequest();

function triggerFileInput() {
  fileInput.value?.click();
}

function handleFileUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  processFile(file);
}

function handleDrop(e: DragEvent) {
  const file = e.dataTransfer?.files?.[0];
  if (!file) return;
  processFile(file);
}

function processFile(file: File) {
  if (!file.name.endsWith('.srt')) {
    alert('请选择 .srt 格式的文件');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = () => {
    srtText.value = reader.result as string;
  };
  reader.readAsText(file, "utf-8");
}

async function translateAll() {
  if (!srtText.value) return alert("请先导入 SRT 文件");

  const entries = parseSrt(srtText.value);
  const chunks = chunkSrtWithContext(entries, 25, 5);

  isTranslating.value = true;
  resultSrt.value = "";
  
  // 强制更新 DOM
  await nextTick();

  const translatedParts: string[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const { context, chunk } = chunks[i];

    const contextSrtJa = buildSrt(context);
    const chunkSrtJa = buildSrt(chunk);

    let chunkResult = "";

    try {
      await getResult({
        body: {
          model: "deepseek-chat",
          temperature: Temperature.TRANSLATION,
          context: [
            {
              role: "user",
              content: buildTranslatePrompt(
                summaryJa.value,
                contextSrtJa,
                chunkSrtJa,
              ),
              reasoning_content: "",
            },
          ],
        },
        onProcess(contentChunk: string) {
          chunkResult += contentChunk;
        },
        onDone() {
          // 清理翻译结果中开头的括号内容，如 (笑) (惊讶) 等
          const cleanedResult = chunkResult.replace(/^(\d+\n[\d:,\s\->]+\n)\([^)]+\)\s*/gm, '$1');
          translatedParts.push(cleanedResult);
        },
        onError(err: string) {
          console.error("翻译失败：", err);
          alert("翻译失败：" + err);
          isTranslating.value = false;
          abortRequest();
          throw err; // 重新抛出错误以停止循环
        },
      });
    } catch (error) {
      // 如果出错，停止翻译
      return;
    }
  }

  resultSrt.value = translatedParts.join("\n\n");
  
  // 如果启用了时间轴校对，自动转换帧率
  if (enableFrameRateConversion.value) {
    await nextTick();
    convertFrameRate();
  }
  
  // 延迟一下再关闭 loading
  setTimeout(() => {
    isTranslating.value = false;
  }, 500);
}

function downloadSrt() {
  const blob = new Blob([resultSrt.value], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "translated_zh.srt";
  a.click();
  URL.revokeObjectURL(url);
}

function convertFrameRate() {
  if (!resultSrt.value) {
    if (!enableFrameRateConversion.value) {
      alert("请先翻译字幕");
    }
    return;
  }

  if (!originalFps.value || originalFps.value <= 0) {
    alert("请输入有效的原始帧率");
    return;
  }

  const targetFps = 29.97;
  const ratio = targetFps / originalFps.value;

  // 保存转换前的前几行用于对比
  const lines = resultSrt.value.split('\n');
  const previewLines = lines.slice(0, 10).join('\n');
  beforeConversion.value = previewLines;

  // 解析 SRT 内容
  const convertedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 检查是否是时间轴行 (格式: 00:00:00,000 --> 00:00:00,000)
    if (line.includes('-->')) {
      const [startTime, endTime] = line.split('-->').map(t => t.trim());
      const convertedStart = convertTimestamp(startTime, ratio);
      const convertedEnd = convertTimestamp(endTime, ratio);
      convertedLines.push(`${convertedStart} --> ${convertedEnd}`);
    } else {
      convertedLines.push(line);
    }
  }

  resultSrt.value = convertedLines.join('\n');
  
  // 保存转换后的前几行用于对比
  const afterLines = convertedLines.slice(0, 10).join('\n');
  afterConversion.value = afterLines;
  
  if (!enableFrameRateConversion.value) {
    alert(`时间轴已转换为 ${targetFps} fps`);
  }
}

function convertTimestamp(timestamp: string, ratio: number): string {
  // 解析时间戳 (格式: 00:00:00,000)
  const match = timestamp.match(/(\d{2}):(\d{2}):(\d{2}),(\d{3})/);
  if (!match) return timestamp;

  const hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const seconds = parseInt(match[3]);
  const milliseconds = parseInt(match[4]);

  // 转换为总毫秒数
  const totalMs = (hours * 3600 + minutes * 60 + seconds) * 1000 + milliseconds;

  // 应用帧率转换
  const newTotalMs = Math.round(totalMs * ratio);

  // 防止负时间
  if (newTotalMs < 0) {
    return "00:00:00,000";
  }

  // 转换回时:分:秒,毫秒格式
  const newHours = Math.floor(newTotalMs / 3600000);
  const newMinutes = Math.floor((newTotalMs % 3600000) / 60000);
  const newSeconds = Math.floor((newTotalMs % 60000) / 1000);
  const newMilliseconds = newTotalMs % 1000;

  // 格式化为两位数/三位数
  const hh = String(newHours).padStart(2, '0');
  const mm = String(newMinutes).padStart(2, '0');
  const ss = String(newSeconds).padStart(2, '0');
  const ms = String(newMilliseconds).padStart(3, '0');

  return `${hh}:${mm}:${ss},${ms}`;
}

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
</style>
