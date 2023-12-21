<template>
  <div class="flex items-end justify-between">
    <h1 class="text-2xl font-bold">节假日管理</h1>
    <Button type="primary" @click="open">添加</Button>
  </div>
  <hr class="mt-2 mb-3" />
  <Table
    :headers="headers"
    :data="list"
    :isAction="true"
    @edit="onEdit"
    @del="onDel"
  ></Table>

  <Dialog v-model="isOpen">
    <form
      class="absolute flex flex-col p-6 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow left-1/2 top-1/2 w-96"
    >
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-xl font-bold">{{ mode.text }}节假日信息</h1>
        <Button @click="onClose"
          ><Icon icon="material-symbols:close" color="#bbb"
        /></Button>
      </div>
      <!-- 日期 -->
      <FormItem title="日期">
        <DatePicker v-model="form.date"></DatePicker>
      </FormItem>
      <!-- 节假日 -->
      <FormItem title="节假日">
        <Select
          v-model="currentHoliday"
          :options="holidays"
          @select="onSelectHoliday"
          placeholder="请选择节假日"
        ></Select>
      </FormItem>
      <!-- 节假日类型 -->
      <FormItem title="节假日类型">
        <Select
          v-model="currentHolidayAction"
          placeholder="请选择节假日类型"
          :options="actions"
          @select="onSelectHolidayAction"
        ></Select>
      </FormItem>
      <!-- 上班工分倍率 -->
      <FormItem title="上班工分倍率" v-show="currentHolidayAction.code === '0'">
        <Input type="number" v-model="form.workWeight"></Input>
      </FormItem>
      <!-- 加班工分倍率 -->
      <FormItem title="加班工分倍率">
        <Input type="number" v-model="form.extraWeight"></Input>
      </FormItem>
      <Button @click="submit" type="primary" :disabled="isFormValid"
        >{{ mode.text }}
      </Button>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { Option } from "@/components/Select/types";
import { HOLIDAYS, HOLIDAY_ACTIONS } from "@/constants/index.ts";
import { HOLIDAY_TABLE_HEADERS } from "@/constants/table.header";
import { useDialog } from "@/hooks/useDialog";
import { Holiday } from "@/models/holiday.model";
import useStore from "@/store";
import { deepCopy } from "@/utils/index.ts";
import { computed, ref } from "vue";

const { mode, isOpen, openDialog, closeDialog } = useDialog();
// 节假日列表;
const headers = HOLIDAY_TABLE_HEADERS;
const list = useStore().holiday.holidayList;

const emptyForm = (): Holiday => {
  return {
    date: "",
    id: "",
    name: "",
    typeId: "",
    typeName: "",
    workWeight: 1,
    extraWeight: 1.5,
  };
};

const form = ref<Holiday>(emptyForm());

const holidays = HOLIDAYS;
const currentHoliday = ref({
  code: form.value.id,
  text: form.value.name,
});
/**
 * 节假日选择事件
 * @param {Option} option
 */
const onSelectHoliday = (option: Option) => {
  form.value.name = option.text;
  form.value.id = option.code;
};

const actions = HOLIDAY_ACTIONS;
const currentHolidayAction = ref({
  code: form.value.typeId,
  text: form.value.typeName,
} as Option);
/**
 * 补班加班选择事件
 * @param {Option} option
 */
const onSelectHolidayAction = (option: Option) => {
  form.value.typeName = option.text;
  form.value.typeId = option.code;
};

const isFormValid = computed(() => {
  return Object.values(form.value).some((e) => !Boolean(e));
});

/**
 * 节假日form表单事件
 */
const submit = () => {
  if (mode.value.code === "create") {
    useStore().holiday.add(form.value);
  } else if (mode.value.code === "update") {
    useStore().holiday.update(form.value);
  }
  form.value = emptyForm();
  closeDialog();
};

/**
 * 编辑按钮事件
 * @param {Holiday} holiday
 */
const onEdit = (holiday: Holiday): void => {
  form.value = deepCopy(holiday);
  currentHoliday.value.code = holiday.id;
  currentHoliday.value.text = holiday.name;
  currentHolidayAction.value.code = holiday.typeId;
  currentHolidayAction.value.text = holiday.typeName;
  openDialog(false);
};

/**
 * 删除按钮事件
 * @param {Holiday} holiday
 */
const onDel = (holiday: Holiday): void => {
  useStore().holiday.remove(holiday.date);
};

const onClose = () => {
  form.value = emptyForm();
  closeDialog();
};

const open = () => {
  currentHolidayAction.value = {
    code: form.value.typeId,
    text: form.value.typeName,
  };
  currentHoliday.value = {
    code: form.value.id,
    text: form.value.name,
  };
  openDialog();
};
</script>
<style lang="scss" scoped></style>
