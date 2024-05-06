<template>
  <el-dialog v-model="newModelValue" :title="title" width="500" destroy-on-close :append-to-body="true"
    :show-close="false" :close-on-click-modal="false">
    <el-form :model="formData" label-width="auto" :rules="rules" status-icon ref="dictFormRef">
      <el-form-item label="字典类型" prop="dictType">
        <el-input v-model="formData.dictType" disabled />
      </el-form-item>
      <el-form-item label="数据标签" required prop="dictLabel">
        <el-input v-model="formData.dictLabel" placeholder="请输入数据标签" clearable />
      </el-form-item>
      <el-form-item label="数据键值" required prop="dictValue">
        <el-input v-model="formData.dictValue" placeholder="请输入数据键值" clearable />
      </el-form-item>
      <el-form-item label="显示排序" required prop="dictSort">
        <el-input-number v-model="formData.dictSort" :min="0" :max="10" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio value="0">正常</el-radio>
          <el-radio value="1">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" placeholder="请输入备注信息"
          show-word-limit maxlength="100" />
      </el-form-item>
      <el-form-item>
        <el-row justify="end" class="w-full">
          <el-button type="primary" @click="submit(dictFormRef)">确定</el-button>
          <el-button @click="cancel(dictFormRef)">取消</el-button>
        </el-row>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang='ts'>
import { DictDetailForm } from "@/types/dict.d";
import { FormInstance, FormRules } from "element-plus/es/components";
import cloneDeep from "lodash/cloneDeep";

const props = defineProps<{
  title: string,
  formData: DictDetailForm,
  modelValue: boolean
}>();

const newModelValue = ref(props.modelValue);
watch(
  () => props.modelValue, // 监听props.modelValue的变化
  (newValue) => {
    newModelValue.value = newValue; // 将新值赋给newModelValue
  }
);

const emit = defineEmits<{
  (e: "confirm", data: DictDetailForm): void;
  (e: "update:modelValue", data: boolean): void;
}>();

const dictFormRef = ref<FormInstance>();
const rules = reactive<FormRules<DictDetailForm>>({
  dictLabel: [
    { required: true, message: '请输入数据标签', trigger: 'blur' },
  ],
  dictValue: [
    { required: true, message: '请输入数据键值', trigger: 'blur' },
  ],
});

const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      emit("confirm", cloneDeep(props.formData));
      emit("update:modelValue", false);
    } else {
      console.log('error submit!', fields)
    }
  })
}

const cancel = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields();
  emit("update:modelValue", false);
}
</script>