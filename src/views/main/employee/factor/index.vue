<template>
  <Search v-if="searchFormVisible" :form="form" @search="onSearch"></Search>

  <Table2 :columns="columns" :tableData="tableData" @add="onAdd" @edit="onEdit" @delete="onDelete" @refresh="onRefresh"
    @toggle="onToggle">
  </Table2>

  <el-dialog v-model="actionFormVisible" :title="formTitle" :width="deviceType === 'mobile' ? '95%' : '420'"
    destroy-on-close :append-to-body="true" :show-close="false" :close-on-click-modal="false">
    <Form2 :rules="rules" :form="actionForm" @confirm="onConfirm" @cancel="onClose"></Form2>
  </el-dialog>
</template>

<script setup lang='ts'>
import { getSelectOptionByType2 } from "@/api/common.api";
import { addFactorInfo, deleteFactorInfo, getFactorList, updateFactorInfo } from "@/api/factor.api";
import { DictDetailTypeEnum } from "@/constants";
import useDevice from '@/hooks/useDevice';
import useUserStore from "@/store/user.store";
import { FormItem, SelectOption } from '@/types/common';
import { FactorTableData } from "@/types/factor";
import { FormRules } from "element-plus/es/components";

const { deviceType } = useDevice();

const actionFormVisible = ref(false);
const searchFormVisible = ref(true);
const mode = ref<"init" | "edit" | "add">("init");
const formTitle = computed(() => {
  return mode.value === 'add' ? '添加系数变更信息' : mode.value === 'edit' ? '修改系数变更信息' : ''
})

const form = ref<FormItem[]>([]);
const actionForm = ref<FormItem[]>([]);

const initForm = (options: SelectOption[]) => {

  form.value = [
    {
      field: 'id',
      label: '职工姓名',
      type: 'select',
      value: '',
      options
    },
  ];

  actionForm.value = [
    {
      field: 'id',
      label: '职工姓名',
      type: 'select',
      value: '',
      options
    },
    {
      field: 'weighted',
      label: '系数变更',
      type: 'number',
      value: '',
      step: 0.01
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
}

const getEmployeeSelectOptions = async () => {
  const res = await getSelectOptionByType2(DictDetailTypeEnum.EMPLOYEE);
  initForm(res.data);
}
getEmployeeSelectOptions();

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
    field: "no",
    label: "编号"
  },
  {
    field: "name",
    label: "姓名"
  }, {
    field: "weighted",
    label: "系数变化",
    style: {
      type: 'tag',
      color: (val: number) => {
        return val > 0 ? 'primary' : 'danger';
      }
    }
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

const tableData = ref<FactorTableData[]>([])

const editRowNo = ref<number>(-1);
const onEdit = (row: any) => {
  editRowNo.value = row.no;
  mode.value = 'edit';
  actionFormVisible.value = true;
  Object.keys(row).forEach(key => {
    const item = actionForm.value.find(e2 => e2.field === key);
    if (item) item.value = row[key];
  })
}

const onDelete = (rows: any[]) => {
  const nos = rows.map(e => e.no);
  ElMessageBox.confirm(
    `是否确认删除编号为"${nos.join(', ')}"的数据项？`,
    '系统提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      const res = await deleteFactorInfo(nos);
      ElMessage.success(res.message);
      await getTableData();
    })
    .catch(() => {
      ElMessage.info('取消删除！')
    })
}

const onRefresh = () => {
  getTableData();
}

const onAdd = () => {
  mode.value = 'add';
  actionFormVisible.value = true;
}

const onConfirm = (data: any) => {

  onClose();
  const userId = useUserStore().user.userId;
  if (mode.value === 'add') {
    const body = Object.assign(data, { createBy: userId });
    addFactorInfo(body).then((res: any) => {
      ElMessage.success(res.message);
      getTableData();
    })
  } else if (mode.value === 'edit') {
    updateFactorInfo(Object.assign(data, { no: editRowNo.value, updateBy: userId })).then(res => {
      editRowNo.value = -1;
      ElMessage.success(res.message);
      getTableData();
    });
  } else {
    return;
  }
}

const onClose = () => {
  actionFormVisible.value = false;
}

const onSearch = (data: any) => {
  getTableData(data);
}

const onToggle = () => {
  searchFormVisible.value = !searchFormVisible.value;
}

const getTableData = async (data?: Record<string, any>) => {
  const res = await getFactorList(data);
  tableData.value = res.data;
}
getTableData();
</script>