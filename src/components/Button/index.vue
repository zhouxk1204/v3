<template>
  <button
    type="button"
    class="focus:ring-4 focus:outline-none rounded-lg border text-sm font-medium px-5 py-2.5 focus:z-10"
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
    "hover:bg-gray-100 text-gray-500 focus:ring-gray-200 border-gray-200 hover:text-gray-900 bg-white",
  primary: "text-blue bg-green-600 hover:bg-blue-800 focus:ring-blue-300",
  success: "text-white bg-green-600 hover:bg-green-800 focus:ring-green-300",
  danger: "text-white bg-red-600 hover:bg-red-800 focus:ring-red-300",
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
