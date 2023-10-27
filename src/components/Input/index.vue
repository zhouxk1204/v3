<template>
  <input
    :type="type"
    class="w-full h-12 px-2 border rounded-lg outline-none"
    v-model="modelValueCopy"
  />
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    type?: "number" | "text";
    modelValue: any;
  }>(),
  {
    type: "text",
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", data: any): void;
}>();

const modelValueCopy = ref(props.modelValue);

watch(modelValueCopy, (newValue) => {
  emit("update:modelValue", newValue);
});
</script>
<style scoped></style>
