<template>
  <div class="flex flex-col gap-3">

    <div class="flex items-center justify-between">
      <Typewriter text="永远相信美好的事情即将发生"></Typewriter>
    </div>

    <div class="flex gap-3">
      <el-date-picker class="max-w-[40%]" v-model="calcMonth" type="month" placeholder="选择年月" format="YYYY/MM"
        value-format="YYYY/MM" @change="onCalcMonthChange" />
      <el-button-group>
        <el-button type="success" :icon="ArrowLeft" @click="changeMonth(-1)">上月</el-button>
        <el-button type="success" @click="changeMonth(1)">
          下月<el-icon class="el-icon--right">
            <ArrowRight />
          </el-icon>
        </el-button>
      </el-button-group>
    </div>

    <el-row :gutter="12" v-if="!isEmpty">
      <el-col :span="6" :xs="24">
        <div class="flex flex-col gap-3">
          <el-card v-for="item in arr" class="flex-1 h-[104px]">
            <div class="relative flex items-center">
              <el-popover placement="top-start" title="每日平均工作时长" :width="200" trigger="hover"
                content="统计工作日、周末和节假日，包括其他岗位和胃镜2岗位的每日上班加班时长的平均，以小时为单位计算。">
                <template #reference>

                  <div class="absolute top-0 right-0">
                    <el-icon :size="24" color="#c2c2c2">
                      <QuestionFilled />
                    </el-icon>
                  </div>
                </template>
              </el-popover>

              <div class="flex items-center justify-center flex-none rounded-full h-14 w-14 bg-primary aspect-square">
                <el-icon :size="40" color="#fff">
                  <Histogram />
                </el-icon>
              </div>

              <div class="flex flex-col justify-between flex-1 py-2 ml-2 font-bold">
                <div class="flex items-end justify-between text-2xl">
                  <span>{{ item.value }}</span>
                </div>
                <div class="text-xs text-gray-500">{{ item.title }}</div>
              </div>
            </div>
          </el-card>
          <el-card v-if="pileData.length > 0">
            <EchartPile :title="pileChartTitle" :data="pileData" class="h-[320px] max-sm:h-[400px]"></EchartPile>
          </el-card>
        </div>
      </el-col>
      <el-col :span="18" :xs="24" class="max-sm:mt-3">
        <el-card v-if="barChartOption">
          <EchartBar class="h-[439px] max-sm:h-[240px]" :option="barChartOption">
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
import { ArrowLeft, ArrowRight, Histogram, QuestionFilled, } from "@element-plus/icons-vue";
import dayjs from "dayjs";


const pileData = ref<{ name: string, value: number }[]>([])

const barChartOption = ref<BarOption | null>(null)

const arr = ref([
  {
    title: '',
    value: '',
  },
])

const isEmpty = ref(true);

onMounted(() => {
  refresh(calcMonth.value);
})

const refresh = async (value: string) => {
  const data = await getBarChartList(value);

  if (data.data.length === 0) {
    isEmpty.value = true;
    return;
  };

  isEmpty.value = false;

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
        name: '其他上班',
        value: other,
        unit: 'h',
        type: 'bar',
      },
      {
        name: '其他加班',
        value: otherOvertime,
        unit: 'h',
        type: 'bar',
      },
      {
        name: '胃2上班',
        value: gastroscopy,
        unit: 'h',
        type: 'bar',
      },
      {
        name: '胃2加班',
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
  const month = calcMonth.value.split('/')[1];
  arr.value[0].title = `${+month}月平均每日工作`;
  arr.value[0].value = `${average}h`;
}

const lastMonth = getYearMonthFromDate(-1);
const calcMonth = ref(lastMonth);
const pileChartTitle = computed(() => {
  return `${calcMonth.value}岗位工分占比`
})
const onCalcMonthChange = async (value: string) => {
  refresh(value ?? '');
}

// 切换月份
const changeMonth = (offset: number) => {
  if (!calcMonth.value || calcMonth.value.length === 0) {
    calcMonth.value = getYearMonthFromDate(-1);
  }

  const date = dayjs(calcMonth.value).add(offset, 'month').format('YYYY/MM');
  calcMonth.value = date
  refresh(calcMonth.value);
};
</script>
