<template>
  <div class="relative w-full h-full">
    <!-- <div
      class="absolute flex flex-col items-center text-white -translate-x-1/2 -translate-y-1/2 md:w-1/4 top-1/2 left-1/2"
    >
      <svg
        width="100"
        height="100"
        viewBox="0 0 17 35"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#FFF"
          d="m15.5752 19.0792a4.2055 4.2055 0 0 0 -2.01 3.5376 4.0931 4.0931 0 0 0 2.4908 3.7542 9.7779 9.7779 0 0 1 -1.2755 2.6351c-.7941 1.1431-1.6244 2.2862-2.8878 2.2862s-1.5883-.734-3.0443-.734c-1.42 0-1.9252.7581-3.08.7581s-1.9611-1.0589-2.8876-2.3584a11.3987 11.3987 0 0 1 -1.9373-6.1487c0-3.61 2.3464-5.523 4.6566-5.523 1.2274 0 2.25.8062 3.02.8062.734 0 1.8771-.8543 3.2729-.8543a4.3778 4.3778 0 0 1 3.6822 1.841zm-6.8586-2.0456a1.3865 1.3865 0 0 1 -.2527-.024 1.6557 1.6557 0 0 1 -.0361-.337 4.0341 4.0341 0 0 1 1.0228-2.5148 4.1571 4.1571 0 0 1 2.7314-1.4078 1.7815 1.7815 0 0 1 .0361.373 4.1487 4.1487 0 0 1 -.9867 2.587 3.6039 3.6039 0 0 1 -2.5148 1.3236z"
        />
      </svg>

      <h1 class="text-3xl text-center text-white">iPhone&nbsp;17&nbsp;Pro</h1>
    </div> -->
    <div class="absolute -translate-x-1/2 -translate-y-1/2 md:w-1/4 top-1/2 left-1/2">
      <svg class="hello__svg" viewBox="0 0 1230.94 414.57">
        <path
          d="M-293.58-104.62S-103.61-205.49-60-366.25c9.13-32.45,9-58.31,0-74-10.72-18.82-49.69-33.21-75.55,31.94-27.82,70.11-52.22,377.24-44.11,322.48s34-176.24,99.89-183.19c37.66-4,49.55,23.58,52.83,47.92a117.06,117.06,0,0,1-3,45.32c-7.17,27.28-20.47,97.67,33.51,96.86,66.93-1,131.91-53.89,159.55-84.49,31.1-36.17,31.1-70.64,19.27-90.25-16.74-29.92-69.47-33-92.79,16.73C62.78-179.86,98.7-93.8,159-81.63S302.7-99.55,393.3-269.92c29.86-58.16,52.85-114.71,46.14-150.08-7.44-39.21-59.74-54.5-92.87-8.7-47,65-61.78,266.62-34.74,308.53S416.62-58,481.52-130.31s133.2-188.56,146.54-256.23c14-71.15-56.94-94.64-88.4-47.32C500.53-375,467.58-229.49,503.3-127a73.73,73.73,0,0,0,23.43,33.67c25.49,20.23,55.1,16,77.46,6.32a111.25,111.25,0,0,0,30.44-19.87c37.73-34.23,29-36.71,64.58-127.53C724-284.3,785-298.63,821-259.13a71,71,0,0,1,13.69,22.56c17.68,46,6.81,80-6.81,107.89-12,24.62-34.56,42.72-61.45,47.91-23.06,4.45-48.37-.35-66.48-24.27a78.88,78.88,0,0,1-12.66-25.8c-14.75-51,4.14-88.76,11-101.41,6.18-11.39,37.26-69.61,103.42-42.24,55.71,23.05,100.66-23.31,100.66-23.31"
          transform="translate(311.08 476.02)"
          style="
            fill: none;
            stroke: #fff;
            stroke-linecap: round;
            stroke-miterlimit: 10;
            stroke-width: 35px;
            stroke-opacity: 0.3;
          "
        />
      </svg>
    </div>
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup lang="ts">
const canvasRef = ref<HTMLCanvasElement | null>(null);
let animationId: number = -1;
const width = ref(0);
const height = ref(0);
const ctx = ref<CanvasRenderingContext2D | null>();
// 配置星星层
const layers: {
  count: number;
  size: number;
  speed: number;
  stars: { x: number; y: number; size: number }[];
}[] = [
  { count: 100, size: 3, speed: 0.7, stars: [] }, // 大星，慢速
  { count: 200, size: 2, speed: 1, stars: [] }, // 小星，快速
  { count: 500, size: 1, speed: 1.5, stars: [] }, // 极小星，非常快速
];

const initStars = () => {
  const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  layers.forEach((layer) => {
    layer.stars = [];
    const loopCount = isMobile ? layer.count / 10 : layer.count;
    for (let i = 0; i < loopCount; i++) {
      layer.stars.push({
        x: Math.random() * width.value,
        y: Math.random() * height.value,
        size: layer.size,
      });
    }
  });
};

const draw = () => {
  if (!ctx.value) return;

  // 中心坐标和半径
  const centerX = width.value / 2;
  const centerY = height.value * 0.8; // 类似 CSS 的 "ellipse at bottom"
  const radius = Math.max(width.value, width.value);

  // 创建径向渐变
  const gradient = ctx.value.createRadialGradient(
    centerX,
    centerY,
    0,
    centerX,
    centerY,
    radius
  );
  gradient.addColorStop(0, "#1B2735"); // 中心颜色
  gradient.addColorStop(1, "#090A0F"); // 边缘颜色

  // 填充整个画布
  ctx.value.fillStyle = gradient;
  ctx.value.fillRect(0, 0, width.value, height.value);

  for (let layer of layers) {
    for (let star of layer.stars) {
      ctx.value.fillStyle = "white";
      ctx.value.beginPath();
      ctx.value.arc(star.x, star.y, star.size, 0, 2 * Math.PI);
      ctx.value.fill();

      // 更新位置
      star.y -= layer.speed;
      if (star.y <= 0) {
        star.y = height.value;
        star.x = Math.random() * width.value;
      }
    }
  }
  animationId = requestAnimationFrame(draw);
};

onMounted(() => {
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  initStars();
  draw();
});

const resizeCanvas = () => {
  if (!canvasRef.value) {
    return;
  }
  width.value = window.innerWidth;
  height.value = window.innerHeight;
  canvasRef.value.width = width.value;
  canvasRef.value.height = height.value;
  ctx.value = canvasRef.value!.getContext("2d");
};

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId);
  window.removeEventListener("resize", resizeCanvas);
});
</script>
<style>
.hello__svg {
  fill: none;
  stroke: #fff;
  stroke-opacity: 0.3;
  stroke-linecap: round;
  stroke-miterlimit: 10;
  stroke-width: 48px;
  stroke-dasharray: 5800px;
  stroke-dashoffset: 5800px;
  animation: anim__hello linear 5s forwards;

  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto;
  text-align: center;
}

@keyframes anim__hello {
  0% {
    stroke-dashoffset: 5800;
  }
  25% {
    stroke-dashoffset: 5800;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
</style>
