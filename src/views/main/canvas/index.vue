<template>
  <div class="w-full h-full">
    <canvas id="canvas" width="1200px" height="600px"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ReportTable } from '@/config/table.config';
import { onMounted } from 'vue';

const reportCols = ReportTable;
const colHeight = 22

onMounted(() => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const canvasWidth = canvas.width;
  console.log(canvasWidth);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.fillStyle = 'white'; // 设置填充颜色为白色
  ctx.fillRect(0, 0, canvas.width, canvas.height); // 填充整个 Canvas

  const path1 = new Path2D();
  path1.moveTo(0, 2);
  path1.lineTo(canvasWidth, 2);

  const path2 = new Path2D();
  path2.moveTo(0, colHeight);
  path2.lineTo(canvasWidth, colHeight);
  ctx.lineWidth = 1;
  ctx.stroke(path1);
  ctx.stroke(path2);

  ctx.textBaseline = 'middle'; // 设置垂直居中
  ctx.font = '11px Calibri, Arial, sans-serif';
  const colCount = reportCols.length;
  const colWidth = Math.ceil(canvasWidth / colCount);
  console.log(colWidth);
  for (let index = 0; index < colCount; index++) {
    const text = reportCols[index].label;
    const textWidth = ctx.measureText(text).width; // 获取文字宽度
    const x = (colWidth - textWidth) / 2 + colWidth * index; // 水平居中
    const y = colHeight / 2 + 2; // 垂直居中
    ctx.fillText(text, x, y); // 绘制文字
  }
  // ctx.fillStyle = 'red';
  // ctx.fillRect(10, 10, 100, 100);
  downloadCanvasImage(canvas, 'image.png');
});


const downloadCanvasImage = (canvas: HTMLCanvasElement, filename = 'image.png') => {
  const imageURL = canvas.toDataURL('image/png'); // 生成图片数据
  const link = document.createElement('a'); // 创建 <a> 标签
  link.href = imageURL; // 设置图片数据为链接
  link.download = filename; // 设置下载文件名
  document.body.appendChild(link); // 将链接添加到页面
  link.click(); // 触发下载
  document.body.removeChild(link); // 移除链接
}
</script>
