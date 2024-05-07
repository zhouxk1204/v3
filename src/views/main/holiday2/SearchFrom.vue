<template>
  <el-form :inline="true" :model="form" class="mb-2" v-if="visible">
    <el-form-item label="节假日名称">
      <el-input v-model="form.dictName" placeholder="请输入字典名称" clearable />
    </el-form-item>
    <el-form-item label="节假日类别">
      <el-input v-model="form.dictType" placeholder="请输入字典类型" clearable />
    </el-form-item>
    <el-form-item label="年度">
      <el-date-picker v-model="form.year" type="year" placeholder="年份" format="YYYY" value-format="YYYY" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleSearch" :icon="Search">搜索</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="handleReset" :icon="Refresh">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang='ts'>
import { HolidaySearchForm } from "@/types/holiday";
import { Refresh, Search } from "@element-plus/icons-vue";

defineProps<{
  visible: boolean
}>();

const emit = defineEmits<{
  (e: "search", data: HolidaySearchForm): void;
  (e: "reset", data: null): void;
}>();

const dateRange = ref('');
const form = reactive<HolidaySearchForm>({
  code: '',
  year: '',
  typeValue: '',
})

const handleSearch = () => {
  emit("search", form);
}

const handleReset = () => {
  form.code = '';
  form.year = '';
  form.typeValue = '';
  emit("reset", null);
}
</script>