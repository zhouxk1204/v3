<template>
  <h1 class="pb-2 mb-3 text-2xl font-bold border-b">添加节假日</h1>
  <div class="px-4 pb-5">
    <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      :inline="true"
      class="flex flex-wrap gap-1"
    >
      <el-form-item label="日期" prop="date">
        <el-date-picker
          v-model="form.date"
          type="date"
          placeholder="选择日期"
          format="YYYY/MM/DD"
          value-format="YYYY/MM/DD"
          clearable
        />
      </el-form-item>
      <el-form-item label="节假日" prop="name">
        <el-select-v2
          v-model="form.name"
          placeholder="节假日"
          :options="holidays"
          class="min-w-24 max-w-24"
        />
      </el-form-item>
      <el-form-item label="放假/补班" prop="type">
        <el-select-v2
          v-model="form.type"
          placeholder="放假/补班"
          :options="holidayActions"
          class="min-w-28 max-w-28"
        />
      </el-form-item>
      <el-form-item label="工作工分倍率" prop="workRadio">
        <el-input
          v-model="form.workRadio"
          type="number"
          min="0"
          step="0.5"
          class="min-w-20 max-w-24"
        />
      </el-form-item>
      <el-form-item label="加班工分倍率" prop="extraRadio">
        <el-input
          v-model="form.extraRadio"
          type="number"
          min="0"
          step="0.5"
          class="min-w-20 max-w-24"
        />
      </el-form-item>

      <el-button type="primary" @click="handelSubmit">添加</el-button>
    </el-form>
  </div>

  <div>
    <h1 class="pb-2 text-2xl font-bold border-b">节假日明细</h1>
    <el-table :data="list" class="w-full" size="large">
      <el-table-column label="日期" width="253">
        <template #default="scope">
          <template v-if="editRowIndex !== scope.$index">
            {{ scope.row.date }}
          </template>
          <template v-else>
            <el-date-picker
              v-model="editRowTemp!.date"
              type="date"
              placeholder="选择日期"
              format="YYYY/MM/DD"
              value-format="YYYY/MM/DD"
            >
            </el-date-picker>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="节假日">
        <template #default="scope">
          <template v-if="editRowIndex !== scope.$index">
            {{ getHolidayName(scope.row.name) }}
          </template>
          <template v-else>
            <el-select v-model="editRowTemp!.name" placeholder="节假日">
              <el-option
                v-for="item in holidays"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="放假/补班">
        <template #default="scope">
          <template v-if="editRowIndex !== scope.$index">
            {{ getHolidayActionName(scope.row.type) }}
          </template>
          <template v-else>
            <el-select v-model="editRowTemp!.type" placeholder="放假/补班">
              <el-option
                v-for="item in holidayActions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="上班工分倍率">
        <template #default="scope">
          <template v-if="editRowIndex !== scope.$index">
            <span>{{ scope.row.workRadio }}</span>
          </template>
          <template v-else>
            <el-input
              v-model="editRowTemp!.workRadio"
              type="number"
              min="0"
            ></el-input>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="加班工分倍率">
        <template #default="scope">
          <template v-if="editRowIndex !== scope.$index">
            <span>{{ scope.row.extraRadio }}</span>
          </template>
          <template v-else>
            <el-input
              v-model="editRowTemp!.extraRadio"
              type="number"
              min="0"
            ></el-input>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <template v-if="editRowIndex !== scope.$index">
            <el-button @click="edit(scope.$index, scope.row)"> 编辑</el-button>
            <el-popconfirm
              width="220"
              title="确认删除这条数据?"
              @confirm="handleRemove(scope.row.date)"
            >
              <template #reference>
                <el-button type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
          <template v-else>
            <el-button @click="update()" type="success">更新</el-button>
            <el-button @click="cancel()">取消</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { useSelect } from "@/hooks/useSelect";
import { useTable } from "@/hooks/useTable";
import useStore from "@/store";
import { IHoliday } from "@/types";
import * as dayjs from "dayjs";
import * as _ from "lodash";
import { storeToRefs } from "pinia";
import { useForm } from "./useForm";

const store = useStore().holiday2;
const { handleInsert, handleRemove, handleUpdate } = store;
const { list } = storeToRefs(store);

const { getHolidayActionName, getHolidayName, holidayActions, holidays } =
  useSelect();
// 表格
const { editRowTemp, editRowIndex, edit, cancel } = useTable<IHoliday>();

// 表单
const { form, rules, resetFrom, formRef } = useForm();
const handelSubmit = () => {
  if (!formRef.value) return;
  formRef.value.validate((valid, fields) => {
    if (valid) {
      const data = _.cloneDeep(form);
      data.id = dayjs().valueOf();
      if (!handleInsert(data)) {
        resetFrom();
      }
    } else {
      console.error("error submit!", fields);
    }
  });
};

const update = () => {
  const data = _.cloneDeep(editRowTemp.value) as IHoliday;
  handleUpdate(data);
  editRowIndex.value = -1;
};
</script>
./useForm
