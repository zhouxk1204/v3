<template>
  <form class="flex">
    <Select
      :options="holidays"
      @select="selectHoliday"
      placeholder="请选择节假日"
      class="mr-3"
    ></Select>
    <Select
      placeholder="请选择节假日类型"
      :options="holidayActions"
      @select="selectHolidayActions"
      class="mr-3"
    ></Select>
    <DatePicker v-model="date" class="mr-3"></DatePicker>
    <Button @click="submit" :type="buttonType">添加</Button>
  </form>

  <Table class="mt-3" :rows="rows" :isAction="true"></Table>

  <Dialog v-model="isShowDialog" @confirm="confirm"></Dialog>

  <Button @click="openDialog">打开</Button>
</template>

<script setup lang="ts">
import Button from "@/components/Button/index.vue";
import DatePicker from "@/components/DatePicker/index.vue";
import Dialog from "@/components/Dialog/index.vue";
import Select from "@/components/Select/index.vue";
import { Option } from "@/components/Select/types";
import Table from "@/components/Table/index.vue";
import { TableHeader } from "@/components/Table/type";
import {
  HOLIDAYS,
  HOLIDAY_ACTIONS,
  HOLIDAY_TABLE_HEADERS,
} from "@/constants/index.ts";
import useStore from "@/store";
import { storeToRefs } from "pinia";
import { computed, reactive, ref } from "vue";
import { MOCK_HOLIDAY } from "./data.mock";
const holidays = HOLIDAYS;
const holidayActions = HOLIDAY_ACTIONS;
const holiday2 = reactive({
  data: { key: "", label: "" },
});
const holidayAction = reactive({
  data: { key: "", label: "" },
});

const selectHoliday = (data: Option) => {
  holiday2.data = data;
};

const selectHolidayActions = (data: Option) => {
  holidayAction.data = data;
};

const form = computed(() => {
  return {
    date: date.value,
    name: holiday2.data.label,
    typeId: holidayAction.data.key,
    typeName: holidayAction.data.label,
  };
});

const buttonType = computed(() => {
  return Object.values(form.value).some((e) => e === "")
    ? "disabled"
    : "primary";
});

const date = ref("");
const submit = () => {};

const rows: [TableHeader[], any[]] = [HOLIDAY_TABLE_HEADERS, MOCK_HOLIDAY];

// 节假日列表
const { holidayList } = storeToRefs(useStore().holiday);

const isShowDialog = ref<boolean>(false);
const confirm = () => {};
const openDialog = () => {
  isShowDialog.value = true;
};
</script>
<style lang="scss" scoped></style>
