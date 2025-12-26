import { computed, ref } from "vue";

export function useCrud<T extends { id: number }>() {
  const tableData = ref<T[]>([]);
  const selectedIds = ref<number[]>([]);
  const loading = ref(false);

  const isSingleSelected = computed(() => selectedIds.value.length === 1);
  const selectedRow = computed(() =>
    tableData.value.find((i) => i.id === selectedIds.value[0])
  );

  const resetSelection = () => {
    selectedIds.value = [];
  };

  return {
    tableData,
    selectedIds,
    loading,
    isSingleSelected,
    selectedRow,
    resetSelection,
  };
}
