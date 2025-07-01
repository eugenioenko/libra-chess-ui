import { useEffect, useRef } from "react";

interface TimerProps {
  running: boolean;
  currentTurn: 'white' | 'black';
  whiteTime: number;
  blackTime: number;
  setWhiteTime: (t: (prev: number) => number) => void;
  setBlackTime: (t: (prev: number) => number) => void;
}

export function Timer({ running, currentTurn, whiteTime, blackTime, setWhiteTime, setBlackTime }: TimerProps) {
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      console.log('timer')
      setWhiteTime((t) => (currentTurn === 'white' ? (t > 0 ? t - 1 : 0) : t));
      setBlackTime((t) => (currentTurn === 'black' ? (t > 0 ? t - 1 : 0) : t));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running, currentTurn, setWhiteTime, setBlackTime]);

  return null;
}
