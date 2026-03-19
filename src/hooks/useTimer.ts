import { useState, useEffect, useCallback, useRef } from 'react';

export function useTimer(initialTime: number) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const start = useCallback(() => {
    if (!isActive) {
      setIsActive(true);
      startTimeRef.current = Date.now();
    }
  }, [isActive]);

  const stop = useCallback(() => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const reset = useCallback((newTime?: number) => {
    setIsActive(false);
    setTimeLeft(newTime ?? initialTime);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [initialTime]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const getElapsed = useCallback(() => {
    return initialTime - timeLeft;
  }, [initialTime, timeLeft]);

  const calculateBonus = useCallback(() => {
    const elapsed = getElapsed();
    if (elapsed < 30) return 20;
    if (elapsed < 60) return 10;
    return 0;
  }, [getElapsed]);

  return { timeLeft, isActive, start, stop, reset, getElapsed, calculateBonus, isExpired: timeLeft === 0 };
}
