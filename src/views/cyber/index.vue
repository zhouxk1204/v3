<template>
  <div class="flex items-center justify-center w-screen h-screen">
    <div class="card">
      <div class="card-inner">
        <div class="card-front">

        </div>
        <div class="p-10 card-back">
          <h1>恭喜你！今日已赚<span class="text-4xl font-bold"> ¥ {{ money }}</span></h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import Decimal from 'decimal.js';

const form = reactive<{
  salary: number;
  days: number;
  hours: number;
}>({
  salary: 3000,
  days: 22.5,
  hours: 8,
})

const step = computed(() => {
  return form.salary / form.days / form.hours;
})

const money = ref('0.00');
setInterval(() => {
  money.value = new Decimal(money.value).plus(step.value).toNumber().toFixed(2);
}, 1000);


</script>
<style lang="scss" scoped>
.card {
  width: 800px;
  height: calc(800px * 0.618);
  perspective: 1200px;
}

.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card:hover .card-inner {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  border-radius: 10px;
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
  background-image: linear-gradient(to top, #fad0c4 0%, #ffd1ff 100%);
}
</style>