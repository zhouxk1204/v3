<template>
  <el-form :model="formModel" ref="formRef" label-position="left"
    class="flex flex-wrap gap-2 max-[450px]:block items-center">
    <template v-for="item in form">
      <el-form-item :label="item.label" :prop="item.field" :rules="item.rules"
        v-show="!(item.hidden && (item.hidden.value === formModel[item.hidden.key]))">
        <!-- 日期 -->
        <el-date-picker style="width:100%" v-if="item.type === 'date'" type="date" v-model="formModel[item.field]"
          :placeholder="item.placeholder ?? ''" :clearable="item.clearable" :disabled="item.disabled"
          format="YYYY/MM/DD" value-format="YYYY/MM/DD" :editable="false" />
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
          :disabled="item.disabled" class="min-w-28" />
      </el-form-item>
    </template>
    <div class="max-[450px]:flex">
      <el-button type="primary" @click="handelSubmit" class="max-[450px]:flex-1">添加</el-button>
      <el-button type="danger" @click="handelReset" class="max-[450px]:flex-1">清空</el-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { FormInstance } from "element-plus/es/components/form";
import { ref } from "vue";
import { FieldItem } from "./form";

const formRef = ref<FormInstance>();
const formModel = ref<any>({});

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
  formRef.value.validate((valid, _) => {
    if (valid) {
      const numberFields = props.form
        .filter(e => e.type === 'number')
        .map(el => el.field);

      for (const key of numberFields) {
        if (formModel.value.hasOwnProperty(key)) {
          formModel.value[key] = +formModel.value[key];
        }
      }

      emit("submit", formModel.value);
    } else {
      // console.error("error submit!", fields);
    }
  });
};

const handelReset = () => {
  if (!formRef.value) return;
  formRef.value.resetFields();
};

defineExpose({
  handelReset
})
</script>