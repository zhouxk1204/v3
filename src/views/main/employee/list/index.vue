<template>
  <Search v-if="searchFormVisible" :form="form" @search="onSearch"></Search>

  <Table2 :back="false" :columns="columns" :tableData="tableData" @add="onAdd" @edit="onEdit" @delete="onDelete"
    @refresh="onRefresh" @toggle="onToggle">
  </Table2>

  <el-dialog v-model="actionFormVisible" :title="formTitle" :width="deviceType === 'mobile' ? '95%' : '420'"
    destroy-on-close :append-to-body="true" :show-close="false" :close-on-click-modal="false">
    <Form2 :rules="rules" :form="actionForm" @confirm="onConfirm" @cancel="onClose"></Form2>
  </el-dialog>
</template>

<script setup lang='ts'>
import { addEmployeeInfo, deleteEmployeeInfo, getEmployeeInfoList, getEmployeeSelection, updateEmployeeInfo } from "@/api/employee.api";
import useDevice from '@/hooks/useDevice';
import useUserStore from "@/store/user.store";
import { FormItem, SelectOption } from "@/types/common";
import { EmployeeSearchForm, EmployeeTableData } from "@/types/employee";
import { TableColumn, TagType } from "@/types/table";
import { FormRules } from "element-plus/es/components";

const { deviceType } = useDevice();

const actionFormVisible = ref(false);
const searchFormVisible = ref(true);
const mode = ref<"init" | "edit" | "add">("init");
const formTitle = computed(() => {
  return mode.value === 'add' ? '添加系数变更信息' : mode.value === 'edit' ? '修改系数变更信息' : ''
})

const selectOptionObj = reactive<{
  gender: SelectOption[],
  position: SelectOption[],
  status: SelectOption[],
}>({
  gender: [],
  position: [],
  status: []
})


const form = computed<FormItem[]>(() => {
  return [
    {
      field: 'name',
      label: '姓名',
      type: 'text',
      value: '',
    },
    {
      field: 'genderId',
      label: '性别',
      type: 'select',
      value: '',
      options: selectOptionObj.gender
    },
    {
      field: 'positionId',
      label: '职位',
      type: 'select',
      value: '',
      options: selectOptionObj.position
    },
    {
      field: 'statusId',
      label: '状态',
      type: 'select',
      value: '',
      options: selectOptionObj.status
    },
  ];
})

const actionForm = computed<FormItem[]>(() => {
  return [
    {
      field: 'name',
      label: '职工姓名',
      type: 'text',
      value: '',
    },
    {
      field: 'factor',
      label: '基础系数',
      type: 'number',
      value: '',
      step: 0.01
    },
    {
      field: 'genderId',
      label: '职工性别',
      type: 'select',
      value: '',
      options: selectOptionObj.gender
    },
    {
      field: 'positionId',
      label: '员工职位',
      type: 'select',
      value: '',
      options: selectOptionObj.position
    },
    {
      field: 'statusId',
      label: '员工状态',
      type: 'select',
      value: '',
      options: selectOptionObj.status
    },
  ]
});

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

const columns: TableColumn[] = [
  {
    field: "no",
    label: "编号"
  },
  {
    field: "name",
    label: "姓名"
  },
  {
    field: "factor",
    label: "系数",
  },
  {
    field: "gender",
    label: "性别",
    style: {
      type: 'tag',
      color: (val: string) => {
        const index = selectOptionObj.gender.findIndex(e => e.label == val);
        return ['danger', 'primary'][index > 0 && index < 2 ? index : 0] as TagType;
      }
    },
  },
  {
    field: "position",
    label: "职位",
    style: {
      type: 'tag',
      color: (val: string) => {
        const index = selectOptionObj.position.findIndex(e => e.label == val);
        return ['info', 'danger'][index > 0 && index < 2 ? index : 0] as TagType;
      }
    },
  },
  {
    field: "status",
    label: "状态",
    style: {
      type: 'tag',
      color: (val: string) => {
        const index = selectOptionObj.status.findIndex(e => e.label == val);
        return ['info', 'success'][index > 0 && index < 2 ? index : 0] as TagType;
      }
    },
  }
]

const tableData = ref<EmployeeTableData[]>([])

const editRowNo = ref<number>(-1);
const onEdit = (row: any) => {
  editRowNo.value = row.no;
  mode.value = 'edit';
  actionFormVisible.value = true;
  Object.keys(row).forEach(key => {
    const item = actionForm.value.find(e2 => e2.field === key);
    if (item) {
      if (key === 'factor') {
        item.value = row.baseFactor;
      } else {
        item.value = row[key]
      }
    };
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
      const res = await deleteEmployeeInfo(nos);
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
    addEmployeeInfo(body).then((res: any) => {
      ElMessage.success(res.message);
      getTableData();
    })
  } else if (mode.value === 'edit') {
    updateEmployeeInfo(Object.assign(data, { no: editRowNo.value, updateBy: userId })).then(res => {
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

const getTableData = async (data?: EmployeeSearchForm) => {
  const res = await getEmployeeInfoList(data);
  tableData.value = res.data;
}
getTableData();

const initSelection = async () => {
  const res = await getEmployeeSelection();
  selectOptionObj.gender = res.gender;
  selectOptionObj.position = res.position;
  selectOptionObj.status = res.status;
}

initSelection();
</script>