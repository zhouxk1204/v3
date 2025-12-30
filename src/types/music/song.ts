export interface SongSearchForm {
  title?: string;
  artistId?: string;
  albumId?: string;
}

export interface SongTableData {
  songId?: string;
  title: string;
  artistId: string;
  artistName: string;
  albumId?: string;
  releaseDate?: string;
  duration: number;
  coverImage?: string;
  filePath?: string | undefined;
}

export interface SongAddInfo {
  title: string;
  artistId: string;
  albumId?: string;
  duration: number;
  releaseDate?: string;
  coverImage?: string;
  filePath?: string | undefined;
}

export interface SongUpdateInfo{
  songId: string;
  title: string;
  artistId: string;
  albumId?: string;
  duration: number;
  releaseDate?: string;
  coverImage?: string;
  filePath?: string | undefined;
}


/**
 * 歌曲实体（后端返回的标准结构）
 */
export interface SongEntity {
  id: string;
  title: string;
  duration: number;

  albumId?: string;
  artistId?: string;
  genreId?: string;

  releaseDate?: string;

  fileUrl: string;
  coverUrl?: string;

  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  delFlag?: 0 | 1;

  /** 关联展示字段 */
  albumTitle?: string;
  artistName?: string;
}

/**
 * 歌曲列表项（表格使用，精简版）
 */
export interface SongListItem {
  id: string;
  title: string;
  duration: number;

  albumId?: string;
  artistId?: string;

  releaseDate?: string;

  fileUrl: string;
  coverUrl?: string;

  albumTitle?: string;
  artistName?: string;
}

/**
 * 歌曲列表查询参数
 */
export interface SongQueryParams {
  title?: string;
  albumId?: string;
  artistId?: string;
}

/**
 * 新增歌曲入参
 */
export interface SongCreatePayload {
  title: string;
  duration: number;

  albumId?: string;
  artistId?: string;
  genreId?: string;

  releaseDate?: string;

  fileUrl: string;
  coverUrl?: string;

  createdBy?: string;
}

/**
 * 更新歌曲入参
 */
export interface SongUpdatePayload {
  id: string;

  title: string;
  duration: number;

  albumId?: string;
  artistId?: string;
  genreId?: string;

  releaseDate?: string;

  fileUrl: string;
  coverUrl?: string;
}

/**
 * 歌曲表单提交（组件内部使用）
 * coverUrl / fileUrl 在新增时可能是 File
 */
export interface SongForm {
  id?: string;

  title: string;
  duration: number;

  albumId?: string;
  artistId?: string;
  genreId?: string;

  releaseDate?: string;

  fileUrl?: string;
  coverUrl?: string;
}

export interface SongFormSubmit {
  id?: string;

  title: string;
  duration: number;

  albumId?: string;
  artistId?: string;
  genreId?: string;

  releaseDate?: string;

  audioFile: File | null;
  coverFile: File | null;
}
