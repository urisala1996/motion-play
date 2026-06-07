import { useState, useEffect, useRef } from 'react';
import './index.css';
import { ModeToggle } from './components/ModeToggle';
import { DrumPackSelector } from './components/DrumPackSelector';
import { ScaleSelector } from './components/ScaleSelector';
import { RootNoteSelector } from './components/RootNoteSelector';
import { SplashScreen } from './components/SplashScreen';
import { useAccelerometer } from './hooks/useAccelerometer';
import { rhythmEngine } from './audio/rhythmEngine';
import { melodyEngine } from './audio/melodyEngine';
import { RhythmVisualizer } from './visualizers/rhythmVisualizer';
import { MelodyVisualizer } from './visualizers/melodyVisualizer';
import type { TriggerEvent } from './types';
import type { DrumPackName, ScaleName, RootNote } from './types';

function App() {
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState<'rhythm' | 'melody'>('rhythm');
  const [currentPack, setCurrentPack] = useState<DrumPackName>('808 Classic');
  const [currentScale, setCurrentScale] = useState<ScaleName>('Major');
  const [currentRoot, setCurrentRoot] = useState<RootNote>('C');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visualizerRef = useRef<RhythmVisualizer | MelodyVisualizer | null>(null);

  const handleRhythmTrigger = (event: TriggerEvent) => {
    rhythmEngine.trigger(event.zone);
    if (visualizerRef.current instanceof RhythmVisualizer) {
      visualizerRef.current.triggerZone(event.zone);
    }
  };

  const handleMelodyZone = (zone: number) => {
    melodyEngine.triggerNote(zone);
    if (visualizerRef.current instanceof MelodyVisualizer) {
      visualizerRef.current.triggerZone(zone);
    }
  };

  useAccelerometer({
    onTrigger: mode === 'rhythm' ? handleRhythmTrigger : undefined,
    onMelodyZone: mode === 'melody' ? handleMelodyZone : undefined,
    enabled: started,
  });

  useEffect(() => {
    if (!canvasRef.current || !started) return;

    if (visualizerRef.current) {
      visualizerRef.current.stop();
      visualizerRef.current.dispose();
    }

    if (mode === 'rhythm') {
      const viz = new RhythmVisualizer(canvasRef.current);
      visualizerRef.current = viz;
      viz.start();
    } else {
      const viz = new MelodyVisualizer(canvasRef.current);
      visualizerRef.current = viz;
      viz.start();
    }

    return () => {
      if (visualizerRef.current) {
        visualizerRef.current.stop();
      }
    };
  }, [mode, started]);

  useEffect(() => {
    if (mode === 'melody' && visualizerRef.current instanceof MelodyVisualizer) {
      visualizerRef.current.setCurrentZone(0);
    }
  }, [mode]);

  const handleModeChange = async (newMode: 'rhythm' | 'melody') => {
    setMode(newMode);

    if (newMode === 'melody') {
      melodyEngine.setScale(currentScale);
      melodyEngine.setRoot(currentRoot);
    }
  };

  const handlePackChange = async (pack: DrumPackName) => {
    setCurrentPack(pack);
    await rhythmEngine.setCurrentPack(pack);
  };

  const handleScaleChange = (scale: ScaleName) => {
    setCurrentScale(scale);
    melodyEngine.setScale(scale);
  };

  const handleRootChange = (root: RootNote) => {
    setCurrentRoot(root);
    melodyEngine.setRoot(root);
  };

  if (!started) {
    return <SplashScreen onStarted={() => setStarted(true)} />;
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', backgroundColor: '#080810' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, display: 'block' }} />

      <ModeToggle mode={mode} onChange={handleModeChange} />

      {mode === 'rhythm' ? (
        <DrumPackSelector currentPack={currentPack} onChange={handlePackChange} />
      ) : (
        <>
          <ScaleSelector currentScale={currentScale} onChange={handleScaleChange} />
          <RootNoteSelector currentRoot={currentRoot} onChange={handleRootChange} />
        </>
      )}
    </div>
  );
}

export default App
