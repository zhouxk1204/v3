<template>
  <div class="title-mask" ref="maskRef">
    <div class="title-track" ref="trackRef">
      <span class="title" ref="titleRef">{{ title }}</span>
      <span v-if="isOverflow" class="title clone">{{ title }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import gsap from 'gsap';
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  title: string
}>()

const maskRef = ref<HTMLDivElement | null>(null)
const trackRef = ref<HTMLDivElement | null>(null)
const titleRef = ref<HTMLSpanElement | null>(null)
const isOverflow = ref(false)

let tl: gsap.core.Timeline | null = null

const startMarquee = async () => {
  await nextTick()
  if (!maskRef.value || !trackRef.value || !titleRef.value) return

  const maskWidth = maskRef.value.clientWidth
  const titleWidth = titleRef.value.scrollWidth

  // 不溢出就不滚
  if (titleWidth <= maskWidth) {
    isOverflow.value = false
    tl?.kill()
    tl = null
    gsap.set(trackRef.value, { x: 0 })
    return
  }

  isOverflow.value = true

  const gap = 40
  const speed = 40 // px/s
  const pause = 0.9

  const distance = titleWidth + gap

  tl?.kill()
  tl = gsap.timeline({ repeat: -1 })

  tl.to(trackRef.value, {
    x: -distance,
    duration: distance / speed,
    ease: 'none'
  })
    .to(trackRef.value, { duration: pause })
    .set(trackRef.value, { x: 0 })
    .to(trackRef.value, { duration: pause })
}

onMounted(startMarquee)
watch(() => props.title, startMarquee)
onBeforeUnmount(() => tl?.kill())
</script>

<style scoped>
.title-mask {
  overflow: hidden;
  white-space: nowrap;
  /* width: 100%; */
}

.title-track {
  display: inline-flex;
  gap: 40px;
  will-change: transform;
}

.title {
  white-space: nowrap;
  font-weight: 600;
  font-size: 18px;
}

.clone {
  opacity: 0.85;
}
</style>
