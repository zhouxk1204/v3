<template>
  <div class="flex gap-3 p-2 bg-white rounded-lg">
    <!-- 新增按钮 -->
    <button
      @click="emitAdd"
      class="px-4 py-2 text-sm font-medium text-white transition bg-green-600 rounded-lg shadow hover:bg-green-700 active:scale-95"
    >
      新增
    </button>

    <!-- 编辑按钮 -->
    <button
      :disabled="selectedIds.length !== 1"
      @click="emitEdit"
      :class="[
        'px-4 py-2 text-sm font-medium rounded-lg shadow transition',
        selectedIds.length === 1
          ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
          : 'bg-gray-200 text-gray-400 cursor-not-allowed',
      ]"
    >
      编辑
    </button>

    <!-- 删除按钮 -->
    <button
      :disabled="selectedIds.length === 0"
      @click="emitDelete"
      :class="[
        'px-4 py-2 text-sm font-medium rounded-lg shadow transition',
        selectedIds.length > 0
          ? 'bg-red-600 text-white hover:bg-red-700 active:scale-95'
          : 'bg-gray-200 text-gray-400 cursor-not-allowed',
      ]"
    >
      删除
    </button>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  selectedIds: string[];
}>();

const emit = defineEmits<{
  (e: "add"): void;
  (e: "edit"): void;
  (e: "delete"): void;
}>();

const emitAdd = () => emit("add");
const emitEdit = () => emit("edit");
const emitDelete = () => emit("delete");
</script>
