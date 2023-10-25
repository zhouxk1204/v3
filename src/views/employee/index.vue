<template>
  <div class="flex mb-4">
    <Button type="primary" class="mr-2" @click="openDialog">添加</Button>
    <Upload @data="onUploadData">一键导入</Upload>
  </div>

  <Table :rows="rows" :isAction="true"></Table>

  <Dialog v-model="isOpen">
    <form
      class="absolute flex flex-col p-6 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow left-1/2 top-1/2 w-96"
    >
      <FormItem title="顺序">
        <Input type="number"></Input>
      </FormItem>

      <FormItem title="姓名">
        <Input></Input>
      </FormItem>

      <FormItem title="系数">
        <Input type="number"></Input>
      </FormItem>

      <FormItem title="性别">
        <Select
          v-model="currentGender"
          placeholder="请选择性别"
          :options="genders"
          @select="onSelect"
        ></Select>
      </FormItem>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { TableHeader } from "@/components/Table/type";
import { TABLE_HEADER_EMPLOYEE } from "@/constants/table.header";
import { Employee } from "@/models/employee.model";
import useStore from "@/store";
import { computed, reactive, ref } from "vue";
import { useDialog } from "@/hooks/useDialog";
import { GENDERS } from "@/constants";
import { Option } from "@/components/Select/types";
const form = ref<Employee>({
  no: "",
  name: "",
  factor: 0,
  genderId: "",
  gender: "",
  stateId: "",
  state: "",
  roleId: "",
  role: "",
});
const genders = GENDERS;
const currentGender = computed(() => {
  return { key: form.value.genderId, label: form.value.gender } as Option;
});
const onSelect = (option: Option) => {
  form.value.gender = option.label;
  form.value.genderId = option.key;
};

const { isOpen, openDialog } = useDialog();

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
