import { defineStore } from "pinia";
import { ref } from "vue";

import {
  addArtistInfo,
  deleteArtist,
  getArtistList,
  updateArtistInfo,
} from "@/api/music/artist";

import type {
  ArtistAddInfo,
  ArtistSearchForm,
  ArtistTableData,
  ArtistUpdateInfo,
} from "@/types/music/artist";

export const useArtistStore = defineStore(
  "artist",
  () => {
    /** 歌手列表 */
    const artistList = ref<ArtistTableData[]>([]);

    /** 选中行 */
    const selectedIds = ref<string[]>([]);

    /** 获取列表 */
    const fetchArtistList = async (search?: ArtistSearchForm) => {
      const res = await getArtistList(search || {});
      artistList.value = res.data;
      selectedIds.value = [];
    };

    /** 新增 */
    const addArtist = async (data: ArtistAddInfo) => {
      await addArtistInfo(data);
      await fetchArtistList();
    };

    /** 编辑 */
    const updateArtist = async (data: ArtistUpdateInfo) => {
      await updateArtistInfo(data);
      await fetchArtistList();
    };

    /** 删除 */
    const removeArtist = async (ids: string[]) => {
      await deleteArtist(ids);
      await fetchArtistList();
    };

    /** 根据 id 找歌手 */
    const getArtistById = (id: string) =>
      artistList.value.find((i) => i.artistId === id);

    return {
      artistList,
      selectedIds,

      fetchArtistList,
      addArtist,
      updateArtist,
      removeArtist,
      getArtistById,
    };
  },
  {
    persist: true,
  }
);
