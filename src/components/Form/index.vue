<template>
  <el-form :model="formModel" ref="formRef" label-width="auto" :label-position="labelPosition" size="large"
    :inline="inline">
    <template v-for="item in form">
      <el-form-item :key="item.field" :label="item.label" :prop="item.field" :rules="item.rules"
        v-if="!(item.hidden && (item.hidden.value === formModel[item.hidden.key]))">
        <!-- 日期 -->
        <el-date-picker class="w-[132px]" v-if="item.type === 'date'" type="date" v-model="formModel[item.field]"
          :placeholder="item.placeholder ?? ''" :clearable="item.clearable" :disabled="item.disabled"
          format="YYYY/MM/DD" value-format="YYYY/MM/DD" :editable="false" />

        <!-- 日期范围选择 -->
        <el-date-picker v-if="item.type === 'daterange'" v-model="formModel[item.field]" :disabled="item.disabled"
          :clearable="item.clearable" type="daterange" unlink-panels range-separator="~" start-placeholder="开始日"
          end-placeholder="结束日" format="YYYY/MM/DD" value-format="YYYY/MM/DD"
          :disabled-date="(date: Date) => isDisabledDate(date, item.disableDateRange ?? [])" />

        <!-- 数字输入框 -->
        <el-input class="w-full" v-else-if="item.type === 'number'" v-model.number="formModel[item.field]"
          :placeholder="item.placeholder ?? ''" :clearable="item.clearable" :disabled="item.disabled" type="number"
          min="0" step="0.5" />
        <!-- 文本输入框 -->
        <el-input v-else-if="item.type === 'text'" v-model="formModel[item.field]" :placeholder="item.placeholder ?? ''"
          :clearable="item.clearable" :disabled="item.disabled" type="text" />
        <!-- 下拉选项 -->
        <el-select-v2 v-else-if="item.type === 'select'" v-model="formModel[item.field]"
          :placeholder="item.placeholder ?? ''" :clearable="item.clearable" :options="item.options ?? []"
          :disabled="item.disabled" class="min-w-[176px]" />
      </el-form-item>
    </template>
    <div :class="inline ? 'inline-block' : 'flex'">
      <el-button type="primary" @click="handelSubmit" :class="inline ? 'mb-[22px]' : 'flex-1'">添加</el-button>
      <el-button type="danger" @click="handelReset" :class="inline ? 'mb-[22px]' : 'flex-1'">清空</el-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { isInRange } from "@/utils/date";
import { FormInstance } from "element-plus/es/components/form";
import _ from "lodash";
import { ref } from "vue";
import { FieldItem } from "./form";

const formRef = ref<FormInstance>();
const formModel = ref<any>({});

const props = withDefaults(defineProps<{
  form: FieldItem[];
  inline?: boolean;
  labelPosition?: 'top' | 'left'
}>(), {
  inline: false,
  labelPosition: 'top'
});

for (let item of props.form) {
  formModel.value[item.field] = item.value;
}

const emit = defineEmits<{
  (e: "submit", data: Record<string, string | number>): void;
}>();

const handelSubmit = () => {
  if (!formRef.value) return;
  formRef.value.validate((valid, fields) => {
    if (valid) {

      const data = _.cloneDeep(formModel.value);
      for (let key in data) {
        const value = data[key];
        const type = props.form.find(e => e.field === key)?.type
        if (type === 'number') {
          if (value.length === 0) {
            delete data[key];
          } else {
            data[key] = +data[key];
          }
        }
      }

      emit("submit", _.cloneDeep(data));
    } else {
      console.error("error submit!", fields);
    }
  });
};

const handelReset = () => {
  if (!formRef.value) return;
  formRef.value.resetFields();
};

// 禁用日期范围方法
const isDisabledDate = (time: Date, range: string[][]) => {
  if (range.length === 0) return false;

  for (let dates of range) {
    if (isInRange(dates, time)) {
      return true;
    }
  }
  return false;
}

defineExpose({
  handelReset
})
</script>