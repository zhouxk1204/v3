<template>
  <div class="flex flex-col gap-5">
    <div>
      <h1 class="flex items-center h-12 pb-3 mb-3 font-bold border-b">
        添加节假日
      </h1>
      <Form :form="form" @submit="handelSubmit"></Form>
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
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

const holidayStore = useStore().holiday;

const cols: TableColumnItem<Holiday>[] = HolidayTable;
const form = ref<FieldItem[]>(HolidayForm);

const holidayList = ref<Holiday[]>([]);
onMounted(() => {
  refreshHolidayList();
})

const range = ref<string[][]>([]);

const refreshHolidayList = async () => {
  const { data } = await getHolidayList();
  holidayStore.setHolidayTempList(data);
  holidayList.value = data;
  range.value = data.map(e => e.date);
  console.log("%c Line:48 🍣 range", "color:#42b983", range.value);
  form.value[0].disableDate = (time: Date) => {
    if (range.value.length === 0) return false;
    let visible = false
    for (let dates of range.value) {
      const [start, end] = dates;
      // 使用 isBetween 方法检查日期是否在范围内（包括边界）
      const isInRange = dayjs(time).isBetween(dayjs(start), dayjs(end), null, '[]');
      if (isInRange) {
        visible = true;
        break;
      }
    }
    console.log("%c Line:65 🌭 visible", "color:#7f2b82", visible);
    return visible;
  }
}

const updateHoliday = async (data: any) => {
  await updateHolidayData(data);
  await refreshHolidayList();
  ElMessage.success('节假日信息更新成功！')
}

const deleteHoliday = async (index: number) => {
  const id = holidayList.value[index].id
  await deleteHolidayById(id);
  await refreshHolidayList();
  ElMessage.success('节假日信息删除成功！')
}

const handelSubmit = async (data: any) => {
  data.id = generateId();
  await submitHoliday(data);
  await refreshHolidayList();
  ElMessage.success('节假日信息添加成功！')
};

</script>
