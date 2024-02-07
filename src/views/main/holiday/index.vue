<template>
  <h1 class="pb-3 mb-3 font-bold border-b">添加节假日</h1>
  <Form :form="form" @submit="handelSubmit"></Form>
  <h1 class="pb-3 font-bold border-b">节假日明细</h1>
  <Table
    :list="list"
    :cols="cols"
    :editable="true"
    @remove="onRemove"
    @update="onUpdate"
  ></Table>
</template>

<script setup lang="ts">
import { FieldItem } from "@/components/Form/form";
import { TableColumnItem } from "@/components/Table/type";
import { HolidayForm } from "@/config/form.config";
import { HolidayTable } from "@/config/table.config";
import useStore from "@/store";
import { IHoliday } from "@/types";
import { generateId } from "@/utils";
import { storeToRefs } from "pinia";

const holidayStore = useStore().holiday;
const { list } = storeToRefs(holidayStore);

const form = ref<FieldItem[]>(HolidayForm);

const handelSubmit = (data: any) => {
  data.id = generateId();
  holidayStore.insert(data);
};

const cols: TableColumnItem<IHoliday>[] = HolidayTable;

const onRemove = (index: number) => {
  holidayStore.remove(index);
};

const onUpdate = (data: any) => {
  holidayStore.update(data);
};
</script>
