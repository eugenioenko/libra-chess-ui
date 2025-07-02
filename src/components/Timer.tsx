import { useEffect, useImperativeHandle, useRef, useState, forwardRef } from "react";
import { ClockIcon } from "../icons/Clock";
import type { PlayerColor } from "../App";


export interface TimerHandle {
  resetTimer: () => void;
}

interface TimerProps {
  running: boolean;
  currentTurn: PlayerColor;
  timeControl: number;
  onTimeout: (winner: PlayerColor) => void;
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export interface TimerHandle {
  resetTimer: () => void;
}

export const Timer = forwardRef<TimerHandle, TimerProps>(function Timer(
  { running, currentTurn, timeControl, onTimeout },
  ref
) {
  const [whiteTime, setWhiteTime] = useState(timeControl);
  const [blackTime, setBlackTime] = useState(timeControl);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setWhiteTime((t) => {
        if (currentTurn === 'white') {
          if (t > 0) return t - 1;
          onTimeout('black');
          return 0;
        }
        return t;
      });
      setBlackTime((t) => {
        if (currentTurn === 'black') {
          if (t > 0) return t - 1;
          onTimeout('white');
          return 0;
        }
        return t;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running, currentTurn, onTimeout]);


  useImperativeHandle(ref, () => ({
    resetTimer: () => {
      setWhiteTime(timeControl);
      setBlackTime(timeControl);
    },
  }));

  return (
    <div className="grid grid-cols-2 rounded-xl overflow-hidden text-lg md:text-xl text-center">
      <div className="bg-gray-100 text-black py-2 md:py-3 flex items-center justify-center gap-1">
        {currentTurn === "white" && <ClockIcon />}
        {formatTime(whiteTime)}
      </div>
      <div className="bg-black text-gray-100 py-2 md:py-3 flex items-center justify-center gap-1">
        {currentTurn === "black" && <ClockIcon />}
        {formatTime(blackTime)}
      </div>
    </div>
  );
});
