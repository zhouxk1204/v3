<template>
  <div
    class="w-screen h-[100dvh] flex items-center justify-center bg-gradient-to-br from-yellow-300 to-orange-400"
  >
    <div
      class="group cursor-pointer relative w-[90%] md:w-2/3 lg:w-1/3 bg-white text-gray-800 rounded-xl shadow-2xl p-12 flex flex-col gap-5 transition-all duration-200 hover:rounded-tr-[3rem]"
      @mouseenter="nextEmoji"
      :style="{
        '--emoji': `'${current.emoji}'`,
        '--emoji-bg': current.color,
      }"
    >
      <h1 class="text-4xl font-bold">《傲慢与偏见》</h1>

      <p class="text-xl leading-8 whitespace-pre-line">
        {{ content }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const emojiList = [
  { emoji: "🤟", color: "#4481eb" },
  { emoji: "👍", color: "#7028e4" },
];
const index = ref(0);

const nextEmoji = () => {
  index.value = (index.value + 1) % emojiList.length;
};

const current = computed(() => emojiList[index.value]);

const content = `爱情并非一见倾心的鲁莽，也不是权衡利弊后的妥协。
    它是在反复的误解与试探中，仍愿意尊重彼此的骄傲；
    是在看清对方的不完美之后，
    依然选择理解、靠近，并郑重地说一句——
    我之所以爱你，是因为你正是你。`;
</script>

<style scoped lang="scss">
.group {
  font-family: "HarmonyOS Sans SC", "PingFang SC", "Microsoft YaHei",
    "Noto Sans SC", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}
.group::before {
  content: var(--emoji);
  position: absolute;
  right: 0;
  top: 0;

  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  padding: 1rem;

  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: var(--emoji-bg);
  color: white;

  transform-origin: center;
  transform: translate(50%, -50%) scale(0);
  transition: transform 200ms ease;
  box-shadow: 0 0 #0000, 0 0 #0000, 0 25px 50px -12px rgb(0 0 0 / 0.25);
}

.group::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 4rem;
  height: 4rem;
}

.group:hover::before {
  transform: translate(50%, -50%) scale(1);
}

.group:hover {
  corner-top-right-shape: scoop;
}
</style>
