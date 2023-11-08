<template>
  <header class="relative h-20" @mousemove="mousemove" ref="headerRef">
    <div v-for="item in banners" class="absolute top-0 left-0 w-full h-20">
      <img :src="item" class="h-20 w-[110%] object-cover" ref="imageRefs" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";

const imageRefs = ref();
const headerRef = ref();

const banners = Object.keys(
  import.meta.glob("@/assets/img/banner/*.{png,jpg,gif,svg,webp}")
);

const mousemove = (e: any) => {
  let percentage = e.clientX / window.outerWidth;
  let offset = 10 * percentage;
  let blur = 20;

  for (let [index, image] of imageRefs.value.entries()) {
    offset *= 1.3;

    let blurValue =
      Math.pow(index / imageRefs.value.length - percentage, 2) * blur;

    image.style.transform = `translatex(${offset}px)`;
    image.style.filter = `blur(${blurValue}px)`;
  }
};

onBeforeUnmount(() => {
  // 在组件卸载时清理引用
  imageRefs.value = [];
});
</script>
<style lang="scss" scoped></style>
