<template>
  <div 
    class="polaroid-photo group cursor-pointer relative"
    :style="{ transform: `rotate(${randomRotation}deg)` }"
    @click="showFullscreen = true"
  >
    <!-- 拍立得外框 -->
    <div class="bg-white p-3 pb-16 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative">
      <!-- 照片区域 -->
      <div class="aspect-square bg-gray-100 overflow-hidden relative">
        <img 
          :src="photo.imageUrl" 
          :alt="photo.title"
          class="w-full h-full object-cover"
          loading="lazy"
        />
        
        <!-- 悬停时显示的操作按钮 -->
        <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <button
            @click.stop="$emit('edit', photo)"
            class="bg-white hover:bg-gray-100 text-gray-800 p-2 rounded-full shadow-lg transition-colors"
            title="编辑"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            @click.stop="$emit('delete', photo.id)"
            class="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
            title="删除"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- 底部文字区域 -->
      <div class="mt-3 text-center">
        <h3 class="font-handwriting text-lg text-gray-800 mb-1 truncate">{{ photo.title }}</h3>
        <p class="font-handwriting text-sm text-gray-600 truncate">{{ photo.description }}</p>
        <p class="font-handwriting text-xs text-gray-500 mt-1">{{ formatDate(photo.date) }}</p>
      </div>
      
      <!-- 胶带效果 -->
      <div class="absolute -top-2 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-yellow-200 opacity-70 rotate-3 rounded-sm shadow-sm"></div>
    </div>
  </div>

  <!-- 全屏查看模态框 -->
  <div 
    v-if="showFullscreen"
    class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
    @click="showFullscreen = false"
  >
    <div class="max-w-4xl max-h-full relative">
      <img 
        :src="photo.imageUrl" 
        :alt="photo.title"
        class="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
      />
      
      <!-- 关闭按钮 -->
      <button
        @click="showFullscreen = false"
        class="absolute top-4 right-4 bg-white hover:bg-gray-100 text-gray-800 p-2 rounded-full shadow-lg transition-colors"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <!-- 照片信息 -->
      <div class="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-4">
        <h3 class="text-xl font-bold text-gray-800 mb-2">{{ photo.title }}</h3>
        <p class="text-gray-600 mb-2">{{ photo.description }}</p>
        <p class="text-sm text-gray-500">{{ formatDate(photo.date) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

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
  photo: Photo
}>()

// Emits
defineEmits<{
  delete: [id: string]
  edit: [photo: Photo]
}>()

// 响应式数据
const showFullscreen = ref(false)

// 渲染时生成随机角度
const randomRotation = computed(() => {
  // 使用photo.id作为种子，确保同一张照片的角度保持一致
  const seed = props.photo.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const random = (seed * 9301 + 49297) % 233280 / 233280
  return (random * 16 - 8) // -8 到 8 度之间
})

// 格式化日期 - 英文格式
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
/* 导入艺术字体 */
@import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap');

.polaroid-photo {
  transition: transform 0.3s ease;
}

.polaroid-photo:hover {
  z-index: 999 !important; /* 悬停时提升到最高层 */
  transform: scale(1.05) !important; /* 悬停时稍微放大，覆盖旋转 */
}

/* 手写字体效果 */
.font-handwriting {
  font-family: 'Cedarville Cursive', 'Kalam', 'Comic Sans MS', cursive;
}

/* 胶带效果的阴影 */
.polaroid-photo::before {
  content: '';
  position: absolute;
  top: -3px;
  left: 50%;
  transform: translateX(-50%) rotate(3deg);
  width: 60px;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  z-index: -1;
}
</style>