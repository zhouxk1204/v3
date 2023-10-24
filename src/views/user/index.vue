<template>
  <Table class="mt-3" :rows="rows" :isAction="true"></Table>
</template>

<script setup lang="ts">
import Table from "@/components/Table/index.vue";
import { TableHeader } from "@/components/Table/type";
import { TABLE_HEADER_EMPLOYEE } from "@/constants/table.header.ts";
import { MOCK_USER_LIST } from "./data.mock.ts";
const rows: [TableHeader[], any[]] = [TABLE_HEADER_EMPLOYEE, MOCK_USER_LIST];
</script>
<style lang="scss" scoped></style>
