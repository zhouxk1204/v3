<template>
  <el-upload
    ref="upload"
    :on-change="onChange"
    :auto-upload="false"
    :show-file-list="false"
    accept=".xlsx, .xls"
  >
    <template #trigger>
      <el-button type="primary">
        <slot></slot>
      </el-button>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import { useExcel } from "@/hooks/useExcel";
import {
  UploadFile,
  UploadProps,
} from "element-plus/es/components/upload/src/upload";

const emit = defineEmits<{
  (e: "change", data: any[]): void;
}>();

const { parseExcel } = useExcel();
const onChange: UploadProps["onChange"] = async (uploadFile: UploadFile) => {
  const file = uploadFile.raw;
  const res = file ? await parseExcel(file) : [];
  emit("change", res);
};
</script>
