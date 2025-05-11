<template>
  <div class="flex items-center justify-center w-screen h-screen bg">
    <div class="card">
      <div class="card-inner">
        <div class="card-front">
          <el-form ref="formRef" :model="loginForm" :rules="rules" size="large"
            class="bg-white bg-opacity-30 absolute py-12 px-10 -translate-x-1/2 -translate-y-1/2 shadow w-[66%] rounded-xl left-1/2 top-1/2 max-sm:w-[80%]">
            <el-form-item prop="salary">
              <el-input v-model="loginForm.salary" type="number" placeholder="每月工资" clearable />
            </el-form-item>
            <el-form-item prop="salary">
              <el-input v-model="loginForm.days" placeholder="每月工作天数" type="number" clearable />
            </el-form-item>
            <el-form-item prop="hours">
              <el-input v-model="loginForm.hours" placeholder="每天工作小时" type="number" clearable />
            </el-form-item>
            <el-button class="w-full" type="primary" @click="submitForm">开始计算
            </el-button>
          </el-form>
        </div>
        <div class="flex flex-col gap-5 p-10 card-back">
          <div class="flex flex-col items-center justify-center gap-3">
            <h1 class="font-bold text-purple-500">今日目前累计已赚</h1>
            <rollingDigits :value="money"></rollingDigits>
          </div>
          <div class="flex w-full gap-12">
            <div
              class="flex-1 flex p-12 flex-col items-center justify-center gap-5 shadow-[inset_3px_3px_5px_rgba(0,0,0,0.1),inset_-3px_-3px_5px_rgba(255,255,255,0.3)] rounded-xl">
              <h2 class="text-xl">今日已工作</h2>
              <p class="text-4xl font-bold w-[8ch] text-red-400">{{ displayWorkTime }}</p>
            </div>
            <div
              class="flex-1 text-xl flex p-12 flex-col items-center justify-center gap-2 shadow-[inset_3px_3px_5px_rgba(0,0,0,0.1),inset_-3px_-3px_5px_rgba(255,255,255,0.3)] rounded-xl">
              <h2>
                赚钱速度
              </h2>
              <p>
                每秒: {{ step.toFixed(4) }}
              </p>
              <p>
                每分钟: {{ getSpreed(60) }}
              </p>
              <p>
                每小时: {{ getSpreed(60 * 60) }}
              </p>
              <p>
                每天: {{ getSpreed(60 * 60 * 8) }}
              </p>
            </div>
          </div>
          <div class="flex items-center justify-center">
            <button class="px-4 py-2 text-xl font-bold text-white bg-purple-500 border-none shadow-xl rounded-xl active:bg-purple-600">下班咯</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang='ts'>
import Decimal from 'decimal.js';
import { FormRules } from 'element-plus/es/components/form/src/types';
import rollingDigits from './rolling-digits.vue';


interface LoginForm {
  salary: number;
  days: number;
  hours: number;
}

const loginForm = reactive<LoginForm>({
  salary: 0,
  days: 0,
  hours: 0
});

const rules = reactive<FormRules<LoginForm>>({
  salary: [
    {
      required: true,
      message: "邮箱地址不能为空",
      trigger: "submit",
    },
  ],
  days: [
    {
      required: true,
      message: "登录密码不能为空",
      trigger: "submit",
    },
  ],
});

const form = reactive<{
  salary: number;
  days: number;
  hours: number;
}>({
  salary: 10000,
  days: 22.75,
  hours: 8,
})

const step = computed(() => {
  return new Decimal(form.salary).div(form.days).div(form.hours).div(60).div(60).toNumber();
})

const getSpreed = (ratio: number) => {
  return new Decimal(step.value).times(ratio).toNumber().toFixed(4);
}

const money = ref('000.0000');
setInterval(() => {
  const du = getWorkedDuration();
  money.value = new Decimal(du).div(1000).times(step.value).toNumber().toFixed(4);
  updateWorkTimeDisplay();
}, 1000);


const submitForm = () => {

}

// 1. 定义工作时间段（假设9:00上班）
const workStartTime = new Date();
workStartTime.setHours(9, 0, 0, 0); // 设置上班时间为今天9:00
const displayWorkTime = ref('00:00:00');

// 2. 计算已工作时长
function getWorkedDuration() {
  const now = new Date();
  // 如果还没到上班时间，返回0
  if (now < workStartTime) return 0;

  // 计算差值（毫秒）
  const workedMs = now.getTime() - workStartTime.getTime();
  return workedMs;
}

// 3. 格式化时间为小时:分钟
const formatDuration = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);  // 确保是整数秒
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;  // 修正秒数计算
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// 4. 更新页面显示
const updateWorkTimeDisplay = () => {
  const duration = getWorkedDuration();
  displayWorkTime.value = duration > 0
    ? formatDuration(duration)
    : "还未开始工作";
}

// 5. 每秒更新一次

// 初始显示
updateWorkTimeDisplay();

</script>
<style lang="scss" scoped>
.card {
  width: 1000px;
  height: calc(800px * 0.618);
  perspective: 1200px;
}

.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
  transform: rotateY(180deg);
}

// .card:hover .card-inner {
//   transform: rotateY(180deg);
// }

.card-front,
.card-back {
  border-radius: 20px;
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  /* 隐藏背面 */
  font-size: 20px;
  background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  box-shadow: 0 0 10px #ccc,
    /* 外发光 */
    0 0 20px #f2f2f2;
  /* 更亮一层 */
}

.card-back {
  transform: rotateY(180deg);
  /* 让文字正过来 */
  transform: rotateY(180deg);
  background: rgba(255, 255, 255, 0.2);
  /* 半透明背景 */
  backdrop-filter: blur(10px);
  /* 毛玻璃效果 */
  -webkit-backdrop-filter: blur(10px);
  /* Safari 支持 */
  border: 1px solid rgba(255, 255, 255, 0.3);
  /* 添加轻微边框增强效果 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  /* 增强层次感 */
}

.bg {
  background-image: linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%);
}
</style>