<template>
  <div class="mahjong-game">
    <MahjongHeader />

    <div class="main">
      <HandDisplay :hand="hand" :que="detectedQue" @remove-tile="removeTile" @show-context-menu="showContextMenu"
        @analyze="analyze" @undo="undoLast" @clear="clearHand" />
      <ResultPanel v-if="result" :result="result" />

      <TileSelector :hand="hand" @add-tile="addTile" />


    </div>

    <PengGangModal v-if="showPengGangModal" :type="pengGangType" @confirm="confirmPengGang" />

    <WinConditionModal v-if="showWinConditionModal" @confirm="confirmWinCondition"
      @close="showWinConditionModal = false" />

    <ContextMenu v-if="contextMenu.show" :x="contextMenu.x" :y="contextMenu.y" @action="handleContextAction"
      @close="contextMenu.show = false" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ContextMenu from './ContextMenu.vue'
import HandDisplay from './HandDisplay.vue'
import MahjongHeader from './MahjongHeader.vue'
import PengGangModal from './PengGangModal.vue'
import ResultPanel from './ResultPanel.vue'
import TileSelector from './TileSelector.vue'
import WinConditionModal from './WinConditionModal.vue'
import {
  type AnalysisResult,
  calcFan,
  canWin,
  getBestDiscards,
  getTingTiles,
  type Tile,
  type WinCondition
} from './mahjongLogic'

const hand = ref<Tile[]>([])
const result = ref<AnalysisResult | null>(null)
const contextMenu = ref({ show: false, x: 0, y: 0, index: -1 })
const showPengGangModal = ref(false)
const showWinConditionModal = ref(false)
const pendingWinTiles = ref<number[]>([])
const pendingTile = ref<{ suit: Tile['suit'], num: number } | null>(null)
const pengGangType = ref<'peng' | 'gang' | null>(null)

const detectedQue = computed(() => {
  const counts = { wan: 0, tiao: 0, bing: 0 }
  hand.value.forEach(t => counts[t.suit]++)
  const zeros = (['wan', 'tiao', 'bing'] as const).filter(s => counts[s] === 0)
  if (zeros.length === 1) return zeros[0]
  return null
})

function addTile(suit: Tile['suit'], num: number) {
  const count = hand.value.filter(t => t.suit === suit && t.num === num).length
  if (count >= 4) return

  // 检查是否需要弹出碰/杠选择
  if (count === 2) {
    // 三张一致，询问是否碰
    pendingTile.value = { suit, num }
    pengGangType.value = 'peng'
    showPengGangModal.value = true
  } else if (count === 3) {
    // 四张一致，询问是否杠
    pendingTile.value = { suit, num }
    pengGangType.value = 'gang'
    showPengGangModal.value = true
  } else {
    // 正常添加
    hand.value.push({ suit, num, state: 'normal' })
    result.value = null
  }
}

function removeTile(index: number) {
  hand.value.splice(index, 1)
  result.value = null
}

function undoLast() {
  if (hand.value.length === 0) return
  hand.value.pop()
  result.value = null
}

function clearHand() {
  hand.value = []
  result.value = null
}

function showContextMenu(e: MouseEvent, index: number) {
  contextMenu.value = {
    show: true,
    x: Math.min(e.clientX, window.innerWidth - 150),
    y: Math.min(e.clientY, window.innerHeight - 120),
    index
  }
}

function handleContextAction(action: 'peng' | 'gang' | 'remove') {
  const index = contextMenu.value.index
  contextMenu.value.show = false

  if (index < 0 || index >= hand.value.length) return

  const tile = hand.value[index]

  if (action === 'remove') {
    removeTile(index)
    return
  }

  const targetCount = action === 'peng' ? 3 : 4
  const current = hand.value.filter(t => t.suit === tile.suit && t.num === tile.num)

  if (current.length < targetCount) return

  hand.value = hand.value.filter(t => !(t.suit === tile.suit && t.num === tile.num))

  if (action === 'peng') {
    // 碰：前两张竖着，第三张横着
    hand.value.push({ suit: tile.suit, num: tile.num, state: 'peng', isHorizontal: false })
    hand.value.push({ suit: tile.suit, num: tile.num, state: 'peng', isHorizontal: false })
    hand.value.push({ suit: tile.suit, num: tile.num, state: 'peng', isHorizontal: true })
  } else {
    // 杠：四张都竖着
    for (let i = 0; i < 4; i++) {
      hand.value.push({ suit: tile.suit, num: tile.num, state: 'gang', isHorizontal: false })
    }
  }

  result.value = null
}

function analyze() {
  // 分离手牌和碰/杠牌
  const normalTiles = hand.value.filter(t => t.state === 'normal')
  const pengGangTiles = hand.value.filter(t => t.state !== 'normal')

  // 将手牌转换为数字ID
  const tiles = normalTiles.map(t => {
    const base = t.suit === 'wan' ? 0 : t.suit === 'tiao' ? 10 : 20
    return base + t.num
  }).sort((a, b) => a - b)

  // 计算碰/杠的组数
  const pengGangGroups = new Map<string, number>()
  pengGangTiles.forEach(t => {
    const key = `${t.suit}-${t.num}-${t.state}`
    pengGangGroups.set(key, (pengGangGroups.get(key) || 0) + 1)
  })
  const groupCount = Array.from(pengGangGroups.values()).filter(count => count >= 3).length

  // 检查是否胡牌
  // 标准胡牌：手牌2张（将） + 碰/杠组数 = 4组
  // 或者手牌14张（没有碰/杠）
  if (tiles.length === 2 && groupCount === 4) {
    // 金勾钓：只剩2张手牌作为将，其他都是碰/杠
    if (tiles[0] === tiles[1]) {
      pendingWinTiles.value = [...tiles, ...pengGangTiles.map(t => {
        const base = t.suit === 'wan' ? 0 : t.suit === 'tiao' ? 10 : 20
        return base + t.num
      })]
      showWinConditionModal.value = true
      return
    }
  } else if (tiles.length === 14 && groupCount === 0 && canWin(tiles)) {
    // 标准14张胡牌（没有碰/杠）
    pendingWinTiles.value = tiles
    showWinConditionModal.value = true
    return
  } else if (tiles.length >= 2 && canWin(tiles)) {
    // 其他情况：手牌能胡
    pendingWinTiles.value = [...tiles, ...pengGangTiles.map(t => {
      const base = t.suit === 'wan' ? 0 : t.suit === 'tiao' ? 10 : 20
      return base + t.num
    })]
    showWinConditionModal.value = true
    return
  }

  // 检查是否听牌
  if (tiles.length >= 1) {
    const tingTiles = getTingTiles(tiles)
    if (tingTiles.length > 0) {
      result.value = { type: 'ting', tingTiles }
      return
    }

    // 给出建议
    const suggestions = getBestDiscards(tiles)
    result.value = suggestions.length > 0
      ? { type: 'suggest', suggestions, is13: tiles.length === 13 }
      : { type: 'no-ting' }
  }
}

function confirmWinCondition(condition: WinCondition) {
  showWinConditionModal.value = false
  if (pendingWinTiles.value.length === 0) return

  // 直接传递 hand.value（包含 state 信息）
  const fans = calcFan(hand.value, condition)
  result.value = { type: 'hu', fans, winCondition: condition }
  pendingWinTiles.value = []
}

function confirmPengGang(confirm: boolean) {
  showPengGangModal.value = false
  if (!pendingTile.value) return

  const { suit, num } = pendingTile.value

  if (confirm && pengGangType.value) {
    // 用户确认碰/杠

    // 移除所有相同的牌
    hand.value = hand.value.filter(t => !(t.suit === suit && t.num === num))

    // 添加碰/杠的牌
    if (pengGangType.value === 'peng') {
      // 碰：前两张竖着，第三张横着
      hand.value.push({ suit, num, state: 'peng', isHorizontal: false })
      hand.value.push({ suit, num, state: 'peng', isHorizontal: false })
      hand.value.push({ suit, num, state: 'peng', isHorizontal: true })
    } else {
      // 杠：四张都竖着
      for (let i = 0; i < 4; i++) {
        hand.value.push({ suit, num, state: 'gang', isHorizontal: false })
      }
    }
  } else {
    // 用户取消，正常添加
    hand.value.push({ suit, num, state: 'normal' })
  }

  pendingTile.value = null
  pengGangType.value = null
  result.value = null
}
</script>

<style scoped>
.mahjong-game {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
  color: #1e293b;
  padding-bottom: 40px;
}

.main {
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px 16px;
}
</style>
