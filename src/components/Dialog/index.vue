<template>
  <teleport to="body">
    <div class="fixed top-0 bottom-0 left-0 right-0 z-50" v-if="modelValue">
      <div class="relative w-full h-full bg-black bg-opacity-50">
        <div
          v-if="message.length"
          class="min-w-[410px] absolute -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow top-1/2 left-1/2"
        >
          <div
            class="flex flex-col items-center justify-center p-6 text-yellow-500"
          >
            <Icon icon="mdi:alert-circle-outline" :width="60"></Icon>
            <h3 class="mb-5 text-xl text-gray-400">
              {{ message }}
            </h3>
            <div class="flex w-full">
              <Button type="danger" class="flex-1 mr-1" @click="confirm">{{
                confirmLabel
              }}</Button>
              <Button class="flex-1 ml-1" @click="cancel">{{
                cancelLabel
              }}</Button>
            </div>
          </div>
        </div>
        <slot></slot>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import Button from "../Button/index.vue";

withDefaults(
  defineProps<{
    modelValue: boolean;
    message?: string;
    cancelLabel?: string;
    confirmLabel?: string;
  }>(),
  {
    message: "",
    cancelLabel: "取消",
    confirmLabel: "确认",
  }
);

const emit = defineEmits(["cancel", "confirm", "update:modelValue"]);

const cancel = (): void => {
  emit("update:modelValue", false);
  emit("cancel");
};

const confirm = (): void => {
  emit("update:modelValue", false);
  emit("confirm");
};
</script>
