# 成都麻将模拟器 - Vue3 + TypeScript 组件

这是从原始 HTML 文件改造的 Vue3 + TypeScript 版本的成都麻将模拟器。

## 文件结构

```
├── MahjongGame.vue       # 主组件（容器）
├── MahjongHeader.vue     # 头部组件
├── HandDisplay.vue       # 手牌显示组件
├── MahjongTile.vue       # 麻将牌组件（使用雪碧图）
├── TileSelector.vue      # 选牌器组件
├── ResultPanel.vue       # 结果面板组件
├── WinModal.vue          # 胡牌确认弹窗
├── ContextMenu.vue       # 右键菜单组件
├── mahjongLogic.ts       # 麻将逻辑（胡牌判断、番数计算等）
└── mahjong-sprite.png    # 麻将牌雪碧图（需要从原项目复制）
```

## 使用方法

### 1. 复制文件到你的项目

将所有 `.vue` 和 `.ts` 文件复制到你的项目中，例如 `src/components/mahjong/`

### 2. 复制雪碧图

将 `mahjong-sprite.png` 复制到 `public/` 目录或组件同级目录

### 3. 在你的应用中使用

```vue
<template>
  <MahjongGame />
</template>

<script setup lang="ts">
import MahjongGame from './components/mahjong/MahjongGame.vue'
</script>
```

### 4. 添加字体（可选）

在你的 `index.html` 中添加：

```html
<link href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet">
```

或在 CSS 中引入：

```css
@import url('https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=Noto+Sans+SC:wght@300;400;500;700&display=swap');
```

## 功能特性

- ✅ 选牌：点击选择万、条、饼牌
- ✅ 手牌管理：显示当前手牌，支持撤销和清空
- ✅ 碰/杠：右键点击手牌可设置碰（3张）或杠（4张）
- ✅ 缺门检测：自动检测缺一门
- ✅ 听牌判断：13张牌时判断是否听牌
- ✅ 胡牌判断：14张牌时判断是否可胡
- ✅ 番数计算：支持平胡、对对胡、清一色、七对、自摸等
- ✅ 出牌建议：提供最优出牌策略

## 技术栈

- Vue 3 Composition API
- TypeScript
- CSS3（雪碧图背景定位）

## 组件说明

### MahjongGame.vue
主容器组件，管理整体状态和逻辑流程。

### MahjongTile.vue
单个麻将牌组件，使用雪碧图技术渲染牌面。支持两种尺寸（normal/small）和三种状态（normal/peng/gang）。

### mahjongLogic.ts
核心逻辑模块，包含：
- `canWin()` - 判断是否可胡牌
- `getTingTiles()` - 获取听牌列表
- `calcFan()` - 计算番数
- `getBestDiscards()` - 获取最优出牌建议

## 注意事项

1. 确保 `mahjong-sprite.png` 路径正确
2. 雪碧图规格：400×1200px，每格 100×133px
3. 列顺序：饼(0)、条(1)、万(2)
4. 行顺序：1-9 对应行 0-8

## 自定义样式

所有样式都使用 scoped CSS，可以通过修改各组件的 `<style>` 部分来自定义外观。

主要 CSS 变量在 `MahjongGame.vue` 中定义：
- 背景色：`#16301f`
- 主色调：`#c9a84c`（金色）
- 文字色：`#f5f0e8`（象牙白）
