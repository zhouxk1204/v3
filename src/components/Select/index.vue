<template>
  <div
    class="relative bg-white"
    ref="selectDom"
    :style="{ width: minWidth + 'px' }"
  >
    <button
      class="flex items-center justify-between w-full h-12 px-2 border rounded-lg"
      @click="select"
      :class="currentOption.data.label.length > 0 ? '' : 'text-gray-400'"
    >
      <span>{{ currentOption.data.label || props.placeholder }}</span>
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
          v-for="option in props.options"
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
import { computed, onMounted, reactive, ref } from "vue";
import { Option } from "./types";
const props = defineProps<{ options: Option[]; placeholder?: string }>();
const emit = defineEmits<{
  (e: "select", data: Option): void;
}>();

const currentOption = reactive<{ data: Option }>({
  data: { key: "", label: "" },
});

const minWidth = computed(() => {
  return (
    (Math.max(
      ...props.options
        .map((e) => e.label.length)
        .concat(props.placeholder?.length ?? 0)
    ) +
      2) *
    18
  );
});

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
  currentOption.data = option;
  emit("select", option);
  visible.value = false;
};
</script>
<style lang="scss" scoped></style>
