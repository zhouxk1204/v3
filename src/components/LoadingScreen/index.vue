<template>
  <div
    class="relative z-50 flex items-center justify-center w-full h-full bg-white dark:bg-black"
  >
    <svg class="svg">
      <path class="path"></path>
    </svg>
  </div>
</template>

<script setup lang="ts"></script>
<style lang="scss" scoped>
.svg {
  position: absolute;
  width: 400px;
  fill: none;
}

.svg {
  filter: blur(40px);
}

.svg path {
  d: path("M0,25 C150,110 150, -60 300,25");
  stroke: #ff0092;
  stroke-width: 50;
  stroke-linecap: round;
  transform: translate(50px, 50%);
  animation: animate 2s ease-in-out infinite;
}

@keyframes animate {
  0% {
    stroke: greenyellow;
    stroke: #ff0092;
    d: path("M0,25 C150,110 150, -60 300,25");
  }

  50% {
    stroke: dodgerblue;
    stroke: #00ff00;
    d: path("M0,25 C160,-50 140, 110 300,25");
  }
}
</style>
