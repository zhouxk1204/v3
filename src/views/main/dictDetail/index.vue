<template>
  <SearchForm :visible="searchFormVisible" @search="handleSearchFromAction" @reset="handleSearchFromAction">
  </SearchForm>

  <el-row justify="space-between" class="mb-2">
    <el-col :span="12">
      <el-button type="primary" plain :icon="Plus" @click="handleAdd">新增</el-button>
      <el-button type="success" plain :icon="Edit" :disabled="!(multipleSelection.length === 1)"
        @click="handleEdit(multipleSelection[0])">修改</el-button>
      <el-button type="danger" plain :icon="Delete" :disabled="multipleSelection.length === 0"
        @click="handleDelete(multipleSelection.map(e => e.dictCode))">删除</el-button>
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

  <ActionForm v-model="actionFormVisible" :title="actionFormTitle" :formData="actionFormData" @confirm="handleConfirm">
  </ActionForm>
</template>

<script setup lang='ts'>
import { addDictData, getDictDataList } from "@/api/dict.api";
import useUserStore from "@/store/user.store";
import { DictDetailForm, DictDetailSearchForm, DictDetailVO } from "@/types/dict.d";
import { Delete, Edit, Plus, Refresh, Search } from "@element-plus/icons-vue";
import { useRoute } from 'vue-router';
import ActionForm from './ActionForm.vue';
import SearchForm from './SearchFrom.vue';

const searchFormVisible = ref(true);
const handleSearchFromAction = async (formData: DictDetailSearchForm | null) => {
  const data = await getDictDataList(formData);
  tableData.value = data.data;
}

const dictType = `${useRoute().query.dictType ?? ''}`;
const multipleSelection = ref<DictDetailVO[]>([]);
const handleAdd = () => {
  mode.value = 'add';
  actionFormData.dictType = dictType;
  actionFormData.status = '0';
  actionFormData.remark = '';
  actionFormData.dictLabel = '';
  actionFormData.dictSort = 0;
  actionFormVisible.value = true;
  actionFormData.createBy = useUserStore().user.userId;
};
const handleRefresh = () => { };
const toggleSearch = () => {
  searchFormVisible.value = !searchFormVisible.value;
};

const handleEdit = (data: any) => {
  console.log("%c Line:98 🍆 data", "color:#2eafb0", data);
};
const handleDelete = (data: any) => {
  console.log("%c Line:102 🍌 data", "color:#2eafb0", data);

};

const tableData = ref<DictDetailVO[]>([]);
const handleSelectionChange = () => { }

const actionFormVisible = ref(false);
const mode = ref<"init" | "edit" | "add">("init");
const actionFormTitle = computed(() => {
  return mode.value === 'add' ? '添加字典数据' : mode.value === 'edit' ? '修改字典数据' : ''
})

const actionFormData = reactive<DictDetailForm>({
  dictType: '',
  dictLabel: '',
  dictValue: '',
  dictSort: 0,
  status: '0',
  remark: '',
  createBy: "",
  updateBy: ""
});

const handleConfirm = (data: any) => {
  if (mode.value === 'add') {
    addDictData(data).then((res: any) => {
      ElMessage.success(res.message);
      getAllDictDataList();
    })
  } else if (mode.value === 'edit') {
    // updateDictData(currentDictId.value, data).then(res => {
    //   currentDictId.value = -1;
    //   ElMessage.success(res.message);
    //   getAllDictTypeList();
    // });
  } else {
    return;
  }
}

const getAllDictDataList = () => {
  getDictDataList({ dictType: dictType }).then(res => {
    tableData.value = res.data;
  })
}
getAllDictDataList();
</script>