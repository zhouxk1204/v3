<template>
  <div>
    <SearchForm :visible="searchFormVisible" @search="handleSearchFromAction" @reset="handleSearchFromAction">
    </SearchForm>

    <el-row justify="space-between" class="mb-2">
      <el-col :span="12">
        <el-button type="primary" plain :icon="Plus" @click="handleAdd">新增</el-button>
        <el-button type="success" plain :icon="Edit" :disabled="!(multipleSelection.length === 1)"
          @click="handleEdit(multipleSelection[0])">修改</el-button>
        <el-button type="danger" plain :icon="Delete" :disabled="multipleSelection.length === 0"
          @click="handleDelete(multipleSelection.map(e => e.dictId))">删除</el-button>
      </el-col>
      <el-col :span="12" class="flex justify-end">
        <el-tooltip effect="dark" :content="searchFormVisible ? '隐藏搜索' : '显示搜索'" placement="top">
          <el-button :icon="Search" circle @click="toggleSearch" />
        </el-tooltip>
        <el-tooltip effect="dark" content="刷新" placement="top">
          <el-button :icon="Refresh" circle @click="getAllDictTypeList" />
        </el-tooltip>
      </el-col>
    </el-row>

    <el-table ref="dictTableRef" :data="tableData" class="w-full" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40" />
      <el-table-column label="字典编号" width="80" align="center">
        <template #default="scope">{{ scope.row.dictId }}</template>
      </el-table-column>
      <el-table-column label="字典标签" align="center">
        <template #default="scope">{{ scope.row.dictName }}</template>
      </el-table-column>
      <el-table-column label="字典类型" align="center">
        <template #default="scope">
          <el-link :underline="false" :href="'/main/dictDetail?dictType=' + scope.row.dictType">{{ scope.row.dictType
            }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.status === '0' ? 'primary' : 'info'">{{ scope.row.status === '0' ? '正常' : '停用'
            }}</el-tag>
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
          <el-button size="small" :icon="Edit" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button size="small" type="danger" :icon="Delete" @click="handleDelete([scope.row.dictId])">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <ActionForm v-model="actionFormVisible" :title="actionFormTitle" :formData="actionFormData"
      @confirm="handleConfirm">
    </ActionForm>
  </div>
</template>

<script setup lang='ts'>
import { addDictType, deleteDictType, getDictTypeList, updateDictType } from "@/api/dict.api";
import useUserStore from '@/store/user.store';
import { DictForm, DictSearchForm, DictVO } from "@/types/dict.d";
import { Delete, Edit, Plus, Refresh, Search } from "@element-plus/icons-vue";
import ActionForm from './ActionForm.vue';
import SearchForm from './SearchFrom.vue';

const tableData = ref<DictVO[]>([]);
const handleSearchFromAction = async (formData: DictSearchForm | null) => {
  const data = await getDictTypeList(formData);
  tableData.value = data.data;
}

const getAllDictTypeList = () => {
  getDictTypeList().then(res => {
    tableData.value = res.data;
  })
}
getAllDictTypeList();

const searchFormVisible = ref(true);
const toggleSearch = () => {
  searchFormVisible.value = !searchFormVisible.value;
};

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

const mode = ref<"init" | "edit" | "add">("init");
const actionFormVisible = ref(false);
const actionFormData = reactive<DictForm>({
  dictName: '',
  dictType: '',
  status: '0',
  remark: '',
  createBy: '',
  updateBy: '',
});
const actionFormTitle = computed(() => {
  return mode.value === 'add' ? '添加字典类型' : mode.value === 'edit' ? '修改字典类型' : ''
})

const handleAdd = () => {
  mode.value = 'add';
  actionFormData.dictName = '';
  actionFormData.dictType = '';
  actionFormData.status = '0';
  actionFormData.remark = '';
  actionFormData.createBy = useUserStore().user.userId;
  actionFormData.updateBy = '';
  actionFormVisible.value = true;
}

const currentDictId = ref(-1);
const handleEdit = (row: DictVO) => {
  mode.value = 'edit'
  actionFormData.dictName = row.dictName;
  actionFormData.dictType = row.dictType;
  actionFormData.status = row.status;
  actionFormData.remark = row.remark;
  actionFormData.createBy = '';
  actionFormData.updateBy = useUserStore().user.userId;
  currentDictId.value = row.dictId;
  actionFormVisible.value = true;
}

const handleConfirm = (data: DictForm) => {
  if (mode.value === 'add') {
    addDictType(data).then((res: any) => {
      ElMessage.success(res.message);
      getAllDictTypeList();
    })
  } else if (mode.value === 'edit') {
    updateDictType(currentDictId.value, data).then(res => {
      currentDictId.value = -1;
      ElMessage.success(res.message);
      getAllDictTypeList();
    });
  } else {
    return;
  }
}
</script>