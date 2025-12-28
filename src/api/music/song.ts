import { SongAddInfo, SongSearchForm, SongTableData, SongUpdateInfo } from "@/types/music/song";
import { http, ResponseData } from "../request";

/**
 * 歌曲列表查询
 */
export const getSongList = (params?: SongSearchForm) => {
  return http.get<ResponseData<SongTableData[]>>("/music/song/query", {
    params: params ?? {},
  });
};

/**
 * 新增歌曲
 */
export const addSongInfo = (body: SongAddInfo) => {
  return http.post<ResponseData<{}>>("/music/song/insert", body);
};

/**
 * 更新歌曲
 */
export const updateSongInfo = (body: SongUpdateInfo) => {
  return http.post<ResponseData<{}>>("/music/song/update", body);
};

/**
 * 删除歌曲
 */
export const deleteSong = (songId: string) => {
  return http.post<ResponseData<{}>>("/music/song/delete", {
    songId: songId,
  });
};
