<template>
    <el-form :inline="true" :model="form" class="mb-2 hidden-sm-and-down" v-if="visible" label-width="auto">
      <el-form-item label="字典名称">
        <el-input v-model="form.dictName" placeholder="请输入字典名称" clearable />
      </el-form-item>
      <el-form-item label="字典类型">
        <el-input v-model="form.dictType" placeholder="请输入字典类型" clearable />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.status" placeholder="字典状态" clearable class="min-w-36">
          <el-option label="正常" value="0" />
          <el-option label="停用" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建日期">
        <el-date-picker v-model="dateRange" clearable type="daterange" unlink-panels range-separator="~"
          start-placeholder="开始日期" end-placeholder="结束日期" format="YYYY/MM/DD" value-format="YYYY/MM/DD" />
      </el-form-item>
  
      <el-form-item>
        <el-button type="primary" @click="handleSearch" :icon="Search">搜索</el-button>
        <el-button @click="handleReset" :icon="Refresh">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="false" :model="form" class="p-5 mb-5 border rounded-md border-ep hidden-sm-and-up" v-if="visible"
      label-width="auto">
      <el-form-item label="字典名称">
        <el-input v-model="form.dictName" placeholder="请输入字典名称" clearable />
      </el-form-item>
      <el-form-item label="字典类型">
        <el-input v-model="form.dictType" placeholder="请输入字典类型" clearable />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.status" placeholder="字典状态" clearable class="min-w-36">
          <el-option label="正常" value="0" />
          <el-option label="停用" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建日期">
        <el-date-picker v-model="dateRange" clearable type="daterange" unlink-panels range-separator="~"
          start-placeholder="开始日期" end-placeholder="结束日期" format="YYYY/MM/DD" value-format="YYYY/MM/DD" />
      </el-form-item>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-button type="primary" @click="handleSearch" :icon="Search" class="w-full">搜索</el-button>
        </el-col>
        <el-col :span="12">
          <el-button @click="handleReset" :icon="Refresh" class="w-full">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
  </template>
  
  <script setup lang='ts'>
  import { DictSearchForm } from "@/types/dict";
  import { Refresh, Search } from "@element-plus/icons-vue";
  
  defineProps<{
    visible: boolean
  }>();
  
  const emit = defineEmits<{
    (e: "search", data: DictSearchForm): void;
    (e: "reset", data: null): void;
  }>();
  
  const dateRange = ref('');
  const form = reactive<DictSearchForm>({
    dictName: '',
    dictType: '',
    status: '',
    beginTime: '',
    endTime: '',
  })
  
  const handleSearch = () => {
    emit("search", form);
  }
  
  const handleReset = () => {
    form.dictName = '';
    form.dictType = '';
    form.status = '';
    form.beginTime = '';
    form.endTime = '';
    dateRange.value = '';
    emit("reset", null);
  }
  
  </script>
  <style lang="scss" scoped></style>