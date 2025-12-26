export interface AlbumSearchForm {
  title?: string;
  artistId?: number;
}

export interface AlbumTableData {
  albumId: number;
  title: string;
  artistId: number;
  coverImage: string;
  releaseDate: string;
}

export interface AlbumAddInfo {
  title: string;
  artistId: number;
  releaseDate?: string;
  coverImage?: string;
}

export interface AlbumUpdateInfo extends AlbumAddInfo {
  albumId: number;
}

export interface AlbumForm {
  title: string;
  artistId: number | null;
  releaseDate: string;
  description: string;
  coverImage: File | null;
}
