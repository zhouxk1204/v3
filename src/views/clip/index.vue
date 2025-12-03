<template>
  <div class="w-screen h-screen">
      <Trae
      text="HELLO"
      :gridSize="15"
      :mouseRadius="0.25"
      :relaxation="0.9"
    />
    </div>
  <!-- <div class="w-[90%] mx-auto"> -->
    

    <!-- <h1 class="w-full mb-10 text-4xl font-bold text-center">制作圆角图片</h1>
    <div class="flex gap-4">
      <div class="flex flex-col flex-1 gap-3">
        <h2 class="text-2xl font-bold">图片预览</h2>
        <div class="flex justify-center w-full border board">
          <div class="h-[600px] relative">
            <img
              v-if="previewUrl"
              :src="previewUrl"
              class="absolute inset-0 z-10 h-[600px]"
            />
            <div
              v-if="previewUrl"
              class="absolute inset-0 z-20 bg-black bg-opacity-60 h-[600px]"
            ></div>
            <img
              v-if="previewUrl"
              :src="previewUrl"
              class="relative z-30 h-[600px]"
              ref="previewImg"
              :style="{
                'border-radius': radius + 'px',
              }"
            />
          </div>
        </div>
        <div>
          <label
            for="upload"
            class="block px-4 py-4 text-xl text-center text-white bg-blue-600 rounded shadow cursor-pointer hover:bg-blue-500 focus:outline-none"
          >
            上传图片
          </label>
          <input
            type="file"
            id="upload"
            class="hidden"
            @change="onFileChange"
          />
        </div>
      </div>

      <div class="flex-1">
        <div class="mt-4">
          <label>圆角：{{ radius }}px</label>
          <input type="range" min="0" :max="maxRadius" v-model="radius" />
        </div>

        <select name="format" id="format" v-model="format">
          <option value="png">PNG</option>
          <option value="jpg">JPG</option>
          <option value="webp">WEBP</option>
        </select> -->
        <!-- 
        <button
          class="px-4 py-2 text-center text-white bg-blue-600 rounded shadow cursor-pointer hover:bg-blue-500 focus:outline-none"
          @click="downloadCropped"
        >
          下载裁剪后的图片
        </button> -->
        <!-- <Button @click="downloadCropped">下载裁剪后的图片</Button>
      </div>
    </div>

    <div class="flex gap-5">
      <FlippingCard class="flex-1"></FlippingCard>
      <FlippingCard class="flex-1"></FlippingCard>
      <FlippingCard class="flex-1"></FlippingCard>
    </div> -->
  <!-- </div> -->
</template>
<script setup lang="ts">
import { ref } from "vue";
import Trae from "../../components/Trae/index.vue";
const previewUrl = ref<string | null>(null);
const radius = ref(30);
const previewImg = ref<HTMLImageElement | null>(null);
const maxRadius = ref(20);
const format = ref("png");


const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("请选择图片文件");
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    previewUrl.value = reader.result as string;

    // 加载图片计算最大圆角
    const img = new Image();
    img.src = reader.result as string;
    img.onload = () => {
      // 获取 CSS 显示尺寸
      const cssW = previewImg.value?.clientWidth || 0;
      const cssH = previewImg.value?.clientHeight || 0;

      // 按显示区域来算最大可圆角
      const maxCssRadius = Math.min(cssW, cssH) / 2;
      // 转换为真实像素最大圆角
      maxRadius.value = maxCssRadius;
    };
  };

  reader.readAsDataURL(file);
};

const downloadCropped = () => {
  const img = previewImg.value;
  if (!img) return;

  // 图片真实像素
  const realWidth = img.naturalWidth;
  const realHeight = img.naturalHeight;
  // CSS 显示尺寸
  const cssWidth = img.clientWidth;

  // 比例（CSS → 实际像素）
  const scaleX = realWidth / cssWidth;

  // 将 CSS 圆角 px 转换为真实像素圆角
  const realRadius = radius.value * scaleX;

  const canvas = document.createElement("canvas");
  canvas.width = realWidth;
  canvas.height = realHeight;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, realWidth, realHeight);

  const r = realRadius;

  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(realWidth - r, 0);
  ctx.arc(realWidth - r, r, r, -Math.PI / 2, 0);
  ctx.lineTo(realWidth, realHeight - r);
  ctx.arc(realWidth - r, realHeight - r, r, 0, Math.PI / 2);
  ctx.lineTo(r, realHeight);
  ctx.arc(r, realHeight - r, r, Math.PI / 2, Math.PI);
  ctx.lineTo(0, r);
  ctx.arc(r, r, r, Math.PI, Math.PI * 1.5);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(img, 0, 0, realWidth, realHeight);

  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/" + format.value);
  a.download = "rounded_" + Date.now() + "." + format.value;
  a.click();
};
</script>
<style>
.board {
  --size: 24px; /* 每个小格的边长，改这个值改变棋盘格尺寸 */
  --light: #ffffff; /* 亮色（白色） */
  --dark: #d0d0d0; /* 暗色（灰色） */

  background-color: var(--dark); /* 作为底色（另一种颜色） */

  /* 两个相同的 45deg 线性渐变，第二个偏移 half-size，叠加成棋盘格 */
  background-image: linear-gradient(
      45deg,
      var(--light) 25%,
      transparent 25%,
      transparent 75%,
      var(--light) 75%,
      var(--light) 100%
    ),
    linear-gradient(
      45deg,
      var(--light) 25%,
      transparent 25%,
      transparent 75%,
      var(--light) 75%,
      var(--light) 100%
    );
  background-size: var(--size) var(--size);
  background-position: 0 0, calc(var(--size) / 2) calc(var(--size) / 2);

  /* 视觉优化（可选）*/
  border: 1px solid #999;
  box-sizing: border-box;
}
</style>
