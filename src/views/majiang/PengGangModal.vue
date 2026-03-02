<template>
  <div class="modal-overlay" @click.self="$emit('confirm', false)">
    <div class="modal">
      <div class="modal-title">{{ type === 'peng' ? '🀄 碰牌' : '🀄 杠牌' }}</div>
      <div class="modal-subtitle">
        {{ type === 'peng' ? '检测到三张相同的牌，是否要碰？' : '检测到四张相同的牌，是否要杠？' }}
      </div>
      <div class="modal-btns">
        <button class="btn-modal btn-confirm" @click="$emit('confirm', true)">
          {{ type === 'peng' ? '碰' : '杠' }}
        </button>
        <button class="btn-modal btn-cancel" @click="$emit('confirm', false)">
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type: 'peng' | 'gang' | null
}

defineProps<Props>()

defineEmits<{
  'confirm': [confirm: boolean]
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

.btn-confirm {
  background: #3b82f6;
  color: white;
  box-shadow: 0 1px 3px rgba(59, 130, 246, 0.3);
}

.btn-confirm:hover {
  background: #2563eb;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-cancel {
  background: white;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.btn-cancel:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}
</style>
