<template>
  <button class="px-4 rounded-lg" :class="color" @click="clickButton">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
type ButtonType = "disabled" | "default" | "primary" | "success" | "danger";

const className = {
  disabled: "bg-gray-200 text-gray-500 cursor-not-allowed",
  default: "bg-gray-100 hover:bg-gray-200 active:bg-gray-300",
  primary: "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white",
  success: "bg-green-500 hover:bg-green-600 active:bg-green-700 text-white",
  danger: "bg-red-500 hover:bg-red-600 active::bg-red-700 text-white",
};

const props = withDefaults(
  defineProps<{
    type: ButtonType;
    disibled: boolean;
  }>(),
  {
    type: "default",
    disibled: false,
  }
);

const emit = defineEmits(["click"]);

const clickButton = () => {
  if (props.type === "disabled") return;
  emit("click");
};

const color = computed(() => {
  return className[props.type];
});
</script>
