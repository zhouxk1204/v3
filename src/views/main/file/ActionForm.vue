<template>
  <el-dialog v-model="newModelValue" :title="title" width="360" destroy-on-close :append-to-body="true"
    :show-close="false" :close-on-click-modal="false" @close="handleDialogClose">
    <el-form :model="formData" label-width="auto" :rules="rules" status-icon ref="dictFormRef">
      <el-form-item label="文件名" required prop="name">
        <el-input v-model="form.name" placeholder="请输入文件名" clearable />
      </el-form-item>
      <el-form-item label="文件种类" prop="typeId">
        <el-radio-group v-model="form.typeId">
          <el-radio value="0">图片</el-radio>
          <el-radio value="1">音乐</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="文件状态" prop="statusId">
        <el-radio-group v-model="form.statusId">
          <el-radio value="0">正常</el-radio>
          <el-radio value="1">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="文件上传" prop="url">
        <el-upload :class="{ uoloadSty: fileList.length >= 1, disUoloadSty: fileList.length >= 1 }" :limit="1"
          v-model:file-list="fileList" :auto-upload="false" list-type="picture-card"
          :on-preview="handlePictureCardPreview">
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="文件备注" prop="remark">
        <el-input v-model="formData.remark" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" placeholder="请输入备注信息"
          show-word-limit maxlength="100" />
      </el-form-item>
      <el-form-item>
        <el-row justify="end" class="w-full">
          <el-button type="primary" @click="submit(dictFormRef)" :loading="isConfirm">确定</el-button>
          <el-button @click="cancel(dictFormRef)" :loading="isConfirm">取消</el-button>
        </el-row>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang='ts'>
import { useCos } from "@/hooks/useCos";
import { FileForm } from "@/types/files.d";
import { Plus } from "@element-plus/icons-vue";
import type { UploadProps, UploadUserFile } from 'element-plus';
import { FormInstance, FormRules } from "element-plus/es/components";
import cloneDeep from "lodash/cloneDeep";
import { reactive, ref, watch } from "vue";

const props = defineProps<{
  title: string,
  formData: FileForm,
  modelValue: boolean
}>();

const newModelValue = ref(props.modelValue);
watch(
  () => props.modelValue, // 监听props.modelValue的变化
  (newValue) => {
    if (form.url.length > 0) {
      fileList.value = [{
        name: form.name,
        url: form.url
      }];
    }
    newModelValue.value = newValue; // 将新值赋给newModelValue
  }
);

const form = reactive(props.formData);

const emit = defineEmits<{
  (e: "confirm", data: FileForm): void;
  (e: "update:modelValue", data: boolean): void;
}>();

const dictFormRef = ref<FormInstance>();
const rules = reactive<FormRules<FileForm>>({
  name: [
    { required: true, message: '请输入文件名', trigger: 'submit' },
  ],
});

const isConfirm = ref(false);
const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      isConfirm.value = true;
      const uploadUserFile = fileList.value[0];
      if (uploadUserFile.hasOwnProperty('raw')) {
        const type = uploadUserFile.name.split('.')[1];
        const cos = useCos({
          bucket: 'peach-1322235980', // 存储桶
          region: 'ap-chengdu', // 地区
          prefix: '/love/', // 存储桶文件夹路径 /xx/
          stsUrl: 'https://api.zhouxk.fun/sts',
        });
        const data: any = await cos.upload({
          uploadBody: uploadUserFile.raw as File,
          type
        });
        form.url = `https://${data.Location}`;
      } else {
        form.url = uploadUserFile.url ?? '';
      }
      emit("confirm", cloneDeep(form));
      emit("update:modelValue", false);
      return
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

const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

const fileList = ref<UploadUserFile[]>([]);


const handleDialogClose = () => {
  // 关闭dialog时清除文件列表
  fileList.value = [];
}

</script>
<style>
.uoloadSty .el-upload--picture-card {
  width: 110px;
  height: 110px;
  line-height: 110px;
}

.disUoloadSty .el-upload--picture-card {
  display: none;
  /* 上传按钮隐藏 */
}
</style>