/**
 * 歌手实体（后端返回的标准结构）
 */
export interface ArtistEntity {
  id: string;
  name: string;
  country?: string;
  birthDate?: string;
  bio?: string;
  avatarUrl?: string;
  createBy?: string;
  createdAt?: string;
  delFlag?: 0 | 1;
}

/**
 * 歌手列表项（表格使用，精简版）
 */
export interface ArtistListItem {
  id: string;
  name: string;
  country?: string;
  birthDate?: string;
  avatarUrl?: string;
}

/**
 * 歌手列表查询参数
 */
export interface ArtistQueryParams {
  name?: string;
  country?: string;
}

/**
 * 新增歌手入参
 */
export interface ArtistCreatePayload {
  name: string;
  country?: string;
  birthDate?: string;
  bio?: string;
  avatarUrl?: string;
  createBy?: string;
}

/**
 * 更新歌手入参
 */
export interface ArtistUpdatePayload {
  id: string;
  name: string;
  country?: string;
  birthDate?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface ArtistFormSubmit {
  id?: string;
  name: string;
  country?: string;
  birthDate?: string;
  avatarUrl?: string | File;
}