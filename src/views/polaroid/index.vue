<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-100 to-orange-100 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- 标题和添加按钮 -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <!-- <h1 class="text-4xl font-bold text-gray-800 mb-2">拍立得照片墙</h1> -->
          <p class="text-gray-600 text-xl" style="font-family: 'Cedarville Cursive', cursive;">Collect your beautiful memories</p>
          <!-- 存储状态指示器 -->
          <!-- <div class="mt-2 text-xs text-gray-500" v-if="photos.length > 0">
            已保存 {{ photos.length }} 张照片
            <span class="ml-2 text-orange-600" v-if="getStorageInfo().percentage > 80">
              ⚠️ 存储空间使用率: {{ getStorageInfo().percentage }}%
            </span>
          </div> -->
        </div>
        
        <!-- 添加按钮 - 图标版本 -->
        <button
          @click="showAddModal = true"
          class="bg-white hover:bg-gray-50 text-gray-800 p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200 group"
          title="添加照片"
        >
          <svg class="w-6 h-6 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <!-- 照片墙 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <PolaroidPhoto
          v-for="(photo, index) in photos"
          :key="photo.id"
          :photo="photo"
          :style="{ zIndex: index + 1 }"
          @delete="deletePhoto"
          @edit="editPhoto"
        />
      </div>

      <!-- 空状态 -->
      <div v-if="photos.length === 0" class="text-center py-20">
        <div class="text-gray-400 mb-4">
          <svg class="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-600 mb-2">还没有照片</h3>
        <p class="text-gray-500 mb-6" style="font-family: 'Cedarville Cursive', cursive; font-size: 1.1rem;">
          Start collecting your beautiful memories!
        </p>
        <button
          @click="showAddModal = true"
          class="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-full transition-colors"
        >
          添加第一张照片
        </button>
      </div>
    </div>

    <!-- 添加/编辑照片模态框 -->
    <AddPhotoModal
      v-if="showAddModal"
      :photo="editingPhoto"
      @save="savePhoto"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AddPhotoModal from './components/AddPhotoModal.vue'
import PolaroidPhoto from './components/PolaroidPhoto.vue'

interface Photo {
  id: string
  imageUrl: string
  title: string
  description: string
  date: string
  createdAt: number
}

// 响应式数据
const photos = ref<Photo[]>([])
const showAddModal = ref(false)
const editingPhoto = ref<Photo | null>(null)

// 生成随机ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

// 保存照片
const savePhoto = (photoData: Omit<Photo, 'id' | 'createdAt'>) => {
  if (editingPhoto.value) {
    // 编辑现有照片
    const index = photos.value.findIndex(p => p.id === editingPhoto.value!.id)
    if (index !== -1) {
      photos.value[index] = {
        ...editingPhoto.value,
        ...photoData
      }
    }
  } else {
    // 添加新照片
    const newPhoto: Photo = {
      id: generateId(),
      ...photoData,
      createdAt: Date.now()
    }
    photos.value.unshift(newPhoto)
  }
  
  saveToLocalStorage()
  closeModal()
}

// 删除照片
const deletePhoto = (id: string) => {
  if (confirm('确定要删除这张照片吗？')) {
    photos.value = photos.value.filter(p => p.id !== id)
    saveToLocalStorage()
  }
}

// 编辑照片
const editPhoto = (photo: Photo) => {
  editingPhoto.value = photo
  showAddModal.value = true
}

// 关闭模态框
const closeModal = () => {
  showAddModal.value = false
  editingPhoto.value = null
}

// 保存到本地存储 - 实用版本
const saveToLocalStorage = () => {
  try {
    const testData = JSON.stringify(photos.value)
    
    // 如果数据太大，只保存元数据和网络图片URL
    if (testData.length > 4 * 1024 * 1024) { // 4MB限制
      console.warn('数据量过大，将压缩存储')
      const compressedPhotos = photos.value.map(photo => ({
        ...photo,
        imageUrl: photo.imageUrl.startsWith('data:') ? '' : photo.imageUrl // 移除Base64数据
      }))
      localStorage.setItem('polaroid-photos', JSON.stringify(compressedPhotos))
    } else {
      localStorage.setItem('polaroid-photos', testData)
    }
  } catch (error) {
    console.error('保存失败，可能是存储空间不足:', error)
    // 降级方案：只保存最近的10张照片
    const recentPhotos = photos.value.slice(0, 10).map(photo => ({
      ...photo,
      imageUrl: photo.imageUrl.startsWith('data:') ? '' : photo.imageUrl
    }))
    try {
      localStorage.setItem('polaroid-photos', JSON.stringify(recentPhotos))
      alert('存储空间不足，只保存了最近的10张照片')
    } catch (fallbackError) {
      console.error('降级保存也失败:', fallbackError)
      alert('存储失败，请清理浏览器缓存后重试')
    }
  }
}

// 从本地存储加载 - 实用版本
const loadFromLocalStorage = () => {
  const saved = localStorage.getItem('polaroid-photos')
  if (saved) {
    try {
      const loadedPhotos = JSON.parse(saved)
      // 过滤掉没有图片的项目
      photos.value = loadedPhotos.filter((photo: Photo) => photo.imageUrl && photo.imageUrl.trim() !== '')
    } catch (error) {
      console.error('Failed to load photos from localStorage:', error)
    }
  }
}

// 获取存储使用情况
const getStorageInfo = () => {
  try {
    const used = JSON.stringify(localStorage).length
    const quota = 5 * 1024 * 1024 // 假设5MB限制
    return {
      used: Math.round(used / 1024), // KB
      quota: Math.round(quota / 1024), // KB
      percentage: Math.round((used / quota) * 100)
    }
  } catch (error) {
    return { used: 0, quota: 5120, percentage: 0 }
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadFromLocalStorage()
  
  // 在开发环境下显示存储使用情况
  if (import.meta.env.DEV) {
    const storageInfo = getStorageInfo()
    console.log(`存储使用情况: ${storageInfo.used}KB / ${storageInfo.quota}KB (${storageInfo.percentage}%)`)
  }
})
</script>

<style scoped>
/* 导入艺术字体 */
@import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap');

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>