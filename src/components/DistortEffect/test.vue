<template>
  <div class="test-container">
    <h2>Trae 颜色测试</h2>
    
    <div class="test-grid">
      <!-- 白色文字，黑色背景 -->
      <div class="test-item">
        <h3>白色文字 + 黑色背景</h3>
        <div class="trae-box">
          <Trae 
            text="TEST"
            background-color="#000000"
            text-color="#ffffff"
          />
        </div>
      </div>
      
      <!-- 红色文字，透明背景 -->
      <div class="test-item">
        <h3>红色文字 + 透明背景</h3>
        <div class="trae-box">
          <Trae 
            text="TEST"
            background-color="transparent"
            text-color="#ff0000"
          />
        </div>
      </div>
      
      <!-- 蓝色文字，黄色背景 -->
      <div class="test-item">
        <h3>蓝色文字 + 黄色背景</h3>
        <div class="trae-box">
          <Trae 
            text="TEST"
            background-color="#ffff00"
            text-color="#0000ff"
          />
        </div>
      </div>
      
      <!-- 默认颜色 -->
      <div class="test-item">
        <h3>默认颜色</h3>
        <div class="trae-box">
          <Trae text="TEST" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Trae from './index.vue';
</script>

<style scoped>
.test-container {
  padding: 20px;
}

.test-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.test-item {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
}

.test-item h3 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #666;
}

.trae-box {
  width: 100%;
  height: 200px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
}
</style>