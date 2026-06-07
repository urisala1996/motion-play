import { PACK_NAMES } from '../audio/drumPacks';
import type { DrumPackName } from '../types';

interface DrumPackSelectorProps {
  currentPack: DrumPackName;
  onChange: (pack: DrumPackName) => void;
}

export function DrumPackSelector({ currentPack, onChange }: DrumPackSelectorProps) {
  const currentIndex = PACK_NAMES.indexOf(currentPack);

  const handlePrev = () => {
    const newIndex = (currentIndex - 1 + PACK_NAMES.length) % PACK_NAMES.length;
    onChange(PACK_NAMES[newIndex]);
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % PACK_NAMES.length;
    onChange(PACK_NAMES[newIndex]);
  };

  return (
    <div
      className="glass-panel"
      style={{
        position: 'absolute',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      <button
        onClick={handlePrev}
        style={{
          fontSize: '24px',
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          padding: '8px',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#7c3aed')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'white')}
      >
        ◀
      </button>
      <div style={{ fontSize: '20px', fontWeight: 'bold', minWidth: '192px', textAlign: 'center' }}>
        {currentPack}
      </div>
      <button
        onClick={handleNext}
        style={{
          fontSize: '24px',
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          padding: '8px',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#7c3aed')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'white')}
      >
        ▶
      </button>
    </div>
  );
}
