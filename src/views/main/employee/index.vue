<template>
  <div>
    <div class="mb-5">
      <h1 class="flex items-center h-12 pb-3 mb-3 font-bold border-b">
        添加员工
      </h1>
      <Form :form="form" @submit="handelSubmit" ref="employeeFormRef"></Form>
    </div>

    <h1 class="flex items-center justify-between h-12 pb-3 mb-3 font-bold border-b ">
      <span>员工列表</span>
      <div class="flex gap-3">
        <el-popconfirm width="220" title="确认删除所有员工?" @confirm="reset">
          <template #reference>
            <el-button type="danger" :disabled="list.length === 0">清空</el-button>
          </template>
        </el-popconfirm>
        <UploadExcel @change="onChange">选择文件导入</UploadExcel>
      </div>
    </h1>
    <div class=" flex flex-col max-[450px]:hidden">
      <Table :list="list" :cols="cols" :editable="true" @remove="remove($event)" @update="update($event)"></Table>
    </div>
    <!-- <div class="flex-col gap-2 hidden max-[450px]:flex">
      <div v-for="item in list" class="mt-2 text-gray-400 rounded-lg shadow bg-gray-50">
        <div class="flex items-center justify-between px-3 py-1">
          <div>
            <div class="flex items-center gap-2">
              <el-avatar :size="40">
                <span class="text-xl">{{ item.employeeName[0] }}</span>
              </el-avatar>
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-gray-600">{{ item.employeeName }}</span>
                  <el-icon class="w-5 h-5 p-1 bg-red-300 rounded-full" :style="{
        backgroundColor:
          item.genderId === '1' ? '#70a3f3' : '#edacd2',
      }" color="#fff">
                    <Male v-if="item.genderId === '1'" />
                    <Female v-else />
                  </el-icon>
                </div>
                <div class="text-xs">
                  系数：
                  <span class="font-bold text-red-500">{{ item.factor }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div class="px-3">
          <div class="flex items-center gap-1 text-xs">
            <Icon icon="tabler:nurse" />
            {{ item.postId === "0" ? "护士" : "护士长" }}
          </div>
        </div>
      </div>
    </div> -->


    <ul class="flex-col gap-3 hidden max-[450px]:flex">
      <li v-for="item in employeeList" class="flex items-center justify-between py-2 border-b">
        <div class="flex gap-4">
          <el-avatar :size="60">
            <span class="text-4xl">{{ item.name[0] }}</span>
          </el-avatar>
          <div class="text-sm text-gray-500">
            <div class="flex items-center gap-1 text-base font-bold text-black">
              <span>{{ item.name }}</span>
              <el-icon class="w-5 h-5 p-1 text-2xl rounded-full" color="#fff"
                :class="item.genderId === '1' ? 'bg-[#70a3f3]' : 'bg-[#edacd2]'">
                <Male v-if="item.genderId === '1'" />
                <Female v-else />
              </el-icon>
            </div>
            <div>系数：<strong>{{ item.factor }}</strong></div>
          </div>
        </div>
        <div>
          <el-button type="primary" :icon="Edit" circle />
        </div>
      </li>
    </ul>

  </div>
</template>

<script setup lang="ts">
import { getEmployee, submitEmployee } from "@/api/employee";
import { Employee } from "@/api/employee/type";
import { FieldItem } from "@/components/Form/form";
import { TableColumnItem } from "@/components/Table/type";
import { EmployeeForm } from "@/config/form.config";
import { EmployeeTable } from "@/config/table.config";
import { useSelect } from "@/hooks/useSelect";
import useStore from "@/store";
import { IEmployee } from "@/types";
import { generateId } from "@/utils";
import { Edit, Female, Male } from "@element-plus/icons-vue";
import { storeToRefs } from "pinia";
const employeeStore = useStore().employee;
const { insert, remove, update, reset } = employeeStore;
const { list } = storeToRefs(employeeStore);

const { getOption } = useSelect();
const cols: TableColumnItem<IEmployee>[] = EmployeeTable;

const employeeList = ref<Employee[]>([]);
onMounted(async () => {
  const data = await getEmployee();
  if (data.code === 200) {
    employeeList.value = data.data;
  }
  console.log("%c Line:96 🍔 employeeList.value", "color:#3f7cff", employeeList.value);
})


const onChange = (data: any[]) => {
  if (data.length > 0) {
    const list: IEmployee[] = data.map((e) => {
      return {
        id: generateId(),
        no: e.no,
        employeeName: e.name,
        factor: e.factor,
        genderId: getOption("label", e.gender, "gender")?.value ?? "",
        postId: getOption("label", e.post, "post")?.value ?? "",
      };
    });
    insert(list);
  }
};

const form = ref<FieldItem[]>(EmployeeForm);
const employeeFormRef = ref();

const handelSubmit = async (data: any) => {
  const res1 = await submitEmployee(data);
  if (res1.code === 200) {
    ElMessage.success('员工添加成功！')
    employeeFormRef.value.handelReset();
    const res2 = await getEmployee();
    if (res2.code === 200) {
      employeeList.value = res2.data;
    }
  }
}
const { getSelectOptionByType } = useStore().selection;

console.log("%c Line:157 🍉 lll", "color:#3f7cff", getSelectOptionByType('0'));
</script>
