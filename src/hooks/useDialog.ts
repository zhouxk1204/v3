import { ref } from 'vue';

export function useDialog() {
  const isOpen = ref(false);

  function openDialog() {
    isOpen.value = true;
  }

  function closeDialog() {
    isOpen.value = false;
  }

  return {
    isOpen,
    openDialog,
    closeDialog,
  };
}