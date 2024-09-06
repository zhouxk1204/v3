<template>
  <SearchForm :visible="searchFormVisible" @search="handleSearchFromAction" @reset="handleSearchFromAction"
    :dictId="dictId" @dictType="onDictType">
  </SearchForm>

  <el-row justify="space-between" class="mb-2">
    <el-col :span="12">
      <el-button type="primary" plain :icon="Plus" @click="handleAdd">新增</el-button>
      <el-button type="success" plain :icon="Edit" :disabled="!(multipleSelection.length === 1)"
        @click="handleEdit(multipleSelection[0])">修改</el-button>
      <el-button type="danger" plain :icon="Delete" :disabled="multipleSelection.length === 0"
        @click="handleDelete(multipleSelection.map(e => e.dictCode))">删除</el-button>
      <el-button type="warning" plain :icon="Close" @click="handleClose">关闭</el-button>
    </el-col>
    <el-col :span="12" class="flex justify-end">
      <el-tooltip effect="dark" :content="searchFormVisible ? '隐藏搜索' : '显示搜索'" placement="top">
        <el-button :icon="Search" circle @click="toggleSearch" />
      </el-tooltip>
      <el-tooltip effect="dark" content="刷新" placement="top">
        <el-button :icon="Refresh" circle @click="handleRefresh" />
      </el-tooltip>
    </el-col>
  </el-row>

  <el-table ref="dictTableRef" :data="tableData" class="w-full" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="40" />
    <el-table-column label="字典编号" width="80" align="center">
      <template #default="scope">{{ scope.row.dictCode }}</template>
    </el-table-column>
    <el-table-column label="字典标签" align="center">
      <template #default="scope">{{ scope.row.dictLabel }}</template>
    </el-table-column>
    <el-table-column label="字典键值" align="center">
      <template #default="scope">{{ scope.row.dictValue }}</template>
    </el-table-column>
    <el-table-column label="字典排序" align="center">
      <template #default="scope">{{ scope.row.dictSort }}</template>
    </el-table-column>
    <el-table-column label="状态" align="center">
      <template #default="scope">
        <el-tag :type="scope.row.status === '0' ? 'primary' : 'info'">{{ scope.row.status === '0' ? '正常' : '停用'
          }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="备注" align="center">
      <template #default="scope">
        <el-text line-clamp="2">
          {{ scope.row.remark }}
        </el-text>
      </template>
    </el-table-column>
    <el-table-column label="创建时间" align="center">
      <template #default="scope">{{ scope.row.createTime }}</template>
    </el-table-column>
    <el-table-column label="操作" align="center">
      <template #default="scope">
        <el-space :size="10">
          <el-link type="primary" :underline="false" @click="handleEdit(scope.row)">
            编辑
          </el-link>
          <el-link type="danger" :underline="false" @click="handleDelete([scope.row.dictCode])">
            删除
          </el-link>
        </el-space>
      </template>
    </el-table-column>
  </el-table>

  <ActionForm v-model="actionFormVisible" :title="actionFormTitle" :formData="actionFormData" @confirm="handleConfirm">
  </ActionForm>
</template>

<script setup lang='ts'>
import { addDictData, deleteDictData, getDictDataList, updateDictData } from "@/api/dict.api";
import useUserStore from "@/store/user.store";
import { DictDetailForm, DictDetailSearchForm, DictDetailVO } from "@/types/dict.d";
import { Close, Delete, Edit, Plus, Refresh, Search } from "@element-plus/icons-vue";
import { useRoute, useRouter } from 'vue-router';
import ActionForm from './ActionForm.vue';
import SearchForm from './SearchForm.vue'

const searchFormVisible = ref(true);
const handleSearchFromAction = async (formData: DictDetailSearchForm | null) => {
  if (formData && formData.dictId) {
    dictId.value = formData.dictId;
  }
  const data = await getDictDataList(formData);
  tableData.value = data.data;
}

const dictId = ref(+`${useRoute().query.dictId ?? ''}`);
const dictType = ref('');

const onDictType = (data: string) => {
  dictType.value = data;
};

const multipleSelection = ref<DictDetailVO[]>([]);
const handleAdd = () => {
  mode.value = 'add';
  actionFormData.dictType = dictType.value;
  actionFormData.status = '0';
  actionFormData.remark = '';
  actionFormData.dictLabel = '';
  actionFormData.dictValue = '';
  actionFormData.dictSort = 0;
  actionFormVisible.value = true;
  actionFormData.createBy = useUserStore().user.userId;
};
const handleRefresh = () => { };
const toggleSearch = () => {
  searchFormVisible.value = !searchFormVisible.value;
};

const currentDictCode = ref(-1);
const handleEdit = (row: DictDetailVO) => {
  mode.value = 'edit'
  actionFormData.dictType = dictType.value;
  actionFormData.dictLabel = row.dictLabel;
  actionFormData.dictValue = row.dictValue;
  actionFormData.dictSort = row.dictSort;
  actionFormData.remark = row.remark;
  actionFormData.status = row.status;
  actionFormData.createBy = '';
  actionFormData.updateBy = useUserStore().user.userId;
  actionFormVisible.value = true;
  currentDictCode.value = row.dictCode;
};

const handleDelete = (dictCodes: number[]) => {
  ElMessageBox.confirm(
    `是否确认删除字典编号为"${dictCodes.join(', ')}"的数据项？`,
    '系统提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      const res = await deleteDictData(dictCodes);
      ElMessage.success(res.message);
      getAllDictDataList();
    })
    .catch(() => {
      ElMessage.info('取消删除！')
    })
};

const router = useRouter();
const handleClose = () => {
  router.back();
};

const tableData = ref<DictDetailVO[]>([]);
const handleSelectionChange = (val: DictDetailVO[]) => {
  multipleSelection.value = val;
}

const actionFormVisible = ref(false);
const mode = ref<"init" | "edit" | "add">("init");
const actionFormTitle = computed(() => {
  return mode.value === 'add' ? '添加字典数据' : mode.value === 'edit' ? '修改字典数据' : ''
})

const actionFormData = reactive<DictDetailForm>({
  dictType: '',
  dictId: -1,
  dictLabel: '',
  dictValue: '',
  dictSort: 0,
  status: '0',
  remark: '',
  createBy: "",
  updateBy: ""
});

const handleConfirm = (data: DictDetailForm) => {
  if (mode.value === 'add') {
    data.dictId = dictId.value;
    addDictData(data).then((res: any) => {
      ElMessage.success(res.message);
      getAllDictDataList();
    })
  } else if (mode.value === 'edit') {
    updateDictData(currentDictCode.value, data).then(res => {
      currentDictCode.value = -1;
      ElMessage.success(res.message);
      getAllDictDataList();
    });
  } else {
    return;
  }
}

const getAllDictDataList = () => {
  getDictDataList({ dictId: dictId.value }).then(res => {
    tableData.value = res.data;
  })
}
getAllDictDataList();
</script>