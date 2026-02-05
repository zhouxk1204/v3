<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
      <!-- 模态框头部 -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-800">
          {{ photo ? '编辑照片' : '添加新照片' }}
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- 表单内容 -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- 图片上传区域 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">照片</label>
          
          <!-- 图片预览 -->
          <div v-if="previewUrl" class="mb-4">
            <div class="relative inline-block">
              <img 
                :src="previewUrl" 
                alt="预览"
                class="w-32 h-32 object-cover rounded-lg shadow-md"
              />
              <button
                type="button"
                @click="removeImage"
                class="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <!-- 上传按钮 -->
          <div class="flex gap-2">
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleFileSelect"
              class="hidden"
            />
            <button
              type="button"
              @click="fileInput?.click()"
              class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              选择照片
            </button>
            <button
              type="button"
              @click="showUrlInput = !showUrlInput"
              class="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-3 px-4 rounded-lg transition-colors"
              title="使用网络图片"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </button>
          </div>
          
          <!-- URL输入框 -->
          <div v-if="showUrlInput" class="mt-3">
            <input
              v-model="imageUrl"
              type="url"
              placeholder="输入图片网址..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              @input="handleUrlInput"
            />
          </div>
        </div>

        <!-- 标题输入 -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">标题</label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            required
            placeholder="给你的照片起个名字..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <!-- 描述输入 -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">描述</label>
          <textarea
            id="description"
            v-model="formData.description"
            rows="3"
            placeholder="记录这一刻的故事..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          ></textarea>
        </div>

        <!-- 日期输入 -->
        <div>
          <label for="date" class="block text-sm font-medium text-gray-700 mb-2">拍摄日期</label>
          <input
            id="date"
            v-model="formData.date"
            type="date"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <!-- 按钮组 -->
        <div class="flex gap-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            :disabled="!previewUrl || !formData.title.trim()"
            class="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {{ photo ? '保存修改' : '添加照片' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'

interface Photo {
  id: string
  imageUrl: string
  title: string
  description: string
  date: string
  createdAt: number
}

// Props
const props = defineProps<{
  photo?: Photo | null
}>()

// Emits
const emit = defineEmits<{
  save: [photo: Omit<Photo, 'id' | 'createdAt'>]
  close: []
}>()

// 响应式数据
const fileInput = ref<HTMLInputElement>()
const previewUrl = ref('')
const imageUrl = ref('')
const showUrlInput = ref(false)

const formData = reactive({
  title: '',
  description: '',
  date: new Date().toISOString().split('T')[0]
})

// 处理文件选择
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        previewUrl.value = e.target?.result as string
      }
      reader.readAsDataURL(file)
    } else {
      alert('请选择图片文件')
    }
  }
}

// 处理URL输入
const handleUrlInput = () => {
  if (imageUrl.value.trim()) {
    previewUrl.value = imageUrl.value.trim()
  }
}

// 移除图片
const removeImage = () => {
  previewUrl.value = ''
  imageUrl.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 提交表单
const handleSubmit = () => {
  if (!previewUrl.value || !formData.title.trim()) {
    return
  }

  emit('save', {
    imageUrl: previewUrl.value,
    title: formData.title.trim(),
    description: formData.description.trim(),
    date: formData.date
  })
}

// 监听photo prop变化，用于编辑模式
watch(() => props.photo, (newPhoto) => {
  if (newPhoto) {
    previewUrl.value = newPhoto.imageUrl
    formData.title = newPhoto.title
    formData.description = newPhoto.description
    formData.date = newPhoto.date
  }
}, { immediate: true })

// 组件挂载时的初始化
onMounted(() => {
  // 如果是编辑模式，填充表单数据
  if (props.photo) {
    previewUrl.value = props.photo.imageUrl
    formData.title = props.photo.title
    formData.description = props.photo.description
    formData.date = props.photo.date
  }
})
</script>

<style scoped>
/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>