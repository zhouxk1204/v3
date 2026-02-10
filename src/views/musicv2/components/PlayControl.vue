<template>
  <div class="control-container">
    <div v-for="btn in controlButtons" :key="btn.action" class="control-btn" @click="onControlClick(btn.action)">
      <Icon :icon="btn.icon" width="44" class="control-icon" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

export type PlayerAction = "prev" | "toggle" | "next";

export interface ControlItem {
  action: PlayerAction;
  icon: string;
}

/* ---------------- props / emits ---------------- */

const props = defineProps<{
  playing: boolean;
}>();

const emit = defineEmits<{
  (e: "control", action: PlayerAction): void;
}>();

/* ---------------- UI data ---------------- */

const controlButtons = computed<ControlItem[]>(() => [
  {
    action: "prev",
    icon: "tabler:player-track-prev-filled",
  },
  {
    action: "toggle",
    icon: `tabler:player-${props.playing ? "pause" : "play"}-filled`,
  },
  {
    action: "next",
    icon: "tabler:player-track-next-filled",
  },
]);

/* ---------------- events ---------------- */

const onControlClick = (action: PlayerAction) => {
  emit("control", action);
};
</script>

<style scoped>
.control-container{
  @apply flex items-center justify-around;
}

.control-btn {
  @apply flex items-center justify-center w-16 h-16 rounded-full text-white cursor-pointer transition duration-150 ease-out;
}

.control-icon {
  @apply text-white drop-shadow-lg;
}

@media (hover: hover) {
  .control-btn:hover {
    background-color: rgb(0 0 0 / 0.2);
  }

  .control-btn:active {
    background-color: rgb(0 0 0 / 0.3);
    transform: scale(0.96);
  }
}
</style>
