<template>
  <label class="slider">
    <!-- range -->
    <input
      type="range"
      class="level"
      v-model.number="props.current"
      :min="0"
      :max="props.total"
      :step="1"
      disabled
    />

    <!-- time -->
    <div class="time">
      <span>{{ formatTime(props.current) }}</span>
      <span>-{{ formatTime(props.total - props.current) }}</span>
    </div>
  </label>
</template>

<script setup lang="ts">

const props = defineProps<{
  current: number;
  total: number;
}>();

/* mm:ss */
function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
</script>
<style lang="scss" scoped>
.slider {
  --slider-height: 6px;
  --slider-bg: rgba(255, 255, 255, 0.25);
  --level-color: rgba(255, 255, 255, 0.85);
  --text-color: var(--level-color);
  --radius: 999px;

  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

/* range */
.level {
  appearance: none;
  width: 100%;
  height: var(--slider-height);
  background: var(--slider-bg);
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
  transition: height 0.15s;
}

.level::-webkit-slider-thumb {
  appearance: none;
  width: 0;
  height: 0;
  box-shadow: -1000px 0 0 1000px var(--level-color);
}

.slider:hover .level {
  height: calc(var(--slider-height) * 1);
}

/* time */
.time {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-color);
  opacity: 0.85;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
</style>
