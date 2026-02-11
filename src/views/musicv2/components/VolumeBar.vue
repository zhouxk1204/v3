<template>
  <label class="slider">
    <Icon
      icon="vaadin:volume-off"
      width="25"
      class="text-white volume drop-shadow-lg"
    />
    <input
      type="range"
      class="w-full level"
      v-model="volume"
      :min="0"
      :max="1"
      :step="0.01"
    />
    <Icon
      icon="vaadin:volume-up"
      width="25"
      class="text-white volume drop-shadow-lg"
    />
  </label>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: number;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();

/* v-model 代理 */
const volume = computed({
  get: () => props.modelValue,
  set: (value: number) => {
    emit("update:modelValue", +value);
  },
});
</script>
<style lang="scss" scoped>
.slider {
  /* slider */
  --slider-width: 100%;
  --slider-height: 6px;
  --slider-bg: rgba(0, 0, 0, 0.1);
  --slider-border-radius: 999px;
  /* level */
  --level-color: rgba(255, 255, 255, 0.8);
  --level-transition-duration: 0.1s;
  /* icon */
  --icon-margin: 15px;
  --icon-color: var(--level-color);
  --icon-size: 25px;
}

.slider {
  cursor: pointer;
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: var(--icon-margin);
}

.slider .volume {
  display: inline-block;
  vertical-align: top;
  color: var(--icon-color);
  width: var(--icon-size);
  height: auto;
}

.slider .level {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: var(--slider-width);
  height: var(--slider-height);
  background: var(--slider-bg);
  overflow: hidden;
  border-radius: var(--slider-border-radius);
  -webkit-transition: height var(--level-transition-duration);
  -o-transition: height var(--level-transition-duration);
  transition: height var(--level-transition-duration);
  cursor: inherit;
}

.slider .level::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 0;
  height: 0;
  /* 用超大值覆盖整条轨道，避免宽度变化导致左边空白 */
  -webkit-box-shadow: -1000px 0 0 1000px var(--level-color);
  box-shadow: -1000px 0 0 1000px var(--level-color);
}

/* Firefox 已填充进度 */
.slider .level::-moz-range-progress {
  background: var(--level-color);
  height: var(--slider-height);
  border-radius: var(--slider-border-radius);
}

/* Firefox 轨道 */
.slider .level::-moz-range-track {
  background: var(--slider-bg);
  height: var(--slider-height);
  border-radius: var(--slider-border-radius);
}

.slider:hover .level {
  height: calc(var(--slider-height) * 2);
}
</style>
