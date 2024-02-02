import { IDayRatio } from "@/types";
import { compareObjectsWithoutProperty } from "@/utils";
import { defineStore } from "pinia";

const useDayRatio = defineStore(
  "dayRatio",
  () => {
    const list = ref<IDayRatio[]>([]);

    /**
     * 添加
     * @param {IDayRatio} item
     */
    const handleInsert = (item: IDayRatio): boolean => {
      const isExist = list.value.some((e) => e.id === item.id);
      if (!isExist) {
        list.value.push(item);
        return true;
      } else {
        return false;
      }
    };

    /**
     * 删除
     * @param {number} id
     */
    const handleRemove = (id: number): void => {
      console.log("%c Line:29 🥪 id", "color:#b03734", id);
      const index = list.value.findIndex((e) => e.id === id);
      console.log("%c Line:30 🥒 index", "color:#ed9ec7", index);
      if (index > -1) {
        list.value.splice(index, 1);
      }
    };

    /**
     * 更新
     * @param {IDayRatio} item
     *
     * @returns { User }
     */
    const handleUpdate = (item: IDayRatio): boolean => {
      const index = list.value.findIndex((e) => e.id === item.id);
      if (index > -1) {
        const rest = list.value.filter((e) => e.id !== item.id);
        const isExist = rest.some((e) =>
          compareObjectsWithoutProperty(e, item, "id")
        );

        if (!isExist) {
          list.value.splice(index, 1, item);
          return true;
        } else {
          ElMessage.error("该项目已存在");
        }
      }
      return false;
    };

    return { list, handleInsert, handleRemove, handleUpdate };
  },
  {
    persist: true,
  }
);
export default useDayRatio;
