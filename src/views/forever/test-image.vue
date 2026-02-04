<template>
  <div class="p-4">
    <h2>图片上传测试</h2>
    
    <div class="mb-4">
      <input 
        ref="fileInput"
        type="file"
        accept="image/*"
        @change="handleImageUpload"
        class="mb-2"
      />
      <button 
        v-if="imageUrl"
        @click="clearImage"
        class="ml-2 px-3 py-1 bg-red-500 text-white rounded"
      >
        清除
      </button>
    </div>
    
    <div v-if="imageUrl" class="mb-4">
      <p class="text-sm text-gray-600 mb-2">
        图片类型: {{ imageUrl.startsWith('data:') ? 'DataURL' : 'URL' }}
      </p>
      <img :src="imageUrl" alt="预览" class="max-w-xs max-h-48 border" />
    </div>
    
    <div class="border p-4 h-64">
      <Trae 
        text="TEST"
        :image-url="imageUrl"
        background-color="#000000"
        text-color="#ffffff"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Trae from '../../components/Trae/index.vue'

const fileInput = ref()
const imageUrl = ref('')

const handleImageUpload = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      imageUrl.value = e.target?.result
      console.log('Image loaded:', imageUrl.value.substring(0, 50) + '...')
    }
    reader.readAsDataURL(file)
  }
}

const clearImage = () => {
  imageUrl.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>