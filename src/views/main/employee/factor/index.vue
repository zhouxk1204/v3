<template>
  <Search :visible="true" :form="form"></Search>

  <Table2 :columns="columns" :tableData="tableData"></Table2>

</template>

<script setup lang='ts'>
import { SearchFormItem } from '@/components/Search/type';


const form: SearchFormItem[] = [
  {
    field: 'name',
    label: '姓名',
    type: 'input',
    value: '',
  },
]

const columns = [
  {
    field: "name",
    label: "姓名"
  }, {
    field: "weighted",
    label: "系数变化",
    style: 'tag',
  }, {
    field: "effectiveMonth",
    label: "生效起始月份"
  },
  {
    field: "createTime",
    label: "创建时间"
  },
  {
    field: "remark",
    label: "调整原因备注"
  }
]

const tableData = [
  {
    name: "张三",
    weighted: "1.2",
    effectiveMonth: "2021-01",
    createTime: "2021-01-01 00:00:00",
    remark: "中级职称中级职称中级职称中级职称中级职称中级职称中级职称中级职称"
  }
]

</script>