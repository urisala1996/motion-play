import * as Tone from 'tone';
import type { ScaleName, RootNote } from '../types';
import { getNoteFrequency } from './scales';

class MelodyEngine {
  private synth: Tone.PolySynth;
  private reverb: Tone.Reverb;
  private delay: Tone.FeedbackDelay;
  private limiter: Tone.Limiter;
  private master: Tone.Volume;
  private scale: ScaleName = 'Major';
  private root: RootNote = 'C';
  private activeNotes: Map<number, string> = new Map();

  constructor() {
    this.master = new Tone.Volume(0).connect(Tone.Destination);
    this.limiter = new Tone.Limiter(-3).connect(this.master);
    this.delay = new Tone.FeedbackDelay('8n', 0.3).connect(this.limiter);
    this.reverb = new Tone.Reverb({
      decay: 2.5,
    }).connect(this.delay);

    this.synth = new Tone.PolySynth(Tone.MonoSynth, {
      oscillator: { type: 'sawtooth' },
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.3,
        release: 0.5,
      },
      filter: {
        frequency: 3000,
      },
      filterEnvelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0.5,
        release: 0.2,
        baseFrequency: 500,
        octaves: 2,
      },
    });

    this.synth.set({ portamento: 0.05 });
    this.synth.connect(this.reverb);
  }

  setScale(scale: ScaleName) {
    this.scale = scale;
  }

  setRoot(root: RootNote) {
    this.root = root;
  }

  triggerNote(zoneIndex: number) {
    // Get note from scale
    const note = getNoteFrequency(zoneIndex, this.scale, this.root);

    // Stop previous note in this zone if any
    if (this.activeNotes.has(zoneIndex)) {
      const oldNote = this.activeNotes.get(zoneIndex)!;
      this.synth.triggerRelease(oldNote);
    }

    // Trigger new note
    this.synth.triggerAttack(note);
    this.activeNotes.set(zoneIndex, note);
  }

  releaseNote(zoneIndex: number) {
    if (this.activeNotes.has(zoneIndex)) {
      const note = this.activeNotes.get(zoneIndex)!;
      this.synth.triggerRelease(note);
      this.activeNotes.delete(zoneIndex);
    }
  }

  releaseAll() {
    this.activeNotes.forEach((note) => {
      this.synth.triggerRelease(note);
    });
    this.activeNotes.clear();
  }

  dispose() {
    this.synth.dispose();
    this.reverb.dispose();
    this.delay.dispose();
    this.limiter.dispose();
    this.master.dispose();
  }
}

export const melodyEngine = new MelodyEngine();
