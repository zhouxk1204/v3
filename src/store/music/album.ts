import { defineStore } from "pinia";
import { ref } from "vue";

import { deleteAlbum, getAlbumList } from "@/api/music/album";
import type { AlbumSearchForm, AlbumTableData } from "@/types/music/album";

export const useAlbumStore = defineStore(
  "album",
  () => {
    /** 专辑列表 */
    const albumList = ref<AlbumTableData[]>([]);

    /** 选中行 */
    const selectedIds = ref<string[]>([]);

    /** 查询条件（可选缓存） */
    const searchForm = ref<AlbumSearchForm>({
      title: "",
      artistId: undefined,
    });

    /** 获取列表 */
    const fetchAlbumList = async (params?: AlbumSearchForm) => {
      if (params) {
        searchForm.value = { ...params };
      }
      const res = await getAlbumList(searchForm.value);
      albumList.value = res.data;
      selectedIds.value = [];
    };

    /** 删除 */
    const removeAlbum = async (ids: string[]) => {
      await deleteAlbum(ids);
      await fetchAlbumList();
    };

    /** 根据 id 获取 */
    const getAlbumById = (id: string) =>
      albumList.value.find((i) => i.albumId === id) || null;

    return {
      albumList,
      selectedIds,
      searchForm,

      fetchAlbumList,
      removeAlbum,
      getAlbumById,
    };
  },
  {
    persist: true,
  }
);
