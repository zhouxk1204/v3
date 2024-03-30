<template>
  <div>
    <el-button type="success" @click="formVisible = true" class="mb-5">添加节假日</el-button>
    <Table :list="holidayList" :cols="cols" :editable="true" @remove="deleteHoliday($event)"
      @update="updateHoliday($event)">
    </Table>
  </div>
  <el-dialog v-model="formVisible" title="添加节假日" width="500" destroy-on-close :append-to-body="true" :close-on-click-modal="false">
    <Form :form="form" @submit="handelSubmit" ref='holidayFormRef'></Form>
  </el-dialog>
</template>

<script setup lang="ts">
import { deleteHolidayById, getHolidayList, submitHoliday, updateHolidayData } from '@/api/holiday.api';
import { FieldItem } from "@/components/Form/form";
import { TableColumnItem } from "@/components/Table/type";
import { HolidayForm } from "@/config/form.config";
import { HolidayTable } from "@/config/table.config";
import useStore from "@/store";
import { Holiday } from '@/types/holiday';
import { generateId } from "@/utils";

const holidayStore = useStore().holiday;

const cols: TableColumnItem<Holiday>[] = HolidayTable;
const form = ref<FieldItem[]>(HolidayForm);

const holidayList = ref<Holiday[]>([]);
onMounted(() => {
  refreshHolidayList();
})

const range = ref<string[][]>([]);

const refreshHolidayList = async (message?: string) => {
  const { data } = await getHolidayList();
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
</script>
