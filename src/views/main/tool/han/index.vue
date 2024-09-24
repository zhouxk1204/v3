<template>
  <div class="flex flex-col gap-2">
    <h1 class="text-xl font-bold"> <el-text type="primary" size="large">文字出汗效果</el-text></h1>
    <el-radio-group v-model="radio1" size="large">
      <el-radio-button label="微汗如珠" value="r1" />
      <el-radio-button label="大汗淋漓" value="r2" />
    </el-radio-group>
    <el-input size="large" v-model="target" :rows="3" type="textarea" placeholder="汗流浃背了吧，小字～" />
    <el-text type="primary">转换结果预览</el-text>
    <el-input size="large" :value="result" readonly :rows="3" type="textarea" />
    <div>
      <el-button type="primary" size="large" @click="onCopy">复制</el-button>
      <el-button type="danger" size="large" @click="onDelete" :disabled="!target.length">清空</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';

const codeMap = new Map<string, string>([
  ['r1', '\u0488'],
  ['r2', '\u0488\u0488\u0488'],
]);

const radio1 = ref('r1');
const target = ref('');

const result = computed(() => {
  const code = codeMap.get(radio1.value) || '';
  return target.value ? code + target.value.split('').join(code) + code : '';
});

const onCopy = async () => {
  try {
    await navigator.clipboard.writeText(result.value);
    ElMessage.success('复制成功！');
  } catch (err) {
    ElMessage.error('复制失败！');
  }
};

const onDelete = () => {
  target.value = '';
  ElMessage.success('已清除！');
};
</script>
