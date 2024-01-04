<template>
  <input id="toggle" type="checkbox" v-model="modelValueCopy" class="hidden" />
  <label
    for="toggle"
    class="inline-flex items-center w-12 h-6 rounded-full cursor-pointer select-none p-[2px] "
    :class="modelValueCopy ? 'bg-dark-300 border border-dark-100' : 'bg-[#dddddd]'"
  >
    <div
      class="p-[1px] rounded-full transition-all shadow-lg"
      :class="
        modelValueCopy ? 'translate-x-6 bg-dark' : 'bg-white text-gray-400'
      "
    >
      <Icon
        v-show="modelValueCopy"
        icon="ic:twotone-dark-mode"
        color="white"
      ></Icon>
      <Icon v-show="!modelValueCopy" icon="ic:twotone-light-mode"></Icon>
    </div>
    <div class="flex-1">&nbsp;</div>
  </label>
  {{ modelValueCopy }}
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
  }>(),
  {
    modelValue: false,
  }
);

const emit = defineEmits(["update:modelValue"]);

const modelValueCopy = ref(props.modelValue);

watch(modelValueCopy, (newValue) => {
  emit("update:modelValue", newValue);
});
</script>
<style lang="scss" scoped></style>
