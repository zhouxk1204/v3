<template>
  <div class="leading-tight break-all text-7xl" :style="{ '--color': color }">
    <div
      id="text"
      :data-text="text"
      class="relative font-bold text-transparent bg-no-repeat bg-clip-text after:absolute after:left-0 after:top-0 after:bottom-0"
    >
      {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    text: string;
    color: string;
  }>(),
  {
    color: "skyblue",
  }
);
</script>
<style lang="scss" scoped>
#text {
  font-family: Helvetica;
  background-size: 200% 180%;
  background-position-x: 200%;
  animation: 2s fillUp ease-in-out 2s forwards;
  background-image: linear-gradient(
    to right,
    var(--color),
    var(--color),
    transparent
  );
  &::after {
    height: 100%;
    content: attr(data-text);
    -webkit-text-stroke: 2px;
    -webkit-text-stroke-color: var(--color);
    -webkit-text-fill-color: transparent;
    animation: 2s fadeIn ease-in-out forwards;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fillUp {
  from {
    background-position-x: 200%;
  }
  to {
    background-position-x: 0%;
  }
}
</style>
