import type { TriggerEvent, MotionData } from '../types';

const FILTER_SIZE = 8;
const DEBOUNCE_MS = 250;
const SENSITIVITY_MULTIPLIER = 2.2;

class MotionProcessor {
  private magnitudeHistory: number[] = [];
  private lastTriggerTime = 0;
  private lastNoteZone = -1;
  private lastNoteZoneTime = 0;
  private sensitivity = SENSITIVITY_MULTIPLIER;

  setSensitivity(value: number) {
    this.sensitivity = value;
  }

  process(
    ax: number,
    ay: number,
    az: number,
    onTrigger: (event: TriggerEvent) => void,
    onMelodyZone?: (zone: number) => void
  ) {
    const magnitude = Math.sqrt(ax * ax + ay * ay + az * az);

    // Low-pass filter
    this.magnitudeHistory.push(magnitude);
    if (this.magnitudeHistory.length > FILTER_SIZE) {
      this.magnitudeHistory.shift();
    }

    const filtered = this.magnitudeHistory.length >= FILTER_SIZE;
    const average = this.magnitudeHistory.reduce((a, b) => a + b, 0) / this.magnitudeHistory.length;
    const threshold = average * this.sensitivity;

    const data: MotionData = { magnitude, ax, ay, az, filtered };

    const now = performance.now();

    // Rhythm mode: peak detection on acceleration magnitude
    if (magnitude > threshold && now - this.lastTriggerTime > DEBOUNCE_MS && filtered) {
      const velocity = Math.min(1, (magnitude - average) / (average * (this.sensitivity - 1)));

      // Map (ax, ay) to 6 zones by angle
      const angle = Math.atan2(ay, ax) * (180 / Math.PI);
      const normalizedAngle = ((angle + 360) % 360) / 60; // Divide into 6 zones
      const zone = Math.floor(normalizedAngle) % 6;

      onTrigger({
        zone,
        velocity,
        timestamp: now,
        ax,
        ay,
      });

      this.lastTriggerTime = now;
    }

    // Melody mode: map tilt to note zones
    if (onMelodyZone) {
      const normalizedTilt = (ax + 90) / 180; // -90 to +90 -> 0 to 1
      const noteZone = Math.max(0, Math.min(7, Math.floor(normalizedTilt * 8)));

      // Trigger on zone crossing with debounce
      if (noteZone !== this.lastNoteZone && now - this.lastNoteZoneTime > 150) {
        this.lastNoteZone = noteZone;
        this.lastNoteZoneTime = now;
        onMelodyZone(noteZone);
      }
    }

    return data;
  }
}

export const motionProcessor = new MotionProcessor();
