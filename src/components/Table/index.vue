<template>
  <el-table :data="list" class="w-full" size="large">
    <el-table-column :label="col.label" v-for="(col, i) in cols">
      <template #default="scope">
        <template v-if="editRowIndex !== scope.$index">
          <span>{{ scope.row[col.key] }}</span>
        </template>
        <template v-else>
          <template v-if="col.type.name === 'text'">
            <el-input v-model="editRowTempValues[i]" type="text"></el-input>
          </template>
          <template v-else-if="col.type.name === 'number'">
            <el-input
              v-model="editRowTempValues[i]"
              type="number"
              min="0"
            ></el-input>
          </template>
          <template v-else-if="col.type.name === 'date'">
            <el-date-picker
              v-model="editRowTempValues[i]"
              type="date"
              placeholder="选择日期"
              format="YYYY/MM/DD"
              value-format="YYYY/MM/DD"
            >
            </el-date-picker>
          </template>
          <template v-else-if="col.type.name === 'select'">
            <el-select-v2
              v-model="editRowTempValues[i]"
              placeholder="节假日"
              :options="col.type.options"
              class="min-w-24 max-w-24"
            />
          </template>
        </template>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts" generic="T , U extends T">
import { TableColumn } from "@/types";

const props = defineProps<{
  list: U[];
  cols: TableColumn<T>[];
  editTemp: T;
}>();

const arr: any[] = [];
props.cols.forEach((e) => {
  if (e.type.name === "number") {
    arr.push(-1);
  } else {
    arr.push("");
  }
});
const editRowTempValues = ref(arr);

const editRowIndex = ref<number>(-1);

// const keys = computed((): (keyof typeof cols)[] => {
//   return Object.keys(cols) as (keyof typeof cols)[];
// });

// const getTableColumn = (key: keyof typeof cols) => {
//   return cols[key];
// };
// const cols = {
//   no: {
//     label: "顺序",
//     type: {
//       name: "number",
//     },
//   },
//   factor: {
//     type: {
//       name: "number",
//     },
//     label: "系数",
//   },
//   genderId: {
//     label: "性别",
//     type: {
//       name: "select",
//       options: [],
//     },
//   },
// };
</script>
<style lang="scss" scoped></style>
