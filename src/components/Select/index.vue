<template>
  <div class="relative bg-white" ref="selectDom">
    <button
      class="flex items-center justify-between w-full h-12 px-2 border rounded-lg"
      @click.prevent="select"
      :class="modelValue.label.length > 0 ? '' : 'text-gray-400'"
    >
      <span>{{ modelValue.label || placeholder }}</span>
      <div
        class="w-0 h-0 ml-2 border-t-8 border-l-8 border-r-8 border-t-gray-300 border-r-transparent border-l-transparent"
      ></div>
    </button>
    <div
      class="absolute left-0 z-10 w-full py-1 mt-1 bg-white border rounded-lg top-12"
      v-if="visible"
    >
      <ul>
        <li
          v-for="option in options"
          :key="option.key"
          class="flex items-center h-12 px-2 py-1 hover:bg-blue-500 hover:text-white"
          @click="selectOption(option)"
        >
          {{ option.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Option } from "./types";
defineProps<{ modelValue: Option; options: Option[]; placeholder?: string }>();
const emit = defineEmits<{
  (e: "select", data: Option): void;
  (e: "update:modelValue", data: Option): void;
}>();

const visible = ref<boolean>(false);

const select = () => {
  visible.value = !visible.value;
};

const selectDom = ref();

onMounted(() => {
  document.addEventListener(
    "click",
    (e: any) => {
      if (!(selectDom.value && selectDom.value.contains(e.target))) {
        visible.value = false;
      }
    },
    true
  );
});

const selectOption = (option: Option) => {
  emit("select", option);
  emit("update:modelValue", option);
  visible.value = false;
};
</script>
