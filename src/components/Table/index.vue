<template>
  <el-table :data="list" class="w-full" size="large">
    <el-table-column :label="col.label" v-for="(col, i) in cols">
      <template #default="scope">
        <template v-if="editRowIndex !== scope.$index">
          <span v-if="col.type.name === 'select'">
            {{ getOption("value", scope.row[col.key], col.type.key)?.label }}
          </span>
          <span v-else>{{ scope.row[col.key] }}</span>
        </template>
        <template v-else>
          <template v-if="col.type.name === 'text'">
            <el-input
              v-model="editRowTemp[i]"
              type="text"
              :placeholder="col.label"
            ></el-input>
          </template>
          <template v-else-if="col.type.name === 'number'">
            <el-input
              v-model="editRowTemp[i]"
              type="number"
              min="0"
              :placeholder="col.label"
            ></el-input>
          </template>
          <template v-else-if="col.type.name === 'date'">
            <el-date-picker
              v-model="editRowTemp[i]"
              type="date"
              :placeholder="col.label"
              format="YYYY/MM/DD"
              value-format="YYYY/MM/DD"
            >
            </el-date-picker>
          </template>
          <template v-else-if="col.type.name === 'select'">
            <el-select-v2
              :placeholder="col.label"
              v-model="editRowTemp[i]"
              :options="getOptionsByType(col.type.key)"
              class="min-w-24 max-w-24"
            />
          </template>
        </template>
      </template>
    </el-table-column>
    <el-table-column label="操作" v-if="editable">
      <template #default="scope">
        <template v-if="editRowIndex !== scope.$index">
          <el-button @click="onEdit(scope.$index)">编辑</el-button>
          <el-popconfirm
            width="220"
            title="确认删除这条数据?"
            @confirm="onRemove(scope.$index)"
          >
            <template #reference>
              <el-button type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
        <template v-else>
          <el-button @click="onUpdate()" type="success">更新</el-button>
          <el-button @click="onCancel()">取消</el-button>
        </template>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts" generic="T extends IEmployeeTableColumn, U extends T">
import { useSelect } from "@/hooks/useSelect";
import { IEmployeeTableColumn, TableColumn } from "@/types";
const { getOptionsByType, getOption } = useSelect();

const props = withDefaults(
  defineProps<{
    list: U[];
    cols: TableColumn<T>[];
    editable?: boolean;
  }>(),
  {
    editable: false,
  }
);

const emit = defineEmits<{
  (e: "remove", data: U): void;
  (e: "update", data: T): void;
}>();

const editRowTemp = ref<Array<number | string>>([]);
for (let e of props.cols) {
  if (e.type.name === "number") {
    editRowTemp.value.push(-1);
  } else {
    editRowTemp.value.push("");
  }
}

const editRowIndex = ref<number>(-1);

const onCancel = () => {
  editRowIndex.value = -1;
};

const onUpdate = () => {
  const colKeys = props.cols.map((item) => item.key);
  const obj: any = {};
  colKeys.forEach((key, i) => {
    obj[key] = editRowTemp.value[i];
  });
  emit("update", obj as T);
  editRowIndex.value = -1;
};

const onEdit = (index: number) => {
  const data = props.list[index];
  const colKeys = props.cols.map((item) => item.key);
  for (let i = 0; i < colKeys.length; i++) {
    editRowTemp.value[i] = data[colKeys[i]] as number | string;
  }
  editRowIndex.value = index;
};

const onRemove = (index: number) => {
  emit("remove", props.list[index]);
};
</script>
<style lang="scss" scoped></style>
