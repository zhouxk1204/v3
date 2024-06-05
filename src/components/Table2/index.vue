<template>
  <el-row justify="space-between" class="mb-4">
    <el-col :span="19">
      <el-button type="primary" plain :icon="Plus" @click="handleAdd">
        新增
      </el-button>
      <el-button type="success" plain :icon="Edit" :disabled="!(multipleSelection.length === 1)"
        @click="handleEdit(multipleSelection[0])">
        修改
      </el-button>
      <el-button type="danger" plain :icon="Delete" :disabled="multipleSelection.length === 0"
        @click="handleDelete(multipleSelection)">
        删除
      </el-button>
      <el-button v-if="back" type="warning" plain :icon="Close" @click="handleClose">关闭</el-button>
      <slot></slot>
    </el-col>
    <el-col :span="5">
      <el-row justify="end">
        <el-tooltip effect="dark" :content="true ? '隐藏搜索' : '显示搜索'" placement="top">
          <el-button :icon="Search" circle @click="onToggle" />
        </el-tooltip>
        <el-tooltip effect="dark" content="刷新" placement="top">
          <el-button :icon="Refresh" circle @click="refresh()" />
        </el-tooltip>
      </el-row>
    </el-col>
  </el-row>

  <el-table :data="tableData" class="w-full hidden-sm-and-down" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="40" />

    <el-table-column v-for="item in columns" :label="item.label" align="center">
      <template #default="scope">
        <el-tag v-if="item.style === 'tag'">{{ scope.row[item.field] }}</el-tag>
        <span v-else>{{ scope.row[item.field] }}</span>
      </template>
    </el-table-column>

    <el-table-column label="操作" align="center">
      <template #default="scope">
        <el-space :size="10">
          <el-link type="primary" :underline="false" @click="handleEdit(scope.row)">
            编辑
          </el-link>
          <el-link type="danger" :underline="false" @click="handleDelete([scope.row])">
            删除
          </el-link>
        </el-space>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang='ts'>
import { Close, Delete, Edit, Plus, Refresh, Search } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

defineProps<{
  columns: { field: string; label: string; style?: string }[],
  tableData: any[]
  back?: boolean
}>();

const emit = defineEmits<{
  (e: "add", data: null): void,
  (e: "edit", data: any): void,
  (e: "delete", data: any[]): void,
  (e: "refresh", data: null): void,
  (e: "toggle", data: null): void,
}>();

const multipleSelection = ref<any[]>([]);
const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val;
}

const handleAdd = () => {
  emit('add', null);
}

const handleEdit = (data: any) => {
  emit('edit', data);
}

const handleDelete = (data: any[]) => {
  emit('delete', data);
}

const refresh = () => {
  emit('refresh', null);
}

const onToggle = () => {
  emit('toggle', null);
}

const router = useRouter();
const handleClose = () => {
  router.back();
}
</script>