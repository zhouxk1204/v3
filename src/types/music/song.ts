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
  // genre_id?: string;
  releaseDate?: string;
  duration: number;
  coverImage?: string;
  filePath?: string | undefined;
}

export interface SongAddInfo {
  title: string;
  artistId: string;
  albumId?: string;
  // genre_id?: string;
  duration: number;
  releaseDate?: string;
  coverImage?: string;
  filePath: string | undefined;
}

export interface SongUpdateInfo extends SongAddInfo {
  songId: string;
}
