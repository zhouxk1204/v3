<template>
  <div class="card">
    <div class="card-title">选牌</div>

    <div v-for="suit in SUITS" :key="suit" class="suit-section">
      <div class="suit-label">{{ SUIT_NAMES[suit] }}</div>
      <div class="selector-grid">
        <div
          v-for="num in 9"
          :key="num"
          :class="{ maxed: getTileCount(suit, num) >= 4 }"
        >
          <MahjongTile
            :suit="suit"
            :num="num"
            @click="$emit('add-tile', suit, num)"
          />
          <div v-if="getTileCount(suit, num) > 0" class="tile-count-badge">
            {{ getTileCount(suit, num) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tile } from './mahjongLogic';
import MahjongTile from './MahjongTile.vue';

interface Props {
  hand: Tile[]
}

const props = defineProps<Props>()

defineEmits<{
  'add-tile': [suit: Tile['suit'], num: number]
}>()

const SUITS: Tile['suit'][] = ['wan', 'tiao', 'bing']
const SUIT_NAMES = { wan: '万子', tiao: '条子', bing: '饼子' }

function getTileCount(suit: Tile['suit'], num: number): number {
  return props.hand.filter(t => t.suit === suit && t.num === num).length
}
</script>

<style scoped>
.card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 18px 20px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.card-title {
  font-size: 12px;
  letter-spacing: 3px;
  color: #3b82f6;
  text-transform: uppercase;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.card-title::before {
  content: '';
  width: 20px;
  height: 2px;
  background: #3b82f6;
}

.suit-section {
  margin-bottom: 10px;
}

.suit-section:last-child {
  margin-bottom: 0;
}

.suit-label {
  font-size: 11px;
  color: #64748b;
  letter-spacing: 2px;
  margin-bottom: 6px;
  padding-left: 2px;
  font-weight: 500;
}

.selector-grid {
  display: grid;
  grid-template-columns: repeat(9, minmax(0, 1fr));
  gap: 5px;
}

.tile-wrapper {
  position: relative;
}

.tile-wrapper :deep(.tile) {
  width: 100%;
  height: auto;
  aspect-ratio: 10/13;
}

.tile-count-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #3b82f6;
  color: white;
  font-size: 9px;
  font-weight: 700;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  pointer-events: none;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

.tile-wrapper.maxed :deep(.tile) {
  opacity: 0.3;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
