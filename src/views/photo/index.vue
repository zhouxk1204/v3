<template>
  <div class="w-screen h-screen overflow-hidden">
    <div class="flex w-screen h-screen">
      <div
        v-for="index in 3"
        class="object-cover w-1/3 h-full"
        :style="{
          'background-image': `url(${images[0]})`,
          'background-position': (-100 / 3) * (index + 1) + 'vw',
        }"
        :class="index === 2 ? 'part1' : 'part2'"
      ></div>
    </div>
    <div class="flex w-screen h-screen">
      <div
        v-for="index in 3"
        class="object-cover w-1/3 h-full"
        :style="{
          'background-image': `url(${images[0]})`,
          'background-position': (-100 / 3) * (index + 1) + 'vw',
        }"
        :class="index === 2 ? 'part1' : 'part2'"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
let images = [
  "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80",
  "https://images.unsplash.com/photo-1544198365-f5d60b6d8190?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2700&q=80",
];
</script>
<style lang="scss" scoped>
// .image-container {
//   width: 100vw;
//   display: flex;
// }

// .image-part {
//   width: calc(100vw / 3);
//   height: 100vh;
//   object-fit: cover;
//   // background-size: cover;
//   // background-position: center;
// }

.part1 {
  background-position: 0%;
  animation: down 3s linear forwards;
}

.part2 {
  background-position: -33.33vw;
  animation: up 3s linear forwards;
}

.part3 {
  background-position: -66.66vw;
  animation: down 3s linear forwards;
}

@keyframes up {
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(-100vh);
  }
}

@keyframes down {
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(100vh);
  }
}
</style>
