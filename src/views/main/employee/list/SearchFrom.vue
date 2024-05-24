<template>
  <el-form :inline="!isMobile" :model="form" :class="isMobile ? 'px-5 pt-5 border rounded-md border-ep' : ''"
    v-if="visible" label-width="auto">
    <el-form-item label="员工姓名">
      <el-input v-model="form.name" placeholder="请输入员工姓名" clearable />
    </el-form-item>
    <el-form-item label="员工性别">
      <el-select v-model="form.genderId" placeholder="员工性别" clearable class="min-w-36">
        <el-option label="女" value="0" />
        <el-option label="男" value="1" />
      </el-select>
    </el-form-item>
    <el-form-item label="员工职位">
      <el-select v-model="form.positionId" placeholder="员工职位" clearable class="min-w-36">
        <el-option label="护士" value="0" />
        <el-option label="护士长" value="1" />
      </el-select>
    </el-form-item>
    <el-form-item label="状态">
      <el-select v-model="form.statusId" placeholder="员工状态" clearable class="min-w-36">
        <el-option label="离职" value="0" />
        <el-option label="在职" value="1" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSearch" :icon="Search">搜索</el-button>
      <el-button @click="handleReset" :icon="Refresh">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang='ts'>
import { EmployeeSearchForm } from "@/types/employee";
import { Refresh, Search } from "@element-plus/icons-vue";

defineProps<{
  visible: boolean
}>();

const emit = defineEmits<{
  (e: "search", data: EmployeeSearchForm): void;
  (e: "reset", data: null): void;
}>();

const form = reactive<EmployeeSearchForm>({
  name: '',
  genderId: '',
  statusId: '',
  positionId: '',
})

const handleSearch = () => {
  emit("search", form);
}

const handleReset = () => {
  form.name = '';
  form.genderId = '';
  form.statusId = '';
  form.positionId = '';
  emit("reset", null);
}

// 监听窗口大小变化
const isMobile = ref(window.innerWidth < 768);
</script>