<template>
  <div class="flex flex-col gap-5">
    <div>
      <h1 class="flex items-center h-12 pb-3 mb-3 font-bold border-b">
        添加节假日
      </h1>
      <Form :form="form" @submit="handelSubmit" ref='holidayFormRef'></Form>
    </div>
    <div>
      <h1 class="flex items-center h-12 pb-3 mb-3 font-bold border-b">
        节假日明细
      </h1>
      <Table :list="holidayList" :cols="cols" :editable="true" @remove="deleteHoliday($event)"
        @update="updateHoliday($event)">
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { deleteHolidayById, getHolidayList, submitHoliday, updateHolidayData } from '@/api/holiday.api.ts';
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
  range.value = data.map(e => e.date);
  // 更新不可选择日期范围
  form.value[0].disableDateRange = range.value;
  if (message) {
    ElMessage.success(message);
  }
}

const updateHoliday = async (data: any) => {
  updateHolidayData(data);
  refreshHolidayList('节假日信息更新成功！');
}

const deleteHoliday = (index: number) => {
  const id = holidayList.value[index].id
  deleteHolidayById(id);
  refreshHolidayList('节假日信息删除成功！');
}

const holidayFormRef = ref();
const handelSubmit = async (data: any) => {
  data.id = generateId();
  submitHoliday(data);
  holidayFormRef.value.handelReset();
  refreshHolidayList('节假日信息添加成功！')
};

</script>
