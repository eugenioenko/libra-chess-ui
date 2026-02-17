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

  const whiteActive = currentTurn === 'white' && running;
  const blackActive = currentTurn === 'black' && running;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className={`rounded-xl px-4 py-3 flex items-center justify-between transition-all duration-300 ${whiteActive
          ? 'bg-[#f0f0f0] text-gray-900 shadow-lg shadow-white/10 ring-2 ring-white/40'
          : 'bg-[#161b22] text-[#8b949e] ring-1 ring-white/5'
        }`}>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-semibold uppercase tracking-widest ${whiteActive ? 'text-gray-500' : 'text-[#8b949e]'}`}>
            White
          </span>
          {whiteActive && <ClockIcon />}
        </div>
        <span className={`font-mono text-xl font-bold tabular-nums ${whiteActive ? 'text-gray-900' : 'text-[#c9d1d9]'}`}>
          {formatTime(whiteTime)}
        </span>
      </div>
      <div className={`rounded-xl px-4 py-3 flex items-center justify-between transition-all duration-300 ${blackActive
          ? 'bg-[#1c1c1c] text-white shadow-lg shadow-black/40 ring-2 ring-white/20'
          : 'bg-[#161b22] text-[#8b949e] ring-1 ring-white/5'
        }`}>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-semibold uppercase tracking-widest ${blackActive ? 'text-gray-400' : 'text-[#8b949e]'}`}>
            Black
          </span>
          {blackActive && <ClockIcon />}
        </div>
        <span className={`font-mono text-xl font-bold tabular-nums ${blackActive ? 'text-white' : 'text-[#c9d1d9]'}`}>
          {formatTime(blackTime)}
        </span>
      </div>
    </div>
  );
});
