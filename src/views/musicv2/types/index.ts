
export interface AudioMeta {
  title: string;
  artist: string;
  cover: string;
  url: string;
}

export const EMPTY_AUDIO_META = {
  title: "UNKNOWN",
  artist: "UNKNOWN",
  cover: "",
  url: "",
};
