<template>
  <div
    class="bg-white shadow-[0_0_8px_rgba(0,0,0,0.2)] rounded-[14px] w-full h-14 flex items-center justify-between pl-2 pr-[15px]"
  >
    <div class="flex items-center gap-4">
      <img
        v-if="!error"
        class="w-10 h-10 rounded-[5px]"
        src=""
        alt="cover"
        @error="onError()"
      />
      <div
        v-else
        class="w-10 h-10 bg-[#e6e6e6] flex items-center justify-center rounded-[5px]"
      >
        <Icon icon="tdesign:music-filled" class="text-black/40"></Icon>
      </div>
      <p class="text-black/85 text-[13px]">{{ title }}</p>
    </div>

    <div class="flex items-center gap-3 text-3xl text-black/80">
      <button v-for="item in controlButtons" @click="onClickItem(item.action)">
        <Icon :icon="item.icon" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ControlItem, PlayerAction } from "@/views/music/type";

const controlButtons = computed<ControlItem[]>(() => [
  {
    action: PlayerAction.Toggle,
    icon: `tabler:player-${props.state ? "pause" : "play"}-filled`,
  },
  {
    action: PlayerAction.Next,
    icon: "tabler:player-track-next-filled",
  },
]);

const error = ref(false);

const props = defineProps<{
  coverUrl: string;
  state: "pause" | "play";
  title: string;
}>();

// const emit = defineEmits<{
//   (e: "track", data: Record<string, string | number>): void;
//   (e: "state", data: Record<string, string | number>): void;
// }>();

const onError = () => {
  error.value = true;
};

const onClickItem = (action: PlayerAction) => {
  if (action === PlayerAction.Next) {
  }
};
</script>
<style lang="scss" scoped></style>
