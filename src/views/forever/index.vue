<template>
  <main class="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-200">
    <!-- 左侧预览区域 -->
    <section class="flex-1 min-h-[60vh] p-5 flex items-center justify-center">
      <div class="w-full max-w-4xl h-96 rounded-xl overflow-hidden shadow-xl bg-white/80 backdrop-blur-sm">
        <DistortEffect 
          :text="currentText"
          :image-url="currentImageUrl"
          :background-color="currentBackgroundColor"
          :text-color="settings.textColor"
          :grid="settings.grid"
          :mouse-radius="settings.mouseRadius"
          :strength="settings.strength"
          :relaxation="settings.relaxation"
        />
      </div>
    </section>

    <!-- 右侧控制面板 -->
    <section class="bg-white/95 backdrop-blur-xl border-t border-gray-200 max-h-[40vh] overflow-y-auto">
      <div class="max-w-6xl mx-auto p-5">
        <h2 class="text-2xl font-bold text-gray-800 text-center mb-5">DistortEffect 组件设置</h2>
        
        <!-- Tab 切换 -->
        <div class="mb-6 p-4 bg-white/80 rounded-lg shadow-sm">
          <div class="flex border-b border-gray-200">
            <button 
              @click="activeTab = 'text'"
              :class="[
                'px-4 py-2 font-medium text-sm transition-colors',
                activeTab === 'text' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              文字模式
            </button>
            <button 
              @click="activeTab = 'image'"
              :class="[
                'px-4 py-2 font-medium text-sm transition-colors',
                activeTab === 'image' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              图片模式
            </button>
          </div>
        </div>
        
        <!-- 内容设置 -->
        <div class="mb-6 p-4 bg-white/80 rounded-lg shadow-sm">
          <h3 class="text-base font-semibold text-gray-700 mb-3 pb-1 border-b-2 border-gray-400">内容设置</h3>
          
          <!-- 文字模式 -->
          <div v-if="activeTab === 'text'">
            <div class="mb-3">
              <label class="block font-medium text-gray-600 mb-1">
                文字内容:
                <input 
                  v-model="settings.text" 
                  type="text"
                  placeholder="输入要显示的文字"
                  class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </label>
            </div>
            
            <!-- 文字颜色设置 -->
            <div class="mb-3">
              <label class="block font-medium text-gray-600 mb-1">
                文字颜色:
                <div class="flex gap-2 items-center mt-1">
                  <input 
                    v-model="settings.textColor" 
                    type="color"
                    class="w-10 h-10 border-none rounded cursor-pointer"
                  />
                  <input 
                    v-model="settings.textColor" 
                    type="text"
                    placeholder="如: #ffffff"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </label>
            </div>
          </div>
          
          <!-- 图片模式 -->
          <div v-if="activeTab === 'image'">
            <div class="mb-3">
              <label class="block font-medium text-gray-600 mb-1">
                图片上传:
                <div class="mt-1">
                  <input 
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    @change="handleImageUpload"
                    class="hidden"
                  />
                  <div class="flex gap-2">
                    <button 
                      @click="fileInput?.click()"
                      class="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm transition-colors"
                    >
                      选择图片
                    </button>
                    <button 
                      v-if="settings.imageUrl"
                      @click="clearImage"
                      class="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm transition-colors"
                    >
                      清除图片
                    </button>
                  </div>
                  <p v-if="settings.imageUrl" class="text-xs text-gray-500 mt-1">
                    {{ settings.imageUrl.startsWith('data:') ? '已上传图片' : '外部图片链接' }}
                  </p>
                </div>
              </label>
            </div>
            <div class="mb-3">
              <label class="block font-medium text-gray-600 mb-1">
                或输入图片URL:
                <input 
                  v-model="settings.imageUrl" 
                  type="url"
                  placeholder="输入图片地址"
                  class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </label>
            </div>
          </div>
        </div>

        <!-- 共通设置 - 背景颜色（仅文字模式） -->
        <div v-if="activeTab === 'text'" class="mb-6 p-4 bg-white/80 rounded-lg shadow-sm">
          <h3 class="text-base font-semibold text-gray-700 mb-3 pb-1 border-b-2 border-gray-400">背景设置</h3>
          <div class="mb-3">
            <label class="block font-medium text-gray-600 mb-1">
              背景颜色:
              <div class="flex gap-2 items-center mt-1">
                <input 
                  v-model="settings.backgroundColor" 
                  type="color"
                  class="w-10 h-10 border-none rounded cursor-pointer"
                />
                <input 
                  v-model="settings.backgroundColor" 
                  type="text"
                  placeholder="如: #000000 或 transparent"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <button 
                  @click="settings.backgroundColor = 'transparent'"
                  class="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-xs text-gray-600 hover:bg-gray-200 hover:border-gray-400 transition-colors"
                >
                  透明
                </button>
              </div>
            </label>
          </div>
        </div>

        <!-- 效果参数 -->
        <div class="mb-6 p-4 bg-white/80 rounded-lg shadow-sm">
          <h3 class="text-base font-semibold text-gray-700 mb-3 pb-1 border-b-2 border-gray-400">扭曲效果参数</h3>
          <div class="mb-3">
            <label class="block font-medium text-gray-600 mb-1">
              网格密度: {{ settings.grid }}
              <input 
                v-model.number="settings.grid" 
                type="range"
                min="3"
                max="50"
                step="1"
                class="w-full mt-1"
              />
            </label>
          </div>
          <div class="mb-3">
            <label class="block font-medium text-gray-600 mb-1">
              鼠标影响半径: {{ settings.mouseRadius.toFixed(2) }}
              <input 
                v-model.number="settings.mouseRadius" 
                type="range"
                min="0.05"
                max="1.0"
                step="0.01"
                class="w-full mt-1"
              />
            </label>
          </div>
          <div class="mb-3">
            <label class="block font-medium text-gray-600 mb-1">
              扭曲强度: {{ settings.strength.toFixed(2) }}
              <input 
                v-model.number="settings.strength" 
                type="range"
                min="0.01"
                max="1.0"
                step="0.01"
                class="w-full mt-1"
              />
            </label>
          </div>
          <div class="mb-3">
            <label class="block font-medium text-gray-600 mb-1">
              恢复速度: {{ settings.relaxation.toFixed(2) }}
              <input 
                v-model.number="settings.relaxation" 
                type="range"
                min="0.5"
                max="0.999"
                step="0.001"
                class="w-full mt-1"
              />
            </label>
          </div>
        </div>

        <!-- 预设按钮（仅文字模式） -->
        <div v-if="activeTab === 'text'" class="mb-6 p-4 bg-white/80 rounded-lg shadow-sm">
          <h3 class="text-base font-semibold text-gray-700 mb-3 pb-1 border-b-2 border-gray-400">快速预设</h3>
          <div class="flex gap-2 flex-wrap">
            <button @click="applyPreset('default')" class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md text-sm transition-all hover:-translate-y-0.5 hover:shadow-md">默认</button>
            <button @click="applyPreset('neon')" class="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md text-sm transition-all hover:-translate-y-0.5 hover:shadow-md">霓虹</button>
            <button @click="applyPreset('classic')" class="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-md text-sm transition-all hover:-translate-y-0.5 hover:shadow-md">经典</button>
            <button @click="applyPreset('minimal')" class="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-md text-sm transition-all hover:-translate-y-0.5 hover:shadow-md">简约</button>
            <button @click="applyPreset('fire')" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition-all hover:-translate-y-0.5 hover:shadow-md">火焰</button>
            <button @click="applyPreset('ocean')" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm transition-all hover:-translate-y-0.5 hover:shadow-md">海洋</button>
            <button @click="applyPreset('forest')" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-all hover:-translate-y-0.5 hover:shadow-md">森林</button>
            <button @click="applyPreset('sunset')" class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm transition-all hover:-translate-y-0.5 hover:shadow-md">日落</button>
            <button @click="applyPreset('galaxy')" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm transition-all hover:-translate-y-0.5 hover:shadow-md">星系</button>
            <button @click="applyPreset('retro')" class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-sm transition-all hover:-translate-y-0.5 hover:shadow-md">复古</button>
            <button @click="applyPreset('cyberpunk')" class="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-md text-sm transition-all hover:-translate-y-0.5 hover:shadow-md">赛博朋克</button>
            <button @click="applyPreset('elegant')" class="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md text-sm transition-all hover:-translate-y-0.5 hover:shadow-md">优雅</button>
          </div>
        </div>

        <!-- 导出配置 -->
        <div class="mb-6 p-4 bg-white/80 rounded-lg shadow-sm">
          <h3 class="text-base font-semibold text-gray-700 mb-3 pb-1 border-b-2 border-gray-400">配置管理</h3>
          <div class="flex gap-2 flex-wrap">
            <button @click="exportConfig" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors">导出配置</button>
            <button @click="importConfig" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors">导入配置</button>
            <button @click="resetConfig" class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md text-sm transition-colors">重置</button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'

// 文件输入框引用
const fileInput = ref<HTMLInputElement>()

// 当前激活的 Tab
const activeTab = ref<'text' | 'image'>('text')

// 监听 Tab 切换，设置默认图片
watch(activeTab, (newTab) => {
  if (newTab === 'image' && !settings.imageUrl) {
    // 使用 Lorem Picsum 随机图片
    const width = 800
    const height = 600
    const randomId = Math.floor(Math.random() * 1000) + 1
    settings.imageUrl = `https://picsum.photos/${width}/${height}?random=${randomId}`
  }
})

// 计算属性：根据当前 Tab 决定传给组件的内容
const currentText = computed(() => activeTab.value === 'text' ? settings.text : '')
const currentImageUrl = computed(() => activeTab.value === 'image' ? settings.imageUrl : '')
const currentBackgroundColor = computed(() => activeTab.value === 'text' ? settings.backgroundColor : 'transparent')

// 设置状态
const settings = reactive({
  text: 'PEACH',
  imageUrl: '',
  backgroundColor: '#000000',
  textColor: '#ffffff',
  grid: 15,
  mouseRadius: 0.25,
  strength: 0.15,
  relaxation: 0.9
})

// 预设配置
const presets = {
  default: {
    text: 'PEACH',
    imageUrl: '',
    backgroundColor: 'transparent',
    textColor: 'rgba(255, 255, 255, 0.9)',
    grid: 15,
    mouseRadius: 0.25,
    strength: 0.15,
    relaxation: 0.9
  },
  neon: {
    text: 'NEON',
    imageUrl: '',
    backgroundColor: '#000011',
    textColor: '#00ffff',
    grid: 20,
    mouseRadius: 0.3,
    strength: 0.25,
    relaxation: 0.85
  },
  classic: {
    text: 'CLASSIC',
    imageUrl: '',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    grid: 12,
    mouseRadius: 0.2,
    strength: 0.1,
    relaxation: 0.95
  },
  minimal: {
    text: 'MINIMAL',
    imageUrl: '',
    backgroundColor: 'transparent',
    textColor: '#333333',
    grid: 10,
    mouseRadius: 0.15,
    strength: 0.08,
    relaxation: 0.98
  },
  fire: {
    text: 'FIRE',
    imageUrl: '',
    backgroundColor: '#1a0000',
    textColor: '#ff4500',
    grid: 18,
    mouseRadius: 0.35,
    strength: 0.3,
    relaxation: 0.82
  },
  ocean: {
    text: 'OCEAN',
    imageUrl: '',
    backgroundColor: '#001122',
    textColor: '#00bfff',
    grid: 16,
    mouseRadius: 0.28,
    strength: 0.18,
    relaxation: 0.92
  },
  forest: {
    text: 'FOREST',
    imageUrl: '',
    backgroundColor: '#0d1b0d',
    textColor: '#32cd32',
    grid: 14,
    mouseRadius: 0.22,
    strength: 0.12,
    relaxation: 0.94
  },
  sunset: {
    text: 'SUNSET',
    imageUrl: '',
    backgroundColor: '#2d1b00',
    textColor: '#ffa500',
    grid: 17,
    mouseRadius: 0.26,
    strength: 0.16,
    relaxation: 0.88
  },
  galaxy: {
    text: 'GALAXY',
    imageUrl: '',
    backgroundColor: '#0a0a1a',
    textColor: '#9370db',
    grid: 22,
    mouseRadius: 0.32,
    strength: 0.28,
    relaxation: 0.86
  },
  retro: {
    text: 'RETRO',
    imageUrl: '',
    backgroundColor: '#2d1810',
    textColor: '#ffb347',
    grid: 13,
    mouseRadius: 0.24,
    strength: 0.14,
    relaxation: 0.91
  },
  cyberpunk: {
    text: 'CYBER',
    imageUrl: '',
    backgroundColor: '#0f0f23',
    textColor: '#ff00ff',
    grid: 25,
    mouseRadius: 0.4,
    strength: 0.35,
    relaxation: 0.8
  },
  elegant: {
    text: 'ELEGANT',
    imageUrl: '',
    backgroundColor: '#f8f8ff',
    textColor: '#4b0082',
    grid: 11,
    mouseRadius: 0.18,
    strength: 0.09,
    relaxation: 0.96
  }
}

// 应用预设
const applyPreset = (presetName: keyof typeof presets) => {
  const preset = presets[presetName]
  Object.assign(settings, preset)
  
  // 根据预设内容自动切换 Tab
  if (preset.imageUrl) {
    activeTab.value = 'image'
  } else {
    activeTab.value = 'text'
  }
}

// 处理图片上传
const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件')
      return
    }
    
    // 检查文件大小（限制为5MB）
    if (file.size > 5 * 1024 * 1024) {
      alert('图片文件不能超过5MB')
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      settings.imageUrl = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// 清除图片
const clearImage = () => {
  settings.imageUrl = ''
  // 清除文件输入框的值
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 导出配置
const exportConfig = () => {
  const config = JSON.stringify(settings, null, 2)
  const blob = new Blob([config], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'trae-config.json'
  a.click()
  URL.revokeObjectURL(url)
}

// 导入配置
const importConfig = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target?.result as string)
          Object.assign(settings, config)
        } catch (error) {
          alert('配置文件格式错误')
        }
      }
      reader.readAsText(file)
    }
  }
  input.click()
}

// 重置配置
const resetConfig = () => {
  if (confirm('确定要重置所有设置吗？')) {
    applyPreset('default')
  }
}
</script>

<style lang="scss" scoped>
/* 响应式设计 */
@media (max-width: 768px) {
  .flex-col {
    flex-direction: column;
  }
}
</style>