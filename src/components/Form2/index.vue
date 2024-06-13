<template>
  <el-form :model="formModel" label-width="auto" :rules="rules" status-icon ref="formRef">

    <template v-for="item in form">
      <el-form-item :label="item.label" :prop="item.field">
        <!-- 输入框 -->
        <el-input v-if="item.type === 'text'" v-model="formModel[item.field]"
          :placeholder="item.placeholder ?? '请输入' + item.label" clearable />
        <!-- 文本域 -->
        <el-input v-else-if="item.type === 'textarea'" v-model="formModel[item.field]"
          :placeholder="item.placeholder ?? '请输入' + item.label" autosize type="textarea" />
        <!-- 数字 -->
        <el-input-number v-else-if="item.type === 'number'" v-model="formModel[item.field]" :step="item.step ?? 1" />
        <!-- 下拉选项 -->
        <el-select-v2 v-else-if="item.type === 'select'" v-model="formModel[item.field]" class="min-w-40"
          :placeholder="item.placeholder ?? '请选择' + item.label" clearable :options="item.options ?? []" />
        <!-- 月份 -->
        <el-date-picker v-else-if="item.type === 'month'" v-model="formModel[item.field]" class="min-w-40" type="month"
          :placeholder="item.placeholder ?? '请选择' + item.label" format="YYYY/MM" value-format="YYYY/MM" clearable />
        <!-- 日期范围 -->
        <el-date-picker v-if="item.type === 'date-range'" v-model="formModel[item.field]" clearable type="daterange"
          unlink-panels range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" format="YYYY/MM/DD"
          value-format="YYYY/MM/DD" :disabled-date="(date: Date) => isDisabledDate(date, item.disableDates ?? [])" />
      </el-form-item>
    </template>

    <el-row justify="end" class="w-full pt-4">
      <el-button type="primary" @click="submit(formRef)">确定</el-button>
      <el-button @click="cancel(formRef)">取消</el-button>
    </el-row>
  </el-form>
</template>

<script setup lang='ts'>
import { FormItem } from "@/types/common";
import { isInRange } from "@/utils/date";
import { FormInstance, FormRules } from "element-plus/es/components";
import cloneDeep from 'lodash/cloneDeep';
const formRef = ref<FormInstance>();

const props = defineProps<{
  form: FormItem[],
  rules: FormRules,
}>();

const emit = defineEmits<{
  (e: "confirm", data: any): void;
  (e: "cancel", data: null): void;
}>();

const formModel = ref(props.form.reduce((acc, item) => {
  acc[item.field] = item.type === 'number' ? +item.value : item.value;
  return acc;
}, {} as Record<string, any>));

const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      emit("confirm", cloneDeep(formModel.value));
    } else {
      console.log('error submit!', fields)
    }
  })
}

const cancel = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields();
  emit("cancel", null);
}

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
</script>