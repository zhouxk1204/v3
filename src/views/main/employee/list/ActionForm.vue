<template>
  <el-dialog v-model="newModelValue" :title="title" width="360" destroy-on-close :append-to-body="true"
    :show-close="false" :close-on-click-modal="false">
    <el-form :model="formData" label-width="auto" :rules="rules" status-icon ref="dictFormRef">
      <el-form-item label="员工工号" required prop="no">
        <el-input-number v-model="formData.no" :min="0" />
      </el-form-item>
      <el-form-item label="员工姓名" required prop="name">
        <el-input v-model="formData.name" placeholder="请输入员工姓名" clearable />
      </el-form-item>
      <el-form-item label="员工系数" required prop="factor">
        <el-input-number v-model="formData.factor" :min="0.45" :step="0.05" />
      </el-form-item>
      <el-form-item label="员工性别" prop="genderId">
        <el-radio-group v-model="formData.genderId">
          <el-radio value="0">女</el-radio>
          <el-radio value="1">男</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="员工职位" prop="positionId">
        <el-radio-group v-model="formData.positionId">
          <el-radio value="0">护士</el-radio>
          <el-radio value="1">护士长</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="员工状态" prop="statusId">
        <el-radio-group v-model="formData.statusId">
          <el-radio value="0">离职</el-radio>
          <el-radio value="1">在职</el-radio>
        </el-radio-group>
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
import { EmployeeForm } from "@/types/employee";
import { FormInstance, FormRules } from "element-plus/es/components";
import cloneDeep from "lodash/cloneDeep";
import { reactive, ref, watch } from "vue";

const props = defineProps<{
  title: string,
  formData: EmployeeForm,
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
  (e: "confirm", data: EmployeeForm): void;
  (e: "update:modelValue", data: boolean): void;
}>();

const dictFormRef = ref<FormInstance>();
const rules = reactive<FormRules<EmployeeForm>>({
  no: [
    { required: true, message: '请输入员工工号', trigger: 'blur' },
  ],
  name: [
    { required: true, message: '请输入员工姓名', trigger: 'blur' },
  ],
  factor: [
    { required: true, message: '请输入员工系数', trigger: 'blur' },
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