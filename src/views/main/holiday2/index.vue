<template>
  <SearchForm :visible="searchFormVisible" @search="handleSearchFromAction" @reset="handleSearchFromAction">
  </SearchForm>

  <el-row justify="space-between" class="mb-2">
    <el-col :span="12">
      <el-button type="primary" plain :icon="Plus" @click="handleAdd">新增</el-button>
      <el-button type="success" plain :icon="Edit" :disabled="!(multipleSelection.length === 1)">修改</el-button>
      <el-button type="danger" plain :icon="Delete" :disabled="multipleSelection.length === 0">删除</el-button>
    </el-col>
    <el-col :span="12" class="flex justify-end">
      <el-row justify="end">
        <el-tooltip effect="dark" :content="searchFormVisible ? '隐藏搜索' : '显示搜索'" placement="top">
          <el-button :icon="Search" circle @click="toggleSearch" />
        </el-tooltip>
        <el-tooltip effect="dark" content="刷新" placement="top">
          <el-button :icon="Refresh" circle @click="handleRefresh" />
        </el-tooltip>
      </el-row>
    </el-col>
  </el-row>

  <el-table :data="tableData" class="w-full" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="40" />
    <el-table-column label="日期" align="center">
      <template #default="scope">{{ scope.row.date }}</template>
    </el-table-column>
    <el-table-column label="节假日" align="center">
      <template #default="scope">{{ scope.row.holidayLabel }}</template>
    </el-table-column>
    <el-table-column label="类别" align="center">
      <template #default="scope">{{ scope.row.holidayTypeLabel }}</template>
    </el-table-column>
    <el-table-column label="上班倍率" align="center">
      <template #default="scope">{{ scope.row.ratio }}</template>
    </el-table-column>
    <el-table-column label="加班倍率" align="center">
      <template #default="scope">{{ scope.row.extraRatio }}</template>
    </el-table-column>
    <el-table-column label="备注" align="center">
      <template #default="scope">
        <el-text line-clamp="2">
          {{ scope.row.remark }}
        </el-text>
      </template>
    </el-table-column>
    <!-- <el-table-column label="操作" align="center">
      <template #default="scope">
        <el-space :size="10">
          <el-link type="primary" :underline="false">
            编辑
          </el-link>
          <el-link type="danger" :underline="false">
            删除
          </el-link>
        </el-space>
      </template>
    </el-table-column> -->
  </el-table>


</template>

<script setup lang="ts">
import { HolidaySearchForm } from '@/types/holiday';
import { Delete, Edit, Plus, Refresh, Search } from "@element-plus/icons-vue";
import SearchForm from './SearchFrom.vue';

const searchFormVisible = ref(true);
const handleSearchFromAction = (formData: HolidaySearchForm | undefined) => {
  console.log("%c Line:74 🌮 formData", "color:#2eafb0", formData);
  // const data = await getFileList(formData);
  // tableData.value = data.data;
}

const multipleSelection = ref<any>([]);
const handleAdd = () => { }
const toggleSearch = () => {
  searchFormVisible.value = !searchFormVisible.value;
}
const handleRefresh = () => { }
// const holidayStore = useStore().holiday;

// const cols: TableColumnItem<Holiday>[] = HolidayTable;
// const form = ref<FieldItem[]>(HolidayForm);

// const holidayList = ref<Holiday[]>([]);
// onMounted(() => {
//   refreshHolidayList();
// })

// const range = ref<string[][]>([]);

// const refreshHolidayList = async (message?: string) => {
//   const { data } = await getHolidayList({
//     year: yearModel.value ?? '',
//     hId: holidayModel.value ?? '',
//   });
//   holidayList.value = data;
//   holidayStore.setHolidayTempList(data);
//   range.value = data.map((e: Holiday) => e.date);
//   // 更新不可选择日期范围
//   form.value[0].disableDateRange = range.value;
//   if (message) {
//     ElMessage.success(message);
//   }
// }

// const updateHoliday = async (data: any) => {
//   await updateHolidayData(data);
//   refreshHolidayList('节假日信息更新成功！');
// }

// const deleteHoliday = async (index: number) => {
//   const id = holidayList.value[index].id
//   await deleteHolidayById(id);
//   refreshHolidayList('节假日信息删除成功！');
// }

// const formVisible = ref<boolean>(false);
// const holidayFormRef = ref();
// const handelSubmit = async (data: any) => {
//   data.id = generateId();
//   await submitHoliday(data);
//   holidayFormRef.value.handelReset();
//   refreshHolidayList('节假日信息添加成功！')
//   formVisible.value = false;
// };


// const yearModel = ref('');
// const monthModel = ref('');
// const holidayModel = ref('');
// const holidayOptions = useSelect().getOptionsByType(SELECT_OPTION.HOLIDAY);
// const handleDatePikerChange = async () => {
//   refreshHolidayList();
// }

// const handleSelectChange = async () => {
//   refreshHolidayList();
// }

// const onRest = () => {
//   yearModel.value = '';
//   holidayModel.value = '';
//   refreshHolidayList();
// }
// const mode = ref<"init" | "edit" | "add">("init");
// const actionFormVisible = ref(false);
// const actionFormData = reactive<FileForm>({
//   name: '',
//   typeId: '0',
//   statusId: '0',
//   remark: '',
//   createBy: '',
//   updateBy: '',
//   url: ''
// });
// // const actionFormTitle = computed(() => {
// //   return mode.value === 'add' ? '添加文件信息' : mode.value === 'edit' ? '修改文件信息' : ''
// // })


const tableData = ref([]);
const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val;
}

// const currentNo = ref(-1);
// const handleEdit = (row: FileInfo) => {
//   mode.value = 'edit';
//   actionFormData.name = row.name;
//   actionFormData.typeId = row.typeId;
//   actionFormData.statusId = row.statusId;
//   actionFormData.remark = row.remark;
//   actionFormData.createBy = '';
//   actionFormData.url = row.url;
//   currentNo.value = row.no;
//   actionFormVisible.value = true;
// }

// const handleDelete = (noList: number[]) => {
//   ElMessageBox.confirm(
//     `是否确认删除文件编号为"${noList.join(', ')}"的数据项？`,
//     '系统提示',
//     {
//       confirmButtonText: '确定',
//       cancelButtonText: '取消',
//       type: 'warning',
//     }
//   )
//     .then(async () => {
//       const res = await deleteFilesByIds(noList);
//       ElMessage.success(res.message);
//       const data = await getFileList();
//       tableData.value = data.data;
//     })
//     .catch(() => {
//       ElMessage.info('取消删除！')
//     })
// }

</script>
