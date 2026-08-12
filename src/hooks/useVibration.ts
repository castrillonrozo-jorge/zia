import { useCallback } from 'react';

type VibrationType = 'light' | 'medium' | 'heavy' | 'success' | 'alert' | 'error';

export const useVibration = () => {
  const vibrate = useCallback((type: VibrationType | number | number[] = 'medium') => {
    if (typeof navigator === 'undefined' || !navigator.vibrate) return;

    let pattern: number | number[];

    if (typeof type === 'number' || Array.isArray(type)) {
      pattern = type;
    } else {
      switch (type) {
        case 'light':
          pattern = 15;
          break;
        case 'medium':
          pattern = 20;
          break;
        case 'heavy':
          pattern = 40;
          break;
        case 'success':
          pattern = [15, 30, 15]; // Short, pause, short
          break;
        case 'alert':
          pattern = [500, 200, 500, 200, 500]; // SOS-like
          break;
        case 'error':
          pattern = [50, 100, 50]; // Quick double pulse
          break;
        default:
          pattern = 20;
      }
    }

    try {
      navigator.vibrate(pattern);
    } catch (error) {
      console.warn('Vibration API not supported or thwarted', error);
    }
  }, []);

  return { vibrate };
};
