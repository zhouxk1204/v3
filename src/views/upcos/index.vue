<template>
  <div class="p-10">
    <UploadCos :cosOption="cosOption"></UploadCos>
  </div>
</template>

<script setup lang='ts'>
import { CosOption } from '@/components/UploadCos/index.vue';
const env: ImportMetaEnv = import.meta.env;

const cosOption = ref<CosOption>({
  bucket: env.APP_COS_BUCKET, // 存储桶
  region: env.APP_COS_REGION, // 地区
  prefix: '/music/', // 存储桶文件夹路径 /xx/
  stsUrl: env.APP_COS_BUCKET_STS_URL,
  cosDomain: env.APP_COS_BUCKET_DOMAIN
})

</script>