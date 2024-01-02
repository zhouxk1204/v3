<template>
  <div
    class="relative overflow-hidden border-t border-l border-r rounded shadow dark:border-dark-200 dark:bg-dark-300"
  >
    <table class="w-full text-left text-gray-500">
      <thead class="text-gray-700 dark:text-dark-100">
        <tr class="text-sm border-b dark:border-dark-200">
          <th
            scope="col"
            class="h-12 px-3 text-center"
            v-for="header in headers"
            :key="header.key"
          >
            {{ header.label }}
          </th>
          <th v-if="isAction" scope="col" class="w-40 px-6 text-center">
            操作
          </th>
        </tr>
      </thead>
      <tbody v-if="data.length > 0">
        <tr
          scope="row"
          class="border-b hover:bg-gray-100 dark:hover:bg-dark-200 dark:border-dark-200"
          v-for="item in data"
          :key="item.label"
        >
          <td
            v-for="item2 in keys"
            :key="item2"
            class="h-12 px-3 text-sm font-medium text-center text-gray-700 dark:text-dark-100 whitespace-nowrap"
          >
            <div
              v-if="item2 === 'state'"
              class="inline-block px-3 py-1 border rounded-md"
              :class="{
                'text-red-600 border-red-600 bg-red-100':
                  item[item2] === '离职',
                'text-green-600 border-green-600 bg-green-100':
                  item[item2] === '在职',
              }"
            >
              {{ item[item2] }}
            </div>
            <div v-else>
              {{ item[item2] }}
            </div>
          </td>
          <td
            class="flex items-center justify-center w-40 h-12 px-6"
            v-if="isAction"
          >
            <Button
              class="mr-2 text-xs"
              @click="edit(item)"
              icon="material-symbols:edit"
            ></Button>
            <Button
              type="danger"
              class="text-xs"
              @click="remove(item)"
              :confirm="true"
              icon="material-symbols:delete-outline"
              confirmMessage="确定删除这条记录吗？"
            ></Button>
          </td>
        </tr>
      </tbody>
    </table>
    <div
      v-if="data.length === 0"
      class="flex flex-col items-center justify-center h-40 text-gray-300 border-b"
    >
      <Icon icon="tabler:mood-empty" :width="40" />
      <div class="mt-2">未找到数据</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TableHeader } from "./type";

const props = withDefaults(
  defineProps<{
    isAction?: boolean;
    headers: TableHeader[];
    data: any[];
  }>(),
  {
    isAction: false,
  }
);

const keys = props.headers.map((e) => e.key);

const emit = defineEmits<{
  (e: "edit", data: any): void;
  (e: "del", data: any): void;
}>();

const edit = (row: any) => {
  emit("edit", row);
};

const remove = (row: any) => {
  emit("del", row);
};
</script>
