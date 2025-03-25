export const MODEL = Object.freeze({
  DEEP_SEEK_V3: "deepseek-chat",
  DEEP_SEEK_R1: "deepseek-reasoner",
});

export function useAiModel() {
  const models = [
    {
      label: "DeepSeek V3",
      value: MODEL.DEEP_SEEK_V3,
    },
    {
      label: "DeepSeek R1",
      value: MODEL.DEEP_SEEK_R1,
    },
  ];

  const currentModel = ref(models[0]);

  const isDeepThinking = computed(() => {
    return currentModel.value.value === MODEL.DEEP_SEEK_R1;
  });

  return {
    currentModel,
    isDeepThinking,
    models,
  };
}
