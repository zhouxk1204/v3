<template>
  <div class="flex flex-col gap-3">

    <div class="flex items-center justify-between">
      <FillUp text="Hi, xz@520.com" class="text-6xl text-center" color="#f0a9a7"></FillUp>
      <el-date-picker class="max-w-[50%]" v-model="calcMonth" type="month" placeholder="选择年月" format="YYYY/MM"
        value-format="YYYY/MM" @change="onCalcMonthChange" />
    </div>


    <div class="flex gap-3">
      <el-card v-for="item in arr" class="flex-1">
        <div class="flex h-full gap-2">
          <div class="flex items-center justify-center w-16 rounded bg-primary aspect-square">
            <el-icon :size="40" color="#fff">
              <component :is="item.icon"></component>
            </el-icon>
          </div>

          <div class="flex flex-col justify-between">
            <div class="text-gray-500">{{ item.title }}</div>
            <div class="text-3xl font-bold">{{ item.value }}</div>
          </div>
        </div>
      </el-card>
    </div>

    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <div class="flex flex-col">
            <EchartPile v-if="pileData.length > 0" title="3月工分种类占比" :data="pileData" class="h-[320px]"></EchartPile>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card>
          <EchartBar v-if="barChartOption" class="h-[320px]" :option="barChartOption">
          </EchartBar>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { getBarChartList } from "@/api/report.api";
import { BarOption } from "@/components/EchartBar/index.vue";
import { Calendar, Flag, Histogram, UserFilled } from "@element-plus/icons-vue";
import Decimal from "decimal.js";

const pileData = ref<{ name: string, value: number }[]>([])

const barChartOption = ref<BarOption | null>(null)

const arr = [
  {
    title: '员工人数',
    value: 9,
    icon: UserFilled,
  },
  {
    title: '3月平均每日工作时长',
    value: 9.5,
    icon: Histogram,
  },
  {
    title: '3月周末出勤',
    value: 23,
    icon: Calendar,
  },
  {
    title: '3月年休天数',
    value: 0,
    icon: Flag,
  },
]

onMounted(() => {
  refresh(calcMonth.value);
})

const refresh = async (value: string) => {
  const data = await getBarChartList(value);
  const dateList: string[] = [];
  const other: number[] = [];
  const otherOvertime: number[] = [];
  const gastroscopy: number[] = [];
  const gastroscopyOvertime: number[] = [];
  const total: number[] = [];
  data.data.forEach(el => {
    dateList.push(el.date);
    other.push(el.otherWorkHours);
    otherOvertime.push(el.otherOvertimeHours);
    gastroscopy.push(el.gastroscopyWorkHours);
    gastroscopyOvertime.push(el.gastroscopyOvertimeHours);
    total.push(el.totalWorkHours);
  });

  barChartOption.value = {
    series: [
      {
        name: '其他岗位上班',
        value: other,
        unit: 'h',
        type: 'bar',
      },
      {
        name: '其他岗位加班',
        value: otherOvertime,
        unit: 'h',
        type: 'bar',
      },
      {
        name: '胃2岗位上班',
        value: gastroscopy,
        unit: 'h',
        type: 'bar',
      },
      {
        name: '胃2岗位加班',
        value: gastroscopyOvertime,
        unit: 'h',
        type: 'bar',
      },
      {
        name: '合计',
        value: total,
        unit: 'h',
        type: 'line',
      },
    ],
    axis: {
      xAxis: dateList.map(e => e.split('-')[2]),
      yAxis: [
        {
          name: '小时',
          unit: 'h',
        },
        {
          name: '合计',
          unit: 'h',
        },
      ]
    },
  }

  console.log("%c Line:150 🌭 other", "color:#e41a6a", other);
  console.log("%c Line:152 🥕 otherOvertime", "color:#7f2b82", otherOvertime);
  console.log("%c Line:154 🍩 gastroscopy", "color:#f5ce50", gastroscopy);
  console.log("%c Line:156 🥛 gastroscopyOvertime", "color:#fca650", gastroscopyOvertime);
  pileData.value = [
    { value: calcArraySum(other), name: '手术上班' }, // 第三个数据项
    { value: calcArraySum(otherOvertime), name: '手术加班' }, // 第四个数据项
    { value: calcArraySum(gastroscopy), name: '胃2上班' }, // 第一个数据项
    { value: calcArraySum(gastroscopyOvertime), name: '胃2加班' }, // 第二个数据项
  ]
}

const calcArraySum = (arr: number[]) => {
  console.log("%c Line:157 🍻 arr", "color:#f5ce50", arr);
  const res = arr.reduce((pre, cur) => pre.plus(cur), new Decimal(0)).toNumber()
  console.log("%c Line:158 🍔 res", "color:#6ec1c2", res);
  return res
}

const calcMonth = ref('2024/03');
const onCalcMonthChange = async (value: string) => {
  refresh(value);
}
</script>
