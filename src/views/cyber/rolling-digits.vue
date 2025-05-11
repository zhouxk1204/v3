<template>
  <div class="flex gap-1">
    <div v-for="digit in displayDigitArray" class="overflow-hidden text-6xl h-[60px] font-bold text-green-500">
      <div v-if="[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(+digit)"
        class="flex flex-col w-[1ch] transition-all duration-700 filter drop-shadow-md"
        :style="{ transform: `translateY(${-1 * +digit * 10}%)` }">
        <span>0</span>
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
        <span>6</span>
        <span>7</span>
        <span>8</span>
        <span>9</span>
      </div>
      <div v-else class="filter drop-shadow-md">{{ digit }}</div>
    </div>
  </div>
</template>

<script setup lang='ts'>
const props = withDefaults(defineProps<{
  value: string | number;
  showThousandsSeparator?: boolean;
  separator?: string;
  forceFormat?: boolean; // 是否强制对字符串数字应用千分位
}>(), {
  showThousandsSeparator: true,
  separator: ',',
  forceFormat: false, // 默认不强制格式化字符串
});

const displayDigitArray = computed<string[]>(() => {
  if (props.value === null || props.value === undefined) {
    return [];
  }

  const valueStr = props.value.toString().trim();

  // 如果是字符串且不强制转换，直接返回原样
  if (typeof props.value === 'string' && !props.forceFormat) {
    return valueStr.split('');
  }

  // 尝试解析为数字
  const num = typeof props.value === 'string' 
    ? parseFloat(valueStr.replace(/[^\d.-]/g, ''))
    : Number(props.value);

  // 如果是有效数字才应用千分位
  if (!isNaN(num) && isFinite(num) && props.showThousandsSeparator) {
    const parts = valueStr.split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, props.separator);
    const decimalPart = parts[1] ? `.${parts[1]}` : '';
    return (integerPart + decimalPart).split('');
  }

  // 其他情况返回原字符串
  return valueStr.split('');
});
</script>