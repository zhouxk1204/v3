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
    <div class="flex flex-col max-[450px]:hidden">
      <Table
        :list="list"
        :cols="cols"
        :editable="true"
        @remove="remove($event)"
        @update="update($event)"
      ></Table>
    </div>

    <div class="flex-col gap-2 hidden max-[450px]:flex">
      <el-card v-for="item in list" shadow="always" body-class="bg-gray-50">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <el-avatar
              :size="50"
              :style="{
                backgroundColor: item.genderId === '1' ? '#70a3f3' : '#edacd2',
              }"
            >
              <span class="text-3xl">{{ item.employeeName[0] }}</span>
            </el-avatar>
            <span class="text-xl">{{ item.employeeName }}</span>
            <el-tag effect="dark" :type="item.genderId === '1' ? '' : 'danger'">
              <div class="flex items-center gap-1">
                {{ item.postId === "0" ? "护士" : "护士长" }}
                <el-icon>
                  <Male v-if="item.genderId === '1'" />
                  <Female v-else />
                </el-icon>
              </div>
            </el-tag>
          </div>
          <div class="text-3xl font-bold">{{ item.factor }}</div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TableColumnItem } from "@/components/Table/type";
import { EmployeeTable } from "@/config/table.config";
import { useSelect } from "@/hooks/useSelect";
import useStore from "@/store";
import { IEmployee } from "@/types";
import { generateId } from "@/utils";
import { Female, Male } from "@element-plus/icons-vue";
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
<style scoped lang="scss"></style>
