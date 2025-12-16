export interface SpecialSlogan {
  date: string;   // YYYY-MM-DD
  text: string;
}

export interface CommonConfig {
  gap: number;
  slogn: string;
  size: number;
  specialSlogans: SpecialSlogan[];
}

export interface TimeConfig {
  is24Hour: boolean;
}

export interface CountdownConfig {
  targetTime: number;
  showFireworks: boolean;
  duration: number;
}

export type ModeType = "time" | "countdown";

export interface Settings {
  mode: ModeType;
  commonConfig: CommonConfig;
  timeConfig: TimeConfig;
  countdownConfig: CountdownConfig;
}
