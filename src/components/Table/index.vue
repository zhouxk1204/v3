<template>
  <div class="relative border shadow-md border-b-none">
    <table class="w-full text-left text-gray-500">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th
            scope="col"
            class="px-6 py-3 text-sm text-center"
            v-for="header in rows[0]"
            :key="header.key"
          >
            {{ header.label }}
          </th>
          <th v-if="isAction" scope="col" class="px-6 py-3 text-sm text-center">
            操作
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          scope="row"
          class="border-b hover:bg-gray-200"
          v-for="(row, i) in rows[1]"
          :key="row.label"
          :class="i % 2 == 0 ? 'bg-white' : 'bg-gray-100'"
        >
          <th
            v-for="index of rows[0].length"
            :key="index"
            class="px-6 py-4 text-sm font-medium text-center text-gray-500 whitespace-nowrap"
          >
            {{ row[rows[0][index - 1].key] }}
          </th>
          <td class="px-6 py-4" v-if="isAction">
            <Button class="mr-1" @click="edit(row)">编辑</Button>
            <Button type="danger" @click="remove(row)">删除</Button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import Button from "../Button/index.vue";
import { TableHeader } from "./type";

withDefaults(
  defineProps<{
    isAction?: boolean;
    rows: [TableHeader[], any[]];
  }>(),
  {
    isAction: false,
  }
);

const emit = defineEmits<{
  edit: any;
  remove: any;
}>();

const edit = (row: any) => {
  emit("edit", row);
};

const remove = (row: any) => {
  emit("remove", row);
};
</script>
