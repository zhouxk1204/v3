<template>
  <el-row justify="space-between" class="mb-4">
    <el-col :span="19">
      <el-button type="primary" plain :icon="Plus" @click="handleAdd">
        新增
      </el-button>
      <el-button type="success" plain :icon="Edit" :disabled="!(multipleSelection.length === 1)" @click="handleEdit()">
        修改
      </el-button>
      <el-button type="danger" plain :icon="Delete" :disabled="multipleSelection.length === 0" @click="handleDelete()">
        删除
      </el-button>
      <slot></slot>
    </el-col>
    <el-col :span="5">
      <el-row justify="end">
        <el-tooltip effect="dark" :content="true ? '隐藏搜索' : '显示搜索'" placement="top">
          <el-button :icon="Search" circle />
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
          <el-link type="danger" :underline="false" @click="handleDelete([scope.row.id])">
            删除
          </el-link>
        </el-space>
      </template>
    </el-table-column>
  </el-table>

</template>

<script setup lang='ts'>
import { Delete, Edit, Plus, Refresh, Search } from "@element-plus/icons-vue";

const props = defineProps<{
  columns: { field: string; label: string }[],
  tableData: any[]
}>();

const multipleSelection: any[] = [];
const handleAdd = () => { }
const handleEdit = (data?: any) => { }
const handleDelete = (data?: any) => { }
const refresh = () => { }

const handleSelectionChange = () => { }
</script>