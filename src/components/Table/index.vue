<template>
  <el-table :data="list" class="w-full" size="large">
    <el-table-column :label="item.label" v-for="item in cols">
      <template #default="scope">
        <template v-if="editRowIndex !== scope.$index">
          <span v-if="item.edit && item.edit.editType === 'select'">
            {{
    getOption("value", scope.row[item.field], item.edit.selectType)
      ?.label
  }}
          </span>
          <span v-else>{{ scope.row[item.field] }}</span>
        </template>
        <template v-else>
          <template v-if="item.edit && item.edit.editType === 'text'">
            <el-input type="text" v-model="editRowTemp[item.field]" :placeholder="item.edit.placeholder"
              :clearable="item.edit.clearable"></el-input>
          </template>
          <template v-else-if="item.edit && item.edit.editType === 'number'">
            <el-input type="number" v-model="editRowTemp[item.field]" :placeholder="item.edit.placeholder"
              :clearable="item.edit.clearable" min="0"></el-input>
          </template>
          <template v-else-if="item.edit && item.edit.editType === 'date'">
            <el-date-picker type="date" v-model="editRowTemp[item.field]" :placeholder="item.edit.placeholder"
              :clearable="item.edit.clearable" format="YYYY/MM/DD" value-format="YYYY/MM/DD" class="w-24">
            </el-date-picker>
          </template>
          <template v-else-if="item.edit && item.edit.editType === 'select'">
            <el-select-v2 v-model="editRowTemp[item.field]" :placeholder="item.edit.placeholder"
              :clearable="item.edit.clearable" :options="item.edit.options" class="w-24" />
          </template>
        </template>
      </template>
    </el-table-column>
    <el-table-column label="操作" v-if="editable">
      <template #default="scope">
        <template v-if="editRowIndex !== scope.$index">
          <el-button type="primary" :icon="Edit" circle @click="onEdit(scope.$index)" />
          <el-popconfirm width="220" title="确认删除这条数据?" @confirm="onRemove(scope.$index)">
            <template #reference>
              <el-button type="danger" :icon="Delete" circle />
            </template>
          </el-popconfirm>
        </template>
        <template v-else>
          <el-button type="success" :icon="Check" circle @click="onUpdate()" />
          <el-button :icon="RefreshLeft" circle @click="onCancel()" />
        </template>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts" generic="T">
import { useSelect } from "@/hooks/useSelect";
import { Check, Delete, Edit, RefreshLeft } from '@element-plus/icons-vue';
import { TableColumnItem } from "./type";
const { getOption } = useSelect();

const props = withDefaults(
  defineProps<{
    list: T[];
    cols: TableColumnItem<T>[];
    editable?: boolean;
  }>(),
  {
    editable: false,
  }
);

const emit = defineEmits<{
  (e: "remove", data: number): void;
  (e: "update", data: any): void;
}>();

const editRowTemp = ref<any>({});
for (let e of props.cols) {
  editRowTemp.value[e.field] = "";
}

const editRowIndex = ref<number>(-1);

const onCancel = () => {
  editRowIndex.value = -1;
};

const onUpdate = () => {
  emit("update", editRowTemp.value);
  editRowIndex.value = -1;
};

const onEdit = (index: number) => {
  const data = props.list[index];
  editRowTemp.value = Object.assign({}, data);
  editRowIndex.value = index;
};

const onRemove = (index: number) => {
  emit("remove", index);
};
</script>
