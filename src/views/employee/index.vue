<template>
  <div class="flex mb-4">
    <Button type="primary" class="mr-2">添加</Button>
    <Upload @data="onUploadData">一键导入</Upload>
  </div>

  <Table :rows="rows" :isAction="true"></Table>
</template>

<script setup lang="ts">
import { TableHeader } from "@/components/Table/type";
import { TABLE_HEADER_EMPLOYEE } from "@/constants/table.header";
import { Employee } from "@/models/employee.model";
import useStore from "@/store";
import { reactive } from "vue";

const rows: [TableHeader[], any[]] = reactive([
  TABLE_HEADER_EMPLOYEE,
  useStore().employee.employeeList,
]);

const onUploadData = (data: any[]): void => {
  const keys = TABLE_HEADER_EMPLOYEE.map((e) => e.key);
  const employeeList: Employee[] = [];
  data.forEach((item) => {
    const employee: any = {};
    keys.forEach((key) => {
      employee[key] = item[key];
    });
    employeeList.push(employee as Employee);
  });
  // 按工号排序（升序）
  employeeList.sort((a, b) => +a.no - +b.no);
  rows.splice(1, 1, employeeList);
  // 保存到Store
  useStore().employee.addList(employeeList);
};
</script>
<style lang="scss" scoped></style>
