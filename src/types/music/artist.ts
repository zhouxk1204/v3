export interface ArtistSearchForm {
  name?: string;
  country?: string;
}

export interface ArtistTableData {
  artist_id: number;
  name: string;
  country: string;
  birth_date: string;
  avatar: string;
  created_at: string;
}

export interface ArtistAddInfo {
  name: string;
  country?: string;
  birth_date?: string;
  bio?: string;
  avatar?: string;
}

export interface ArtistUpdateInfo extends ArtistAddInfo {
  artist_id: number;
}
