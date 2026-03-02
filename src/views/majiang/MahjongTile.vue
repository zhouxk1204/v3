<template>
  <div :class="tileClasses" :style="tileStyle" :title="title"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  suit: 'wan' | 'tiao' | 'bing'
  num: number
  state?: 'normal' | 'peng' | 'gang'
  size?: 'normal' | 'small'
  horizontal?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  state: 'normal',
  size: 'normal'
})

// 雪碧图从左到右：筒子(饼子)、条子、万子
const SPRITE_COLS = { bing: 0, tiao: 1, wan: 2 }
const SPRITE_ORIG_W = 100
const SPRITE_ORIG_H = 133

const tileClasses = computed(() => {
  const classes = ['tile']
  if (props.size === 'small') classes.push('tile-sm')
  if (props.state === 'peng') classes.push('peng')
  if (props.state === 'gang') classes.push('gang')
  if (props.horizontal) classes.push("horizontal")
  return classes.join(' ')
})

const tileStyle = computed(() => {
  const W = props.size === 'small' ? 38 : 48
  const H = props.size === 'small' ? 50 : 64

  const col = SPRITE_COLS[props.suit]
  const row = props.num - 1
  const scaleX = W / SPRITE_ORIG_W
  const scaleY = H / SPRITE_ORIG_H
  const totalW = Math.round(400 * scaleX)
  const totalH = Math.round(1200 * scaleY)
  const offsetX = -Math.round(col * SPRITE_ORIG_W * scaleX)
  const rowYs = [0, 132, 266, 400, 533, 666, 800, 933, 1066]
  const offsetY = -Math.round(rowYs[row] * scaleY)

  return {
    width: `${W}px`,
    height: `${H}px`,
    backgroundImage: `url('/src/views/majiang/mahjong-sprite.png')`,
    backgroundSize: `${totalW}px ${totalH}px`,
    backgroundPosition: `${offsetX}px ${offsetY}px`,
    backgroundColor: '#f5f0e4'
  }
})

const title = computed(() => {
  const SUIT_NAMES = { wan: '万', tiao: '条', bing: '饼' }
  return `${props.num}${SUIT_NAMES[props.suit]}`
})
</script>

<style scoped>
.tile {
  display: inline-block;
  border-radius: 6px;
  border: 1px solid #d4c9a8;
  cursor: pointer;
  position: relative;
  transition: all 0.15s;
  box-shadow:
    0 3px 0 #b8a878,
    0 4px 8px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  user-select: none;
  flex-shrink: 0;
}

.tile:hover {
  transform: translateY(-4px);
  box-shadow:
    0 7px 0 #b8a878,
    0 10px 16px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.tile:active {
  transform: translateY(-1px);
}

.tile-sm {
  border-radius: 5px;
  box-shadow: 0 2px 0 #b8a878, 0 3px 6px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.tile-sm:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 0 #b8a878, 0 8px 12px rgba(0, 0, 0, 0.5);
}

.tile-sm.peng {
  outline: 2px solid #f59e0b;
  outline-offset: -2px;
  box-shadow: 0 2px 0 #d97706, 0 3px 6px rgba(245, 158, 11, 0.4);
}

.tile-sm.gang {
  outline: 2px solid #ef4444;
  outline-offset: -2px;
  box-shadow: 0 2px 0 #dc2626, 0 3px 6px rgba(239, 68, 68, 0.4);
}

.tile-sm.peng.horizontal {
  transform: rotate(90deg);
  transform-origin: 19px 33px;
  margin-right: 15px;
}

.tile-sm.horizontal:hover {
  transform: rotate(90deg) translateY(-3px);
  transform-origin: 19px 33px;
}
</style>
