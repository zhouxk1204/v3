<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-title">🎉 恭喜胡牌！</div>
      <div class="modal-subtitle">请选择胡牌条件</div>
      
      <div class="condition-grid">
        <button 
          v-for="condition in conditions" 
          :key="condition.value"
          class="condition-btn"
          @click="$emit('confirm', condition.value)"
        >
          <div class="condition-icon">{{ condition.icon }}</div>
          <div class="condition-name">{{ condition.name }}</div>
          <div class="condition-desc">{{ condition.desc }}</div>
          <div class="condition-fan" v-if="condition.fan > 0">+{{ condition.fan }}番</div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WinCondition } from './mahjongLogic';

defineEmits<{
  'confirm': [condition: WinCondition]
  'close': []
}>()

const conditions = [
  { value: 'zimo' as WinCondition, name: '自摸', icon: '🀄', fan: 0, desc: '自己摸牌胡' },
  { value: 'dianpao' as WinCondition, name: '点炮', icon: '💥', fan: 0, desc: '别人打出的牌胡' },
  { value: 'gangshanghua' as WinCondition, name: '杠上花', icon: '🌸', fan: 1, desc: '杠后补牌自摸胡' },
  { value: 'gangshangpao' as WinCondition, name: '杠上炮', icon: '💣', fan: 1, desc: '杠后打出被胡' },
  { value: 'qianggang' as WinCondition, name: '抢杠胡', icon: '⚡', fan: 1, desc: '抢别人的杠胡' },
  { value: 'tianhu' as WinCondition, name: '天胡', icon: '☀️', fan: 32, desc: '庄家起手胡' },
  { value: 'dihu' as WinCondition, name: '地胡', icon: '🌙', fan: 32, desc: '闲家第一轮胡' },
]
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
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-title {
  font-family: 'Ma Shan Zheng', serif;
  font-size: 22px;
  color: #1e293b;
  margin-bottom: 8px;
  letter-spacing: 2px;
  text-align: center;
}

.modal-subtitle {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 20px;
  text-align: center;
}

.condition-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.condition-btn {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px 12px;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.condition-btn:hover {
  border-color: #3b82f6;
  background: #eff6ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.condition-icon {
  font-size: 28px;
}

.condition-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.condition-desc {
  font-size: 10px;
  color: #94a3b8;
  line-height: 1.2;
}

.condition-fan {
  font-size: 11px;
  color: #3b82f6;
  font-weight: 600;
  margin-top: 2px;
}
</style>
