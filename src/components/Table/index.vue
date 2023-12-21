<template>
  <div class="relative overflow-hidden border-t border-l border-r rounded">
    <table class="w-full text-left text-gray-500">
      <thead class="text-gray-700">
        <tr class="border-b">
          <th
            scope="col"
            class="h-12 px-3 text-xs text-center text-gray-400"
            v-for="header in headers"
            :key="header.key"
          >
            {{ header.label }}
          </th>
          <th
            v-if="isAction"
            scope="col"
            class="w-40 px-6 text-xs text-center text-gray-400"
          >
            操作
          </th>
        </tr>
      </thead>
      <tbody v-if="data.length > 0">
        <tr
          scope="row"
          class="border-b hover:bg-gray-100"
          v-for="item in data"
          :key="item.label"
        >
          <td
            v-for="item2 in keys"
            :key="item2"
            class="h-12 px-3 text-sm font-medium text-center text-gray-700 hover:bg-gray-100 whitespace-nowrap"
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
      <svg
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="w-12 h-12"
      >
        <path
          d="M26 7.5C26 11.0899 23.0899 14 19.5 14C15.9101 14 13 11.0899 13 7.5C13 3.91015 15.9101 1 19.5 1C23.0899 1 26 3.91015 26 7.5ZM16.8536 4.14645C16.6583 3.95118 16.3417 3.95118 16.1464 4.14645C15.9512 4.34171 15.9512 4.65829 16.1464 4.85355L18.7929 7.5L16.1464 10.1464C15.9512 10.3417 15.9512 10.6583 16.1464 10.8536C16.3417 11.0488 16.6583 11.0488 16.8536 10.8536L19.5 8.20711L22.1464 10.8536C22.3417 11.0488 22.6583 11.0488 22.8536 10.8536C23.0488 10.6583 23.0488 10.3417 22.8536 10.1464L20.2071 7.5L22.8536 4.85355C23.0488 4.65829 23.0488 4.34171 22.8536 4.14645C22.6583 3.95118 22.3417 3.95118 22.1464 4.14645L19.5 6.79289L16.8536 4.14645Z"
          fill="currentColor"
        ></path>
        <path
          d="M25 22.75V12.5991C24.5572 13.0765 24.053 13.4961 23.5 13.8454V16H17.5L17.3982 16.0068C17.0322 16.0565 16.75 16.3703 16.75 16.75C16.75 18.2688 15.5188 19.5 14 19.5C12.4812 19.5 11.25 18.2688 11.25 16.75L11.2432 16.6482C11.1935 16.2822 10.8797 16 10.5 16H4.5V7.25C4.5 6.2835 5.2835 5.5 6.25 5.5H12.2696C12.4146 4.97463 12.6153 4.47237 12.865 4H6.25C4.45507 4 3 5.45507 3 7.25V22.75C3 24.5449 4.45507 26 6.25 26H21.75C23.5449 26 25 24.5449 25 22.75ZM4.5 22.75V17.5H9.81597L9.85751 17.7041C10.2905 19.5919 11.9808 21 14 21L14.215 20.9947C16.2095 20.8953 17.842 19.4209 18.184 17.5H23.5V22.75C23.5 23.7165 22.7165 24.5 21.75 24.5H6.25C5.2835 24.5 4.5 23.7165 4.5 22.75Z"
          fill="currentColor"
        ></path>
      </svg>
      <div class="mt-2">无数据</div>
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
