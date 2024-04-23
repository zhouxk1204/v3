<template>
  <div>
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-3">
        <el-date-picker v-model="yearModel" type="year" placeholder="年份" @change="handleDatePikerChange" format="YYYY"
          value-format="YYYY" />
        <el-select-v2 v-model="holidayModel" placeholder="节假日" :clearable="true" :options="holidayOptions"
          @change="handleSelectChange" />
      </div>
      <div class="flex items-center">
        <el-button type="primary" size="default" @click="onRest">重置</el-button>
        <el-button type="success" :icon="Plus" @click="formVisible = true">添加节假日</el-button>
      </div>
    </div>
    <Table :list="holidayList" :cols="cols" :editable="true" @remove="deleteHoliday($event)"
      @update="updateHoliday($event)">
    </Table>
  </div>
  <el-dialog v-model="formVisible" title="添加节假日" width="500" destroy-on-close :append-to-body="true"
    :close-on-click-modal="false">
    <Form :form="form" @submit="handelSubmit" ref='holidayFormRef'></Form>
  </el-dialog>
</template>

<script setup lang="ts">
import { deleteHolidayById, getHolidayList, submitHoliday, updateHolidayData } from '@/api/holiday.api';
import { FieldItem } from "@/components/Form/form";
import { TableColumnItem } from "@/components/Table/type";
import { HolidayForm } from "@/config/form.config";
import { HolidayTable } from "@/config/table.config";
import { SELECT_OPTION } from '@/constants';
import { useSelect } from '@/hooks/useSelect';
import useStore from "@/store";
import { Holiday } from '@/types/holiday';
import { generateId } from "@/utils";
import { Plus } from "@element-plus/icons-vue";

const holidayStore = useStore().holiday;

const cols: TableColumnItem<Holiday>[] = HolidayTable;
const form = ref<FieldItem[]>(HolidayForm);

const holidayList = ref<Holiday[]>([]);
onMounted(() => {
  refreshHolidayList();
})

const range = ref<string[][]>([]);

const refreshHolidayList = async (message?: string) => {
  const { data } = await getHolidayList({
    year: yearModel.value ?? '',
    hId: holidayModel.value ?? '',
  });
  holidayList.value = data;
  holidayStore.setHolidayTempList(data);
  range.value = data.map((e: Holiday) => e.date);
  // 更新不可选择日期范围
  form.value[0].disableDateRange = range.value;
  if (message) {
    ElMessage.success(message);
  }
}

const updateHoliday = async (data: any) => {
  await updateHolidayData(data);
  refreshHolidayList('节假日信息更新成功！');
}

const deleteHoliday = async (index: number) => {
  const id = holidayList.value[index].id
  await deleteHolidayById(id);
  refreshHolidayList('节假日信息删除成功！');
}

const formVisible = ref<boolean>(false);
const holidayFormRef = ref();
const handelSubmit = async (data: any) => {
  data.id = generateId();
  await submitHoliday(data);
  holidayFormRef.value.handelReset();
  refreshHolidayList('节假日信息添加成功！')
  formVisible.value = false;
};


const yearModel = ref('');
const holidayModel = ref('');
const holidayOptions = useSelect().getOptionsByType(SELECT_OPTION.HOLIDAY);
const handleDatePikerChange = async () => {
  refreshHolidayList();
}

const handleSelectChange = async () => {
  refreshHolidayList();
}

const onRest = () => {
  yearModel.value = '';
  holidayModel.value = '';
  refreshHolidayList();
}
</script>
