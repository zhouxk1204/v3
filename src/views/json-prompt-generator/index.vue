<template>
  <div class="overflow-auto px-4 py-8 h-screen bg-gray-50">
    <div class="mx-auto max-w-[1024px]">
      <!-- 标题 -->
      <div class="mb-8 text-center">
        <h1 class="mb-2 text-3xl font-bold text-gray-800">JSON Prompt 生成器</h1>
        <p class="text-gray-600">输入您的提示词，点击生成按钮优化</p>
      </div>

      <!-- 主内容区：单张卡片 -->
      <div class="p-8 bg-white rounded-2xl shadow-xl">
        <div class="grid grid-cols-2 gap-8">
          <!-- 左侧：输入区 -->
          <div>
            <div class="flex gap-2 items-center mb-4">
              <h2 class="text-xl font-bold text-gray-800">输入提示词</h2>
            </div>
            <div class="mb-6 h-px bg-gray-200"></div>

            <div class="mb-6">
              <div class="flex justify-between items-center mb-2">
                <label class="block text-sm font-medium text-gray-700">
                  描述你想要的生成的内容
                </label>
                <button
                  @click="clearInput"
                  :disabled="!naturalLanguageInput.trim() || isGenerating"
                  class="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 hover:border-red-400 transition-all disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed disabled:hover:bg-white shadow-sm"
                >
                  <Icon icon="ep:delete" width="16" />
                  <span>清空</span>
                </button>
              </div>
              <textarea
                v-model="naturalLanguageInput"
                placeholder="例如：创建一个肾结石饮食分析的 Prompt，需要分析用户的饮食记录，输出风险评分和改善建议..."
                class="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono text-sm"
                :disabled="isGenerating"
              ></textarea>
            </div>

            <!-- 模式选择 -->
            <div class="mb-6">
              <div class="flex overflow-hidden rounded-lg border border-gray-200 shadow-sm w-full">
                <button
                  @click="selectedMode = 'fast'"
                  :class="[
                    'flex-1 flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium transition-all border-r border-gray-200',
                    selectedMode === 'fast'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]"
                  :disabled="isGenerating"
                >
                  <Icon icon="ep:lightning" width="18" />
                  <span>快速模式</span>
                </button>
                <button
                  @click="selectedMode = 'pro'"
                  :class="[
                    'flex-1 flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium transition-all',
                    selectedMode === 'pro'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]"
                  :disabled="isGenerating"
                >
                  <Icon icon="ep:setting" width="18" />
                  <span>专业模式</span>
                </button>
              </div>
              <p class="mt-2 text-xs text-gray-500 text-center">
                {{ selectedMode === 'fast' ? '快速模式：生成简化的 JSON 结构（task、instruction、output_format）' : '专业模式：生成完整的 JSON 结构（meta、execution、model_requirements、roles、constraints、output_schema）' }}
              </p>
            </div>

            <!-- 生成按钮 -->
            <button
              @click="generatePrompt"
              :disabled="isGenerating || !naturalLanguageInput.trim()"
              class="w-full flex gap-2 justify-center items-center px-8 py-3 font-medium text-white bg-indigo-600 rounded-lg transition-all hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              <Icon v-if="!isGenerating" icon="ep:magic-stick" width="20" />
              <span v-if="isGenerating" class="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>{{ isGenerating ? '生成中...' : '生成 JSON Prompt' }}</span>
            </button>
          </div>

          <!-- 右侧：JSON 预览区 -->
          <div class="relative">
            <div class="flex gap-2 items-center mb-4">
              <h2 class="text-xl font-bold text-gray-800">生成结果</h2>
            </div>
            <div class="mb-6 h-px bg-gray-200"></div>

            <div class="mb-6">
              <div class="flex justify-between items-center mb-2">
                <label class="block text-sm font-medium text-gray-700">
                  生成的 JSON Prompt 可编辑
                </label>
                <button
                  @click="clearOutput"
                  :disabled="!jsonPrompt.trim() || isGenerating"
                  class="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 hover:border-red-400 transition-all disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed disabled:hover:bg-white shadow-sm"
                >
                  <Icon icon="ep:delete" width="16" />
                  <span>清空</span>
                </button>
              </div>
              <div class="relative">
                <textarea
                  v-model="jsonPrompt"
                  placeholder="生成的 JSON Prompt 将显示在这里..."
                  class="w-full h-64 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono text-sm bg-gray-50"
                  :class="{ 'border-red-500': jsonPrompt && !isValidJSON, 'border-gray-300': !jsonPrompt || isValidJSON }"
                  :disabled="isGenerating"
                ></textarea>

                <!-- 生成中的遮罩和 Loading -->
                <div
                  v-if="isGenerating"
                  class="absolute inset-0 bg-gray-100 bg-opacity-95 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg border border-gray-300"
                >
                  <div class="inline-block w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p class="text-gray-700 font-medium">正在生成 JSON Prompt...</p>
                  <p class="text-sm text-gray-500 mt-2">请稍候</p>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex gap-3 mb-6">
              <button
                @click="copyJSON"
                :disabled="!jsonPrompt || isGenerating"
                class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                <Icon icon="ep:document-copy" width="18" />
                <span>复制</span>
              </button>
              <button
                @click="exportTS"
                :disabled="!jsonPrompt || !isValidJSON || isGenerating"
                class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                <Icon icon="ep:download" width="18" />
                <span>导出 TS 文件</span>
              </button>
              <button
                @click="testPrompt"
                :disabled="!jsonPrompt || !isValidJSON || isGenerating"
                class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                <Icon icon="ep:promotion" width="18" />
                <span>测试提示词</span>
              </button>
            </div>

            <button
              @click="validateJSON"
              :disabled="!jsonPrompt || isGenerating"
              class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              <Icon icon="ep:circle-check" width="18" />
              <span>校验 JSON</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { chatCompletions } from '@/api/deepseek/index.api'
import { Icon } from '@iconify/vue'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

type Mode = 'fast' | 'pro'

const selectedMode = ref<Mode>('fast')
const naturalLanguageInput = ref('')
const jsonPrompt = ref('')
const isGenerating = ref(false)
const isValidJSON = ref(true)

// 清空输入
const clearInput = () => {
  naturalLanguageInput.value = ''
}

// 清空输出
const clearOutput = () => {
  jsonPrompt.value = ''
  isValidJSON.value = true
}

// 复制 JSON
const copyJSON = async () => {
  if (!jsonPrompt.value) {
    ElMessage.warning('没有可复制的内容')
    return
  }

  try {
    await navigator.clipboard.writeText(jsonPrompt.value)
    ElMessage({
      message: '已复制到剪贴板',
      type: 'success',
      icon: 'CircleCheck'
    })
  } catch (error: any) {
    ElMessage.error('复制失败')
  }
}

// 生成系统 Prompt
const buildSystemPrompt = (mode: Mode): string => {
  const basePrompt = `你是 Prompt Compiler，负责把自然语言转换为 STRICT JSON。

核心规则：
1. 只输出 JSON，不允许任何解释文字
2. JSON 必须合法且可解析
3. 不要使用 markdown 代码块包裹`

  if (mode === 'fast') {
    return `${basePrompt}

输出结构（fast 模式）：
{
  "task": "任务描述",
  "instruction": "详细指令",
  "output_format": "输出格式说明"
}`
  } else {
    return `${basePrompt}

输出结构（pro 模式）：
{
  "meta": {
    "version": "1.0",
    "mode": "pro"
  },
  "execution": {
    "policy": "suggested",
    "temperature": 0.3,
    "max_tokens": 2000
  },
  "model_requirements": {
    "reasoning": "medium",
    "speed": "normal"
  },
  "roles": {
    "system": "系统角色描述",
    "user_template": "用户输入模板"
  },
  "constraints": ["约束1", "约束2"],
  "output_schema": {
    "字段名": "类型和说明"
  }
}`
  }
}

// 生成 JSON Prompt
const generatePrompt = async () => {
  if (!naturalLanguageInput.value.trim()) {
    ElMessage.warning('请输入自然语言描述')
    return
  }

  isGenerating.value = true

  try {
    const response = await chatCompletions({
      context: [
        {
          role: 'system',
          content: buildSystemPrompt(selectedMode.value)
        },
        {
          role: 'user',
          content: naturalLanguageInput.value
        }
      ],
      model: 'deepseek-chat',
      temperature: 0.3
    }, 60000)

    let content = response?.choices?.[0]?.message?.content || ''
    
    if (!content) {
      throw new Error('未收到有效响应')
    }

    // 尝试提取 JSON（可能被包裹在 markdown 代码块中）
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/)
    if (jsonMatch) {
      content = jsonMatch[1].trim()
    }

    // 验证 JSON
    JSON.parse(content)
    
    jsonPrompt.value = content
    isValidJSON.value = true
    ElMessage({
      message: '生成成功',
      type: 'success',
      icon: 'CircleCheck'
    })

  } catch (error: any) {
    console.error('生成失败:', error)
    ElMessage.error('生成失败，请重试')
  } finally {
    isGenerating.value = false
  }
}

// 校验 JSON
const validateJSON = () => {
  if (!jsonPrompt.value.trim()) {
    ElMessage.warning('JSON 内容为空')
    return
  }

  try {
    JSON.parse(jsonPrompt.value)
    isValidJSON.value = true
    ElMessage({
      message: 'JSON 格式正确',
      type: 'success',
      icon: 'CircleCheck'
    })
  } catch (error: any) {
    isValidJSON.value = false
    ElMessage.error('JSON 格式错误')
  }
}

// 导出 TS 文件
const exportTS = () => {
  if (!jsonPrompt.value || !isValidJSON.value) {
    ElMessage.warning('请先生成并校验 JSON')
    return
  }

  try {
    const json = JSON.parse(jsonPrompt.value)
    const tsContent = `export const buildPrompt = () => {
  return ${JSON.stringify(json, null, 2)}
}
`

    // 创建下载
    const blob = new Blob([tsContent], { type: 'text/typescript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'prompt.ts'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    ElMessage({
      message: '导出成功',
      type: 'success',
      icon: 'CircleCheck'
    })
  } catch (error: any) {
    ElMessage.error('导出失败')
  }
}

// 测试提示词
const testPrompt = () => {
  if (!jsonPrompt.value || !isValidJSON.value) {
    ElMessage.warning('请先生成并校验 JSON')
    return
  }

  try {
    // 将 JSON 格式化为字符串，作为测试内容
    const json = JSON.parse(jsonPrompt.value)
    const formattedPrompt = JSON.stringify(json, null, 2)
    
    // 跳转到 peach-ai 页面，并通过 query 传递数据
    router.push({
      path: '/peach-ai',
      query: {
        prompt: formattedPrompt
      }
    })
  } catch (error: any) {
    ElMessage.error('JSON 格式错误，无法测试')
  }
}
</script>
