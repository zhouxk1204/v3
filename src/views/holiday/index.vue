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
    <Button @click="submit" :type="buttonType" :disibled="true">添加</Button>
  </form>

  <Table class="mt-3" :headers="headers"></Table>
</template>

<script setup lang="ts">
import Button from "@/components/Button/index.vue";
import DatePicker from "@/components/DatePicker/index.vue";
import Select from "@/components/Select/index.vue";
import { Option } from "@/components/Select/types";
import Table from "@/components/Table/index.vue";
import {
HOLIDAYS,
HOLIDAY_ACTIONS,
HOLIDAY_TABLE_HEADERS,
} from "@/constants/index.ts";
import { computed, reactive, ref } from "vue";
const holidays = HOLIDAYS;
const holidayActions = HOLIDAY_ACTIONS;
const holiday = reactive({
  data: { key: "", label: "" },
});
const holidayAction = reactive({
  data: { key: "", label: "" },
});

const selectHoliday = (data: Option) => {
  holiday.data = data;
};

const selectHolidayActions = (data: Option) => {
  holidayAction.data = data;
};

const form = computed(() => {
  return {
    date: date.value,
    name: holiday.data.label,
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
const submit = () => {
  console.log("%c Line:22 🍫 holidayName", "color:#6ec1c2", form);
};

const headers = HOLIDAY_TABLE_HEADERS;
</script>
<style lang="scss" scoped></style>
