<template>
  <div class="flex flex-col items-center h-full gap-5 px-5 pt-20">
    <div class="flex flex-col items-center justify-center">
      <strong
        class="flex mb-4 text-5xl font-bold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-5xl dark:text-white"
      >
        <div
          class="w-[2ch] text-center border-2 border-gray-500 aspect-square flex items-center justify-center rounded-lg"
        >
          {{ currentProvincePlate?.prefix || "&nbsp;" }}
        </div>
        &nbsp;<span
          class="w-[2ch] text-center border-2 border-gray-500 aspect-square flex items-center justify-center rounded-lg"
          >{{ currentArea?.code || "&nbsp;" }}</span
        >
      </strong>
      <strong class="flex flex-col items-center justify-center gap-2 text-xl">
        <span class="text-blue-700">{{ currentArea?.name }}&nbsp;</span>
        <span class="text-xs text-gray-400"
          >{{ currentArea?.remark }}&nbsp;</span
        >
      </strong>
    </div>

    <div
      class="flex flex-wrap items-center justify-center gap-2 max-w-[720px] mx-auto"
    >
      <template v-if="currentProvincePlate">
        <button
          v-for="area in currentProvincePlate.area"
          @click="onClickArea(area)"
          class="py-2.5 px-5 me-2 mb-2 text-sm font-bold text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          {{ area.code }}
        </button>
      </template>
      <template v-else>
        <button
          v-for="plate in provincePlates"
          @click="onClickPlate(plate)"
          class="py-2.5 px-5 me-2 mb-2 text-sm font-bold text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          {{ plate.prefix }}
        </button>
      </template>
    </div>

    <button
      v-if="currentArea"
      @click="onClickBack()"
      type="button"
      class="flex justify-center w-[200px] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="square"
          stroke-width="2"
          d="M5.75 7H14a6 6 0 0 1 0 12H6.5M8 10.5L4.5 7L8 3.5"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { Area, ProvincePlate, provincePlateArray } from "./data";

const currentProvincePlate = ref<ProvincePlate | null>(null);
const currentArea = ref<Area | null>(null);

const provincePlates: ProvincePlate[] = provincePlateArray;

const onClickPlate = (item: ProvincePlate) => {
  currentProvincePlate.value = item;
};

const onClickArea = (area: Area) => {
  currentArea.value = area;
};

const onClickBack = () => {
  currentArea.value = null;
  currentProvincePlate.value = null;
};
</script>
