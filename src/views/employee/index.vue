<template>
  <div class="flex mb-4">
    <Button
      type="primary"
      class="mr-2"
      @click="openDialog"
      icon="material-symbols:add"
      >添加</Button
    >
    <Upload @data="onData">
      <div class="flex items-center">
        <span>一键导入</span>
        <Icon icon="material-symbols:upload" class="ml-1" :width="22"></Icon>
      </div>
    </Upload>
  </div>

  <Table :rows="rows" :isAction="true" @del="onDel" @edit="onEdit"></Table>

  <Dialog v-model="isOpen">
    <form
      class="absolute flex flex-col p-6 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow left-1/2 top-1/2 w-96"
    >
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-xl">{{ mode.label }}员工信息</h1>
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
        mode.label
      }}</Button>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { Option } from "@/components/Select/types";
import { TableHeader } from "@/components/Table/type";
import { GENDERS, ROLES, STATES } from "@/constants";
import { TABLE_HEADER_EMPLOYEE } from "@/constants/table.header";
import { useDialog } from "@/hooks/useDialog";
import { Employee } from "@/models/employee.model";
import useStore from "@/store";
import { deepCopy } from "@/utils";
import { computed, reactive, ref } from "vue";
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
const currentGender = ref({
  key: form.value.genderId,
  label: form.value.gender,
});
// 性别选择事件
const onSelectGender = (option: Option) => {
  form.value.gender = option.label;
  form.value.genderId = option.key;
};

// 职位选择框
const roles = ROLES;
const currentRole = ref({ key: form.value.roleId, label: form.value.role });
// 职位选择事件
const onSelectRole = (option: Option) => {
  form.value.role = option.label;
  form.value.roleId = option.key;
};

// 状态选择框
const states = STATES;
const currentState = ref({ key: form.value.stateId, label: form.value.state });
// 状态选择事件
const onSelectState = (option: Option) => {
  form.value.state = option.label;
  form.value.stateId = option.key;
};

const rows: [TableHeader[], any[]] = reactive([
  TABLE_HEADER_EMPLOYEE,
  useStore().employee.employeeList,
]);

const onData = (data: any[]): void => {
  // 按工号（升序）排序

  data.sort((a, b) => +a.no - +b.no);

  rows.splice(1, 1, data);
  // 保存到Store
  useStore().employee.addList(data);
};

const isFormValid = computed(() => {
  return Object.values(form.value).some((e) => !Boolean(e));
});

const submit = () => {
  if (mode.value.key == "create") {
    useStore().employee.add(form.value);
  } else {
    console.log("%c Line:158 🍖 form.value", "color:#b03734", form.value);
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
  currentGender.value = { key: data.genderId, label: data.gender };
  currentRole.value = { key: data.roleId, label: data.role };
  currentState.value = { key: data.stateId, label: data.state };
  openDialog(false);
};
</script>
<style lang="scss" scoped></style>
