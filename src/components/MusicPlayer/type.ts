export const PLAY: "play" = "play";
export const PAUSE: "pause" = "pause";
export const PREV: "prev" = "prev";
export const NEXT: "next" = "next";

export type Action = typeof PLAY | typeof PAUSE | typeof PREV | typeof NEXT;
