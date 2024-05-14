<template>
  <div>
    <SearchForm class="mb-2" :visible="searchFormVisible" @search="handleSearchFromAction"
      @reset="handleSearchFromAction">
    </SearchForm>

    <el-row justify="space-between" class="mb-2">
      <el-col :span="17" class="flex items-center hidden-sm-and-down">
        <el-button type="primary" plain :icon="Plus" @click="handleAdd">
          新增
        </el-button>
        <el-button type="success" plain :icon="Edit" :disabled="!(multipleSelection.length === 1)"
          @click="handleEdit(multipleSelection[0])">
          修改
        </el-button>
        <el-button type="danger" plain :icon="Delete" :disabled="multipleSelection.length === 0"
          @click="handleDelete(multipleSelection.map(e => e.id))">
          删除
        </el-button>
        <!-- <el-button type="primary" plain :icon="Download" @click="onDownload">下载模板</el-button>
        <UploadExcel @change="importExcelData" class="ml-3">
          <el-button type="primary" plain :icon="Upload">导入</el-button>
        </UploadExcel> -->
      </el-col>
      <el-col :span="17" class="hidden-sm-and-up">
        <el-button type="primary" plain :icon="Plus" @click="handleAdd" circle>
        </el-button>
        <el-button type="success" plain :icon="Edit" :disabled="!(multipleSelection.length === 1)"
          @click="handleEdit(multipleSelection[0])" circle>
        </el-button>
        <el-button type="danger" plain :icon="Delete" :disabled="multipleSelection.length === 0"
          @click="handleDelete(multipleSelection.map(e => e.id))" circle>
        </el-button>
      </el-col>
      <el-col :span="7" class="flex justify-end">
        <el-tooltip effect="dark" :content="searchFormVisible ? '隐藏搜索' : '显示搜索'" placement="top">
          <el-button :icon="Search" circle @click="toggleSearch" />
        </el-tooltip>
        <el-tooltip effect="dark" content="刷新" placement="top">
          <el-button :icon="Refresh" circle @click="refresh(true)" />
        </el-tooltip>
      </el-col>
    </el-row>

    <el-table :data="employeeList" class="w-full hidden-sm-and-down" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40" />
      <el-table-column label="员工序号" width="80" align="center">
        <template #default="scope">{{ scope.row.no }}</template>
      </el-table-column>
      <el-table-column label="员工姓名" align="center">
        <template #default="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="员工系数" align="center">
        <template #default="scope">
          <el-text type="danger">{{ scope.row.factor }}</el-text>
        </template>
      </el-table-column>
      <el-table-column label="员工性别" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.gender.indexOf('男') > -1 ? 'primary' : 'danger'">{{ scope.row.gender }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="员工职位" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.position.indexOf('长') > -1 ? 'primary' : 'info'">{{ scope.row.position }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="员工状态" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.status === '在职' ? 'success' : 'info'">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-space :size="10">
            <el-link type="primary" :underline="false" @click="handleEdit(scope.row)">
              编辑
            </el-link>
            <el-link type="danger" :underline="false" @click="handleDelete([scope.row.id])">
              删除
            </el-link>
          </el-space>
        </template>
      </el-table-column>
    </el-table>

    <el-space :fill="true" wrap class="hidden-sm-and-up">
      <el-card v-for="item in employeeList">
        <el-row class="mb-1">
          <el-col :span="7">员工序号：</el-col>
          <el-col :span="17">{{ item.no }}</el-col>
        </el-row>
        <el-row class="mb-1">
          <el-col :span="7">员工姓名：</el-col>
          <el-col :span="17">{{ item.name }}</el-col>
        </el-row>
        <el-row class="mb-1">
          <el-col :span="7">员工系数：</el-col>
          <el-col :span="17"><el-tag type="success">{{ item.factor }}</el-tag></el-col>
        </el-row>
        <el-row class="mb-1">
          <el-col :span="7">员工性别：</el-col>
          <el-col :span="17"><el-tag :type="item.genderId === '0' ? 'danger' : 'primary'">{{ item.gender
              }}</el-tag></el-col>
        </el-row>
        <el-row class="mb-1">
          <el-col :span="7">员工职位：</el-col>
          <el-col :span="17">{{ item.position }}</el-col>
        </el-row>
        <el-row class="mb-1">
          <el-col :span="7">员工状态：</el-col>
          <el-col :span="17">{{ item.status }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            操作：
          </el-col>
          <el-col :span="17">
            <el-space :size="10">
              <el-button type="primary" size="small" @click="handleEdit(item)">
                编辑
              </el-button>
              <el-button type="danger" size="small" @click="handleDelete([item.id])">
                删除
              </el-button>
            </el-space>
          </el-col>
        </el-row>
      </el-card>
    </el-space>

    <ActionForm v-model="actionFormVisible" :title="actionFormTitle" :formData="actionFormData"
      @confirm="handleConfirm">
    </ActionForm>
  </div>


</template>

<script setup lang="ts">
import { addEmployee, deleteEmployeeByIds, getEmployeeList, updateEmployeeData } from "@/api/employee.api";
import useStore from "@/store";
import { Employee, EmployeeForm, EmployeeSearchForm } from "@/types/employee";
import { generateId } from "@/utils";
import { Delete, Edit, Plus, Refresh, Search } from "@element-plus/icons-vue";
import ActionForm from './ActionForm.vue';
import SearchForm from './SearchFrom.vue';
const employeeStore = useStore().employee;
const employeeList = ref<Employee[]>([]);

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

// /**
//  * 导入EXCEL 员工
//  * @param {any[]} data 员工信息列表
//  */
// const importExcelData = async (data: any[]) => {
//   if (data.length > 0) {
//     const list: Employee[] = [];
//     data.forEach((item: any) => {
//       const obj: any = {};
//       Object.keys(item).forEach((label: string) => {
//         const el = cols.find(el => el.label === label)
//         if (el) {
//           const key = el.field;
//           const text = item[label];
//           if (el.edit && el.edit.editType === 'select') {
//             const { selectType } = el.edit
//             const option = getOption('label', text, selectType)
//             if (option) {
//               obj[key] = option.value;
//             }
//           } else {
//             obj[key] = text;
//           }
//         }
//       })
//       obj.id = v4();
//       list.push(obj);
//     });
//     await submitEmployee(list);
//     await refreshEmployeeList();
//     ElMessage.success('员工导入成功！');
//   }
// };

/**
 * 刷新员工列表
 */
const refreshEmployeeList = async (message?: string) => {
  const res = await getEmployeeList();
  employeeStore.setEmployeeTempList(res.data);
  onStatusChange(statusId.value);
  if (message) {
    ElMessage.success(message)
  }
}

////
const searchFormVisible = ref(true);
const handleSearchFromAction = (employeeSearchForm: EmployeeSearchForm | null) => {
  getEmployeeList(employeeSearchForm ?? undefined).then(({ data }) => {
    employeeList.value = data;
  });
}

/// 
const multipleSelection = ref<Employee[]>([]);

const currentEmployeeId = ref('');
const handleEdit = (employee: Employee) => {
  mode.value = 'edit';
  actionFormData.no = employee.no;
  actionFormData.name = employee.name;
  actionFormData.factor = employee.factor;
  actionFormData.genderId = employee.genderId;
  actionFormData.positionId = employee.positionId;
  actionFormData.statusId = employee.statusId;
  currentEmployeeId.value = employee.id;
  actionFormVisible.value = true;
};

const handleDelete = (ids: string[]) => {
  ElMessageBox.confirm(
    `是否确认删除${ids.length > 1 ? '勾选的' : '该'}员工？`,
    '系统提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      const res = await deleteEmployeeByIds(ids);
      ElMessage.success(res.message);
      const data = await getEmployeeList();
      employeeList.value = data.data;
    })
    .catch(() => {
      ElMessage.info('取消删除！')
    })
};
const toggleSearch = () => {
  searchFormVisible.value = !searchFormVisible.value;
}

const refresh = async (showMessage: boolean = false) => {
  const res = await getEmployeeList();
  employeeStore.setEmployeeTempList(res.data);
  employeeList.value = res.data;
  showMessage && ElMessage.success('刷新成功')
};

/// 
const handleSelectionChange = (val: Employee[]) => {
  multipleSelection.value = val;
}

/// 
const actionFormData = reactive<EmployeeForm>({
  no: 0,
  name: '',
  factor: 0.45,
  genderId: '0',
  positionId: '0',
  statusId: '1',
});
const actionFormVisible = ref(false);
const handleAdd = () => {
  mode.value = 'add';
  actionFormData.no = 0;
  actionFormData.name = '';
  actionFormData.factor = 0.45;
  actionFormData.genderId = '0';
  actionFormData.positionId = '0';
  actionFormData.statusId = '1';
  actionFormVisible.value = true;
};
const mode = ref<"init" | "edit" | "add">("init");
const actionFormTitle = computed(() => {
  return mode.value === 'add' ? '添加员工信息' : mode.value === 'edit' ? '修改员工信息' : ''
})
const handleConfirm = (
  data: EmployeeForm
) => {
  if (mode.value === 'add') {
    addEmployee(Object.assign(data, { id: generateId() })).then((res: any) => {
      ElMessage.success(res.message);
      refresh();
    })
  } else if (mode.value === 'edit') {
    updateEmployeeData(Object.assign(data, { id: currentEmployeeId.value })).then(res => {
      currentEmployeeId.value = '';
      ElMessage.success(res.message);
      refresh();
    });
  } else {
    return;
  }
}
</script>
