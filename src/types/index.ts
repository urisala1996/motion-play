export interface TriggerEvent {
  zone: number;
  velocity: number;
  timestamp: number;
  ax: number;
  ay: number;
}

export interface MotionData {
  magnitude: number;
  ax: number;
  ay: number;
  az: number;
  filtered: boolean;
}

export type DrumPackName = '808 Classic' | 'Electronic' | 'Lo-fi' | 'Tribal' | 'Glitch Future';

export type ScaleName = 'Major' | 'Minor' | 'Pentatonic Major' | 'Pentatonic Minor' | 'Blues' | 'Dorian' | 'Phrygian' | 'Lydian';

export type RootNote = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

export const NOTE_VALUES: Record<RootNote, number> = {
  'C': 0,
  'C#': 1,
  'D': 2,
  'D#': 3,
  'E': 4,
  'F': 5,
  'F#': 6,
  'G': 7,
  'G#': 8,
  'A': 9,
  'A#': 10,
  'B': 11,
};
