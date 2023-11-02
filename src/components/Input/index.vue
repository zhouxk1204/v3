<template>
  <div class="relative">
    <input
      :type="inputType"
      class="w-full h-12 px-2 bg-blue-100 rounded-lg outline-none focus:shadow-md focus:border focus:border-gray-300"
      v-model="modelValueCopy"
    />
    <div
      v-if="type === 'password' && modelValueCopy.length > 0"
      class="absolute text-gray-500 -translate-y-1/2 right-2 top-1/2"
      @click="onToggle"
    >
      <Icon icon="mdi:eye-off-outline" v-show="inputType === 'password'"></Icon>
      <Icon icon="mdi:eye-outline" v-show="inputType === 'text'"></Icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    type?: "number" | "text" | "password";
    modelValue: any;
  }>(),
  {
    type: "text",
  }
);

const inputType = ref(props.type);

const onToggle = () => {
  if (inputType.value === "password") {
    inputType.value = "text";
  } else if (inputType.value === "text") {
    inputType.value = "password";
  }
};

const emit = defineEmits<{
  (e: "update:modelValue", data: any): void;
}>();

const modelValueCopy = ref(props.modelValue ?? "");

watch(modelValueCopy, (newValue) => {
  emit("update:modelValue", newValue);
});
</script>
