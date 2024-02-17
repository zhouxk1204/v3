<template>
  <h1 class="flex items-center justify-between h-12 pb-3 mb-3 font-bold border-b">
    <span>员工明细</span>
    <div class="flex gap-2">
      <el-button type="danger" @click="onReset">清空</el-button>
      <UploadExcel @change="onChange">选择文件导入</UploadExcel>
    </div>
  </h1>
  <Table
    :list="list"
    :cols="cols"
    :editable="true"
    @remove="onRemove"
    @update="onUpdate"
  ></Table>
</template>

<script setup lang="ts">
import { TableColumnItem } from "@/components/Table/type";
import { EmployeeTable } from "@/config/table.config";
import { useSelect } from "@/hooks/useSelect";
import useStore from "@/store";
import { IEmployee } from "@/types";
import { generateId } from "@/utils";
import { storeToRefs } from "pinia";

const employeeStore = useStore().employee;
const { insert, remove, update } = employeeStore;
const { list } = storeToRefs(employeeStore);

const { getOption } = useSelect();
const cols: TableColumnItem<IEmployee>[] = EmployeeTable;

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

const onRemove = (index: number) => {
  remove(index);
};

const onUpdate = (data: any) => {
  console.log("%c Line:52 🥥 data", "color:#ea7e5c", data);
  update(data);
};

const onReset = () => {
  list.value = [];
};
</script>
