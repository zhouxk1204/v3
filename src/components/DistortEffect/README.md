# DistortEffect 扭曲效果组件

一个基于 Three.js 的文字/图片扭曲效果组件，支持鼠标交互。

## Props

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `text` | String | `''` | 显示的文字内容 |
| `imageUrl` | String | `''` | 图片地址（与text二选一） |
| `backgroundColor` | String | `'transparent'` | 背景颜色，支持任何CSS颜色值 |
| `textColor` | String | `'rgba(255, 255, 255, 0.9)'` | 文字颜色，支持任何CSS颜色值 |
| `grid` | Number | `15` | 网格密度，影响扭曲效果的精细度 |
| `mouseRadius` | Number | `0.25` | 鼠标影响半径 |
| `strength` | Number | `0.15` | 扭曲强度 |
| `relaxation` | Number | `0.9` | 恢复速度 |

## 使用示例

### 基础文字显示
```vue
<template>
  <DistortEffect text="Hello World" />
</template>
```

### 自定义颜色
```vue
<template>
  <DistortEffect 
    text="DISTORT"
    background-color="transparent"
    text-color="#ff6b6b"
  />
</template>
```

### 使用图片
```vue
<template>
  <DistortEffect 
    image-url="/path/to/image.jpg"
    :grid="20"
    :strength="0.2"
  />
</template>
```

### 完整配置
```vue
<template>
  <DistortEffect 
    text="扭曲效果"
    background-color="rgba(0, 0, 0, 0.8)"
    text-color="rgba(255, 255, 255, 0.9)"
    :grid="15"
    :mouse-radius="0.25"
    :strength="0.15"
    :relaxation="0.9"
  />
</template>
```

## 颜色支持

### backgroundColor
- 支持任何CSS颜色值
- `transparent` - 透明背景
- `#000000` - 十六进制颜色
- `rgba(0, 0, 0, 0.5)` - RGBA颜色
- `red` - CSS颜色名称

### textColor
- 支持任何CSS颜色值
- 建议使用带透明度的颜色以获得更好的视觉效果
- 默认为半透明白色

## 特性

- ✅ 自适应容器大小
- ✅ 智能字体大小计算
- ✅ 响应式设计
- ✅ 鼠标交互扭曲效果
- ✅ 支持文字和图片
- ✅ 自定义背景和文字颜色
- ✅ 实时颜色更新
- ✅ 内存管理和资源清理

## 注意事项

1. 组件需要明确的容器尺寸才能正常工作
2. 文字模式下会自动计算最佳字体大小以充满容器
3. 颜色变化会实时更新，无需重新挂载组件
4. 建议在容器上设置最小高度以确保可见性