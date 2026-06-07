import { ROOT_NOTES } from '../audio/scales';
import type { RootNote } from '../types';

interface RootNoteSelectorProps {
  currentRoot: RootNote;
  onChange: (root: RootNote) => void;
}

export function RootNoteSelector({ currentRoot, onChange }: RootNoteSelectorProps) {
  return (
    <div
      className="glass-panel"
      style={{
        position: 'absolute',
        bottom: '24px',
        right: '24px',
        zIndex: 10,
        padding: '12px 16px',
      }}
    >
      <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '4px' }}>
        Root Note
      </label>
      <select
        value={currentRoot}
        onChange={(e) => onChange(e.target.value as RootNote)}
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
        {ROOT_NOTES.map((note) => (
          <option key={note} value={note} style={{ background: '#080810', color: 'white' }}>
            {note}
          </option>
        ))}
      </select>
    </div>
  );
}
