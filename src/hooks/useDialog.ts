import { MODE_DIALOG } from "@/constants";
import { ref } from "vue";

export function useDialog() {
  const isOpen = ref(false);
  const mode = ref(MODE_DIALOG.CREATE);

  function openDialog(isCreate: boolean = true) {
    isOpen.value = true;
    mode.value = isCreate ? MODE_DIALOG.CREATE : MODE_DIALOG.UPDATE;
  }

  function closeDialog() {
    isOpen.value = false;
  }

  return {
    mode,
    isOpen,
    openDialog,
    closeDialog,
  };
}
