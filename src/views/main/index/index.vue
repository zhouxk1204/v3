<template>
  <div class="flex flex-col gap-3">
    <!-- <Typewriter class="text-4xl text-red-300"></Typewriter> -->
    <FillUp text="Hi, xz@520.com" class="text-6xl text-center" color="#f0a9a7"></FillUp>
    <!-- <StepFadeIn :text="text" class="text-red-300"></StepFadeIn> -->

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

    <el-card class="p-2 border border-ep rounded-xl w-fit hover:shadow">
      <div class="flex flex-col gap-2">
        <h2>月次工分</h2>
        <div class="flex items-center justify-between">
          <el-date-picker class="max-w-[50%]" v-model="calcMonth" type="month" placeholder="选择年月" format="YYYY/MM"
            value-format="YYYY/MM" @change="onCalcMonthChange" />
        </div>
      </div>
      <div id="pie" class="h-64 w-60 border-ep"></div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Calendar, Flag, Histogram, UserFilled } from "@element-plus/icons-vue";
import { PieChart, PieSeriesOption } from 'echarts/charts';
import {
  LegendComponent,
  LegendComponentOption,
  TooltipComponent,
  TooltipComponentOption
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';


echarts.use([
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout
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


onMounted(() => {
  var chartDom = document.getElementById('pie')!;
  var myChart = echarts.init(chartDom);
  option && myChart.setOption(option);
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
    title: '出勤天数',
    value: 23,
    icon: Calendar,
  },
  {
    title: '年休天数',
    value: 0,
    icon: Flag,
  },
]
</script>
