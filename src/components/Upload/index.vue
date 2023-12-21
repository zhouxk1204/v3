<template>
  <div>
    <Button @click="selectFile" type="success">
      <slot></slot>
    </Button>
    <input
      type="file"
      ref="inputRef"
      @change="onChange"
      accept=".xlsx, .xls"
      v-show="false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import * as XLSX from "xlsx";

const inputRef = ref();

const emit = defineEmits<{
  data: any[];
}>();

/**
 * 上传文件事件
 */
const selectFile = (): void => {
  inputRef.value.click();
};

/**
 * 文件上传事件
 * @param event
 */
const onChange = (event: any) => {
  const fileInput = event.target;
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const excelData = XLSX.utils.sheet_to_json(worksheet);
      emit("data", excelData);
      // 清空文件输入框的值，（防止相同文件导入无效）
      fileInput.value = null;
    };

    reader.readAsArrayBuffer(file);
  }
};
</script>
<style lang="scss" scoped></style>
