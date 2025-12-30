import type {
  SongCreatePayload,
  SongListItem,
  SongQueryParams,
  SongUpdatePayload
} from "@/types/music/song";
import { http, ResponseData } from "../request";

/**
 * 歌曲列表查询
 */
export const querySongList = (
  params?: SongQueryParams
): Promise<ResponseData<SongListItem[]>> => {
  return http.get("/music/song/query", {
    params: params ?? {},
  });
};

/**
 * 新增歌曲
 */
export const createSong = (
  body: SongCreatePayload
): Promise<ResponseData<{}>> => {
  return http.post("/music/song/insert", body);
};

/**
 * 更新歌曲
 */
export const updateSong = (
  body: SongUpdatePayload
): Promise<ResponseData<{}>> => {
  return http.post("/music/song/update", body);
};

/**
 * 删除歌曲（批量）
 */
export const deleteSongs = (
  ids: string[]
): Promise<ResponseData<{}>> => {
  return http.post("/music/song/delete", {
    ids,
  });
};
