import {
  ArtistCreatePayload,
  ArtistListItem,
  ArtistQueryParams,
  ArtistUpdatePayload,
} from "@/types/music/artist";
import { http, ResponseData } from "../request";

/**
 * 获取歌手列表
 */
export const fetchArtistList = (
  params?: ArtistQueryParams
): Promise<ResponseData<ArtistListItem[]>> => {
  return http.get("/music/artist/query", {
    params: params ?? {},
  });
};

/**
 * 创建歌手
 */
export const createArtist = (
  payload: ArtistCreatePayload
): Promise<ResponseData<void>> => {
  return http.post("/music/artist/insert", payload);
};

/**
 * 更新歌手
 */
export const updateArtist = (
  payload: ArtistUpdatePayload
): Promise<ResponseData<void>> => {
  return http.post("/music/artist/update", payload);
};

/**
 * 删除歌手（批量）
 */
export const deleteArtists = (
  ids: string[]
): Promise<ResponseData<void>> => {
  return http.post("/music/artist/delete", { ids });
};
