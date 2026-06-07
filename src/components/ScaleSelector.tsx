import { SCALE_NAMES } from '../audio/scales';
import type { ScaleName } from '../types';

interface ScaleSelectorProps {
  currentScale: ScaleName;
  onChange: (scale: ScaleName) => void;
}

export function ScaleSelector({ currentScale, onChange }: ScaleSelectorProps) {
  return (
    <div
      className="glass-panel"
      style={{
        position: 'absolute',
        bottom: '24px',
        left: '24px',
        zIndex: 10,
        padding: '12px 16px',
      }}
    >
      <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '4px' }}>
        Scale
      </label>
      <select
        value={currentScale}
        onChange={(e) => onChange(e.target.value as ScaleName)}
        style={{
          background: 'transparent',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '6px',
          padding: '8px 12px',
          color: 'white',
          fontSize: '14px',
          cursor: 'pointer',
        }}
      >
        {SCALE_NAMES.map((scale) => (
          <option key={scale} value={scale} style={{ background: '#080810', color: 'white' }}>
            {scale}
          </option>
        ))}
      </select>
    </div>
  );
}
