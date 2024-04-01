<template>
  <div>
    <div class="flex items-center justify-between mb-2">
      <div class="flex gap-3">
        <el-button type="primary" @click="formVisible = true">添加员工</el-button>
        <UploadExcel @change="importExcelData">
          <el-button type="success" :icon="Upload">导入文件</el-button>
        </UploadExcel>
        <el-button type="success" :icon="Download" @click="onDownload">下载模板</el-button>
      </div>
      <el-radio-group v-model="statusId" @change="onStatusChange">
        <el-radio-button label="全部" value="全部" />
        <el-radio-button label="在职" value="在职" />
        <el-radio-button label="离职" value="离职" />
      </el-radio-group>
    </div>

    <el-dialog v-model="formVisible" title="添加员工" width="500" destroy-on-close :append-to-body="true"
      :close-on-click-modal="false">
      <Form :form="form" @submit="handleSubmit" ref='employeeFormRef'></Form>
    </el-dialog>

    <div div class=" flex flex-col max-[450px]:hidden">
      <Table :list="employeeList" :cols="cols" :editable="true" @remove="deleteEmployee" @update="updateEmployee">
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { deleteEmployeeById, getEmployee, submitEmployee, updateEmployeeData } from "@/api/employee.api";
import { FieldItem } from "@/components/Form/form";
import { TableColumnItem } from "@/components/Table/type";
import { EmployeeForm } from "@/config/form.config";
import { EmployeeTable } from "@/config/table.config";
import { useExcel } from "@/hooks/useExcel";
import { useSelect } from "@/hooks/useSelect";
import useStore from "@/store";
import { Employee } from "@/types/employee";
import { Download, Upload } from "@element-plus/icons-vue";
import { v4 } from 'uuid';

const { getOption } = useSelect();
const employeeStore = useStore().employee;
const employeeList = ref<Employee[]>([]);

const form = ref<FieldItem[]>(EmployeeForm);
const formVisible = ref<boolean>(false);
const cols: TableColumnItem<Employee>[] = EmployeeTable;
const employeeFormRef = ref();
/**
 * 添加员工
 * @param {any[]} data 员工信息
 */
const handleSubmit = async (data: any): Promise<void> => {
  const req = Object.assign(data, { id: v4() });
  await submitEmployee(req);
  employeeFormRef.value.handelReset();
  await refreshEmployeeList('员工添加成功！');
}

onMounted(() => {
  refreshEmployeeList();
})

const status = ['全部', '离职', '在职',];
const statusId = ref(status[2]);
const onStatusChange = (value: any) => {
  const index = status.indexOf(value);
  if (index > 0) {
    employeeList.value = employeeStore.employeeTempList.filter(e => e.statusId === `${index - 1}`);
  } else {
    employeeList.value = employeeStore.employeeTempList;
  }
}

/**
 * 导入EXCEL 员工
 * @param {any[]} data 员工信息列表
 */
const importExcelData = async (data: any[]) => {
  if (data.length > 0) {
    const list: Employee[] = [];
    data.forEach((item: any) => {
      const obj: any = {};
      Object.keys(item).forEach((label: string) => {
        const el = cols.find(el => el.label === label)
        if (el) {
          const key = el.field;
          const text = item[label];
          if (el.edit && el.edit.editType === 'select') {
            const { selectType } = el.edit
            const option = getOption('label', text, selectType)
            if (option) {
              obj[key] = option.value;
            }
          } else {
            obj[key] = text;
          }
        }
      })
      obj.id = v4();
      list.push(obj);
    });
    await submitEmployee(list);
    await refreshEmployeeList();
    ElMessage.success('员工导入成功！');
  }
};

/**
 * 下载模板
 */
const onDownload = () => {
  useExcel().exportExcel(
    [
      {
        headers: cols.map((e) => e.label),
        data: [],
      },
    ],
    '员工信息excel模版'
  )
}

/**
 * 刷新员工列表
 */
const refreshEmployeeList = async (message?: string) => {
  const res = await getEmployee();
  employeeStore.setEmployeeTempList(res.data);
  onStatusChange(statusId.value);
  if (message) {
    ElMessage.success(message)
  }
}

/**
 * 删除员工
 * @param {number} index 行号
 */
const deleteEmployee = async (index: number) => {
  const id = employeeList.value[index].id
  await deleteEmployeeById(id);
  await refreshEmployeeList('员工删除成功！');
}

/**
 * 更新员工信息
 * @param {any} data 员工信息
 */
const updateEmployee = async (data: any) => {
  await updateEmployeeData(data);
  await refreshEmployeeList('员工信息更新成功！');
};
</script>
