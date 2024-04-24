<template>
  <div ref="pieRef"></div>
</template>

<script setup lang='ts'>
import { PieChart, PieSeriesOption } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  LegendComponentOption,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TooltipComponentOption
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
  UniversalTransition,
  GridComponent,
  ToolboxComponent
]);

type EChartsOption = echarts.ComposeOption<
  TooltipComponentOption | LegendComponentOption | PieSeriesOption
>;

const props = defineProps<{
  title: string,
  data: {
    name: string,
    value: number
  }[]
}>();

const chartData = ref(props.data);
const pieRef = ref();
let chartInstance: echarts.ECharts;

onMounted(() => {
  // 初始化 ECharts 实例
  chartInstance = echarts.init(pieRef.value);

  // 初始化图表
  renderChart();

  // 监听窗口大小变化，重新渲染图表
  window.addEventListener('resize', handleResize);
})

const renderChart = () => {
  const option: EChartsOption = {
    title: {
      text: props.title,
      left: 'center'
    },
    // 提示框组件配置
    tooltip: {
      trigger: 'item' // 触发类型为项（数据项）
    },
    // 图例组件配置
    legend: {
      bottom: 0, // 图例距容器顶部的距离
      left: 'center' // 图例水平居中显示
    },
    series: [
      {
        top: 0,
        // 系列名称
        name: props.title,
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
        data: chartData.value,
      }
    ]
  };
  // 绘制图表
  chartInstance.setOption(option);
}

const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize();
  }
};

// 监听props的变化
watch(() => props.data, (newValue) => {
  chartData.value = newValue;
  renderChart();
});

onUnmounted(() => {
  // 组件销毁时移除事件监听器
  window.removeEventListener('resize', handleResize);
});

</script>