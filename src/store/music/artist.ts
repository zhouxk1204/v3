import { defineStore } from "pinia";
import { ref } from "vue";

import {
  ArtistCreatePayload,
  ArtistListItem,
  ArtistQueryParams,
  ArtistUpdatePayload,
} from "@/types/music/artist";

import {
  createArtist,
  deleteArtists,
  fetchArtistList,
  updateArtist,
} from "@/api/music/artist";

export const useArtistStore = defineStore(
  "artist",
  () => {
    /** 歌手列表（表格数据） */
    const artistList = ref<ArtistListItem[]>([]);

    /** 选中行 ID */
    const selectedIds = ref<string[]>([]);

    /** 查询列表 */
    const loadArtistList = async (params?: ArtistQueryParams) => {
      const res = await fetchArtistList(params ?? {});
      artistList.value = res.data;
      selectedIds.value = [];
    };

    /** 新增歌手 */
    const addArtist = async (payload: ArtistCreatePayload) => {
      await createArtist(payload);
      await loadArtistList();
    };

    /** 更新歌手 */
    const editArtist = async (payload: ArtistUpdatePayload) => {
      await updateArtist(payload);
      await loadArtistList();
    };

    /** 删除歌手（批量） */
    const removeArtists = async (ids: string[]) => {
      if (!ids.length) return;
      await deleteArtists(ids);
      await loadArtistList();
    };

    /** 根据 id 获取歌手（列表内查） */
    const getArtistById = (id: string) => {
      return artistList.value.find((item) => item.id === id);
    };

    return {
      artistList,
      selectedIds,

      loadArtistList,
      addArtist,
      editArtist,
      removeArtists,
      getArtistById,
    };
  },
  {
    persist: true,
  }
);
