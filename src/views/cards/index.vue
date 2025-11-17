<template>
  <div class="w-full h-full">
    <div class="p-2 bg-white rounded shadow-lg w-72" draggable="true">
      <img src="https://picsum.photos/800/800" alt="" srcset="" class="object-cover w-full h-60">
      <p class="flex justify-between p-4 text-2xl text-center font-caveat">
        <span>Swim is fun</span>
        <span class="flex items-center">📍<span class="text-sm text-gray-400">青海湖</span></span>
      </p>
    </div>
  </div>
</template>

<script setup lang='ts'>
</script>
<style lang="scss" scoped>
.font-caveat {
  font-family: "Caveat", cursive;
}
</style>