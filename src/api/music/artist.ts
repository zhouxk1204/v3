import { ArtistAddInfo, ArtistSearchForm, ArtistTableData, ArtistUpdateInfo } from "@/types/music/artist";
import { http, ResponseData } from "../request";

/**
 * 歌手列表查询
 */
export const getArtistList = (params?: ArtistSearchForm): Promise<ResponseData<ArtistTableData[]>> => {
  return http.get<ResponseData<ArtistTableData[]>>("/music/artist/query", {
    params: params ?? {},
  });
};

/**
 * 新增歌手
 */
export const addArtistInfo = (body: ArtistAddInfo) => {
  return http.post<ResponseData<{}>>("/music/artist/insert", body);
};

/**
 * 更新歌手
 */
export const updateArtistInfo = (body: ArtistUpdateInfo) => {
  return http.post<ResponseData<{}>>("/music/artist/update", body);
};

/**
 * 删除歌手
 */
export const deleteArtist = (artistIds: string[]) => {
  return http.post<ResponseData<{}>>("/music/artist/delete", {
    artistIds,
  });
};
