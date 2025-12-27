<template>
  <div
    ref="sliderRef"
    class="w-screen h-screen overflow-hidden bg-black text-white select-none cursor-grab active:cursor-grabbing"
    @mousedown="onMouseDown"
  >
    <div
      class="flex h-full will-change-transform gap-10"
      :style="{ transform: `translate3d(${state.currentX}px,0,0)` }"
    >
      <div
        v-for="(item, i) in slides"
        :key="i"
        ref="slideRefs"
        class="relative w-[360px] h-[500px] shrink-0 top-1/2 -translate-y-1/2 group"
      >
        <!-- image -->
        <div class="w-full h-full overflow-hidden">
          <div
            class="w-full h-full will-change-transform"
            :style="{
              transform: `translate3d(${item.parallax}px,0,0) scale(${SCALE})`,
            }"
          >
            <img
              :src="item.img"
              :alt="item.title"
              class="w-full h-full object-cover pointer-events-none"
              draggable="false"
            />
          </div>
        </div>

        <!-- overlay -->
        <div
          class="absolute -bottom-7 left-0 right-0 flex justify-between text-xs uppercase tracking-wider opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <span>{{ item.title }}</span>
          <span>↗</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from "vue";

/* ---------------- data ---------------- */

const baseSlides = [
  { title: "Project 01", img: "https://picsum.photos/1000/600?1", url: "#" },
  { title: "Project 02", img: "https://picsum.photos/1000/600?2", url: "#" },
  { title: "Project 03", img: "https://picsum.photos/1000/600?3", url: "#" },
  { title: "Project 04", img: "https://picsum.photos/1000/600?4", url: "#" },
  { title: "Project 05", img: "https://picsum.photos/1000/600?5", url: "#" },
];

const COPIES = 5;
const SCALE = 2.2;

/* motion tuning */
const LERP = 0.08;
const FRICTION = 0.95;
const STOP_EPSILON = 0.1;
const DRAG_FACTOR = 2;

/* ---------------- refs ---------------- */

const sliderRef = ref<HTMLElement | null>(null);
const slideRefs = ref<HTMLElement[]>([]);

const slides = reactive(
  Array.from({ length: baseSlides.length * COPIES }, (_, i) => ({
    ...baseSlides[i % baseSlides.length],
    parallax: 0,
  }))
);

/* ---------------- state ---------------- */

const state = reactive({
  currentX: 0,
  targetX: 0,
  isDragging: false,

  lastX: 0,
  velocity: 0,
  isInertia: false,
});

/* ---------------- geometry ---------------- */

const slideWidth = ref(0);
const sequenceWidth = ref(0);

/* ---------------- core animation ---------------- */

const animate = () => {
  // inertia
  if (state.isInertia && !state.isDragging) {
    state.velocity *= FRICTION;
    state.targetX += state.velocity;

    if (Math.abs(state.velocity) < STOP_EPSILON) {
      state.velocity = 0;
      state.isInertia = false;
    }
  }

  // smooth follow
  state.currentX += (state.targetX - state.currentX) * LERP;

  // infinite loop
  const minX = -sequenceWidth.value * (COPIES - 2);
  const maxX = -sequenceWidth.value;

  if (state.currentX > maxX) {
    state.currentX -= sequenceWidth.value;
    state.targetX -= sequenceWidth.value;
  } else if (state.currentX < minX) {
    state.currentX += sequenceWidth.value;
    state.targetX += sequenceWidth.value;
  }

  updateParallax();
  requestAnimationFrame(animate);
};

/* ---------------- full parallax ---------------- */

const updateParallax = () => {
  const vw = window.innerWidth;

  slideRefs.value.forEach((el, i) => {
    const rect = el.getBoundingClientRect();

    // skip far offscreen
    if (rect.right < -100 || rect.left > vw + 100) return;

    // progress: 0 → 1
    const progress = (rect.left + rect.width) / (vw + rect.width);
    const clamped = Math.min(Math.max(progress, 0), 1);

    const maxOffset = rect.width * (SCALE - 1) * 0.5;

    slides[i].parallax = maxOffset - clamped * maxOffset * 2;
  });
};

/* ---------------- drag ---------------- */

const onMouseDown = (e: MouseEvent) => {
  state.isDragging = true;
  state.isInertia = false;
  state.velocity = 0;

  state.lastX = e.clientX;

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
};

const onMouseMove = (e: MouseEvent) => {
  if (!state.isDragging) return;

  const delta = (e.clientX - state.lastX) * DRAG_FACTOR;
  state.targetX += delta;
  state.velocity = delta;

  state.lastX = e.clientX;
};

const onMouseUp = () => {
  state.isDragging = false;
  state.isInertia = true;

  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);
};

/* ---------------- lifecycle ---------------- */

onMounted(async () => {
  await nextTick();

  // measure real slide width (include gap-10 = 40px)
  const first = slideRefs.value[0];
  slideWidth.value = first.offsetWidth + 40;
  sequenceWidth.value = baseSlides.length * slideWidth.value;

  state.currentX = -sequenceWidth.value * 2;
  state.targetX = state.currentX;

  animate();
});

onUnmounted(() => {
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);
});
</script>
