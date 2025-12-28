export interface ArtistSearchForm {
  name?: string;
  country?: string;
}

export interface ArtistTableData {
  artistId: string;
  name: string;
  country: string;
  birthDate: string;
  avatar: string;
}

export interface ArtistAddInfo {
  name: string;
  country?: string;
  birthDate?: string;
  bio?: string;
  avatar?: string;
}

export interface ArtistUpdateInfo extends ArtistAddInfo {
  artistId: string;
}
