export interface SongSearchForm {
  title?: string;
  artist_id?: number;
  album_id?: number;
}

export interface SongTableData {
  song_id: number;
  title: string;
  duration: number;
  artist_id: number;
  album_id: number;
  cover_image: string;
  file_path: string;
}

export interface SongAddInfo {
  title: string;
  artist_id: number;
  album_id?: number;
  genre_id?: number;
  duration: number;
  release_date?: string;
  cover_image?: string;
  file_path: string;
}

export interface SongUpdateInfo extends SongAddInfo {
  song_id: number;
}
