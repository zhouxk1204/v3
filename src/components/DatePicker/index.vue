<template>
  <vue-tailwind-datepicker
    class="min-w-[338px]"
    as-single
    v-model="modelValueCopy"
    :formatter="formatter"
    i18n="zh-cn"
    placeholder="请选择日期"
    input-classes="rounded-lg h-11 border pl-2 focus-visible:outline-none h-12 mb-0"
  />
</template>

<script setup lang="ts">
import { DEFAULT } from "@/constants";
import { ref, watch } from "vue";
import VueTailwindDatepicker from "vue-tailwind-datepicker";
const formatter = ref({
  date: DEFAULT.DATE_FORMAT,
  month: "MM",
});

const props = defineProps<{
  modelValue: string;
}>();
const emit = defineEmits(["update:modelValue"]);

const modelValueCopy = ref(props.modelValue);
// watch(
//   () => props.modelValue,
//   (newValue) => {
//     modelValueCopy.value = newValue;
//   }
// );

watch(modelValueCopy, (newValue) => {
  emit("update:modelValue", newValue);
});
</script>
<style lang="scss" scoped></style>
