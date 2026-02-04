<template>
  <div class="p-4">
    <h2>Tab 功能测试</h2>
    
    <div class="mb-4">
      <button 
        @click="activeTab = 'text'"
        :class="activeTab === 'text' ? 'bg-blue-500 text-white' : 'bg-gray-200'"
        class="px-4 py-2 mr-2 rounded"
      >
        文字模式
      </button>
      <button 
        @click="activeTab = 'image'"
        :class="activeTab === 'image' ? 'bg-blue-500 text-white' : 'bg-gray-200'"
        class="px-4 py-2 rounded"
      >
        图片模式
      </button>
    </div>
    
    <div class="mb-4">
      <p>当前模式: {{ activeTab }}</p>
      <p>图片URL: {{ imageUrl || '无' }}</p>
    </div>
    
    <div class="border p-4 h-64">
      <DistortEffect 
        :text="activeTab === 'text' ? 'TEST' : ''"
        :image-url="activeTab === 'image' ? imageUrl : ''"
        background-color="#000000"
        text-color="#ffffff"
      />
    </div>
  </div>
</template>

<script setup>
import DistortEffect from '@/components/DistortEffect/index.vue'
import { ref, watch } from 'vue'

const activeTab = ref('text')
const imageUrl = ref('')

// 监听 Tab 切换
watch(activeTab, (newTab) => {
  if (newTab === 'image' && !imageUrl.value) {
    const randomId = Math.floor(Math.random() * 1000) + 1
    imageUrl.value = `https://picsum.photos/800/600?random=${randomId}`
    console.log('Generated image URL:', imageUrl.value)
  }
})
</script>