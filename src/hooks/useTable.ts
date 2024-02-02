import * as _ from "lodash";

export function useTable<T>() {
  const editRowTemp = ref<T>();
  const editRowIndex = ref(-1);

  /**
   * 表格行编辑
   * @params {number} index
   * @params {T} row
   */
  const edit = (index: number, row: T): void => {
    editRowTemp.value = _.cloneDeep(row);
    editRowIndex.value = index;
  };

  /**
   * 表格行取消编辑
   */
  const cancel = (): void => {
    editRowIndex.value = -1;
  };

  return {
    editRowTemp,
    editRowIndex,
    edit,
    cancel,
  };
}
