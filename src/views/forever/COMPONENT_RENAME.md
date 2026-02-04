# 组件重命名说明

## 组件名称变更

原组件名称：`Trae`
新组件名称：`DistortEffect`

## 变更原因

- `Trae` 名称不够直观，不能清楚表达组件功能
- `DistortEffect` 更准确地描述了组件的核心功能：扭曲效果
- 提高代码可读性和维护性

## 功能更新

### Tab 功能优化
- **快速预设**：只在文字模式下显示
- **图片模式**：切换到图片 Tab 时自动加载 Lorem Picsum 随机图片
- **智能切换**：根据内容类型自动切换到对应 Tab

### 默认图片设置
- 使用 Lorem Picsum 服务：`https://picsum.photos/800/600?random={id}`
- 每次切换到图片模式都会生成新的随机图片
- 图片尺寸：800x600 像素

### 参数范围扩展
- **网格密度**: 3-50 (更大的调节范围)
- **鼠标影响半径**: 0.05-1.0 (更精细的控制)
- **扭曲强度**: 0.01-1.0 (从微妙到强烈)
- **恢复速度**: 0.5-0.999 (更高精度控制)

## 使用方式

### 导入组件
```vue
<script setup>
import DistortEffect from '@/components/DistortEffect/index.vue'
</script>
```

### 基本使用
```vue
<template>
  <DistortEffect 
    text="Hello World"
    background-color="#000000"
    text-color="#ffffff"
  />
</template>
```

## 文件结构

```
src/components/DistortEffect/
├── index.vue          # 主组件文件
├── demo.vue          # 演示页面
├── test.vue          # 测试页面
├── simple-test.vue   # 简单测试
└── README.md         # 组件文档
```