export interface Tile {
  suit: 'wan' | 'tiao' | 'bing'
  num: number
  state: 'normal' | 'peng' | 'gang'
  isHorizontal?: boolean  // 标记是否横向显示（碰的第三张牌）
}

export type WinCondition = 'zimo' | 'dianpao' | 'gangshanghua' | 'gangshangpao' | 'qianggang' | 'tianhu' | 'dihu'

export interface Fan {
  name: string
  fan: number
}

export interface TingTile {
  suit: 'wan' | 'tiao' | 'bing'
  num: number
  remaining: number
}

export interface Suggestion {
  suit: 'wan' | 'tiao' | 'bing'
  num: number
  tingCount: number
  tingTiles: TingTile[]
}

export interface AnalysisResult {
  type: 'hu' | 'ting' | 'suggest' | 'no-ting'
  fans?: Fan[]
  winCondition?: WinCondition
  tingTiles?: TingTile[]
  suggestions?: Suggestion[]
  is13?: boolean
}

export function tileId(suit: Tile['suit'], num: number): number {
  const base = suit === 'wan' ? 0 : suit === 'tiao' ? 10 : 20
  return base + num
}

export function idToSuit(id: number): Tile['suit'] {
  if (id <= 9) return 'wan'
  if (id <= 19) return 'tiao'
  return 'bing'
}

export function idToNum(id: number): number {
  if (id <= 9) return id
  if (id <= 19) return id - 10
  return id - 20
}

export function canWin(tiles: number[]): boolean {
  if (tiles.length === 0 || tiles.length % 3 !== 2) return false

  const counts: Record<number, number> = {}
  tiles.forEach(t => counts[t] = (counts[t] || 0) + 1)

  const unique = [...new Set(tiles)]
  for (const pair of unique) {
    if (counts[pair] >= 2) {
      const remaining = [...tiles]
      remaining.splice(remaining.indexOf(pair), 1)
      remaining.splice(remaining.indexOf(pair), 1)
      if (canFormMentsu(remaining)) return true
    }
  }

  if (tiles.length === 14) {
    const c: Record<number, number> = {}
    tiles.forEach(t => c[t] = (c[t] || 0) + 1)
    if (Object.values(c).every(v => v >= 2) && Object.keys(c).length === 7) return true
  }

  return false
}

function canFormMentsu(tiles: number[]): boolean {
  if (tiles.length === 0) return true
  if (tiles.length % 3 !== 0) return false

  const sorted = [...tiles].sort((a, b) => a - b)
  const counts: Record<number, number> = {}
  sorted.forEach(t => counts[t] = (counts[t] || 0) + 1)

  const first = sorted[0]

  if (counts[first] >= 3) {
    const rem = [...sorted]
    for (let i = 0; i < 3; i++) rem.splice(rem.indexOf(first), 1)
    if (canFormMentsu(rem)) return true
  }

  const suit1 = Math.floor((first - 1) / 10)
  const next1 = first + 1
  const next2 = first + 2
  const suit2 = next1 > 0 ? Math.floor((next1 - 1) / 10) : -1
  const suit3 = next2 > 0 ? Math.floor((next2 - 1) / 10) : -1

  if (suit1 === suit2 && suit2 === suit3 && counts[next1] >= 1 && counts[next2] >= 1) {
    const n1 = idToNum(first), n3 = idToNum(next2)
    if (n1 >= 1 && n3 <= 9) {
      const rem = [...sorted]
      rem.splice(rem.indexOf(first), 1)
      rem.splice(rem.indexOf(next1), 1)
      rem.splice(rem.indexOf(next2), 1)
      if (canFormMentsu(rem)) return true
    }
  }

  return false
}

export function getTingTiles(tiles: number[]): TingTile[] {
  const result: TingTile[] = []
  const suits: Tile['suit'][] = ['wan', 'tiao', 'bing']

  suits.forEach(suit => {
    for (let n = 1; n <= 9; n++) {
      const id = tileId(suit, n)
      const cnt = tiles.filter(t => t === id).length
      if (cnt < 4) {
        const test = [...tiles, id].sort((a, b) => a - b)
        if (canWin(test)) {
          result.push({ suit, num: n, remaining: 4 - cnt })
        }
      }
    }
  })

  return result
}

export function calcFan(hand: Tile[], winCondition: WinCondition): Fan[] {
  const fans: Fan[] = []

  // 分离手牌和碰/杠牌
  const normalTiles = hand.filter(t => t.state === 'normal')
  const pengTiles = hand.filter(t => t.state === 'peng')
  const gangTiles = hand.filter(t => t.state === 'gang')
  
  // 将所有牌转换为数字ID
  const allTileIds = hand.map(t => {
    const base = t.suit === 'wan' ? 0 : t.suit === 'tiao' ? 10 : 20
    return base + t.num
  })
  
  // 统计每种牌的数量
  const counts: Record<number, number> = {}
  allTileIds.forEach(t => counts[t] = (counts[t] || 0) + 1)
  
  const uniqueTiles = Object.keys(counts).map(Number)
  const countValues = Object.values(counts)

  // 检查清一色
  const suitSet = new Set(hand.map(t => t.suit))
  const isQingYiSe = suitSet.size === 1
  
  // 检查幺九（1或9）
  const hasYaoJiu = allTileIds.every(t => {
    const num = idToNum(t)
    return num === 1 || num === 9
  })
  
  // 计算杠的数量（根）
  const gangGroups = new Map<string, number>()
  gangTiles.forEach(t => {
    const key = `${t.suit}-${t.num}`
    gangGroups.set(key, (gangGroups.get(key) || 0) + 1)
  })
  const gangCount = Array.from(gangGroups.values()).filter(count => count === 4).length
  
  // 计算碰的数量
  const pengGroups = new Map<string, number>()
  pengTiles.forEach(t => {
    const key = `${t.suit}-${t.num}`
    pengGroups.set(key, (pengGroups.get(key) || 0) + 1)
  })
  const pengCount = Array.from(pengGroups.values()).filter(count => count === 3).length
  
  // 检查金勾钓（只剩2张手牌作为将，其他都是碰/杠）
  const normalTileIds = normalTiles.map(t => {
    const base = t.suit === 'wan' ? 0 : t.suit === 'tiao' ? 10 : 20
    return base + t.num
  })
  const isJinGouDiao = normalTileIds.length === 2 && 
                       normalTileIds[0] === normalTileIds[1] && 
                       (pengCount + gangCount) === 4
  
  // 检查十八罗汉（4个杠 + 1对将）
  const isShiBaLuoHan = normalTileIds.length === 2 && 
                        normalTileIds[0] === normalTileIds[1] && 
                        gangCount === 4
  
  // 检查七对相关
  const hasQuad = countValues.some(v => v === 4) // 有四张相同的牌
  const isQiDui = uniqueTiles.length === 7 && countValues.every(v => v === 2 || v === 4) && pengTiles.length === 0 && gangTiles.length === 0
  
  // 检查对对胡（全部是刻子）
  const isDuiDuiHu = (pengCount + gangCount) >= 4
  
  // 十八罗汉（4个杠）- 特殊牌型，只计算清一色和根
  if (isShiBaLuoHan) {
    fans.push({ name: '十八罗汉', fan: 10 })
    if (isQingYiSe) {
      fans.push({ name: '清一色', fan: 3 })
    }
  }
  // 金勾钓可以叠加清一色和对对胡
  else if (isJinGouDiao) {
    if (isQingYiSe) {
      fans.push({ name: '清一色', fan: 3 })
    }
    fans.push({ name: '对对胡', fan: 2 })
    fans.push({ name: '金勾钓', fan: 1 })
  }
  // 天胡/地胡
  else if (winCondition === 'tianhu') {
    fans.push({ name: '天胡（6番 x32）', fan: 32 })
  } else if (winCondition === 'dihu') {
    fans.push({ name: '地胡（6番 x32）', fan: 32 })
  }
  // 清龙七对
  else if (isQiDui && isQingYiSe && hasQuad) {
    fans.push({ name: '清龙七对（6番 x32）', fan: 32 })
  }
  // 龙七对
  else if (isQiDui && hasQuad && !isQingYiSe) {
    fans.push({ name: '龙七对（5番 x16）', fan: 16 })
  }
  // 清七对
  else if (isQiDui && isQingYiSe) {
    fans.push({ name: '清七对（5番 x16）', fan: 16 })
  }
  // 清幺九
  else if (isQingYiSe && hasYaoJiu) {
    fans.push({ name: '清幺九（5番 x16）', fan: 16 })
  }
  // 清对
  else if (isDuiDuiHu && isQingYiSe) {
    fans.push({ name: '清对（4番 x8）', fan: 8 })
  }
  // 清一色
  else if (isQingYiSe) {
    fans.push({ name: '清一色（3番 x4）', fan: 4 })
  }
  // 带幺九
  else if (hasYaoJiu) {
    fans.push({ name: '带幺九（3番 x4）', fan: 4 })
  }
  // 七对
  else if (isQiDui) {
    fans.push({ name: '七对（3番 x4）', fan: 4 })
  }
  // 对对胡
  else if (isDuiDuiHu) {
    fans.push({ name: '对对胡（2番 x2）', fan: 2 })
  }
  // 平胡
  else {
    fans.push({ name: '平胡（1番 x1）', fan: 1 })
  }
  
  // 杠（根）- 另加番
  // 注意：龙七对和清龙七对要减1根
  let actualGangCount = gangCount
  const fanNames = fans.map(f => f.name)
  if (fanNames.some(n => n.includes('龙七对'))) {
    actualGangCount = Math.max(0, gangCount - 1)
  }
  
  if (actualGangCount > 0) {
    fans.push({ name: `${actualGangCount}根`, fan: actualGangCount })
  }
  
  // 自摸 - 另加番
  if (winCondition === 'zimo') {
    fans.push({ name: '自摸', fan: 1 })
  }
  
  // 特殊胡牌条件 - 另加番
  if (winCondition === 'gangshanghua') {
    fans.push({ name: '杠上花', fan: 1 })
  } else if (winCondition === 'gangshangpao') {
    fans.push({ name: '杠上炮', fan: 1 })
  } else if (winCondition === 'qianggang') {
    fans.push({ name: '抢杠胡', fan: 1 }) 
  }

  return fans
}

function getBestStructure(tiles: number[]) {
  if (tiles.length % 3 !== 2) return null

  const unique = [...new Set(tiles)]
  for (const pairTile of unique) {
    const counts: Record<number, number> = {}
    tiles.forEach(t => counts[t] = (counts[t] || 0) + 1)
    if (counts[pairTile] >= 2) {
      const rem = [...tiles]
      rem.splice(rem.indexOf(pairTile), 1)
      rem.splice(rem.indexOf(pairTile), 1)
      const mentsu = extractMentsu(rem)
      if (mentsu !== null) {
        return { pair: pairTile, mentsuList: mentsu }
      }
    }
  }
  return null
}

function extractMentsu(tiles: number[]): Array<{ type: 'ke' | 'shun', tiles: number[] }> | null {
  if (tiles.length === 0) return []
  const sorted = [...tiles].sort((a, b) => a - b)
  const counts: Record<number, number> = {}
  sorted.forEach(t => counts[t] = (counts[t] || 0) + 1)
  const first = sorted[0]

  if (counts[first] >= 3) {
    const rem = [...sorted]
    for (let i = 0; i < 3; i++) rem.splice(rem.indexOf(first), 1)
    const rest = extractMentsu(rem)
    if (rest !== null) return [{ type: 'ke', tiles: [first, first, first] }, ...rest]
  }

  const n1 = idToNum(first)
  const next1 = first + 1, next2 = first + 2
  const suitOk = idToSuit(first) === idToSuit(next1) && idToSuit(first) === idToSuit(next2)
  if (suitOk && n1 <= 7 && counts[next1] >= 1 && counts[next2] >= 1) {
    const rem = [...sorted]
    rem.splice(rem.indexOf(first), 1)
    rem.splice(rem.indexOf(next1), 1)
    rem.splice(rem.indexOf(next2), 1)
    const rest = extractMentsu(rem)
    if (rest !== null) return [{ type: 'shun', tiles: [first, next1, next2] }, ...rest]
  }

  return null
}

export function getBestDiscards(tiles: number[]): Suggestion[] {
  const suggestions: Suggestion[] = []
  const unique = [...new Set(tiles)]

  unique.forEach(discardId => {
    const remaining = [...tiles]
    remaining.splice(remaining.indexOf(discardId), 1)
    const tingTiles = getTingTiles(remaining)
    suggestions.push({
      suit: idToSuit(discardId),
      num: idToNum(discardId),
      tingCount: tingTiles.length,
      tingTiles
    })
  })

  suggestions.sort((a, b) => b.tingCount - a.tingCount)
  return suggestions.slice(0, 5).filter(s => s.tingCount > 0)
}
