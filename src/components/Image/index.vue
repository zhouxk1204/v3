<template>
  <el-image :src="src" :class="rounded ? 'rounded-full' : 'rounded-none'">
    <template #placeholder>
      <div class="flex items-center justify-center w-full h-full "><el-icon>
          <Loading />
        </el-icon></div>
    </template>
    <template #error>
      <div class="flex items-center justify-center w-full h-full">
        <el-icon>
          <Picture />
        </el-icon>
      </div>
    </template>
  </el-image>
</template>

<script setup lang='ts'>
import { Loading, Picture } from "@element-plus/icons-vue";
defineProps<{
  src: string;
  rounded?: boolean;
}>();



</script>
<style lang="scss" scoped></style>