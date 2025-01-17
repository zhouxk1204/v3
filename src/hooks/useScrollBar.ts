import { onMounted, onUnmounted, ref } from "vue";

export function useScrollBar(domRef: HTMLElement | undefined) {
  const isBottom = ref(false);

  const debounce = (func: Function, delay: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(), delay);
    };
  };

  const checkScrollbar = (): boolean => {
    if (!domRef) {
      return false;
    }
    return domRef.scrollHeight > domRef.clientHeight;
  };

  const checkBottom = () => {
    if (domRef) {
      const { scrollTop = 0, scrollHeight = 0, clientHeight = 0 } = domRef;
      isBottom.value = scrollTop + clientHeight >= scrollHeight;
    }
  };

  const debouncedCheckBottom = debounce(checkBottom, 10);

  onMounted(() => {
    console.log("domRef", domRef);
    if (domRef) {
      domRef.addEventListener("scroll", debouncedCheckBottom);
      window.addEventListener("resize", debouncedCheckBottom);
    }
  });

  onUnmounted(() => {
    if (domRef) {
      domRef.removeEventListener("scroll", debouncedCheckBottom);
      window.removeEventListener("resize", debouncedCheckBottom);
    }
  });

  return {
    isBottom,
    checkScrollbar,
  };
}
