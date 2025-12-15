<template>
  <div class="flex items-center justify-around">
    <div
      v-for="btn in controlButtons"
      :key="btn.action"
      class="control-btn"
      @click="onControlClick(btn.action)"
    >
      <Icon :icon="btn.icon" width="44" class="icon" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { ControlItem, PlayerAction } from "../../type";

/* ---------------- props / emits ---------------- */

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
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
    icon: `tabler:player-${props.modelValue ? "pause" : "play"}-filled`,
  },
  {
    action: PlayerAction.Next,
    icon: "tabler:player-track-next-filled",
  },
]);

/* ---------------- events ---------------- */

function onControlClick(action: PlayerAction) {
  if (action === PlayerAction.Toggle) {
    emit("update:modelValue", !props.modelValue);
  } else {
    emit("control", action);
  }
}
</script>
<style>
.control-btn {
  @apply flex items-center justify-center
    w-16 h-16
    rounded-full
    text-white/80
    cursor-pointer
    transition duration-150 ease-out;

  @apply hover:bg-black/20
    active:bg-black/30
    active:scale-[0.96];
}
</style>
