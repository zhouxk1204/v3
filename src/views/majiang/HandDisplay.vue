<template>
  <div class="card">
    <div class="card-title">
      当前手牌
      <span class="que-display">
        <span v-if="que" :class="`que-indicator que-${que}`">
          缺 {{ SUIT_NAMES[que] }}
        </span>
        <span v-else class="que-indicator que-none">缺门未定</span>
      </span>
    </div>

    <div class="hand-display">
      <span v-if="hand.length === 0" class="hand-empty">请从下方选牌 ↓</span>

      <template v-for="(tile, index) in hand" :key="index">
        <!-- 检测是否需要在碰/杠组前添加间隙 -->
        <!-- <div v-if="needGapBefore(index)" class="tile-gap"></div> -->

        <!-- 如果是碰的第三张牌（横向），需要特殊容器 -->
        <MahjongTile v-if="tile.isHorizontal" :suit="tile.suit" :num="tile.num" :state="tile.state" :horizontal="true"
          size="small" @click="$emit('remove-tile', index)"
          @contextmenu.prevent="$emit('show-context-menu', $event, index)" />

        <!-- 普通牌（竖向） -->
        <MahjongTile v-else :suit="tile.suit" :num="tile.num" :state="tile.state" size="small"
          @click="$emit('remove-tile', index)" @contextmenu.prevent="$emit('show-context-menu', $event, index)" />
        </template>

      <span v-if="hand.length > 0" class="hand-count">{{ hand.length }}张</span>
    </div>

    <div class="controls">
      <button class="btn btn-gold" :disabled="!canAnalyze" @click="$emit('analyze')">
        分析手牌
      </button>
      <button class="btn btn-outline btn-sm" @click="$emit('undo')">撤销</button>
      <button class="btn btn-outline btn-sm" @click="$emit('clear')">清空</button>
      <div class="hint">右键点击手牌可碰/杠</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Tile } from './mahjongLogic'
import MahjongTile from './MahjongTile.vue'

interface Props {
  hand: Tile[]
  que: 'wan' | 'tiao' | 'bing' | null
}

const props = defineProps<Props>()

defineEmits<{
  'remove-tile': [index: number]
  'show-context-menu': [e: MouseEvent, index: number]
  'analyze': []
  'undo': []
  'clear': []
}>()

const SUIT_NAMES = { wan: '万', tiao: '条', bing: '饼' }

const canAnalyze = computed(() => {
  const len = props.hand.length
  // 移除最大张数限制，因为杠会多牌
  return len >= 13
})

// 判断是否需要在当前牌前添加间隙
function needGapBefore(index: number): boolean {
  if (index === 0) return false

  const currentTile = props.hand[index]
  const prevTile = props.hand[index - 1]

  // 如果当前牌是碰/杠组的第一张（前一张是普通牌，当前是碰/杠）
  if (prevTile.state === 'normal' && currentTile.state !== 'normal') {
    return true
  }

  // 如果前一张是碰/杠组的最后一张，当前是普通牌
  if (prevTile.state !== 'normal' && currentTile.state === 'normal') {
    // 检查前一张是否是碰/杠组的最后一张
    // 碰：第三张是横向的
    // 杠：需要检查是否是第四张
    if (prevTile.isHorizontal) {
      // 碰的第三张（横向），后面需要间隙
      return true
    }

    // 检查是否是杠的第四张
    if (prevTile.state === 'gang') {
      // 向前数，看是否已经有3张相同的杠牌
      let count = 1
      for (let i = index - 2; i >= 0; i--) {
        const t = props.hand[i]
        if (t.state === 'gang' && t.suit === prevTile.suit && t.num === prevTile.num) {
          count++
        } else {
          break
        }
      }
      if (count >= 3) {
        return true
      }
    }
  }

  return false
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

.que-display {
  margin-left: auto;
}

.que-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.que-wan {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
}

.que-tiao {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #16a34a;
}

.que-bing {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #2563eb;
}

.que-none {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #94a3b8;
}

.hand-display {
  display: flex;
  flex-wrap: wrap;
  min-height: 64px;
  align-items: flex-end;
  padding: 10px 12px 6px;
  background: #f8fafc;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  position: relative;
}

.hand-empty {
  color: #94a3b8;
  font-size: 12px;
  letter-spacing: 2px;
  align-self: center;
  margin: auto;
}

.hand-count {
  position: absolute;
  top: 6px;
  right: 10px;
  font-size: 11px;
  color: #64748b;
  font-family: monospace;
}

.tile-gap {
  width: 12px;
  flex-shrink: 0;
}

.controls {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
  align-items: center;
}

.btn {
  padding: 9px 20px;
  border-radius: 8px;
  border: none;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
  font-weight: 500;
  letter-spacing: 1px;
}

.btn-gold {
  background: #3b82f6;
  color: white;
  box-shadow: 0 1px 3px rgba(59, 130, 246, 0.3);
}

.btn-gold:hover:not(:disabled) {
  background: #2563eb;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-gold:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #94a3b8;
}

.btn-outline {
  background: white;
  border: 1px solid #e2e8f0;
  color: #64748b;
}

.btn-outline:hover {
  border-color: #cbd5e1;
  color: #475569;
  background: #f8fafc;
}

.btn-sm {
  padding: 5px 12px;
  font-size: 11px;
  border-radius: 6px;
}

.hint {
  margin-left: auto;
  font-size: 11px;
  color: #94a3b8;
}
</style>
