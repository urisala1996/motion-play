interface ModeToggleProps {
  mode: 'rhythm' | 'melody';
  onChange: (mode: 'rhythm' | 'melody') => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div
      className="glass-panel"
      style={{
        position: 'absolute',
        top: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        display: 'flex',
        gap: '8px',
        padding: '4px',
      }}
    >
      <button
        onClick={() => onChange('rhythm')}
        className="glass-button"
        style={{
          padding: '8px 24px',
          backgroundColor: mode === 'rhythm' ? '#7c3aed' : 'transparent',
          color: 'white',
          opacity: mode === 'rhythm' ? 1 : 0.5,
        }}
      >
        Rhythm
      </button>
      <button
        onClick={() => onChange('melody')}
        className="glass-button"
        style={{
          padding: '8px 24px',
          backgroundColor: mode === 'melody' ? '#7c3aed' : 'transparent',
          color: 'white',
          opacity: mode === 'melody' ? 1 : 0.5,
        }}
      >
        Melody
      </button>
    </div>
  );
}
