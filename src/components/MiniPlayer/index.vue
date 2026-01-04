<template>
  <div
    class="bg-white shadow-[0_0_8px_rgba(0,0,0,0.2)] rounded-[14px] w-full h-14 flex items-center pl-2 pr-[15px]"
  >
    <img
      v-if="!error"
      class="w-10 h-10 rounded-[5px]"
      src=""
      alt="cover"
      @error="onError()"
    />
    <div
      v-else
      class="w-10 h-10 bg-[#e6e6e6] flex items-center justify-center rounded-[5px]"
    >
      <Icon icon="tdesign:music-filled" class="text-black/40"></Icon>
    </div>
  </div>
</template>

<script setup lang="ts">
const error = ref(false);

defineProps<{
  coverUrl: string;
}>();

const onError = () => {
  error.value = true;
};
</script>
<style lang="scss" scoped></style>
