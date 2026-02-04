<template>
  <div class="simple-test">
    <h2>简单颜色测试</h2>
    <div class="test-box" style="height: 300px; background: #f0f0f0; border: 1px solid #ccc;">
      <Trae 
        text="TEST"
        background-color="#ff0000"
        text-color="#ffffff"
      />
    </div>
    <p>应该显示：红色背景 + 白色文字</p>
  </div>
</template>

<script setup>
import Trae from './index.vue';
</script>

<style scoped>
.simple-test {
  padding: 20px;
}

.test-box {
  margin: 20px 0;
}
</style>