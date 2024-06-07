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
import { addHolidayInfo, deleteHolidayByNos, getHolidayList2, updateHolidayInfo } from "@/api/holiday.api";
import { SelectTypeEnum } from "@/constants";
import useDevice from '@/hooks/useDevice';
import useStore from "@/store";
import useUserStore from "@/store/user.store";
import { FormItem, SelectOption } from '@/types/common';
import { HolidaySearchForm2, HolidayTableData } from "@/types/holiday";
import { FormRules } from "element-plus/es/components";

const { deviceType } = useDevice();

const actionFormVisible = ref(false);
const searchFormVisible = ref(true);
const mode = ref<"init" | "edit" | "add">("init");
const formTitle = computed(() => {
  return mode.value === 'add' ? '添加节假日工分倍率信息' : mode.value === 'edit' ? '修改节假日工分倍率信息' : ''
})

const holidayOptions = ref<SelectOption[]>([]);
const holidayTypeOptions = ref<SelectOption[]>([]);

const form = computed<FormItem[]>(() => {
  return [
    {
      field: 'year',
      label: '节假日年份',
      type: 'year',
      value: '',
    },
    {
      field: 'id',
      label: '节假日名称',
      type: 'select',
      value: '',
      options: holidayOptions.value,
    },
  ]
})

const currentForm = ref<any>({
  date: [],
  id: '',
  type: '',
  ratio1: 0,
  ratio2: 0,
});

const actionForm = computed<FormItem[]>(() => {
  return [
    {
      field: 'date',
      label: '节假日日期',
      type: 'date-range',
      value: currentForm.value.date,
      disableDates: []
    },
    {
      field: 'id',
      label: '节假日名称',
      type: 'select',
      value: currentForm.value.id,
      options: holidayOptions.value,
    },
    {
      field: 'type',
      label: '放假 / 补班',
      type: 'select',
      value: currentForm.value.type,
      options: holidayTypeOptions.value,
    },
    {
      field: 'ratio1',
      label: '补班倍率',
      type: 'number',
      step: 0.5,
      value: currentForm.value.ratio1,
    },
    {
      field: 'ratio2',
      label: '加班倍率',
      type: 'number',
      step: 0.5,
      value: currentForm.value.ratio2,
    },
  ]
})

const getHolidaySelectOptions = async () => {
  const res = await getSelectOptionByType2(SelectTypeEnum.HOLIDAY);
  holidayOptions.value = res.data;
  await initHolidayType();
}
getHolidaySelectOptions();

const rules = reactive<FormRules<any>>({
  id: [
    { required: true, message: '请选择节假日名称', trigger: 'blur' },
  ],
  type: [
    { required: true, message: '请选择放假 / 补班', trigger: 'blur' },
  ],
  date: [
    { required: true, message: '请选择日期', trigger: 'blur' },
  ],
});

const columns = [
  {
    field: "no",
    label: "编号"
  },
  {
    field: "date",
    label: "节假日日期",
    width: 200
  },
  {
    field: "name",
    label: "节假日名称"
  }, {
    field: "typeName",
    label: "放假 / 补班",
    style: {
      type: 'tag',
      color: (val: string) => {
        const index = holidayTypeOptions.value.findIndex(e => e.label == val);
        return ['success', 'danger'][index > 0 && index < 2 ? index : 0];
      }
    },
  }, {
    field: "ratio1",
    label: "补班倍率"
  },
  {
    field: "ratio2",
    label: "加班倍率"
  },
]

const tableData = ref<HolidayTableData[]>([])

const editRowNo = ref<number>(-1);
const onEdit = async (row: any) => {
  editRowNo.value = row.no;
  mode.value = 'edit';
  currentForm.value.date = [row.dateStart, row.dateEnd];
  currentForm.value.id = row.id;
  currentForm.value.type = row.type;
  currentForm.value.ratio1 = row.ratio1;
  currentForm.value.ratio2 = row.ratio2;

  actionFormVisible.value = true;
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
      const res = await deleteHolidayByNos(nos);
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

const onAdd = async () => {
  mode.value = 'add';
  actionFormVisible.value = true;
}

const onConfirm = (data: any) => {
  onClose();
  const userId = useUserStore().user.userId;
  const { date, ...extra } = data;
  if (mode.value === 'add') {
    const body = Object.assign(extra, { createBy: userId, dateStart: date[0], dateEnd: date[1] });
    addHolidayInfo(body).then((res: any) => {
      ElMessage.success(res.message);
      getTableData();
    })
  } else if (mode.value === 'edit') {
    const body = Object.assign(extra, { updateBy: userId, dateStart: date[0], dateEnd: date[1], no: editRowNo.value, });
    updateHolidayInfo(body).then(res => {
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

const getTableData = async (data?: HolidaySearchForm2) => {
  const res = await getHolidayList2(data);
  if (!data) {
    useStore().holiday2.setHolidayTempList(res.data);
  }
  tableData.value = res.data;
}
getTableData();

const initHolidayType = async () => {
  if (holidayTypeOptions.value.length === 0) {
    const res = await getSelectOptionByType2(SelectTypeEnum.HOLIDAY_TYPE);
    holidayTypeOptions.value = res.data;
  }
}
</script>