<!-- components/CrudPage.vue -->
<template>
  <div class="p-6 space-y-6">
    <!-- 🔍 搜索区 -->
    <div v-if="$slots.search" class="p-4 bg-white shadow-sm rounded-xl">
      <slot name="search" />
    </div>

    <!-- ➕ 操作区 -->
    <div v-if="$slots.toolbar" class="flex justify-end">
      <slot name="toolbar" />
    </div>

    <!-- 📋 表格 -->
    <div class="bg-white shadow-sm rounded-xl">
      <slot name="table" />
    </div>

    <!-- 🪟 弹窗 -->
    <slot name="modal" />
  </div>
</template>
