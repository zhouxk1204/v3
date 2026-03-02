<template>
  <div v-if="result.type === 'hu'" class="result-panel result-hu">
    <div class="result-title hu-title">🀄 胡牌！{{ getMainPattern() }}</div>
    <div class="fan-list">
      <div v-for="fan in result.fans" :key="fan.name" class="fan-item">
        <span class="fan-name">{{ fan.name }}</span>
        <span class="fan-score">{{ fan.fan }}</span>
        <span class="fan-unit">番</span>
      </div>
    </div>
    <div class="total-fan">{{ totalFan }} <span style="font-size:18px">番</span></div>
    <div class="total-label">合计番数</div>
    <div class="payment-info">
      {{ getPaymentInfo() }}
    </div>
  </div>

  <div v-else-if="result.type === 'ting'" class="result-panel result-ting">
    <div class="result-title ting-title">🎯 已听牌！</div>
    <div class="ting-info">胡以下 {{ result.tingTiles?.length }} 种牌</div>
    <div class="ting-tiles">
      <div v-for="tile in result.tingTiles" :key="`${tile.suit}-${tile.num}`" class="ting-tile-item">
        <MahjongTile :suit="tile.suit" :num="tile.num" size="small" />
        <div class="ting-remain">剩{{ tile.remaining }}张</div>
      </div>
    </div>
  </div>

  <div v-else-if="result.type === 'suggest'" class="result-panel result-suggest">
    <div class="result-title suggest-title">💡 {{ result.is13 ? '换牌建议' : '出牌建议' }}</div>
    <div class="suggest-info">{{ result.is13 ? '摸到以下牌换出可听' : '打出以下牌可听' }}</div>
    <div class="suggest-list">
      <div v-for="(s, i) in result.suggestions?.slice(0, 4)" :key="`${s.suit}-${s.num}`" class="suggest-item">
        <div class="suggest-rank">{{ i + 1 }}</div>
        <MahjongTile :suit="s.suit" :num="s.num" size="small" />
        <div class="suggest-detail">
          <div class="suggest-action">打 {{ s.num }}{{ SUIT_NAMES[s.suit] }}</div>
          <div class="suggest-desc">
            可听 {{ s.tingCount }} 种牌 · {{ s.tingTiles.map(t => `${t.num}${SUIT_NAMES[t.suit]}`).join('、') }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="result.type === 'no-ting'" class="result-panel result-suggest">
    <div class="result-title suggest-title">🤔 暂未听牌</div>
    <div class="no-ting-info">当前牌形较散，建议继续摸牌整理牌形</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { AnalysisResult } from './mahjongLogic';
import MahjongTile from './MahjongTile.vue';

interface Props {
  result: AnalysisResult
}

const props = defineProps<Props>()

const SUIT_NAMES = { wan: '万', tiao: '条', bing: '饼' }

const totalFan = computed(() => {
  if (props.result.type === 'hu' && props.result.fans) {
    return props.result.fans.reduce((sum, f) => sum + f.fan, 0)
  }
  return 0
})

function getMainPattern() {
  if (!props.result.fans || props.result.fans.length === 0) return ''
  
  // 获取第一个番型作为主牌型
  const firstFan = props.result.fans[0].name
  
  // 如果是十八罗汉组合
  if (props.result.fans.some(f => f.name === '十八罗汉')) {
    const hasQingYiSe = props.result.fans.some(f => f.name === '清一色')
    if (hasQingYiSe) {
      return '清十八罗汉'
    }
    return '十八罗汉'
  }
  
  // 如果是金勾钓组合
  if (props.result.fans.some(f => f.name === '金勾钓')) {
    const hasQingYiSe = props.result.fans.some(f => f.name === '清一色')
    if (hasQingYiSe) {
      return '清金勾钓'
    }
    return '金勾钓'
  }
  
  // 移除括号内容，只保留牌型名称
  return firstFan.replace(/（.*?）/g, '')
}

function getPaymentInfo() {
  const condition = props.result.winCondition
  const fan = totalFan.value
  
  // 计算基本分（2的(番数-1)次方）
  // 因为番数包含了倍数，所以直接用 2^(fan-1) 作为每家的支付
  const baseScore = fan
  
  if (condition === 'zimo' || condition === 'gangshanghua') {
    return `三家各付 ${baseScore} 基本分`
  } else if (condition === 'dianpao' || condition === 'gangshangpao') {
    return `炮手付 ${baseScore * 2} 基本分`
  } else if (condition === 'qianggang') {
    return `被抢杠者付 ${baseScore * 2} 基本分`
  } else if (condition === 'tianhu' || condition === 'dihu') {
    return `三家各付 ${baseScore} 基本分`
  }
  return ''
}
</script>

<style scoped>
.result-panel {
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  animation: fadeIn 0.3s ease;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-hu {
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  border-color: #86efac;
}

.result-ting {
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  border-color: #93c5fd;
}

.result-suggest {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border-color: #fcd34d;
}

.result-title {
  font-family: 'Ma Shan Zheng', serif;
  font-size: 22px;
  letter-spacing: 3px;
  margin-bottom: 12px;
  font-weight: 600;
}

.hu-title {
  color: #16a34a;
}

.ting-title {
  color: #2563eb;
}

.suggest-title {
  color: #d97706;
}

.fan-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}

.fan-item {
  background: white;
  border: 1px solid #d1fae5;
  border-radius: 8px;
  padding: 6px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.fan-name {
  font-size: 13px;
  color: #1e293b;
  font-weight: 500;
}

.fan-score {
  font-family: 'Ma Shan Zheng', serif;
  font-size: 18px;
  color: #16a34a;
}

.fan-unit {
  font-size: 10px;
  color: #64748b;
}

.total-fan {
  font-family: 'Ma Shan Zheng', serif;
  font-size: 32px;
  color: #16a34a;
  font-weight: 600;
}

.total-label {
  font-size: 12px;
  color: #64748b;
  letter-spacing: 2px;
  margin-top: 2px;
}

.payment-info {
  margin-top: 10px;
  font-size: 12px;
  color: #64748b;
}

.ting-info {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 10px;
}

.ting-tiles {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.ting-tile-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}

.ting-remain {
  font-size: 9px;
  color: #64748b;
}

.suggest-info {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 12px;
}

.suggest-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.suggest-item {
  background: white;
  border: 1px solid #fde68a;
  border-radius: 10px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.suggest-rank {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #fbbf24;
  color: white;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.suggest-detail {
  flex: 1;
}

.suggest-action {
  font-size: 12px;
  color: #d97706;
  font-weight: 500;
  margin-bottom: 3px;
}

.suggest-desc {
  font-size: 11px;
  color: #64748b;
}

.no-ting-info {
  font-size: 13px;
  color: #64748b;
}
</style>
