<template>
  <PageTitle title="职工管理">
    <div class="flex">
      <Upload @data="onData">导入</Upload>
      <Button type="primary" class="ml-2" @click="openDialog">添加</Button>
    </div>
  </PageTitle>
  <Table
    :headers="headers"
    :data="list"
    :isAction="true"
    @del="onDel"
    @edit="onEdit"
  >
  </Table>

  <Dialog v-model="isOpen">
    <form
      class="absolute flex flex-col p-6 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow left-1/2 top-1/2 w-96"
    >
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-xl">{{ mode.text }}员工信息</h1>
        <Button @click="closeDialog"
          ><Icon icon="material-symbols:close" color="#bbb" />
        </Button>
      </div>
      <FormItem title="顺序">
        <Input type="number" v-model="form.no"></Input>
      </FormItem>

      <FormItem title="姓名">
        <Input v-model="form.name"></Input>
      </FormItem>

      <FormItem title="系数">
        <Input type="number" v-model="form.factor"></Input>
      </FormItem>

      <FormItem title="性别">
        <Select
          v-model="currentGender"
          placeholder="请选择性别"
          :options="genders"
          @select="onSelectGender"
        ></Select>
      </FormItem>

      <FormItem title="职位">
        <Select
          v-model="currentRole"
          placeholder="请选择职位"
          :options="roles"
          @select="onSelectRole"
        ></Select>
      </FormItem>

      <FormItem title="状态">
        <Select
          v-model="currentState"
          placeholder="请选择在职状态"
          :options="states"
          @select="onSelectState"
        ></Select>
      </FormItem>

      <Button type="primary" @click="submit" :disabled="isFormValid">{{
        mode.text
      }}</Button>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { Option } from "@/components/Select/types";
import { GENDERS, ROLES, STATES } from "@/constants";
import { TABLE_HEADER_EMPLOYEE } from "@/constants/table.header";
import { useDialog } from "@/hooks/useDialog";
import { Employee } from "@/models/employee.model";
import useStore from "@/store";
import { deepCopy } from "@/utils";
import { computed, ref } from "vue";
const { mode, isOpen, openDialog, closeDialog } = useDialog();

const emptyForm = () => {
  return {
    no: "",
    name: "",
    factor: "",
    genderId: "",
    gender: "",
    stateId: "",
    state: "",
    roleId: "",
    role: "",
  };
};

const form = ref<Employee>(emptyForm());
// 性别选择框
const genders = GENDERS;
const currentGender = ref<Option>({
  code: form.value.genderId,
  text: form.value.gender,
});
// 性别选择事件
const onSelectGender = (option: Option) => {
  form.value.gender = option.text;
  form.value.genderId = option.code;
};

// 职位选择框
const roles = ROLES;
const currentRole = ref<Option>({
  code: form.value.roleId,
  text: form.value.role,
});
// 职位选择事件
const onSelectRole = (option: Option) => {
  form.value.role = option.text;
  form.value.roleId = option.code;
};

// 状态选择框
const states = STATES;
const currentState = ref<Option>({
  code: form.value.stateId,
  text: form.value.state,
});
// 状态选择事件
const onSelectState = (option: Option) => {
  form.value.state = option.text;
  form.value.stateId = option.code;
};

const headers = TABLE_HEADER_EMPLOYEE;
const list = ref(useStore().employee.employeeList);

const onData = (data: any[]): void => {
  // 按工号（升序）排序

  data.sort((a, b) => +a.no - +b.no);
  data.forEach((item) => {
    item.roleId = ROLES.find((e2) => e2.text === item.role)?.code ?? "-1";
    item.genderId =
      GENDERS.find((e2) => e2.text.indexOf(item.gender) > -1)?.code ?? "-1";
    item.stateId = STATES.find((e2) => e2.text === item.state)?.code ?? "-1";
  });
  // 保存到Store
  useStore().employee.addList(data);
};

const isFormValid = computed(() => {
  return Object.values(form.value).some((e) => !Boolean(e));
});

const submit = () => {
  if (mode.value.code == "create") {
    useStore().employee.add(form.value);
  } else {
    useStore().employee.update(form.value);
  }
  form.value = emptyForm();
  closeDialog();
};

const onDel = (data: Employee) => {
  useStore().employee.remove(data.no);
};

const onEdit = (data: Employee) => {
  form.value = deepCopy(data);
  currentGender.value = { code: data.genderId, text: data.gender };
  currentRole.value = { code: data.roleId, text: data.role };
  currentState.value = { code: data.stateId, text: data.state };
  openDialog(false);
};
</script>
<style lang="scss" scoped></style>
