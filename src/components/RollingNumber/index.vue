<template>
  <div class="relative inline-block w-8 overflow-hidden bg-white h-7">
    <span data-show class="absolute left-0 inline-block top-7 h-7"></span>
    <span class="absolute left-0 inline-block top-8 h-7"></span>
    <span class="absolute left-0 inline-block top-8 h-7"></span>
  </div>
</template>

<script setup lang="ts">
import { watch } from "vue";

const props = defineProps<{
  val: number;
}>();

watch(
  () => props.val,
  (newVal: number) => {
    console.log("%c Line:19 🍻 newVal", "color:#ffdd4d", newVal);
    scrolling(newVal);
  }
);

const scrolling = (val: number) => {
  const show = document.querySelector("span[data-show]");
  if (show) {
    const next =
      show.nextElementSibling || document.querySelector("span:first-child");
    const up = document.querySelector("span[data-up]");

    if (up) {
      up.removeAttribute("data-up");
    }

    show.removeAttribute("data-show");
    show.setAttribute("data-up", "");

    if (next) {
      next.setAttribute("data-show", "");
      next.innerHTML = `${val < 10 ? "0" + val : val}`;
    }
  }
};
</script>
<style lang="scss" scoped>
.writing-vertical-lr {
  writing-mode: vertical-lr;
}

.text-upright {
  text-orientation: upright;
  transform: translateX(-50%);
  transition: all 0.3s ease-out;
}

span[data-show] {
  transform: translateY(-100%);
  opacity: 1;
  transition: all 0.5s ease-in-out;
}

span[data-up] {
  transform: translateY(-200%);
  opacity: 0;
  transition: all 0.5s ease-in-out;
}
</style>
