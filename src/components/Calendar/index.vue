<template>
  <div class="flex flex-col items-center justify-center font-bold select-none">
    <div class="flex items-center text-gray-300">
      <Icon
        icon="mingcute:left-fill"
        width="30"
        class="cursor-pointer hover:text-gray-500 active:text-gray-900"
        @click="monthChange(-1)"
      ></Icon>
      <span class="inline-block w-40 text-4xl text-center text-gray-500">{{
        currentMonth
      }}</span>
      <Icon
        icon="mingcute:right-fill"
        width="30"
        class="cursor-pointer hover:text-gray-500 active:text-gray-900"
        @click="monthChange(1)"
      ></Icon>
    </div>
    <div class="my-2 text-lg text-gray-500">{{ currentYear }}</div>
  </div>
  <div class="grid grid-cols-7 text-gray-500 border-l select-none bg-my">
    <div
      v-for="item in dateHeader"
      class="py-3 font-bold text-center border-t border-b border-r"
    >
      {{ item }}
    </div>
    <div
      @click="onClickDate(item.date)"
      v-for="item in dateList"
      class="pt-2 pr-2 text-right border-b border-r cursor-pointer h-28"
      :class="{
        'bg-disable': item.month !== currentMonth,
        'border-b-4 border-b-blue-400':
          item.month === currentMonth && item.date === selectDate,
      }"
    >
      <div
        class="relative flex flex-col items-end justify-end p-2"
        :class="{
          'text-red-500':
            item.month === currentMonth && [0, 6].includes(item.dayOfWeek),
          'text-red-300':
            item.month !== currentMonth && [0, 6].includes(item.dayOfWeek),
          'text-gray-500':
            item.month === currentMonth && [0, 6].includes(item.dayOfWeek),
          'text-gray-300':
            item.month !== currentMonth && ![0, 6].includes(item.dayOfWeek),
        }"
      >
        <span class="text-xl font-bold">
          {{ item.dayOfMonth }}
        </span>
        <span v-if="item.name" class="text-xs font-bold">{{
          getHolidayName(item.name)
        }}</span>
        <span
          v-if="item.type.length > 0"
          class="absolute flex items-center justify-center w-4 h-4 text-xs rounded-full -top-1 -right-1"
          :class="
            item.type === '0'
              ? 'text-gray-500 bg-gray-200'
              : 'text-red-500 bg-red-200'
          "
          >{{ item.type === "0" ? "班" : "休" }}
        </span>
        <span
          v-if="item.date === currentDate"
          class="absolute flex items-center justify-center w-4 h-4 text-xs text-green-500 bg-green-200 rounded-full -top-1 -right-1"
          >今
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DATE_FORMAT } from "@/constants";
import { useCalendar } from "@/hooks/useCalendar";
import { useSelect } from "@/hooks/useSelect";
import * as dayjs from "dayjs";
import { computed, ref } from "vue";

const { getHolidayName } = useSelect();
const dateHeader = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const currentDate = dayjs().format(DATE_FORMAT);
const currentMonth = ref<number>(dayjs().month() + 1);
const currentYear = ref<number>(dayjs().year());

const selectDate = ref("");

const dateList = computed(() => {
  return useCalendar(currentYear.value, currentMonth.value).list;
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

const onClickDate = (date: string) => {
  selectDate.value = date;
  const selectDateMonth = dayjs(date).month() + 1;
  if (selectDateMonth !== currentMonth.value) {
    currentMonth.value = selectDateMonth;
  }
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
