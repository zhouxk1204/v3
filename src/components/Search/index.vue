<template>
  <el-form :inline="!isMobile" :model="formModel" :class="isMobile ? 'px-5 pt-5 border rounded-md border-ep' : ''"
    label-width="auto">

    <template v-for="item in form">
      <el-form-item :label="item.label">
        <!-- 输入框 -->
        <el-input v-model="formModel[item.field]" :placeholder="item.placeholder ?? '请输入' + item.label" clearable
          v-if="item.type === 'text'" />
        <!-- 年份 -->
        <el-date-picker v-else-if="item.type === 'year'" v-model="formModel[item.field]" class="min-w-40" type="year"
          :placeholder="item.placeholder ?? '请选择' + item.label" format="YYYY" value-format="YYYY" clearable />
        <!-- 下拉选项 -->
        <el-select-v2 v-else-if="item.type === 'select'" v-model="formModel[item.field]" class="min-w-40"
          :placeholder="item.placeholder ?? '请选择' + item.label" clearable :options="item.options ?? []" />
      </el-form-item>
    </template>

    <el-form-item>
      <el-button type="primary" @click="handleSearch" :icon="Search">搜索</el-button>
      <el-button @click="handleReset" :icon="Refresh">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang='ts'>
import { FormItem } from "@/types/common";
import { Refresh, Search } from "@element-plus/icons-vue";
import cloneDeep from 'lodash/cloneDeep';
// 监听窗口大小变化
const isMobile = ref(window.innerWidth < 768);

const props = defineProps<{
  form: FormItem[],
}>();

const emit = defineEmits<{
  (e: "search", data: any): void;
}>();

const formModel = ref(props.form.reduce((acc, item) => {
  acc[item.field] = item.value;
  return acc;
}, {} as Record<string, any>));

const handleSearch = () => {
  emit("search", cloneDeep(formModel.value));
}

const handleReset = () => {
  Object.keys(formModel.value).forEach(key => {
    formModel.value[key] = '';
  });
  emit("search", {});
}
</script>