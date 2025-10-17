<template>
  <el-form
    :inline="true"
    :model="form"
    class="mb-2 hidden-sm-and-down"
    v-if="visible"
    label-width="auto"
  >
    <el-form-item label="文件名称">
      <el-input v-model="form.name" placeholder="请输入文件名称" clearable />
    </el-form-item>
    <el-form-item label="文件类型">
      <el-select
        v-model="form.typeId"
        placeholder="文件类型"
        clearable
        class="min-w-36"
      >
        <el-option label="图片" value="0" />
        <el-option label="音乐" value="1" />
      </el-select>
    </el-form-item>
    <el-form-item label="状态">
      <el-select
        v-model="form.statusId"
        placeholder="文件状态"
        clearable
        class="min-w-36"
      >
        <el-option label="正常" value="0" />
        <el-option label="停用" value="1" />
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleSearch" :icon="Search"
        >搜索</el-button
      >
      <el-button @click="handleReset" :icon="Refresh">重置</el-button>
    </el-form-item>
  </el-form>
  <el-form
    :inline="false"
    :model="form"
    class="p-5 mb-5 border rounded-md border-ep hidden-sm-and-up"
    v-if="visible"
    label-width="auto"
  >
    <el-form-item label="文件名称">
      <el-input v-model="form.name" placeholder="请输入文件名称" clearable />
    </el-form-item>
    <el-form-item label="文件类型">
      <el-select
        v-model="form.typeId"
        placeholder="文件类型"
        clearable
        class="min-w-36"
      >
        <el-option label="图片" value="0" />
        <el-option label="音乐" value="1" />
      </el-select>
    </el-form-item>
    <el-form-item label="状态">
      <el-select
        v-model="form.statusId"
        placeholder="文件状态"
        clearable
        class="min-w-36"
      >
        <el-option label="正常" value="0" />
        <el-option label="停用" value="1" />
      </el-select>
    </el-form-item>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-button
          type="primary"
          @click="handleSearch"
          :icon="Search"
          class="w-full"
          >搜索</el-button
        >
      </el-col>
      <el-col :span="12">
        <el-button @click="handleReset" :icon="Refresh" class="w-full"
          >重置</el-button
        >
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { FileSearchForm } from "@/types/files.d";
import { Refresh, Search } from "@element-plus/icons-vue";
import { reactive } from "vue";

defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: "search", data: FileSearchForm): void;
  (e: "reset", data: null): void;
}>();

const form = reactive<FileSearchForm>({
  name: "",
  typeId: "",
  statusId: "",
});

const handleSearch = () => {
  emit("search", form);
};

const handleReset = () => {
  form.name = "";
  form.typeId = "";
  form.statusId = "";
  emit("reset", null);
};
</script>
