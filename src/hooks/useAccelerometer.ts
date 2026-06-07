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
  const hasPermissionRef = useRef(false);

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
    if (typeof DeviceMotionEvent === 'undefined') {
      console.warn('DeviceMotionEvent not available');
      return false;
    }

    if (
      typeof (DeviceMotionEvent as any).requestPermission !== 'function' &&
      typeof (window as any).DeviceMotionEvent !== 'undefined'
    ) {
      // Non-iOS device, permission granted by default
      hasPermissionRef.current = true;
      return true;
    }

    try {
      const permission = await (DeviceMotionEvent as any).requestPermission();
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
    if (!enabled || !hasPermissionRef.current) return;

    window.addEventListener('devicemotion', handleDeviceMotion);
    return () => {
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
