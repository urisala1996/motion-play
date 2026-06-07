import type { ScaleName, RootNote } from '../types';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

// Semitone offsets from root
const SCALES: Record<ScaleName, number[]> = {
  'Major': [0, 2, 4, 5, 7, 9, 11, 12],
  'Minor': [0, 2, 3, 5, 7, 8, 10, 12],
  'Pentatonic Major': [0, 2, 4, 7, 9, 12, 14, 16],
  'Pentatonic Minor': [0, 3, 5, 7, 10, 12, 15, 17],
  'Blues': [0, 3, 5, 6, 7, 10, 12, 15],
  'Dorian': [0, 2, 3, 5, 7, 9, 10, 12],
  'Phrygian': [0, 1, 3, 5, 7, 8, 10, 12],
  'Lydian': [0, 2, 4, 6, 7, 9, 11, 12],
};

function getRootMIDI(root: RootNote): number {
  const index = NOTES.indexOf(root);
  return 60 + index; // C4
}

export function getNoteFrequency(scaleIndex: number, scale: ScaleName, root: RootNote, octaveOffset = 0): string {
  const scaleIntervals = SCALES[scale];
  if (scaleIndex < 0 || scaleIndex >= scaleIntervals.length) {
    return 'C4';
  }

  const rootMIDI = getRootMIDI(root);
  const semitones = scaleIntervals[scaleIndex] + octaveOffset * 12;
  const midi = rootMIDI + semitones;

  return midiToNote(midi);
}

function midiToNote(midi: number): string {
  const noteIndex = midi % 12;
  const octave = Math.floor(midi / 12) - 1;
  return `${NOTES[noteIndex]}${octave}`;
}

export function getScaleNotes(scale: ScaleName, root: RootNote): string[] {
  const offsets = SCALES[scale];
  const rootMIDI = getRootMIDI(root);
  return offsets.map((offset) => midiToNote(rootMIDI + offset));
}

export const SCALE_NAMES = Object.keys(SCALES) as ScaleName[];
export const ROOT_NOTES = NOTES as unknown as RootNote[];
