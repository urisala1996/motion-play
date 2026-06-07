import * as Tone from 'tone';

interface SplashScreenProps {
  onStarted: () => void;
}

export function SplashScreen({ onStarted }: SplashScreenProps) {
  const handleStart = async () => {
    try {
      await Tone.start();
      console.log('Audio context unlocked');
    } catch (error) {
      console.error('Failed to unlock audio:', error);
    }

    try {
      if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        console.log('Requesting motion permission...');
        const permission = await (DeviceMotionEvent as any).requestPermission();
        console.log('Motion permission result:', permission);
        if (permission !== 'granted') {
          console.warn('Motion permission not granted');
        }
      } else {
        console.log('DeviceMotionEvent.requestPermission not available (non-iOS)');
      }
    } catch (error) {
      console.error('Motion permission error:', error);
    }

    onStarted();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#080810',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        flexDirection: 'column',
        gap: '32px',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h1
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #7c3aed, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px',
          }}
        >
          motion-play
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '18px' }}>
          Accelerometer-driven sound
        </p>
      </div>

      <button
        onClick={handleStart}
        style={{
          padding: '16px 32px',
          backgroundColor: '#7c3aed',
          color: 'white',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: '8px',
          fontSize: '18px',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.8';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
      >
        Tap to Begin
      </button>

      <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '14px', maxWidth: '320px', textAlign: 'center' }}>
        Enable motion and sound permissions to get started
      </p>
    </div>
  );
}
