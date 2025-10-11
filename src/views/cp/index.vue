<template>
  <div class="flex flex-col items-center h-full gap-5 px-5 pt-20">
    <div class="plate">
      <div class="plate-header">
        <div class="plate-header-hole"></div>
        <div class="plate-header-hole"></div>
      </div>
      <div id="plateCharacters" class="plate-body">川A・F31076</div>
      <div class="plate-footer">
        <div class="plate-header-hole"></div>
        <div class="plate-header-hole"></div>
      </div>
    </div>

    <div class="flex flex-col items-center justify-center">
      <strong
        class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-5xl dark:text-white"
      >
        <span v-if="currentProvincePlate" class="w-[2ch] text-center">{{
          currentProvincePlate.prefix
        }}</span
        >&nbsp;<span v-if="currentArea" class="w-[2ch] text-center">{{
          currentArea.code
        }}</span>
      </strong>
      <strong class="flex flex-col items-center justify-center gap-2 text-xl">
        <span class="text-blue-700">{{ currentArea?.name }}&nbsp;</span>
        <span class="text-xs text-gray-400"
          >{{ currentArea?.remark }}&nbsp;</span
        >
      </strong>
    </div>

    <!-- <div
      class="flex flex-wrap items-center justify-center gap-2 max-w-[720px] mx-auto"
    >
      <template v-if="currentProvincePlate">
        <button
          v-for="area in currentProvincePlate.area"
          @click="onClickArea(area)"
          class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          {{ area.code }}
        </button>
      </template>
      <template v-else>
        <button
          v-for="plate in provincePlates"
          @click="onClickPlate(plate)"
          class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          {{ plate.prefix }}
        </button>
      </template>
    </div> -->

    <!-- <button
      v-if="currentArea"
      @click="onClickBack()"
      type="button"
      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
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
    </button> -->
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
<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Patua+One&display=swap");

* {
  margin: 0;
  padding: 0;
}

body {
  background-color: #333;
  font-family: "Patua One", cursive;
  padding: 20px;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    color: #555;
    margin-bottom: 20px;
  }

  button {
    border-radius: 5px;
    padding: 10px 20px;
  }
}

.plate {
  background-color: #003399;
  width: 480px;
  height: 140px;
  border-radius: 20px;
  border: 6px solid rgba(255, 255, 255, 1);
  box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.5),
    inset -2px -2px 5px rgba(0, 0, 0, 0.5),
    inset 2px -2px 5px rgba(0, 0, 0, 0.5), inset -2px 2px 5px rgba(0, 0, 0, 0.5);

  overflow: hidden;
  padding: 5px 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &-header {
    color: #fff;
    letter-spacing: 5px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: space-around;
    font-size: 30px;

    &-country {
      align-self: flex-end;
    }

    &-hole {
      width: 40px;
      height: 10px;
      border-radius: 20px;
      box-shadow: inset 3px -2px 5px rgba(0, 0, 0, 0.5);
      background-color: #333;
    }
  }

  &-footer {
    color: #fff;
    letter-spacing: 5px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: space-around;
    font-size: 30px;
    align-items: end;
    &-country {
      align-self: flex-end;
    }

    &-hole {
      width: 40px;
      height: 10px;
      border-radius: 20px;
      box-shadow: inset 3px -2px 5px rgba(0, 0, 0, 0.5);
      background-color: #333;
    }
  }

  &-body {
    color: #fff;
    width: 100%;
    font-size: 50px;
    letter-spacing: 8px;
    text-align: center;
    text-shadow: -2px -2px 0 #003399, -1px -2px 0 #003399, 2px -2px 0 #003399,
      1px -2px 0 #003399, -2px 2px 0 #003399, -1px 2px 0 #003399, 2px 2px 0 #003399,
      1px 2px 0 #003399, 2px 5px 5px rgba(0, 0, 0, 0.6);

    text-transform: uppercase;
    transition: all ease-in 0.1s;
  }
}
</style>
