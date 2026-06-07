import * as Tone from 'tone';
import { DRUM_PACKS } from './drumPacks';
import type { DrumPackName } from '../types';

const DRUM_VOICES = ['kick', 'snare', 'closedHH', 'openHH', 'clap', 'perc'] as const;
const DRUM_COLORS = {
  kick: '#ef4444',
  snare: '#f97316',
  closedHH: '#eab308',
  openHH: '#22c55e',
  clap: '#06b6d4',
  perc: '#a855f7',
};

export type DrumVoice = typeof DRUM_VOICES[number];

class RhythmEngine {
  private synths: Map<DrumVoice, any> = new Map();
  private currentPack: DrumPackName = '808 Classic';
  private compressor: Tone.Compressor;
  private master: Tone.Volume;

  constructor() {
    this.master = new Tone.Volume(0).connect(Tone.Destination);
    this.compressor = new Tone.Compressor(-30, 3).connect(this.master);
    this.initializeSynths('808 Classic');
  }

  private initializeSynths(packName: DrumPackName) {
    const packConfig = DRUM_PACKS[packName];

    // Clean up old synths
    this.synths.forEach((synth) => {
      synth.dispose();
    });
    this.synths.clear();

    // Create new synths based on pack
    DRUM_VOICES.forEach((voice) => {
      const config = packConfig[voice];
      let synth: any;

      if (config.type === 'membrane') {
        synth = new Tone.MembraneSynth({
          pitchDecay: 0.08,
          octaves: 2,
          envelope: {
            attack: 0.001,
            decay: config.decay || 0.4,
            sustain: config.sustain || 0,
            release: config.release || 0.1,
          },
        });
      } else if (config.type === 'noise') {
        synth = new Tone.NoiseSynth({
          envelope: {
            attack: 0.001,
            decay: config.decay || 0.2,
            sustain: config.sustain || 0,
            release: config.release || 0.1,
          },
        });
      } else if (config.type === 'metal') {
        synth = new Tone.MetalSynth({
          harmonicity: 12,
          resonance: 3000,
          envelope: {
            attack: 0.001,
            decay: config.decay || 0.1,
            release: config.release || 0.05,
          },
        });
      } else if (config.type === 'fm') {
        synth = new Tone.FMSynth({
          envelope: {
            attack: 0.001,
            decay: config.decay || 0.4,
            sustain: config.sustain || 0,
            release: config.release || 0.1,
          },
        });
      } else {
        synth = new Tone.Synth({
          envelope: {
            attack: 0.001,
            decay: config.decay || 0.3,
            sustain: config.sustain || 0,
            release: config.release || 0.1,
          },
        });
      }

      synth.connect(this.compressor);
      this.synths.set(voice, synth);
    });
  }

  async setCurrentPack(packName: DrumPackName) {
    this.currentPack = packName;
    this.initializeSynths(packName);
  }

  getCurrentPack() {
    return this.currentPack;
  }

  trigger(zone: number) {
    const voice = DRUM_VOICES[zone % DRUM_VOICES.length];
    const synth = this.synths.get(voice);
    if (!synth) return;

    const packConfig = DRUM_PACKS[this.currentPack];
    const config = packConfig[voice];

    // Trigger the synth based on type
    if (config.type === 'noise') {
      synth.triggerAttackRelease('16n');
    } else if (config.note) {
      synth.triggerAttackRelease(config.note, '8n');
    } else if (config.type === 'metal') {
      synth.triggerAttack();
      synth.triggerRelease('+0.1');
    } else {
      synth.triggerAttackRelease('8n');
    }
  }

  dispose() {
    this.synths.forEach((synth) => synth.dispose());
    this.compressor.dispose();
    this.master.dispose();
  }
}

export const rhythmEngine = new RhythmEngine();
export { DRUM_COLORS, DRUM_VOICES };
