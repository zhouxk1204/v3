<template>
  <div>
    <button
      type="button"
      class="flex items-center justify-center w-full h-full p-2 font-medium border rounded-lg focus:z-10"
      :class="color"
      @click="clickButton"
    >
      <slot></slot>
      <Icon v-if="icon.length" :icon="icon" :width="22"></Icon>
    </button>

    <Dialog
      v-model="isConfirm"
      :message="confirmMessage"
      @confirm="onConfirm"
    ></Dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
type ButtonType = "disabled" | "default" | "primary" | "success" | "danger";

const className = {
  disabled: "bg-gray-200 text-gray-500 cursor-not-allowed",
  default:
    "hover:bg-gray-100 text-gray-500 border-gray-200 hover:text-gray-900 active:bg-gray-200 bg-white hover:shadow-md",
  primary:
    "text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:shadow-md",
  success:
    "text-white bg-green-600 hover:bg-green-700 active:bg-green-800 hover:shadow-md",
  danger:
    "text-white bg-red-600 hover:bg-red-700 active:bg-red-800 hover:shadow-md",
};

const props = withDefaults(
  defineProps<{
    type?: ButtonType;
    icon?: string;
    disabled?: boolean;
    confirm?: boolean;
    confirmMessage?: string;
  }>(),
  {
    disabled: false,
    type: "default",
    icon: "",
    confirm: false,
    confirmMessage: "Are you sure?",
  }
);

const emit = defineEmits(["click"]);

const isConfirm = ref<boolean>(false);
const clickButton = () => {
  if (props.disabled) return;
  if (props.confirm) {
    isConfirm.value = true;
  } else {
    emit("click");
  }
};

const onConfirm = () => {
  emit("click");
};

const color = computed(() => {
  return props.disabled ? className["disabled"] : className[props.type];
});
</script>
