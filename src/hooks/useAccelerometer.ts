import { useEffect, useCallback, useRef } from 'react';
import { motionProcessor } from '../motion/motionProcessor';
import type { TriggerEvent } from '../types';

interface UseAccelerometerOptions {
  onTrigger?: (event: TriggerEvent) => void;
  onMelodyZone?: (zone: number) => void;
  enabled?: boolean;
}

export const useAccelerometer = ({
  onTrigger,
  onMelodyZone,
  enabled = true,
}: UseAccelerometerOptions) => {
  const hasPermissionRef = useRef(
    typeof (DeviceMotionEvent as any).requestPermission !== 'function'
  );

  const handleDeviceMotion = useCallback(
    (event: DeviceMotionEvent) => {
      if (!event.acceleration) return;

      const x = event.acceleration.x ?? 0;
      const y = event.acceleration.y ?? 0;
      const z = event.acceleration.z ?? 0;
      motionProcessor.process(
        x,
        y,
        z,
        onTrigger || (() => {}),
        onMelodyZone || undefined
      );
    },
    [onTrigger, onMelodyZone]
  );

  const requestPermission = useCallback(async () => {
    console.log('requestPermission called');
    if (typeof DeviceMotionEvent === 'undefined') {
      console.warn('DeviceMotionEvent not available');
      return false;
    }

    if (typeof (DeviceMotionEvent as any).requestPermission !== 'function') {
      console.log('Non-iOS device, assuming permission granted');
      hasPermissionRef.current = true;
      return true;
    }

    try {
      console.log('Requesting iOS motion permission...');
      const permission = await (DeviceMotionEvent as any).requestPermission();
      console.log('Permission result:', permission);
      if (permission === 'granted') {
        hasPermissionRef.current = true;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Motion permission request failed:', error);
      return false;
    }
  }, []);

  useEffect(() => {
    console.log('useAccelerometer effect', { enabled, hasPermission: hasPermissionRef.current });
    if (!enabled || !hasPermissionRef.current) return;

    console.log('Attaching devicemotion listener');
    window.addEventListener('devicemotion', handleDeviceMotion);
    return () => {
      console.log('Removing devicemotion listener');
      window.removeEventListener('devicemotion', handleDeviceMotion);
    };
  }, [enabled, handleDeviceMotion]);

  const setSensitivity = useCallback((value: number) => {
    motionProcessor.setSensitivity(value);
  }, []);

  return {
    requestPermission,
    hasPermission: hasPermissionRef.current,
    setSensitivity,
  };
};
