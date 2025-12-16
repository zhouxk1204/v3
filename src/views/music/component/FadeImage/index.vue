<template>
  <div class="fade-image">
    <!-- 旧图：稳定显示 -->
    <img
      v-if="oldSrc"
      :src="oldSrc"
      class="img old"
      :style="imgStyle"
    />

    <!-- 新图：负责动画 -->
    <img
      v-if="newSrc"
      :src="newSrc"
      class="img new"
      :class="{ show: showNew }"
      :style="imgStyle"
      @transitionend="onFadeEnd"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, type CSSProperties } from 'vue';

interface Props {
  src: string
  duration?: number
  fit?: CSSProperties['objectFit']
}

const props = withDefaults(defineProps<Props>(), {
  duration: 300,
  fit: 'cover'
})

const oldSrc = ref<string>('')   // 当前稳定显示的图
const newSrc = ref<string>('')   // 正在淡入的图
const showNew = ref<boolean>(false)

watch(
  () => props.src,
  (next: string) => {
    if (!next || next === newSrc.value || next === oldSrc.value) return

    const img = new Image()
    img.src = next

    img.onload = () => {
      // 新图准备好，开始淡入
      newSrc.value = next
      showNew.value = false

      // 触发 opacity 过渡
      requestAnimationFrame(() => {
        showNew.value = true
      })
    }
  },
  { immediate: true }
)

/**
 * 淡入结束：
 * 1. 新图转正 -> oldSrc
 * 2. 清空 newSrc
 * 3. 状态归位
 */
const onFadeEnd = (e: TransitionEvent) => {
  if (e.propertyName !== 'opacity') return
  if (!showNew.value) return

  oldSrc.value = newSrc.value
  newSrc.value = ''
  showNew.value = false
}

const imgStyle = computed<CSSProperties>(() => ({
  objectFit: props.fit,
  transition: `opacity ${props.duration}ms ease`
}))
</script>

<style scoped>
.fade-image {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.old {
  opacity: 1;
}

.new {
  opacity: 0;
}

.new.show {
  opacity: 1;
}
</style>
