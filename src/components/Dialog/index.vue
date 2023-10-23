<template>
  <teleport to="body">
    <div class="fixed top-0 bottom-0 left-0 right-0 z-50" v-if="modelValue">
      <div class="relative w-full h-full bg-black bg-opacity-50">
        <div
          class="min-w-[410px] absolute -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow top-1/2 left-1/2"
        >
          <button
            @click="close"
            type="button"
            class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <svg
              class="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
          <div class="p-6 text-center">
            <svg
              class="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-200"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <h3
              class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400"
            >
              {{ message }}
            </h3>
            <Button type="danger" class="mr-2" @click="confirm">{{
              confirmLabel
            }}</Button>
            <Button @click="cancel">{{ cancelLabel }}</Button>
          </div>
        </div>
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
    message: "Are you sure?",
    cancelLabel: "取消",
    confirmLabel: "确认",
  }
);

const emit = defineEmits(["close", "cancel", "confirm", "update:modelValue"]);

const close = (): void => {
  emit("update:modelValue", false);
  emit("close");
};

const cancel = (): void => {
  emit("update:modelValue", false);
  emit("cancel");
};

const confirm = (): void => {
  emit("update:modelValue", false);
  emit("confirm");
};
</script>
