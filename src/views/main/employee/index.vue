<template>
  <div class="flex items-center justify-between pb-2 border-b">
    <h1 class="text-2xl font-bold">员工明细</h1>
    <UploadExcel @change="onChange">选择文件导入</UploadExcel>
  </div>
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
import * as dayjs from "dayjs";
import { storeToRefs } from "pinia";

const employeeStore = useStore().employee2;
const { insert, remove, update } = employeeStore;
const { list } = storeToRefs(employeeStore);

const { getOption } = useSelect();
const cols: TableColumnItem<IEmployee>[] = EmployeeTable;

const onChange = (data: any[]) => {
  if (data.length > 0) {
    const list: IEmployee[] = data.map((e, i) => {
      return {
        id: dayjs().valueOf() + i,
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
</script>
