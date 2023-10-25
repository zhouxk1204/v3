<template>
  <Button type="primary" @click="onAdd" class="w-20 mb-4">添加</Button>

  <Table :rows="rows" :isAction="true" @edit="onEdit" @del="onDelete"></Table>

  <Dialog v-model="visible">
    <form
      class="absolute flex flex-col p-6 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow left-1/2 top-1/2 w-96"
    >
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-xl">{{ mode.data.value }}节假日信息</h1>
        <Button @click="closeFormPopUp"
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
          v-model="currentHoliday"
          :options="holidays"
          @select="onSelectHoliday"
          placeholder="请选择节假日"
        ></Select>
      </div>
      <div class="mb-4">
        <h2 class="mb-1 text-sm">节假日类型</h2>
        <Select
          v-model="currentHolidayAction"
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

      <Button @click="submit" :type="buttonType">{{ mode.data.value }} </Button>
    </form>
  </Dialog>

  <Dialog
    v-model="modelVisible"
    message="确定删除该节假日?"
    @confirm="deleteHolidayConfirm"
  ></Dialog>
</template>

<script setup lang="ts">
import { Option } from "@/components/Select/types";
import { TableHeader } from "@/components/Table/type";
import {
  HOLIDAYS,
  HOLIDAY_ACTIONS,
  HOLIDAY_TABLE_HEADERS,
} from "@/constants/index.ts";
import { Holiday } from "@/models/holiday.model";
import useStore from "@/store";
import { deepCopy } from "@/utils/index.ts";
import { storeToRefs } from "pinia";
import { computed, reactive, ref } from "vue";
import { FORM_MODE } from "./data.mock";

const holidays = HOLIDAYS;
const actions = HOLIDAY_ACTIONS;
// 节假日列表;
const { holidayList } = storeToRefs(useStore().holiday);
const rows: [TableHeader[], any[]] = [HOLIDAY_TABLE_HEADERS, holidayList.value];

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

const currentHoliday = computed(() => {
  return { key: form.data.id, label: form.data.name } as Option;
});

const currentHolidayAction = computed(() => {
  return { key: form.data.typeId, label: form.data.typeName } as Option;
});

/**
 * 节假日选择事件
 * @param {Option} option
 */
const onSelectHoliday = (option: Option) => {
  form.data.name = option.label;
  form.data.id = option.key;
};

/**
 * 补班加班选择事件
 * @param {Option} option
 */
const onSelectHolidayAction = (option: Option) => {
  form.data.typeName = option.label;
  form.data.typeId = option.key;
};

const buttonType = computed(() => {
  return Object.values(form.data).some((e) => e === "")
    ? "disabled"
    : "primary";
});

// 表单模式
const mode = reactive({ data: FORM_MODE.CREATE });

/**
 * 节假日form表单事件
 */
const submit = () => {
  if (mode.data.key === "create") {
    useStore().holiday.add(form.data);
  } else if (mode.data.key === "update") {
    useStore().holiday.update(form.data);
  }
  closeFormPopUp();
};

// 表单popup
const visible = ref<boolean>(false);
// 确认dialog
const modelVisible = ref<boolean>(false);

/**
 * 添加节假日
 */
const onAdd = (): void => {
  mode.data = FORM_MODE.CREATE;
  visible.value = true;
  resetFormData();
};

/**
 * 编辑按钮事件
 * @param {Holiday} holiday
 */
const onEdit = (holiday: Holiday): void => {
  mode.data = FORM_MODE.UPDATE;
  form.data = deepCopy(holiday);
  visible.value = true;
};

/**
 * 删除按钮事件
 * @param {Holiday} holiday
 */
const onDelete = (holiday: Holiday): void => {
  form.data = holiday;
  // 打开确认弹窗
  modelVisible.value = true;
};

/**
 * 确认删除节假日
 */
const deleteHolidayConfirm = (): void => {
  useStore().holiday.remove(form.data.date);
  resetFormData();
};

/**
 * 关闭表单pop up
 */
const closeFormPopUp = (): void => {
  visible.value = false;
};

/**
 * 重置表单数据
 */
const resetFormData = (): void => {
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
@/models/holiday.model
