<template>
  <button
    type="button"
    class="p-2 font-medium text-center border rounded-lg focus:z-10"
    :class="color"
    @click="clickButton"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
type ButtonType = "disabled" | "default" | "primary" | "success" | "danger";

const className = {
  disabled: "bg-gray-200 text-gray-500 cursor-not-allowed",
  default:
    "hover:bg-gray-100 text-gray-500 border-gray-200 hover:text-gray-900 active:bg-gray-200 bg-white",
  primary: "text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800",
  success: "text-white bg-green-600 hover:bg-green-700 active:bg-green-800",
  danger: "text-white bg-red-600 hover:bg-red-700 active:bg-red-800",
};

const props = withDefaults(
  defineProps<{
    type?: ButtonType;
  }>(),
  {
    type: "default",
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
