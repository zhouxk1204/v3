<template>
  <el-form
    :model="formModel"
    ref="formRef"
    :inline="true"
    class="flex flex-wrap gap-1"
  >
    <template v-for="item in form">
      <el-form-item :label="item.label" :prop="item.field" :rules="item.rules">
        <!-- 日期 -->
        <el-date-picker
          v-if="item.type === 'date'"
          type="date"
          v-model="formModel[item.field]"
          :placeholder="item.placeholder ?? ''"
          :clearable="item.clearable"
          :disabled="item.disabled"
          format="YYYY/MM/DD"
          value-format="YYYY/MM/DD"
        />
        <!-- 数字输入框 -->
        <el-input
          v-else-if="item.type === 'number'"
          v-model="formModel[item.field]"
          :placeholder="item.placeholder ?? ''"
          :clearable="item.clearable"
          :disabled="item.disabled"
          type="number"
          min="0"
          step="0.5"
        />
        <!-- 文本输入框 -->
        <el-input
          v-else-if="item.type === 'text'"
          v-model="formModel[item.field]"
          :placeholder="item.placeholder ?? ''"
          :clearable="item.clearable"
          :disabled="item.disabled"
          type="text"
        />
        <!-- 下拉选项 -->
        <el-select-v2
          v-else-if="item.type === 'select'"
          v-model="formModel[item.field]"
          :placeholder="item.placeholder ?? ''"
          :clearable="item.clearable"
          :options="item.options ?? []"
          :disabled="item.disabled"
          class="min-w-28"
        />
      </el-form-item>
    </template>
    <el-button type="primary" @click="handelSubmit">添加</el-button>
    <el-button type="danger" @click="handelReset">清空</el-button>
  </el-form>
</template>

<script setup lang="ts">
import { FieldItem } from "@/types/form";
import { FormInstance } from "element-plus/es/components/form";
import * as _ from "lodash";
import { ref } from "vue";

const formRef = ref<FormInstance>();
const formModel = ref<Record<string, string | number>>({});

const props = defineProps<{
  form: FieldItem[];
}>();

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
      emit("submit", _.cloneDeep(formModel.value));
    } else {
      console.error("error submit!", fields);
    }
  });
};

const handelReset = () => {
  if (!formRef.value) return;
  formRef.value.resetFields();
};
</script>
@/components/Form/form
