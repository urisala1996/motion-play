import type { DrumPackName } from '../types';

export interface DrumVoiceConfig {
  type: 'membrane' | 'noise' | 'metal' | 'fm' | 'synth';
  note?: string;
  decay?: number;
  sustain?: number;
  release?: number;
  frequency?: number;
  envelope?: { attack: number; decay: number; sustain: number; release: number };
  effects?: string[];
}

export interface DrumPackConfig {
  kick: DrumVoiceConfig;
  snare: DrumVoiceConfig;
  closedHH: DrumVoiceConfig;
  openHH: DrumVoiceConfig;
  clap: DrumVoiceConfig;
  perc: DrumVoiceConfig;
}

export const DRUM_PACKS: Record<DrumPackName, DrumPackConfig> = {
  '808 Classic': {
    kick: {
      type: 'membrane',
      note: 'C1',
      decay: 0.8,
      sustain: 0,
      release: 0.1,
    },
    snare: {
      type: 'noise',
      decay: 0.2,
      sustain: 0,
      release: 0.1,
    },
    closedHH: {
      type: 'metal',
      decay: 0.05,
      sustain: 0,
      release: 0.05,
    },
    openHH: {
      type: 'metal',
      decay: 0.5,
      sustain: 0.2,
      release: 0.2,
    },
    clap: {
      type: 'noise',
      decay: 0.15,
      sustain: 0,
      release: 0.1,
    },
    perc: {
      type: 'fm',
      note: 'G2',
      decay: 0.3,
      sustain: 0,
      release: 0.1,
    },
  },
  'Electronic': {
    kick: {
      type: 'fm',
      note: 'C1',
      decay: 0.6,
      sustain: 0,
      release: 0.05,
      effects: ['distortion'],
    },
    snare: {
      type: 'noise',
      decay: 0.15,
      sustain: 0,
      release: 0.08,
      effects: ['distortion'],
    },
    closedHH: {
      type: 'metal',
      decay: 0.04,
      sustain: 0,
      release: 0.04,
    },
    openHH: {
      type: 'metal',
      decay: 0.3,
      sustain: 0.3,
      release: 0.15,
    },
    clap: {
      type: 'noise',
      decay: 0.1,
      sustain: 0,
      release: 0.08,
      effects: ['distortion'],
    },
    perc: {
      type: 'synth',
      note: 'A2',
      decay: 0.25,
      sustain: 0,
      release: 0.08,
    },
  },
  'Lo-fi': {
    kick: {
      type: 'membrane',
      note: 'C1',
      decay: 0.9,
      sustain: 0,
      release: 0.1,
      effects: ['bitcrusher'],
    },
    snare: {
      type: 'noise',
      decay: 0.25,
      sustain: 0,
      release: 0.12,
      effects: ['bitcrusher'],
    },
    closedHH: {
      type: 'metal',
      decay: 0.08,
      sustain: 0,
      release: 0.06,
      effects: ['bitcrusher'],
    },
    openHH: {
      type: 'metal',
      decay: 0.6,
      sustain: 0.1,
      release: 0.3,
      effects: ['chorus'],
    },
    clap: {
      type: 'noise',
      decay: 0.2,
      sustain: 0,
      release: 0.1,
      effects: ['bitcrusher'],
    },
    perc: {
      type: 'synth',
      note: 'F2',
      decay: 0.35,
      sustain: 0,
      release: 0.15,
      effects: ['chorus'],
    },
  },
  'Tribal': {
    kick: {
      type: 'membrane',
      note: 'G0',
      decay: 1.2,
      sustain: 0.1,
      release: 0.2,
    },
    snare: {
      type: 'noise',
      decay: 0.3,
      sustain: 0,
      release: 0.15,
    },
    closedHH: {
      type: 'noise',
      decay: 0.12,
      sustain: 0,
      release: 0.08,
    },
    openHH: {
      type: 'metal',
      decay: 0.8,
      sustain: 0.2,
      release: 0.4,
      effects: ['reverb'],
    },
    clap: {
      type: 'noise',
      decay: 0.25,
      sustain: 0,
      release: 0.12,
    },
    perc: {
      type: 'membrane',
      note: 'D2',
      decay: 0.5,
      sustain: 0,
      release: 0.2,
      effects: ['reverb'],
    },
  },
  'Glitch Future': {
    kick: {
      type: 'fm',
      note: 'C1',
      decay: 0.7,
      sustain: 0,
      release: 0.08,
      effects: ['pitchShift'],
    },
    snare: {
      type: 'noise',
      decay: 0.12,
      sustain: 0,
      release: 0.06,
      effects: ['distortion', 'pitchShift'],
    },
    closedHH: {
      type: 'metal',
      decay: 0.06,
      sustain: 0,
      release: 0.04,
    },
    openHH: {
      type: 'fm',
      note: 'B4',
      decay: 0.5,
      sustain: 0.3,
      release: 0.2,
      effects: ['reverb'],
    },
    clap: {
      type: 'noise',
      decay: 0.08,
      sustain: 0,
      release: 0.05,
      effects: ['distortion'],
    },
    perc: {
      type: 'fm',
      note: 'F#3',
      decay: 0.3,
      sustain: 0,
      release: 0.1,
      effects: ['pitchShift', 'reverb'],
    },
  },
};

export const PACK_NAMES: DrumPackName[] = Object.keys(DRUM_PACKS) as DrumPackName[];
