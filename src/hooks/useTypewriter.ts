import { computed, onMounted, ref, watch } from "vue";

export function useTypewriter(textToType: string[], delay: number) {
  const typedText = ref("");
  const currentIndex = ref(0);
  const currentLine = ref(0);
  let direction = ref(1); // 1 for forward, -1 for backward
  const cursorFlash = ref(false);

  const currentTextToType = computed(() => {
    return textToType[currentLine.value];
  });

  const typeText = () => {
    cursorFlash.value = false;
    if (
      currentIndex.value >= currentTextToType.value.length ||
      currentIndex.value < 0
    ) {
      direction.value *= -1; // Change directioù
    }

    if (currentIndex.value < 0) {
      currentIndex.value = 0;
    }

    if (direction.value === 1) {
      typedText.value += currentTextToType.value[currentIndex.value];
    } else {
      if (typedText.value.length > 0) {
        typedText.value = typedText.value.slice(0, -1);
      }
    }

    currentIndex.value += direction.value;
  };

  onMounted(() => {
    let timer = setInterval(typeText, delay);

    watch(currentIndex, () => {
      if (
        currentIndex.value === currentTextToType.value.length ||
        currentIndex.value === 0
      ) {
        clearInterval(timer);
        cursorFlash.value = true;
        const d = direction.value === 1 ? 80 : delay;

        if (currentIndex.value === 0) {
          if (currentLine.value === textToType.length - 1) {
            currentLine.value = 0;
          } else {
            currentLine.value = currentLine.value + 1;
          }
        }

        setTimeout(() => {
          timer = setInterval(typeText, d);
        }, 1500); // Wait for 1 second before restarting
      }
    });
  });

  return {
    typedText,
    cursorFlash,
  };
}
