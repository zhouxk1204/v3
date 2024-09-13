<!--
 * @Author: 周小康
 * @Date: 2024-09-06 16:07:40
 * @LastEditors: 周小康
 * @LastEditTime: 2024-09-09 11:27:47
 * @Description: 
-->
<template>
    <div class="flex flex-col gap-2">
        <div class="flex items-center gap-5">
            <el-date-picker v-model="startMonth" type="month" placeholder="选择开始月份" size="large" format="YYYY/MM"
                value-format="YYYY/MM" />

            <el-radio-group v-model="range" size="large">
                <el-radio-button label="未来半年" :value="6" />
                <el-radio-button label="未来一年" :value="12" />
            </el-radio-group>
        </div>
        <div>
            <el-select v-model="value" placeholder="Select" multiple>
                <el-option-group v-for="group in options" :key="group.label" :label="group.label">
                    <el-option v-for="item in group.options" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-option-group>
            </el-select>
        </div>
    </div>

    <el-table :data="tableData">
        <el-table-column fixed prop="employeeName" label="职工" />
        <el-table-column :prop="'month' + (i + 1)" :label="item" v-for="(item, i) in monthList" width="120" />
    </el-table>
</template>

<script setup lang='ts'>
import useStore from '@/store';
import { EmployeeTableData } from '@/types/employee';
import dayjs from 'dayjs';
import { ref } from 'vue';


const currentMonth = dayjs().format('YYYY-MM');
const range = ref(6)
const startMonth = ref(currentMonth);

const monthList = computed(() => {
    const currentMonth = dayjs(startMonth.value);
    const list = [];
    let i = 1;
    while (i <= range.value) {
        i++;
        const nextMonth = currentMonth.add(i, 'month').format('YYYY年MM月');
        list.push(nextMonth);
    }
    return list;
})


const tableData = [
    {
        employeeName: '周小康',
        month1: '手1',
    },
]


const employeeList = ref<EmployeeTableData[]>([]);

const rows = ref<any[]>([]);

const init = async () => {
    const currentDate = dayjs().format('YYYY-MM-DD');
    const list = await useStore().employee2.getEmployeeTempList(currentDate);
    employeeList.value = list;
    const data: any = [];
    for (let item of list) {
        const obj: any = {};
        obj.employeeName = item.name;
        obj.list = Array(range.value).fill('0');
        data.push(obj);
    }
    rows.value = data;
}

init();


const value = ref('')
const options = [
    {
        label: '手术室岗位',
        options: [
            {
                value: 's1',
                label: '手1',
            },
            {
                value: 's2',
                label: '手2',
            },
            {
                value: 's3',
                label: '手3',
            },
        ],
    },
    {
        label: '胃镜室岗位',
        options: [
            {
                value: 'w1',
                label: '胃1',
            },
            {
                value: 'w2',
                label: '胃2',
            },
            {
                value: 'w3',
                label: '胃3',
            },
        ],
    },
];
</script>
<style lang="scss" scoped></style>