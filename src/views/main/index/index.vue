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

    <el-row :gutter="12">
      <el-col :span="6">
        <el-card v-if="pileData.length > 0">
          <EchartPile :title="pileChartTitle" :data="pileData" class="h-[320px]"></EchartPile>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card v-if="barChartOption">
          <EchartBar class="h-[320px]" :option="barChartOption">
          </EchartBar>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { getBarChartList } from "@/api/report.api";
import { BarOption } from "@/components/EchartBar/index.vue";
import { sumArray } from "@/utils/array";
import { calculate, OperatorEnum } from "@/utils/calc";
import { getYearMonthFromDate } from "@/utils/date";
import { Calendar, Flag, Histogram, UserFilled } from "@element-plus/icons-vue";


const pileData = ref<{ name: string, value: number }[]>([])

const barChartOption = ref<BarOption | null>(null)

const arr = ref([
  {
    title: '员工人数',
    value: 9,
    icon: UserFilled,
  },
  {
    title: '',
    value: '',
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
])

onMounted(() => {
  refresh(calcMonth.value);
})

const refresh = async (value: string) => {
  const data = await getBarChartList(value);
  console.log("%c Line:84 🍧 data", "color:#e41a6a", data);

  if (data.data.length === 0) return;

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

  pileData.value = [
    { value: sumArray(other), name: '手术上班' }, // 第三个数据项
    { value: sumArray(otherOvertime), name: '手术加班' }, // 第四个数据项
    { value: sumArray(gastroscopy), name: '胃2上班' }, // 第一个数据项
    { value: sumArray(gastroscopyOvertime), name: '胃2加班' }, // 第二个数据项
  ]

  const average = calculate(sumArray(total), total.length, OperatorEnum.DIVIDE);
  arr.value[1].value = average + ' h';
}

const lastMonth = getYearMonthFromDate(-1);
const calcMonth = ref(lastMonth);
arr.value[1].title = calcMonth.value.split('/')[1] + '月每日平均';
const pileChartTitle = computed(() => {
  return `${calcMonth.value}工分类别占比`
})
const onCalcMonthChange = async (value: string) => {
  refresh(value);
}
</script>
