<template>
  <div class="demo-container">
    <h2>DistortEffect 组件演示</h2>
    
    <div class="controls">
      <input 
        v-model="demoText" 
        placeholder="输入文字内容"
        class="text-input"
      />
      <input 
        v-model="imageUrl" 
        placeholder="输入图片URL"
        class="text-input"
      />
      <div class="color-controls">
        <label>
          背景色:
          <input 
            v-model="backgroundColor" 
            type="color"
            class="color-input"
          />
          <input 
            v-model="backgroundColor" 
            placeholder="背景色 (如: #000000 或 transparent)"
            class="text-input"
          />
        </label>
        <label>
          文字色:
          <input 
            v-model="textColor" 
            type="color"
            class="color-input"
          />
          <input 
            v-model="textColor" 
            placeholder="文字色 (如: #ffffff)"
            class="text-input"
          />
        </label>
      </div>
    </div>
    
    <div class="trae-wrapper">
      <DistortEffect 
        :text="demoText"
        :imageUrl="imageUrl"
        :background-color="backgroundColor"
        :text-color="textColor"
        :grid="15"
        :mouseRadius="0.25"
        :strength="0.15"
        :relaxation="0.9"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const demoText = ref('Hello World')
const imageUrl = ref('')
const backgroundColor = ref('transparent')
const textColor = ref('rgba(255, 255, 255, 0.9)')
</script>

<style scoped>
.demo-container {
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.controls {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.color-controls {
  display: flex;
  gap: 20px;
}

.color-controls label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

.text-input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
}

.color-input {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.trae-wrapper {
  flex: 1;
  border: 2px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  min-height: 400px;
  background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
}
</style>