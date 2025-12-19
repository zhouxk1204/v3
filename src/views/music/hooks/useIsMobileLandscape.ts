import { onMounted, onUnmounted, ref } from 'vue';

export function useIsMobileLandscape(breakpoint = 768) {
  const isMobileLandscape = ref(false)

  const update = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    isMobileLandscape.value = h < breakpoint && w > h
  }

  onMounted(() => {
    update()
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', update)
    window.removeEventListener('orientationchange', update)
  })

  return isMobileLandscape
}
