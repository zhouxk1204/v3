export interface AlbumSearchForm {
  title?: string;
  artistId?: string;
}

export interface AlbumTableData {
  albumId: string;
  title: string;
  artistId: string;
  coverImage: string;
  releaseDate: string;
}

export interface AlbumAddInfo {
  title: string;
  artistId: string;
  releaseDate?: string;
  coverImage?: string;
}

export interface AlbumUpdateInfo extends AlbumAddInfo {
  albumId: string;
}

export interface AlbumForm {
  title: string;
  artistId: string;
  releaseDate: string;
  description: string;
  coverImage: File | null;
}
