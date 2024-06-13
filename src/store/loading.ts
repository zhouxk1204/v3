import { defineStore } from "pinia";

const useLoadingStore = defineStore("loading", () => {
  const isLoading = ref<boolean>(false);

  const setLoading = (status: boolean) => {
    isLoading.value = status;
  };
  return {
    isLoading,
    setLoading,
  };
});

export default useLoadingStore;
