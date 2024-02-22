<template>
  <div>
    <h1
      class="flex items-center justify-between h-12 pb-3 mb-3 font-bold border-b"
    >
      <span>员工明细</span>
      <div class="flex gap-2">
        <el-popconfirm width="220" title="确认清空工分汇算?" @confirm="reset">
          <template #reference>
            <el-button type="danger" :disabled="list.length === 0"
              >清空</el-button
            >
          </template>
        </el-popconfirm>
        <UploadExcel @change="onChange">选择文件导入</UploadExcel>
      </div>
    </h1>
    <Table
      :list="list"
      :cols="cols"
      :editable="true"
      @remove="remove($event)"
      @update="update($event)"
    ></Table>
  </div>
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
const { insert, remove, update, reset } = employeeStore;
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
</script>
