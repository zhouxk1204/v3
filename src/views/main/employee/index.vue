<template>
  <div class="flex items-center justify-between pb-2 border-b">
    <h1 class="text-2xl font-bold">员工明细</h1>
    <UploadExcel @change="onChange">选择文件导入</UploadExcel>
  </div>
  <!-- <el-table :data="list" class="w-full" size="large">
    <el-table-column label="顺序">
      <template #default="scope">
        <template v-if="editRowIndex !== scope.$index">
          <span>{{ scope.row.no }}</span>
        </template>
        <template v-else>
          <el-input v-model="editRowTemp!.no" type="text"></el-input>
        </template>
      </template>
    </el-table-column>
    <el-table-column label="姓名">
      <template #default="scope">
        <template v-if="editRowIndex !== scope.$index">
          <span>{{ scope.row.name }}</span>
        </template>
        <template v-else>
          <el-input v-model="editRowTemp!.name" type="text"></el-input>
        </template>
      </template>
    </el-table-column>
    <el-table-column label="系数">
      <template #default="scope">
        <template v-if="editRowIndex !== scope.$index">
          <span class="font-bold text-red-500">{{ scope.row.factor }}</span>
        </template>
        <template v-else>
          <el-input
            v-model="editRowTemp!.factor"
            type="number"
            min="0.5"
          ></el-input>
        </template>
      </template>
    </el-table-column>
    <el-table-column label="性别">
      <template #default="scope">
        <template v-if="editRowIndex !== scope.$index">
          <el-tag
            effect="dark"
            :type="scope.row.gender === '0' ? 'danger' : ''"
            >{{ getGenderName(scope.row.gender) }}</el-tag
          >
        </template>
        <template v-else>
          <el-select v-model="editRowTemp!.gender" placeholder="性别">
            <el-option
              v-for="item in genders"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </template>
    </el-table-column>
    <el-table-column label="职位">
      <template #default="scope">
        <template v-if="editRowIndex !== scope.$index">
          <el-tag
            effect="dark"
            :type="scope.row.post === '0' ? 'warning' : 'success'"
            >{{ getPostName(scope.row.post) }}</el-tag
          >
        </template>
        <template v-else>
          <el-select v-model="editRowTemp!.post" placeholder="职位">
            <el-option
              v-for="item in posts"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
  </el-table> -->
  <Table :list="list2" :cols="cols" :editRow="editRow"></Table>
</template>

<script setup lang="ts">
import { useSelect } from "@/hooks/useSelect";
// import { useTable } from "@/hooks/useTable";
// import useStore from "@/store";
import {
  EditRowTemp,
  IEmployee,
  IEmployeeTableColumn,
  TableColumn,
} from "@/types";
import * as dayjs from "dayjs";
// import { storeToRefs } from "pinia";

// const employeeStore = useStore().employee2;
// const { handleInsert, handleRemove, handleUpdate } = employeeStore;
// const { list } = storeToRefs(employeeStore);
// // 下拉框
const { genders, posts } = useSelect();

// // 表格
// const { editRowTemp, editRowIndex, edit, cancel } = useTable<IEmployee>();

// const update = () => {
//   const data = _.cloneDeep(editRowTemp.value) as IEmployee;
//   handleUpdate(data);
//   editRowIndex.value = -1;
// };

const list2: IEmployee[] = [];
const cols: TableColumn<IEmployeeTableColumn>[] = [
  {
    key: "no",
    label: "顺序",
    type: {
      name: "number",
    },
  },
  {
    key: "name",
    type: {
      name: "text",
    },
    label: "姓名",
  },
  {
    key: "factor",
    type: {
      name: "number",
    },
    label: "系数",
  },
  {
    key: "genderId",
    label: "性别",
    type: {
      name: "select",
      options: genders,
    },
  },
  {
    key: "postId",
    label: "职位",
    type: {
      name: "select",
      options: posts,
    },
  },
];
const editRow: EditRowTemp<IEmployee> = {
  id: -1,
  no: -1,
  name: "",
  factor: -1,
  genderId: "",
  gender: "",
  postId: "",
  post: "",
};

const onChange = (data: any[]) => {
  console.log("%c Line:142 🍯 data", "color:#2eafb0", data);
  if (data.length > 0) {
    data.forEach((e: any, i: number) => {
      e.id = dayjs().valueOf() + i;
      e.gender = `${e.gender}`;
      e.post = `${e.post}`;
    });

    // const employees = data as IEmployee[];
    // handleInsert(employees);
  }
};
</script>
