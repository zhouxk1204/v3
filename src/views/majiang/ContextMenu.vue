<template>
  <Teleport to="body">
    <div 
      v-if="show"
      class="ctx-menu" 
      :style="{ left: x + 'px', top: y + 'px' }"
      @click.stop
    >
      <div class="ctx-item" @click="handleAction('peng')">碰 (×3)</div>
      <div class="ctx-item" @click="handleAction('gang')">杠 (×4)</div>
      <div class="ctx-divider"></div>
      <div class="ctx-item danger" @click="handleAction('remove')">移除此牌</div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

interface Props {
  x: number
  y: number
  show?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  'action': [action: 'peng' | 'gang' | 'remove']
  'close': []
}>()

function handleAction(action: 'peng' | 'gang' | 'remove') {
  emit('action', action)
  emit('close')
}

function handleClickOutside() {
  emit('close')
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.ctx-menu {
  position: fixed;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 6px;
  z-index: 200;
  min-width: 130px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.ctx-item {
  padding: 7px 14px;
  font-size: 12px;
  cursor: pointer;
  border-radius: 6px;
  color: #1e293b;
  transition: background 0.1s;
  letter-spacing: 1px;
}

.ctx-item:hover {
  background: #f1f5f9;
  color: #3b82f6;
}

.ctx-item.danger:hover {
  background: #fef2f2;
  color: #ef4444;
}

.ctx-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 4px 0;
}
</style>
