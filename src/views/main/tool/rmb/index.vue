<template>
  <div>
    <div class="flex flex-col items-center gap-5 ">
    <h1>
      <el-text type="primary"><span class="text-3xl">人民币大小写转换工具</span></el-text>
    </h1>
    <el-input size="large" v-model="target" placeholder="输入需要转换为大写的金额（最多两位小数）" @input="handleInput">
      <template #prepend>人民币金额</template>
    </el-input>
    <el-alert v-if="showError" title="请输入人民币金额" type="error" size="large" show-icon @close="showError = false"/>
    <el-alert v-if="result.length > 0" :title="result" type="info" size="large" :closable="false" />
    <div>
      <el-button type="primary" size="large" @click="onTrans">转换</el-button>
      <el-button type="success" size="large" @click="onCopy">复制</el-button>
      <el-button type="warning" size="large" @click="onClear">清空</el-button>
    </div>
  </div>

  <section class="flex flex-col mt-8">
    <div>
      <h2 class="text-xl">人民币介绍</h2>
      <el-divider></el-divider>
    </div>
    <div class="flex flex-col gap-5">
      <p>
        人民币（CNY）是中华人民共和国的法定货币，由中国人民银行发行。人民币的单位为元，符号为“¥”。人民币的发行和流通促进了中国的经济发展和国际贸易。人民币有纸币和硬币两种形式，纸币面额包括1元、5元、10元、20元、50元和100元，硬币面额则有1角、5角和1元等。人民币在国际市场上逐渐获得认可，成为全球主要货币之一。
      </p>
      <p>中文大写数字主要包括：{{ uppers.join('、') }}。</p>
      <el-table :data="tableData" border>
        <el-table-column v-for="num in nums" :key="num" :label="num" :prop="num" align="center">
        </el-table-column>
      </el-table>
      <p>在财务、合同、票据等场景中，使用中文大写数字可以有效避免篡改和误读，确保金额的严谨性和准确性。例如，在支票和发票上，常常将金额用中文大写表示，以增加法律效力和防范风险。</p>
    </div>
  </section>

  <section class="flex flex-col mt-8">
    <div>
      <h2 class="text-xl">人民币大写书写规范</h2>
      <el-divider></el-divider>
    </div>
    <div class="flex flex-col gap-5">
      <p>中文大写金额的填写应使用正楷或行书书写，如壹、贰、叁、肆、伍、陆、柒、捌、玖、拾、佰、仟、万、亿、元、角、分、零、整等字样。不得使用一、二、三、四、五、六、七、八、九、十、廿、毛、另（或0）等简化字，也不得自行造字。
      </p>
      <p>
        当大写金额到“元”时，需在“元”后加上“整”或“正”；若是到“角”后，可选择不加。大写金额前须标明“人民币”字样，且在“分”后不需要写“整”或“正”。大写金额应紧跟“人民币”字样填写，且不得留有空白。如果前面没有“人民币”字样，应手动添加。
      </p>
      <p>在票据和结算凭证的大写金额栏内，不得预印固定的“仟、佰、拾、万、元、角、分”字样。若小写金额中含有“0”，大写金额的书写应遵循汉语规则，并符合金额构成及防止涂改的要求。</p>
    </div>
  </section>
  </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';

const target = ref('');
const nums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '十', '百', '千', '万', '亿'];
const uppers = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖', '拾', '佰', '仟', '万', '亿'];

const obj: any = {};
nums.forEach((num, index) => {
  obj[num] = uppers[index];
});
const tableData = [obj];

const result = ref("");

const onClear = () => {
  target.value = '';
  result.value = '';
}

const showError = ref(false);

const onTrans = () => {
  if(target.value === '') {
    showError.value = true;
  }else{
    result.value = trans();
  }
}

const onCopy = () => {
  if (result.value) {
    navigator.clipboard.writeText(result.value);
    ElMessage.success('复制成功！🎉');
  }
}

const trans = () => {
  if(+target.value === 0){
    return `${target.value}元整`;
  }
  
  if (+target.value % 1 === 0) {

  } else {
    const x = target.value.split('.')[1];
    if (x.length === 1) {
      return `${uppers[+x]}角`;
    }else{
      return `${uppers[+x[0]]}角${uppers[+x[1]]}分`;
    }
  }
  return '';
}

const handleInput = () => {
  // 只允许输入数字和小数点
  const value = target.value;
  const validValue = value.replace(/[^0-9.]/g, ''); // 只允许数字和小数点

  // 限制小数点后两位
  const parts = validValue.split('.');
  if (parts.length > 2) {
    target.value = parts[0] + '.' + parts[1].slice(0, 2);
  } else if (parts.length === 2) {
    target.value = parts[0] + '.' + parts[1].slice(0, 2);
  } else {
    target.value = validValue;
  }
};
</script>