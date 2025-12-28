<!-- components/CrudPage.vue -->
<template>
  <div>
    <!-- 🔍 搜索区 -->
    <div v-if="$slots.search">
      <slot name="search" />
    </div>

    <!-- ➕ 操作区 -->
    <div v-if="$slots.toolbar">
      <slot name="toolbar" />
    </div>

    <!-- 📋 表格 -->
    <div class="bg-white rounded-xl">
      <slot name="table" />
    </div>

    <!-- 🪟 弹窗 -->
    <slot name="modal" />
  </div>
</template>
