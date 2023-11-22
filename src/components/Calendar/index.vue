<template>
  <div class="flex flex-col items-center justify-center font-bold">
    <div class="flex items-center text-gray-300">
      <Icon
        icon="mingcute:left-fill"
        width="30"
        class="hover:text-gray-500 active:text-gray-900"
        @click="monthChange(-1)"
      ></Icon>
      <span class="inline-block w-40 text-xl text-center text-gray-500">{{
        currentMonth
      }}</span>
      <Icon
        icon="mingcute:right-fill"
        width="30"
        class="hover:text-gray-500 active:text-gray-900"
        @click="monthChange(1)"
      ></Icon>
    </div>
    <div class="my-2 text-sm text-gray-400">{{ currentYear }}</div>
  </div>
  <div class="grid grid-cols-7 text-gray-400 border-l bg-my">
    <div
      v-for="item in dateHeader"
      class="py-3 text-center border-t border-b border-r text-bold"
    >
      {{ item }}
    </div>
    <div
      v-for="item in dateList"
      class="h-32 pt-2 pr-2 text-right border-b border-r cursor-pointer"
      :class="{ 'bg-disable': +item.split('-')[1] !== currentMonth }"
    >
      <span
        class="inline-flex items-center justify-center w-10 h-10"
        :class="{
          ' text-white bg-green-500 rounded-full': item === currentDate,
        }"
      >
        {{ +item.split("-")[2] }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as dayjs from "dayjs";
import { computed, ref } from "vue";
import { getWeekDatesArrayOfMonthYear } from "../../utils/date";
const dateHeader = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const currentDate = dayjs().format("YYYY-MM-DD");
const currentMonth = ref<number>(dayjs().month() + 1);
const currentYear = ref<number>(dayjs().year());

const dateList = computed(() => {
  return getWeekDatesArrayOfMonthYear(currentYear.value, currentMonth.value);
});

const monthChange = (value: number) => {
  const yearMonth = dayjs(`${currentYear.value}-${currentMonth.value}`).add(
    value,
    "month"
  );
  const month = yearMonth.month() + 1;
  const year = yearMonth.year();
  currentMonth.value = month;
  currentYear.value = year;
};
</script>
<style lang="scss" scoped>
.bg-disable {
  background: linear-gradient(
    -45deg,
    #ffffff 25%,
    #f0f0f0 25%,
    #f0f0f0 50%,
    #ffffff 50%,
    #ffffff 75%,
    #f0f0f0 75%,
    #f0f0f0 100%
  );
  background-size: 40px 40px; /* 条纹的宽度和高度，根据需要调整 */
}
</style>
