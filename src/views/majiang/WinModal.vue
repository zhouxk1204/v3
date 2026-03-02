<template>
  <div class="modal-overlay" @click.self="$emit('confirm', 'zimo')">
    <div class="modal">
      <div class="modal-title">🎉 恭喜胡牌！</div>
      <div class="modal-subtitle">请选择胡牌方式</div>
      <div class="modal-btns">
        <button class="btn-modal btn-zimo" @click="$emit('confirm', 'zimo')">自摸</button>
        <button class="btn-modal btn-dianpao" @click="$emit('confirm', 'dianpao')">点炮</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  'confirm': [type: 'zimo' | 'dianpao']
}>()
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fadeIn 0.2s ease;
  backdrop-filter: blur(4px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  max-width: 360px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-title {
  font-family: 'Ma Shan Zheng', serif;
  font-size: 22px;
  color: #1e293b;
  margin-bottom: 8px;
  letter-spacing: 2px;
}

.modal-subtitle {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 20px;
}

.modal-btns {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.btn-modal {
  padding: 10px 28px;
  border-radius: 10px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
  letter-spacing: 1px;
  transition: all 0.15s;
}

.btn-zimo {
  background: #3b82f6;
  color: white;
  box-shadow: 0 1px 3px rgba(59, 130, 246, 0.3);
}

.btn-zimo:hover {
  background: #2563eb;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-dianpao {
  background: #ef4444;
  color: white;
  box-shadow: 0 1px 3px rgba(239, 68, 68, 0.3);
}

.btn-dianpao:hover {
  background: #dc2626;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}
</style>
