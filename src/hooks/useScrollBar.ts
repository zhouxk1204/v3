import { onMounted, onUnmounted, ref } from "vue";

export function useScrollBar(domRef: Ref<HTMLElement | undefined>) {
  const isBottom = ref(false);

  const debounce = (func: Function, delay: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(), delay);
    };
  };

  const checkScrollbar = (): boolean => {
    if (!domRef.value) {
      return false;
    }
    return domRef.value.scrollHeight > domRef.value.clientHeight;
  };

  const checkBottom = () => {
    if (domRef.value) {
      const {
        scrollTop = 0,
        scrollHeight = 0,
        clientHeight = 0,
      } = domRef.value;
      console.log(scrollTop, scrollHeight, clientHeight);
      isBottom.value = scrollTop + clientHeight >= scrollHeight;
      console.log(isBottom.value);
    }
  };

  const debouncedCheckBottom = debounce(checkBottom, 10);

  onMounted(() => {
    domRef.value?.addEventListener("scroll", debouncedCheckBottom);
  });

  onUnmounted(() => {
    domRef.value?.removeEventListener("scroll", debouncedCheckBottom);
  });

  return {
    isBottom,
    checkScrollbar,
  };
}
