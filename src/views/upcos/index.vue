<template>
  <div class="p-10">
    <UploadCos :cosOption="cosOption"></UploadCos>
  </div>
</template>

<script setup lang='ts'>
import { CosOption } from '@/components/UploadCos/index.vue';

const cosOption = ref<CosOption>({
  bucket: 'peach-1322235980', // 存储桶
  region: 'ap-chengdu', // 地区
  prefix: '/music/', // 存储桶文件夹路径 /xx/
})
</script>