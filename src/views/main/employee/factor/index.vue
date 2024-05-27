<template>
  <Search :visible="true" :form="form"></Search>

  <Table2 :columns="columns" :tableData="tableData" @add="onAdd" @edit="onEdit" @delete="onDelete" @refresh="onRefresh">
  </Table2>

  <el-dialog v-model="actionFormVisible" :title="formTitle" :width="deviceType === 'mobile' ? '95%' : '60%'"
    destroy-on-close :append-to-body="true" :show-close="false" :close-on-click-modal="false">
    <Form2 :rules="rules" :form="actionForm" @confirm="onConfirm" @cancel="onClose"></Form2>
  </el-dialog>
</template>

<script setup lang='ts'>
import { SearchFormItem } from '@/components/Search/type';
import useDevice from '@/hooks/useDevice';
import { FormRules } from "element-plus/es/components";

const { deviceType } = useDevice();

const actionFormVisible = ref(false);
const mode = ref<"init" | "edit" | "add">("init");
const formTitle = computed(() => {
  return mode.value === 'add' ? '添加系数变更信息' : mode.value === 'edit' ? '修改系数变更信息' : ''
})

const form: SearchFormItem[] = [
  {
    field: 'name',
    label: '姓名',
    type: 'text',
    value: '',
  },
]

const actionForm: SearchFormItem[] = [
  {
    field: 'name',
    label: '职工姓名',
    type: 'text',
    value: '',
  },
  {
    field: 'weighted',
    label: '系数变更',
    type: 'number',
    value: '',
  },
  {
    field: 'effectiveMonth',
    label: '生效起始月份',
    type: 'month',
    value: '',
  },
  {
    field: 'remark',
    label: '系数变更备注',
    type: 'textarea',
    value: '',
  },
]

const rules = reactive<FormRules<any>>({
  name: [
    { required: true, message: '请输入职工名称', trigger: 'blur' },
  ],
  weighted: [
    { required: true, message: '请输入系数变化值', trigger: 'blur' },
  ],
  effectiveMonth: [
    { required: true, message: '请输入系数变化生效起始月份', trigger: 'blur' },
  ],
  remark: [
    { required: true, message: '请输入系数变化备注信息', trigger: 'blur' },
  ],
});

const columns = [
  {
    field: "name",
    label: "姓名"
  }, {
    field: "weighted",
    label: "系数变化",
    style: 'tag',
  }, {
    field: "effectiveMonth",
    label: "生效起始月份"
  },
  {
    field: "createTime",
    label: "创建时间"
  },
  {
    field: "remark",
    label: "调整原因备注"
  }
]

const tableData = [
  {
    no: 1,
    name: "张三",
    weighted: "1.2",
    effectiveMonth: "2021-01",
    createTime: "2021-01-01 00:00:00",
    remark: "中级职称中级职称中级职称中级职称中级职称中级职称中级职称中级职称"
  }
]

const onEdit = (row: any) => {
  mode.value = 'edit';
  console.log(row)
}

const onDelete = (row: any) => {
  console.log(row);
}

const onRefresh = () => {
  console.log('refresh');
}

const onAdd = () => {
  mode.value = 'add';
  actionFormVisible.value = true;
}

const onConfirm = (data: any) => {
  console.log("%c Line:126 🥟 data", "color:#6ec1c2", data);
  onClose();
}

const onClose = () => {
  actionFormVisible.value = false;
}
</script>