<template>
  <table class="w-full overflow-hidden text-sm text-left">
    <thead class="text-gray-600 bg-gray-50">
      <tr>
        <!-- 多选 -->
        <th class="w-12 px-4 py-3">
          <input type="checkbox" :checked="isAllChecked" @change="toggleAll" />
        </th>

        <th v-for="col in columns" :key="col.key" class="px-4 py-3">
          {{ col.title }}
        </th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="row in data"
        :key="row[rowKey]"
        class="border-t hover:bg-gray-50"
      >
        <td class="px-4 py-3">
          <input type="checkbox" :value="row[rowKey]" v-model="innerSelected" />
        </td>

        <td v-for="col in columns" :key="col.key" class="px-4 py-3">
          <slot :name="col.key" :row="row">
            {{ row[col.key] }}
          </slot>
        </td>
      </tr>

      <tr v-if="!data.length">
        <td
          :colspan="columns.length + 1"
          class="px-4 py-6 text-center text-gray-400"
        >
          暂无数据
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Column {
  title: string;
  key: string;
}

const props = defineProps<{
  data: any[];
  columns: Column[];
  rowKey?: string;
  selectedIds: string[];
}>();

const emit = defineEmits<{
  (e: "update:selectedIds", val: string[]): void;
}>();

const rowKey = props.rowKey ?? "id";

const innerSelected = computed({
  get: () => props.selectedIds,
  set: (val) => emit("update:selectedIds", val),
});

const isAllChecked = computed<boolean>((): boolean => {
  return (
    props.data.length > 0 &&
    props.data.every((i) => innerSelected.value.includes(i[rowKey]))
  );
});

const toggleAll = (e: Event) => {
  const checked = (e.target as HTMLInputElement).checked;
  innerSelected.value = checked ? props.data.map((i) => i[rowKey]) : [];
};
</script>
