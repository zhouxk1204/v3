<template>
  <el-button type="primary" @click="visible = true">添加</el-button>

  <el-drawer v-model="visible" title="工分内容模板添加" direction="ltr" :close-on-click-modal="false">
    <el-form :model="form" label-width="auto" style="max-width: 600px"  class="px-5">
      <el-form-item label-position="top" label="工分类型">
        <el-select v-model="form.type" placeholder="请选择工分类型">
          <el-option label="工分" value="point" />
          <el-option label="假期" value="leave" />
        </el-select>
      </el-form-item>

      <el-form-item label-position="top" label="工分匹配类型">
        <el-select v-model="form.matchMode" placeholder="请选择工分类型">
          <el-option label="规则解析" value="pattern" />
          <el-option label="关键词" value="keyword" />
        </el-select>
      </el-form-item>

      <el-form-item label-position="top" label="关键词" v-show="form.matchMode === 'keyword'">
        <el-input-tag v-model="form.keywords" placeholder="请输入关键词，输入完成后按回车键提交"/>
      </el-form-item>

      <el-collapse v-model="activeNames" v-show="form.matchMode === 'pattern'"  class="mb-5">
        <el-collapse-item v-for="(rule, index) in form.rules" :key="index" :title="'第' + (index + 1) + '部分'"
          :name="index">
          
          <el-form-item label-position="top" label="示例模板类型">
             <el-select v-model="rule.option" placeholder="请选择示例模板类型">
              <el-option label="整数" value="int" />
              <el-option label="数字（包括小数）" value="float" />
              <el-option label="文本关键词" value="text" />
              <el-option label="正则表达式" value="regex" />
            </el-select>
          </el-form-item>

          <el-form-item label-position="top" label="文本关键词" v-if="rule.option === 'text'">
            <el-input-tag v-model="rule.labels" placeholder="请输入文本关键词，输入完成后按回车键提交"/>
          </el-form-item>

          <el-form-item label-position="top" label="自定义正则表达式" v-if="rule.option === 'regex'">
            <el-input-tag v-model="rule.labels" placeholder="请输入自定义正则表达式，输入完成后按回车键提交"/>
          </el-form-item>

          <el-form-item label-position="top" label="该部分工分类型" prop="type">
            <el-select v-model="rule.type" placeholder="请选择类型">
              <el-option label="上班" value="work" />
              <el-option label="加班" value="overtime" />
              <el-option label="假期" value="leave" />
            </el-select>
          </el-form-item>

          <el-form-item label-position="top" :label="rule.type === 'leave'? '该部分假期计算天数' : '该部分工分倍率'" prop="multiplier">
            <el-input-number v-model="rule.multiplier" placeholder="请输入该部分工分汇算倍率" :step="0.5" />
          </el-form-item>

          <el-form-item label-position="top" label="规则分隔符（如果还有其他规则）">
            <el-input v-model="rule.separator" placeholder="请输入规则分隔符" />
          </el-form-item>

          <el-button type="primary" @click="addRule" :disabled="rule.separator.length === 0">添加第{{index + 2}}部分规则</el-button>
          <el-button type="danger" @click="removeRule(index)" v-if="form.rules.length > 1 && index > 0">删除规则</el-button>
        </el-collapse-item>
      </el-collapse>

      <el-form-item label-position="top" label="备注信息" v-show="form.matchMode === 'keyword'">
        <el-input v-model="form.remark" placeholder="请输入备注"/>
      </el-form-item>

      <el-form-item label-position="top">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">添加</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup lang='ts'>
const activeNames = ref([]);
const visible = ref(false);
const form = reactive<any>({
  type: 'leave', //   类型分类
  matchMode: 'keyword', // 匹配模式
  keywords: [],
  rules: [],
  remark: ''
})

const addRule = () => {
  form.rules.push({
    labels: [],
    type: "work",
    multiplier: 1,
    separator: '',
    option:'float',
  });
};

const removeRule = (index: number) => {
  form.rules.splice(index, 1);
}

watch(
  () => form.rules.length,
  () => {
    activeNames.value = form.rules.map((_: any, index: number) => index)
  }
)

watch(
  () => form.matchMode,
  (newType) => {
    if (newType === 'pattern' && form.rules.length === 0) {
      addRule();
      form.keywords = [];
    }else{
      form.rules = [];
    }
  }
)

const submitForm = () => {
  console.log("%c Line:120 🍪", "color:#6ec1c2", form);
}

// // 生成正则表达式的函数
// function generateRegexFromRules(rules: RulePart[]): RegExp {
//   const pattern = rules.map(rule => {
//     let labelPart: string;

//     switch (rule.option) {
//       case 'float':
//         labelPart = '\\d+(?:\\.\\d+)?'; // 匹配数字（整数或小数）
//         break;
//       case 'int':
//         labelPart = '\\d+'; // 只匹配整数
//         break;
//       case 'text':
//         labelPart = rule.labels.map(label => label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'); // 匹配文本，处理特殊字符
//         break;
//       case 'regex':
//         labelPart = rule.labels.join('|'); // 使用自定义正则表达式
//         break;
//       default:
//         throw new Error('Unsupported label option');
//     }
//     const sep = rule.separator ? `\\${rule.separator}` : ''; // 如果有分隔符，添加分隔符
//     return `(${labelPart})${sep}`;
//   }).join('');

//   return new RegExp('^' + pattern + '$'); // 最终正则，以 ^ 开头，$ 结尾，确保完全匹配
// }

</script>
<style lang="scss" scoped></style>