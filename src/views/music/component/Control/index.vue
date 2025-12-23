<template>
  <div class="flex items-center justify-around">
    <div
      v-for="btn in controlButtons"
      :key="btn.action"
      class="control-btn"
      @click="onControlClick(btn.action)"
    >
      <Icon :icon="btn.icon" width="44" class="icon mix-blend-difference"  />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ControlItem, PlayerAction } from "../../type";

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
    action: PlayerAction.Prev,
    icon: "tabler:player-track-prev-filled",
  },
  {
    action: PlayerAction.Toggle,
    icon: `tabler:player-${props.playing ? "pause" : "play"}-filled`,
  },
  {
    action: PlayerAction.Next,
    icon: "tabler:player-track-next-filled",
  },
]);

/* ---------------- events ---------------- */

const onControlClick = (action: PlayerAction) => {
  emit("control", action);
};
</script>

<style scoped>
.control-btn {
  @apply flex items-center justify-center
    w-16 h-16
    rounded-full
    text-white/80
    cursor-pointer
    transition duration-150 ease-out;

  @media (hover: hover) {
    .control-btn:hover {
      background-color: rgb(0 0 0 / 0.2);
    }

    .control-btn:active {
      background-color: rgb(0 0 0 / 0.3);
      transform: scale(0.96);
    }
  }
}
</style>
