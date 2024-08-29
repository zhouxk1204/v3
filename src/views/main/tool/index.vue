<template>
  <div class="flex flex-col gap-2">
    <h1 class="text-xl font-bold">文字出汗效果</h1>
    <el-radio-group v-model="radio1" size="large">
      <el-radio-button label="微汗如珠" value="r1" />
      <el-radio-button label="大汗淋漓" value="r2" />
    </el-radio-group>
    <el-input size="large" v-model="target" :rows="3" type="textarea" placeholder="汗流浃背了吧，小字～" />

    <el-button type="primary" size="default" @click="onCopy">复制</el-button>

    <el-input size="large" :value="result" readonly :rows="3" type="textarea" />
  </div>
</template>

<script setup lang='ts'>

const codeMap = new Map<string, string>();

codeMap.set('r1', '\u0488');
codeMap.set('r2', '\u0488\u0488\u0488');

const radio1 = ref('r1')
const target = ref('');

const code = computed(() => {
  return codeMap.get(radio1.value);
});

const result = computed(() => {
  if (target.value.length > 0) {
    return code.value + target.value.split('').join(code.value) + code.value;
  } else {
    return "";
  }
})

const onCopy =async () => {
  try {
        await navigator.clipboard.writeText(result.value);
        ElMessage.success("复制成功！");
      } catch (err) {
        ElMessage.error("复制失败！");
      }
}
</script>
<style lang="scss" scoped></style>