<template>
  <div class="w-full h-full">
    <canvas id="canvas" width="900px" height="600px"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ReportTable } from '@/config/table.config';
import { onMounted } from 'vue';

const reportCols = ReportTable;
console.log("%c Line:12 🥛 reportCols", "color:#e41a6a", reportCols);
// const colHeight = 22

onMounted(() => {
  // 使用示例
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  const tableData = [
    ['姓名', '系数', '手术总工分', '季度3', '季度4'],
    ['手机', '1200', '1500', '1800', '2100'],
    ['电脑', '800', '950', '1100', '1300'],
    ['平板', '600', '700', '850', '900']
  ];

  drawAdvancedTable(ctx, {
    data: tableData,
    x: 30,
    y: 30,
    cellWidth: 73,
    cellHeight: 19,
    fontSize: 14
  });
  // const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  // const canvasWidth = canvas.width;
  // console.log(canvasWidth);
  // const ctx = canvas.getContext('2d');
  // if (!ctx) return;
  // ctx.fillStyle = 'red'; // 设置填充颜色为白色
  // ctx.fillRect(0, 0, canvas.width, canvas.height); // 填充整个 Canvas

  // const path1 = new Path2D();
  // path1.moveTo(0, 2);
  // path1.lineTo(canvasWidth, 2);

  // const path2 = new Path2D();
  // path2.moveTo(0, colHeight);
  // path2.lineTo(canvasWidth, colHeight);
  // ctx.lineWidth = 1;
  // ctx.stroke(path1);
  // ctx.stroke(path2);

  // for(let i = 0; i < 8; i++){
  //   const path1 = new Path2D();
  //   path1.moveTo(0, 0 + i * colHeight + 1);
  //   path1.lineTo(canvasWidth, 0 + i * colHeight + 1);
  //   ctx.stroke(path1);
  // }

  // for(let i = 0; i < 8; i++){
  //   const path1 = new Path2D();
  //   path1.moveTo(0, 0 + i * colHeight + 1);
  //   path1.lineTo(colHeight * 6, 0 + i * colHeight + 1);
  //   ctx.stroke(path1);
  // }


  // ctx.textBaseline = 'middle'; // 设置垂直居中
  // ctx.font = '11px Calibri, Arial, sans-serif';
  // const colCount = reportCols.length;
  // const colWidth = Math.ceil(canvasWidth / colCount);
  // console.log(colWidth);
  // for (let index = 0; index < colCount; index++) {
  //   const text = reportCols[index].label;
  //   console.log("%c Line:41 🥤 text", "color:#ea7e5c", text);
  //   const textWidth = ctx.measureText(text).width; // 获取文字宽度
  //   const x = (colWidth - textWidth) / 2 + colWidth * index; // 水平居中
  //   const y = colHeight / 2 + 2; // 垂直居中
  //   ctx.fillText(text, x, y); // 绘制文字
  // }
  // ctx.fillStyle = 'red';
  // ctx.fillRect(10, 10, 100, 100);
  // downloadCanvasImage(canvas, 'image.png');
});


// const downloadCanvasImage = (canvas: HTMLCanvasElement, filename = 'image.png') => {
//   const imageURL = canvas.toDataURL('image/png'); // 生成图片数据
//   const link = document.createElement('a'); // 创建 <a> 标签
//   link.href = imageURL; // 设置图片数据为链接
//   link.download = filename; // 设置下载文件名
//   document.body.appendChild(link); // 将链接添加到页面
//   link.click(); // 触发下载
//   document.body.removeChild(link); // 移除链接
// }

const drawAdvancedTable = (ctx: any, options: any) => {
  const {
    data,
    x,
    y,
    cellWidth = 100,
    cellHeight = 40,
    headerBgColor ='#ffffff',
    cellBgColor = '#ffffff',
    borderColor ='#000000',
    textColor = '#000000',
    headerTextColor = '#000000',
    fontSize = 14,
    fontFamily = 'SimSun, Songti SC, serif'
  } = options;

  // 设置细线样式
  ctx.lineWidth = 0.5;
  const rows = data.length;
  const cols = data[0].length;

  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.textBaseline = 'middle';

  // 绘制表格内容
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cellX = x + j * cellWidth;
      const cellY = y + i * cellHeight;

      // 设置单元格背景色
      ctx.fillStyle = i === 0 ? headerBgColor : cellBgColor;
      ctx.fillRect(cellX, cellY, cellWidth, cellHeight);

      // 绘制单元格边框
      ctx.strokeStyle = borderColor;
      ctx.strokeRect(cellX, cellY, cellWidth, cellHeight);

      // 设置文本颜色
      ctx.fillStyle = i === 0 ? headerTextColor : textColor;

      // 绘制文本（居中显示）
      const text = data[i][j].toString();
      const textWidth = ctx.measureText(text).width;
      ctx.fillText(
        text,
        cellX + (cellWidth - textWidth) / 2,
        cellY + cellHeight / 2
      );
    }
  }
}
</script>
