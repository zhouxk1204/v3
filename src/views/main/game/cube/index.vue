<template>
  <div class="rubiks-cube">
    <div class="face" v-for="(face, index) in cube.faces" :key="index">
      <div v-for="(row, rowIndex) in face" :key="rowIndex" class="row">
        <div
          v-for="(color, colIndex) in row"
          :key="colIndex"
          class="cubelet"
          :style="{ backgroundColor: color }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "RubiksCube",
  setup() {
    // Initial state of the Rubik's Cube
    const cube = ref({
      faces: [
        [
          ["#ff0000", "#ff0000", "#ff0000"],
          ["#ff0000", "#ff0000", "#ff0000"],
          ["#ff0000", "#ff0000", "#ff0000"],
        ],
        [
          ["#00ff00", "#00ff00", "#00ff00"],
          ["#00ff00", "#00ff00", "#00ff00"],
          ["#00ff00", "#00ff00", "#00ff00"],
        ],
        [
          ["#0000ff", "#0000ff", "#0000ff"],
          ["#0000ff", "#0000ff", "#0000ff"],
          ["#0000ff", "#0000ff", "#0000ff"],
        ],
        [
          ["#ffff00", "#ffff00", "#ffff00"],
          ["#ffff00", "#ffff00", "#ffff00"],
          ["#ffff00", "#ffff00", "#ffff00"],
        ],
        [
          ["#ff6600", "#ff6600", "#ff6600"],
          ["#ff6600", "#ff6600", "#ff6600"],
          ["#ff6600", "#ff6600", "#ff6600"],
        ],
        [
          ["#cccccc", "#cccccc", "#cccccc"],
          ["#cccccc", "#cccccc", "#cccccc"],
          ["#cccccc", "#cccccc", "#cccccc"],
        ],
      ],
    });

    return {
      cube,
    };
  },
});
</script>

<style scoped>
.rubiks-cube {
  width: 160px;
  height: 160px;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  perspective: 800px;
  transform-style: preserve-3d;
}

.face {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  grid-column: 3;
  grid-row: 3;
  transform-style: preserve-3d;
}

.row {
  display: flex;
  flex: 1;
}

.cubelet {
  flex: 1;
  margin: 2px;
  box-sizing: border-box;
}
</style>
