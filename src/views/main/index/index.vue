<template>
  <div class="flex flex-col gap-3">
    <!-- <Typewriter class="text-4xl text-red-300"></Typewriter> -->
    <FillUp text="Hi, xz@520.com" class="text-6xl text-center" color="#f0a9a7"></FillUp>

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


    <div class="flex gap-2">
      <el-card class="border border-ep rounded-xl w-fit hover:shadow">
        <div class="flex flex-col gap-2">
          <h2>月次工分</h2>
          <div class="flex items-center justify-between">
            <el-date-picker class="max-w-[50%]" v-model="calcMonth" type="month" placeholder="选择年月" format="YYYY/MM"
              value-format="YYYY/MM" @change="onCalcMonthChange" />
          </div>
        </div>
        <div id="pie" class="h-64 w-60 border-ep"></div>
      </el-card>

      <el-card class="flex-1 h-[360px]">
        <div id="bar" class="w-full h-[360px]"></div>
      </el-card>
    </div>


  </div>
</template>

<script setup lang="ts">
import { Calendar, Flag, Histogram, UserFilled } from "@element-plus/icons-vue";
import { BarChart, LineChart, PieChart, PieSeriesOption } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  LegendComponentOption,
  ToolboxComponent,
  TooltipComponent,
  TooltipComponentOption
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TooltipComponent,
  LegendComponent,
  PieChart,
  BarChart,
  LineChart,
  CanvasRenderer,
  LabelLayout,
  UniversalTransition,
  GridComponent,
  ToolboxComponent
]);

type EChartsOption = echarts.ComposeOption<
  TooltipComponentOption | LegendComponentOption | PieSeriesOption
>;

var option: EChartsOption;

option = {
  // 提示框组件配置
  tooltip: {
    trigger: 'item' // 触发类型为项（数据项）
  },
  // 图例组件配置
  legend: {
    bottom: 0, // 图例距容器顶部的距离
    left: 'center' // 图例水平居中显示
  },
  grid: {
    // top: '25%',//距上边距
    // left: '25%',//距离左边距
    // right: '25%',//距离右边距
    bottom: 0,//距离下边距
  },
  // 系列列表。每个系列通过 type 决定自己的图表类型
  series: [
    {
      top: -50,
      // 系列名称
      name: '月次工分分布',
      // 系列类型为饼图
      type: 'pie',
      // 饼图的内外半径，数组的第一项是内半径，第二项是外半径
      radius: ['30%', '80%'],
      // 是否启用防止标签重叠策略，默认为 false
      avoidLabelOverlap: false,
      // 图形样式
      itemStyle: {
        // 饼图扇形的圆角半径
        borderRadius: 7,
        // 饼图扇形的边框颜色
        borderColor: '#fff',
        // 饼图扇形的边框宽度
        borderWidth: 2
      },
      // 标签设置
      label: {
        // 是否显示标签，默认为 false
        show: true,
        // 标签的位置
        position: 'inner',
        // 标签文本颜色
        color: 'white'
      },
      // 高亮样式设置
      emphasis: {
        // 标签设置
        label: {
          // 是否显示标签，默认为 true
          show: true,
          // 标签字体大小
          fontSize: 14,
          // 标签字体粗细
          fontWeight: 'bold'
        }
      },
      // 标签视觉引导线设置
      labelLine: {
        // 是否显示标签视觉引导线，默认为 false
        show: false
      },
      // 数据项列表
      data: [
        { value: 12, name: '胃2上班' }, // 第一个数据项
        { value: 0.75, name: '胃2加班' }, // 第二个数据项
        { value: 184, name: '手术上班' }, // 第三个数据项
        { value: 69.75, name: '手术加班' }, // 第四个数据项
      ]
    }
  ]
};

const barOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999'
      }
    }
  },
  toolbox: {
    feature: {
      dataView: { show: true, readOnly: false },
      magicType: { show: true, type: ['line', 'bar'] },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  legend: {
    data: ['Evaporation', 'Precipitation', 'Temperature']
  },
  xAxis: [
    {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisPointer: {
        type: 'shadow'
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      name: '工分',
      min: 0,
      max: 400,
      interval: 60,
      axisLabel: {
        formatter: '{value} ml'
      }
    },
    {
      type: 'value',
      name: 'Temperature',
      min: 0,
      max: 25,
      interval: 5,
      axisLabel: {
        formatter: '{value} °C'
      }
    }
  ],
  series: [
    {
      name: 'Evaporation',
      type: 'bar',
      tooltip: {
        valueFormatter: (value: number) => {
          return value + ' ml';
        }
      },
      data: [
        2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
      ]
    },
    {
      name: 'Precipitation',
      type: 'bar',
      tooltip: {
        valueFormatter: (value: number) => {
          return value + ' ml';
        }
      },
      data: [
        2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
      ]
    },
    {
      name: 'Temperature',
      type: 'line',
      yAxisIndex: 1,
      tooltip: {
        valueFormatter: (value: number) => {
          return value + ' °C';
        }
      },
      data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
    }
  ]
};


onMounted(() => {
  var chartDom = document.getElementById('pie')!;
  var myChart = echarts.init(chartDom);
  option && myChart.setOption(option);

  var chartDom2 = document.getElementById('bar')!;
  var myChart2 = echarts.init(chartDom2);
  barOption && myChart2.setOption(barOption);
})

const calcMonth = ref('');
const onCalcMonthChange = async (value: string) => {
  console.log("%c Line:119 🌽 value", "color:#33a5ff", value);
}

const arr = [
  {
    title: '员工人数',
    value: 9,
    icon: UserFilled,
  },
  {
    title: '3月时间总工分',
    value: 269.05,
    icon: Histogram,
  },
  {
    title: '3月出勤天数',
    value: 23,
    icon: Calendar,
  },
  {
    title: '3月年休天数',
    value: 0,
    icon: Flag,
  },
]
</script>
