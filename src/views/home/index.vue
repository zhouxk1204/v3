<template>
  <h2
    class="text-2xl relative hover:before:content-['#'] hover:before:text-green-400 hover:before:absolute hover:before:-left-5 hover:before:z-10"
  >
    HOME WORD！
  </h2>

  <Button>ok</Button>
  <Button type="primary">primary</Button>
  <Button type="success">success</Button>
  <Button type="danger">danger</Button>
  <Record></Record>

  <Upload @data="onFileData">123213</Upload>
</template>

<script setup lang="ts">
const onFileData = (data: any[]) => {
  console.log("%c Line:20 🍔 data", "color:#42b983", data);
};
</script>
