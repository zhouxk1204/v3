<template>
  <el-form :inline="true" :model="searchForm" class="mb-2" v-if="searchFormVisible">
    <el-form-item label="节假日名称">
      <el-select v-model="searchForm.holidayValue" placeholder="节假日名称" clearable class="min-w-36">
        <el-option :label="item.dictLabel" :value="item.dictValue" v-for="item in options1" />
      </el-select>
    </el-form-item>
    <el-form-item label="节假日类别">
      <el-select v-model="searchForm.holidayValue" placeholder="节假日类别" clearable class="min-w-36">
        <el-option :label="item.dictLabel" :value="item.dictValue" v-for="item in options2" />
      </el-select>
    </el-form-item>
    <el-form-item label="年度">
      <el-date-picker v-model="searchForm.year" type="year" placeholder="年份" format="YYYY" value-format="YYYY" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleSearch" :icon="Search">搜索</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="handleReset" :icon="Refresh">重置</el-button>
    </el-form-item>
  </el-form>

  <el-row justify="space-between" class="mb-2">
    <el-col :span="12">
      <el-button type="primary" plain :icon="Plus" @click="handleAdd">新增</el-button>
      <el-button type="success" plain :icon="Edit" :disabled="!(multipleSelection.length === 1)"
        @click="handleEdit()">修改</el-button>
      <el-button type="danger" plain :icon="Delete" :disabled="multipleSelection.length === 0"
        @click="handleDelete()">删除</el-button>
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

  <!-- <el-table ref="dictTableRef" :data="tableData" class="w-full" @selection-change="handleSelectionChange">
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
</el-table> -->

  <!-- <div>
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-3">
        <el-button type="primary" :icon="Plus" @click="formVisible = true">新增</el-button>
        <el-date-picker v-model="yearModel" type="year" placeholder="年份" @change="handleDatePikerChange" format="YYYY"
          value-format="YYYY" />
        <el-date-picker v-model="monthModel" type="month" placeholder="月份" @change="handleDatePikerChange" format="MM"
          value-format="MM" />
        <el-select-v2 v-model="holidayModel" placeholder="节假日" :clearable="true" :options="holidayOptions"
          @change="handleSelectChange" />
        <el-button size="default" @click="onRest" :icon="Refresh">重置</el-button>
      </div>
    </div>
    <Table :list="holidayList" :cols="cols" :editable="true" @remove="deleteHoliday($event)"
      @update="updateHoliday($event)">
    </Table>
  </div>
  <el-dialog v-model="formVisible" title="添加节假日" width="500" destroy-on-close :append-to-body="true"
    :close-on-click-modal="false">
    <Form :form="form" @submit="handelSubmit" ref='holidayFormRef'></Form>
  </el-dialog> -->
</template>

<script setup lang="ts">
import { getHolidayOptions } from '@/api/holiday.api';
import { DictDetailVO } from '@/types/dict';
import { Delete, Edit, Plus, Refresh, Search } from "@element-plus/icons-vue";

const searchFormVisible = ref(true);
const searchForm = reactive({
  holidayValue: '',
  holidayTypeValue: '',
  year: ''
})
const handleSearch = () => {

}

const handleReset = () => {
  searchForm.holidayValue = '';
  searchForm.holidayTypeValue = '';
  searchForm.year = '';
}

const options1 = ref<DictDetailVO[]>([]);
const options2 = ref<DictDetailVO[]>([]);
const getOptions = () => {
  getHolidayOptions().then((res: any) => {
    console.log("%c Line:75 🍏 res", "color:#f5ce50", res);
    options1.value = res.data[0];
    console.log("%c Line:76 🍺 options1.value", "color:#fca650", options1.value);
    options2.value = res.data[1];
    console.log("%c Line:78 🍏 options2.value", "color:#b03734", options2.value);
  })
}
getOptions();


const multipleSelection = ref([]);
const handleAdd = () => { }
const handleEdit = () => { }
const handleDelete = () => { }
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
</script>
