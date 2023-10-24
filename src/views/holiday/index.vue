<template>
  <Button type="primary" @click="onAddHoliday" class="w-20">添加</Button>

  <Table
    class="mt-3"
    :rows="rows"
    :isAction="true"
    @edit="onEdit"
    @del="onDelete"
  ></Table>

  <Dialog v-model="visible">
    <form
      class="absolute flex flex-col p-6 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow left-1/2 top-1/2 w-96"
    >
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-xl">{{ mode === 0 ? "添加" : "更新" }}节假日信息</h1>
        <Button @click="close"
          ><svg
            class="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            /></svg
        ></Button>
      </div>
      <div class="mb-4">
        <h2 class="mb-1 text-sm">日期</h2>
        <DatePicker v-model="form.data.date"></DatePicker>
      </div>
      <div class="mb-4">
        <h2 class="mb-1 text-sm">节假日</h2>
        <Select
          v-model="selectedHoliday"
          :options="holidays"
          @select="onSelectHoliday"
          placeholder="请选择节假日"
        ></Select>
      </div>
      <div class="mb-4">
        <h2 class="mb-1 text-sm">节假日类型</h2>
        <Select
          v-model="selectedAction"
          placeholder="请选择节假日类型"
          :options="actions"
          @select="onSelectHolidayAction"
        ></Select>
      </div>
      <div class="mb-4">
        <h2 class="mb-1 text-sm">上班工分倍率</h2>
        <input
          class="w-full h-12 px-2 border rounded-lg"
          type="number"
          step="0.5"
          v-model="form.data.workWeight"
        />
      </div>
      <div class="mb-4">
        <h2 class="mb-1 text-sm">加班工分倍率</h2>
        <input
          class="w-full h-12 px-2 border rounded-lg"
          type="number"
          step="0.5"
          v-model="form.data.extraWeight"
        />
      </div>

      <Button @click="submit" :type="buttonType">{{
        mode === 0 ? "添加" : "更新"
      }}</Button>
    </form>
  </Dialog>
  <Dialog
    v-model="modelVisible"
    message="确定删除该节假日?"
    @confirm="confirm"
  ></Dialog>
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
import { Holiday } from "@/models/holidayModel";
import useStore from "@/store";
import { storeToRefs } from "pinia";
import { computed, reactive, ref } from "vue";
const holidays = HOLIDAYS;
const actions = HOLIDAY_ACTIONS;

const form = reactive<{ data: Holiday }>({
  data: {
    date: "",
    id: "",
    name: "",
    typeId: "",
    typeName: "",
    workWeight: 1,
    extraWeight: 1.5,
  },
});

const mode = ref<number>(0);

const selectedHoliday = computed(() => {
  return { key: form.data.id, label: form.data.name } as Option;
});

const selectedAction = computed(() => {
  return { key: form.data.typeId, label: form.data.typeName } as Option;
});

const onSelectHoliday = (data: Option) => {
  form.data.name = data.label;
  form.data.id = data.key;
};

const onSelectHolidayAction = (data: Option) => {
  form.data.typeName = data.label;
  form.data.typeId = data.key;
};

const buttonType = computed(() => {
  return Object.values(form.data).some((e) => e === "")
    ? "disabled"
    : "primary";
});

const submit = () => {
  useStore().holiday.add(form.data);
  close();
};
// 节假日列表;
const { holidayList } = storeToRefs(useStore().holiday);
const rows: [TableHeader[], any[]] = [HOLIDAY_TABLE_HEADERS, holidayList.value];

const visible = ref<boolean>(false);
const modelVisible = ref<boolean>(false);

const onAddHoliday = () => {
  mode.value = 0;
  visible.value = true;
};

const onEdit = (holiday: Holiday) => {
  mode.value = 1;
  form.data = holiday;
  visible.value = true;
};

const onDelete = (holiday: Holiday) => {
  form.data = holiday;
  modelVisible.value = true;
};

const close = () => {
  visible.value = false;
};

const confirm = () => {
  useStore().holiday.remove(form.data.date);
  form.data = {
    date: "",
    id: "",
    name: "",
    typeId: "",
    typeName: "",
    workWeight: 1,
    extraWeight: 1.5,
  };
};
</script>
<style lang="scss" scoped></style>
