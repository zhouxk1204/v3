export interface Confetti {
  id: number;
  // 下落
  fallX: number        // 水平偏移量
  startY: number       // 起始Y坐标
  endY: number         // 结束Y坐标
  fallZStart: number   // 起始Z坐标（深度）
  fallZEnd: number     // 结束Z坐标（深度）

  // 摆动
  swayX: number        // 左右摆幅
  swayZ: number        // Z轴摆幅

  // 旋转
  spinX: number        // X轴旋转度数
  spinY: number        // Y轴旋转度数
  spinZ: number        // Z轴旋转度数

  // 动画时间
  fallDuration: number
  swayDuration: number
  spinDuration: number

  // 延迟
  delay: number

  // 可选：颜色、大小等
  hue?: number
  width?: number
  height?: number
}
