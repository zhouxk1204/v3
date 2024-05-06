<template>
  <el-form :inline="true" :model="form" class="mb-2" v-if="visible">
    <el-form-item label="字典名称">
      <el-input v-model="form.dictType" placeholder="请输入字典名称" clearable />
    </el-form-item>
    <el-form-item label="字典标签">
      <el-input v-model="form.dictLabel" placeholder="请输入字典标签" clearable />
    </el-form-item>
    <el-form-item label="状态">
      <el-select v-model="form.status" placeholder="状态" clearable class="min-w-36">
        <el-option label="正常" value="0" />
        <el-option label="停用" value="1" />
      </el-select>
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
import { DictSearchForm } from "@/types/dict";
import { Refresh, Search } from "@element-plus/icons-vue";

defineProps<{
  visible: boolean
}>();

const emit = defineEmits<{
  (e: "search", data: DictSearchForm): void;
  (e: "reset", data: null): void;
}>();

const form = reactive<DictDetailSearchForm>({
  dictType: '',
  dictLabel: '',
  status: '',
})

const handleSearch = () => {
  emit("search", form);
}

const handleReset = () => {
  form.dictType = '';
  form.dictLabel = '';
  form.status = '';
  emit("reset", null);
}

</script>