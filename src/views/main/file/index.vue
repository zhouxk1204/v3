<template>
  <div>
    <SearchForm :visible="searchFormVisible" @search="handleSearchFromAction" @reset="handleSearchFromAction">
    </SearchForm>

    <el-row justify="space-between" class="mb-2">
      <el-col :span="17" class="hidden-sm-and-down">
        <el-button type="primary" plain :icon="Plus" @click="handleAdd">
          新增
        </el-button>
        <el-button type="success" plain :icon="Edit" :disabled="!(multipleSelection.length === 1)"
          @click="handleEdit(multipleSelection[0])">
          修改
        </el-button>
        <el-button type="danger" plain :icon="Delete" :disabled="multipleSelection.length === 0"
          @click="handleDelete(multipleSelection.map(e => e.no))">
          删除
        </el-button>
      </el-col>
      <el-col :span="17" class="hidden-sm-and-up">
        <el-button type="primary" plain :icon="Plus" @click="handleAdd" circle>
        </el-button>
        <el-button type="success" plain :icon="Edit" :disabled="!(multipleSelection.length === 1)"
          @click="handleEdit(multipleSelection[0])" circle>
        </el-button>
        <el-button type="danger" plain :icon="Delete" :disabled="multipleSelection.length === 0"
          @click="handleDelete(multipleSelection.map(e => e.no))" circle>
        </el-button>
      </el-col>
      <el-col :span="7" class="flex justify-end">
        <el-tooltip effect="dark" :content="searchFormVisible ? '隐藏搜索' : '显示搜索'" placement="top">
          <el-button :icon="Search" circle @click="toggleSearch" />
        </el-tooltip>
        <el-tooltip effect="dark" content="刷新" placement="top">
          <el-button :icon="Refresh" circle @click="getAllFileList" />
        </el-tooltip>
      </el-col>
    </el-row>

    <el-table ref="dictTableRef" :data="tableData" class="w-full hidden-sm-and-down"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40" />
      <el-table-column label="编号" width="80" align="center">
        <template #default="scope">{{ scope.row.no }}</template>
      </el-table-column>
      <el-table-column label="文件名" align="center">
        <template #default="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="文件类型" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.typeId === '0' ? 'primary' : 'success'">{{ scope.row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="文件预览" align="center">
        <template #default="scope">
          <el-image :preview-teleported="true" :z-index="99" class="w-full h-full" :src="scope.row.url" :zoom-rate="1.2"
            :max-scale="7" :min-scale="0.2" :preview-src-list="[scope.row.url]" :initial-index="0" fit="cover" />
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.statusId === '0' ? 'primary' : 'info'">{{ scope.row.status }}</el-tag>
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
          <el-space :size="10">
            <el-link type="primary" :underline="false" @click="handleEdit(scope.row)">
              编辑
            </el-link>
            <el-link type="danger" :underline="false" @click="handleDelete([scope.row.no])">
              删除
            </el-link>
          </el-space>
        </template>
      </el-table-column>
    </el-table>

    <ActionForm v-model="actionFormVisible" :title="actionFormTitle" :formData="actionFormData"
      @confirm="handleConfirm">
    </ActionForm>
  </div>
</template>

<script setup lang='ts'>
import { addFileData, deleteFilesByIds, getFileList, updateFileByNo } from '@/api/file.api';
import useUserStore from '@/store/user.store';
import { FileForm, FileInfo, FileSearchForm } from '@/types/files.d';
import { Delete, Edit, Plus, Refresh, Search } from "@element-plus/icons-vue";
import { computed, reactive, ref } from 'vue';

import ActionForm from './ActionForm.vue';
import SearchForm from './SearchFrom.vue';

const searchFormVisible = ref(true);
const toggleSearch = () => {
  searchFormVisible.value = !searchFormVisible.value;
};

const tableData = ref<FileInfo[]>([]);
const handleSearchFromAction = async (formData: FileSearchForm | undefined) => {
  const data = await getFileList(formData);
  tableData.value = data.data;
}

const multipleSelection = ref<FileInfo[]>([]);
const handleSelectionChange = (val: FileInfo[]) => {
  multipleSelection.value = val;
}

const mode = ref<"init" | "edit" | "add">("init");
const actionFormVisible = ref(false);
const actionFormData = reactive<FileForm>({
  name: '',
  typeId: '0',
  statusId: '0',
  remark: '',
  createBy: '',
  updateBy: '',
  url: ''
});
const actionFormTitle = computed(() => {
  return mode.value === 'add' ? '添加文件信息' : mode.value === 'edit' ? '修改文件信息' : ''
})

const handleAdd = () => {
  mode.value = 'add';
  actionFormData.name = '';
  actionFormData.typeId = '0';
  actionFormData.statusId = '0';
  actionFormData.remark = '';
  actionFormData.createBy = useUserStore().user.userId;
  actionFormData.updateBy = '';
  actionFormData.url = '';
  actionFormVisible.value = true;
}

const currentNo = ref(-1);
const handleEdit = (row: FileInfo) => {
  mode.value = 'edit';
  actionFormData.name = row.name;
  actionFormData.typeId = row.typeId;
  actionFormData.statusId = row.statusId;
  actionFormData.remark = row.remark;
  actionFormData.createBy = '';
  actionFormData.updateBy = useUserStore().user.userId;
  actionFormData.url = row.url;
  currentNo.value = row.no;
  actionFormVisible.value = true;
}

const handleConfirm = (data: FileForm) => {
  if (mode.value === 'add') {
    addFileData(data).then((res: any) => {
      ElMessage.success(res.message);
      getAllFileList();
    })
  } else if (mode.value === 'edit') {
    updateFileByNo(currentNo.value, data).then(res => {
      currentNo.value = -1;
      ElMessage.success(res.message);
      getAllFileList();
    });
  } else {
    return;
  }
}

const handleDelete = (noList: number[]) => {
  ElMessageBox.confirm(
    `是否确认删除文件编号为"${noList.join(', ')}"的数据项？`,
    '系统提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      const res = await deleteFilesByIds(noList);
      ElMessage.success(res.message);
      const data = await getFileList();
      tableData.value = data.data;
    })
    .catch(() => {
      ElMessage.info('取消删除！')
    })
}

const getAllFileList = async () => {
  const data = await getFileList();
  tableData.value = data.data;
}

getAllFileList();
</script>