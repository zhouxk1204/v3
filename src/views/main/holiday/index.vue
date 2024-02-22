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
      <Table
        :list="list"
        :cols="cols"
        :editable="true"
        @remove="remove($event)"
        @update="update($event)"
      ></Table>
    </div>
  </div>
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
const { remove, update, insert } = holidayStore;

const form = ref<FieldItem[]>(HolidayForm);

const handelSubmit = (data: any) => {
  data.id = generateId();
  insert(data);
};

const cols: TableColumnItem<IHoliday>[] = HolidayTable;
</script>
