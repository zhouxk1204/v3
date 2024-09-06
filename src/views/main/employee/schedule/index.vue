<!--
 * @Author: 周小康
 * @Date: 2024-09-06 16:07:40
 * @LastEditors: 周小康
 * @LastEditTime: 2024-09-06 17:29:32
 * @Description: 
-->
<template>
    <div class="flex items-center gap-5">
        <el-date-picker v-model="startMonth" type="month" placeholder="选择开始月份" size="large" format="YYYY/MM"
            value-format="YYYY/MM" />

        <el-radio-group v-model="range" size="large">
            <el-radio-button label="未来半年" :value="6" />
            <el-radio-button label="未来一年" :value="12" />
        </el-radio-group>
    </div>

    <el-table :data="tableData" style="width: 100%">
        <el-table-column fixed prop="employeeName" label="职工" />
        <el-table-column :prop="'month' + i + 1" :label="item" v-for="(item, i) in monthList" />
    </el-table>

    <table class="w-full overflow-auto border-collapse">
        <thead class="border-b">
            <tr class="text-gray-400">
                <th class="p-2 text-base font-normal">职工</th>
                <th class="p-2 text-base font-normal" v-for="item in monthList" :key="item">{{ item }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="row in rows" :key="row.employeeName" class="text-gray-600 border-b">
                <th class="p-2 text-base font-normal">{{ row.employeeName }}</th>
                <td class="p-2 text-base font-normal text-center" v-for="post in row.list" :key="post">
                    {{ post }}
                </td>
            </tr>
        </tbody>
    </table>


</template>

<script setup lang='ts'>
import useStore from '@/store';
import { EmployeeTableData } from '@/types/employee';
import dayjs from 'dayjs';
import { ref } from 'vue';


const currentMonth = dayjs().format('YYYY-MM');
const range = ref(6)
const startMonth = ref(currentMonth);

const dragOptions = {
    animation: 200,
    handle: '.draggable', // Optional: handle element class for dragging
};

const onDragEnd = (index: number, event: any) => {
    console.log("%c Line:63 🍕 index", "color:#3f7cff", index);
    console.log('Drag Ended', event);
}

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
</script>
<style lang="scss" scoped></style>