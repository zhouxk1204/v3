<template>
  <div ref="barRef"></div>
</template>

<script setup lang='ts'>
import { BarChart, LineChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
echarts.use([
  TooltipComponent,
  LegendComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
  LabelLayout,
  UniversalTransition,
  GridComponent,
  ToolboxComponent
]);
const barRef = ref();

export interface BarOption {
  series: {
    name: string;
    value: number[];
    unit: string;
    type: 'bar' | 'line'
  }[],
  axis: {
    xAxis: string[];
    yAxis: {
      name: string;
      unit: string;
      min?: number;
      max?: number;
      interval?: number;
    }[]
  }
}

const props = defineProps<{
  option: BarOption
}>();

const chartData = ref(props.option);
let chartInstance: echarts.ECharts;

onMounted(() => {
  // 初始化 ECharts 实例
  chartInstance = echarts.init(barRef.value);

  // 初始化图表
  renderChart();

  // 监听窗口大小变化，重新渲染图表
  window.addEventListener('resize', handleResize);
})

const renderChart = () => {
  const option = {
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
      data: [...props.option.series.map(e => e.name)]
    },
    xAxis: [
      {
        type: 'category',
        data: props.option.axis.xAxis,
        axisPointer: {
          type: 'shadow'
        }
      }
    ],
    yAxis: getYAxis(),
    series: getSeries()
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
watch(() => props.option, (newValue) => {
  chartData.value = newValue;
  renderChart();
});

onUnmounted(() => {
  // 组件销毁时移除事件监听器
  window.removeEventListener('resize', handleResize);
});

const getYAxis = () => {
  const yAxis = props.option.axis.yAxis.map((item) => {
    const { name, min, max, interval, unit } = item
    return {
      type: 'value',
      name: name,
      min: min ?? 0,
      max: max ?? 20,
      interval: interval ?? 5,
      axisLabel: {
        formatter: '{value}' + unit
      }
    }
  });
  return yAxis;
}

const getSeries = () => {
  return props.option.series.map((item) => {
    const { name, value, unit, type } = item
    return {
      name,
      type,
      tooltip: {
        valueFormatter: (value: number) => {
          return value + unit;
        }
      },
      data: value
    }
  });
}
</script>