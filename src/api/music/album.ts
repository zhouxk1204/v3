import { AlbumAddInfo, AlbumSearchForm, AlbumTableData, AlbumUpdateInfo } from "@/types/music/album";
import { http, ResponseData } from "../request";

/**
 * 专辑列表查询
 */
export const getAlbumList = (params?: AlbumSearchForm) => {
  return http.get<ResponseData<AlbumTableData[]>>("/music/album/query", {
    params: params ?? {},
  });
};

/**
 * 新增专辑
 */
export const addAlbumInfo = (body: AlbumAddInfo) => {
  return http.post<ResponseData<{}>>("/music/album/insert", body);
};

/**
 * 更新专辑
 */
export const updateAlbumInfo = (body: AlbumUpdateInfo) => {
  return http.post<ResponseData<{}>>("/music/album/update", body);
};

/**
 * 删除专辑
 */
export const deleteAlbum = (albumIds: number[]) => {
  return http.post<ResponseData<{}>>("/music/album/delete", {
    album_id: albumIds.join(","),
  });
};
