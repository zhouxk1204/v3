<template>
  <div>
    <el-form :inline="true" :model="searchDictForm" class="mb-2" v-if="searchFormVisible">
      <el-form-item label="字典名称">
        <el-input v-model="searchDictForm.dictName" placeholder="请输入字典名称" clearable />
      </el-form-item>
      <el-form-item label="字典类型">
        <el-input v-model="searchDictForm.dictType" placeholder="请输入字典类型" clearable />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchDictForm.status" placeholder="字典状态" clearable class="min-w-36">
          <el-option label="正常" value="0" />
          <el-option label="停用" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建日期">
        <el-date-picker v-model="dateRange" clearable type="daterange" unlink-panels range-separator="~"
          start-placeholder="开始日期" end-placeholder="结束日期" format="YYYY/MM/DD" value-format="YYYY/MM/DD" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="search" :icon="Search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="reset()" :icon="Refresh">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row justify="space-between" class="mb-2">
      <el-col :span="12">
        <el-button type="primary" plain :icon="Plus" @click="handleAdd">新增</el-button>
        <el-button type="success" plain :icon="Edit" :disabled="!(multipleSelection.length === 1)">修改</el-button>
        <el-button type="danger" plain :icon="Delete" :disabled="multipleSelection.length === 0"
          @click="handleDelete(multipleSelection.map(e => e.dictId))">删除</el-button>
      </el-col>
      <el-col :span="12" class="flex justify-end">
        <el-tooltip effect="dark" :content="searchFormVisible ? '隐藏搜索' : '显示搜索'" placement="top">
          <el-button :icon="Search" circle @click="toggleSearch" />
        </el-tooltip>
        <el-tooltip effect="dark" content="刷新" placement="top">
          <el-button :icon="Refresh" circle />
        </el-tooltip>
      </el-col>
    </el-row>

    <el-table ref="dictTableRef" :data="tableData" class="w-full" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40" />
      <el-table-column label="字典编号" width="80" align="center">
        <template #default="scope">{{ scope.row.dictId }}</template>
      </el-table-column>
      <el-table-column label="字典名称" align="center">
        <template #default="scope">{{ scope.row.dictName }}</template>
      </el-table-column>
      <el-table-column label="字典类型" align="center">
        <template #default="scope">{{ scope.row.dictType }}</template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template #default="scope">
          <el-tag>{{ scope.row.status === '0' ? '正常' : '停用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template #default="scope">{{ scope.row.remark }}</template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template #default="scope">{{ scope.row.createTime }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button size="small" :icon="Edit" @click="handleEdit(scope.$index, scope.row)">
            编辑
          </el-button>
          <el-button size="small" type="danger" :icon="Delete" @click="handleDelete([scope.row.dictId])">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="isAddDictDialogVisible" title="添加字典类型" width="500" destroy-on-close :append-to-body="true"
      :close-on-click-modal="false">
      <el-form :model="dictForm" label-width="auto" :rules="rules" status-icon ref="dictFormRef">
        <el-form-item label="字典名称" required prop="dictName">
          <el-input v-model="dictForm.dictName" placeholder="请输入字典名称" clearable />
        </el-form-item>
        <el-form-item label="字典类型" required prop="dictType">
          <el-input v-model="dictForm.dictType" placeholder="请输入字典类型" clearable />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="dictForm.status">
            <el-radio value="0">正常</el-radio>
            <el-radio value="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="dictForm.remark" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"
            placeholder="请输入备注信息" show-word-limit maxlength="100" />
        </el-form-item>
        <el-form-item>
          <el-row justify="end" class="w-full">
            <el-button type="primary" @click="submitForm(dictFormRef)">确定</el-button>
            <el-button @click="resetForm(dictFormRef)">取消</el-button>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang='ts'>
import { deleteDictType, getDictTypeList, submitDict } from "@/api/dict.api";
import useUserStore from "@/store/user.store";
import { DictForm, DictSearchForm, DictVO } from "@/types/dict.d";
import { Delete, Edit, Plus, Refresh, Search } from "@element-plus/icons-vue";
import { FormInstance, FormRules } from "element-plus/es/components";

const tableData = ref<DictVO[]>([]);
const dateRange = ref('');
const searchDictForm = reactive<DictSearchForm>({
  dictName: '',
  dictType: '',
  status: '',
  beginTime: '',
  endTime: '',
})

const refresh = async () => {
  const data = await getDictTypeList(searchDictForm);
  tableData.value = data.data;
}

refresh();

const search = async () => {
  const [beginTime = '', endTime = ''] = dateRange.value;
  searchDictForm.beginTime = beginTime;
  searchDictForm.endTime = endTime;
  refresh();
}

const reset = async () => {
  searchDictForm.dictName = '';
  searchDictForm.dictType = '';
  searchDictForm.status = '';
  searchDictForm.beginTime = '';
  searchDictForm.endTime = '';
  dateRange.value = '';
  refresh();
}

const searchFormVisible = ref(true);
const toggleSearch = () => {
  searchFormVisible.value = !searchFormVisible.value;
};

const handleEdit = (index: number, row: any) => {
  console.log(index, row)
}

const handleDelete = (dictIds: number[]) => {
  ElMessageBox.confirm(
    `是否确认删除字典编号为"${dictIds.join(', ')}"的数据项？`,
    '系统提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      const res = await deleteDictType(dictIds);
      ElMessage.success(res.message);
      const data = await getDictTypeList({
        dictName: '',
        dictType: '',
        status: '',
        beginTime: '',
        endTime: '',
      });
      tableData.value = data.data;
    })
    .catch(() => {
      ElMessage.info('取消删除！')
    })
}

const multipleSelection = ref<DictVO[]>([]);
const handleSelectionChange = (val: DictVO[]) => {
  multipleSelection.value = val;
}

const isAddDictDialogVisible = ref(false);
const handleAdd = () => {
  isAddDictDialogVisible.value = true;
}

const dictFormRef = ref<FormInstance>();
const dictForm = reactive<DictForm>({
  dictName: '',
  dictType: '',
  status: '0',
  remark: '',
  createBy: '',
});

const rules = reactive<FormRules<DictForm>>({
  dictName: [
    { required: true, message: '请输入字典名称', trigger: 'blur' },
  ],
  dictType: [
    { required: true, message: '请输入字典类型', trigger: 'blur' },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      dictForm.createBy = useUserStore().user.userId;
      console.log(dictForm);
      submitDict(dictForm);
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields();
  isAddDictDialogVisible.value = false;
}
</script>