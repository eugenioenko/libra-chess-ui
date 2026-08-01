import { useEffect, useImperativeHandle, useRef, useState, forwardRef } from "react";
import { ClockIcon } from "../icons/Clock";
import type { PlayerColor } from "../App";


export interface TimerHandle {
  resetTimer: () => void;
  getRemainingTime: (color: PlayerColor) => number;
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

function isLowTime(sec: number) {
  return sec <= 30;
}

export const Timer = forwardRef<TimerHandle, TimerProps>(function Timer(
  { running, currentTurn, timeControl, onTimeout },
  ref
) {
  const [whiteTime, setWhiteTime] = useState(timeControl);
  const [blackTime, setBlackTime] = useState(timeControl);
  const timerRef = useRef<number | null>(null);
  const whiteTimeRef = useRef(timeControl);
  const blackTimeRef = useRef(timeControl);

  useEffect(() => {
    if (!running) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setWhiteTime((t) => {
        if (currentTurn === 'white') {
          if (t > 0) { whiteTimeRef.current = t - 1; return t - 1; }
          onTimeout('black');
          whiteTimeRef.current = 0;
          return 0;
        }
        return t;
      });
      setBlackTime((t) => {
        if (currentTurn === 'black') {
          if (t > 0) { blackTimeRef.current = t - 1; return t - 1; }
          onTimeout('white');
          blackTimeRef.current = 0;
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
      whiteTimeRef.current = timeControl;
      blackTimeRef.current = timeControl;
    },
    getRemainingTime: (color: PlayerColor) => {
      return color === 'white' ? whiteTimeRef.current : blackTimeRef.current;
    },
  }));

  const whiteActive = currentTurn === 'white' && running;
  const blackActive = currentTurn === 'black' && running;
  const whiteLow = isLowTime(whiteTime) && running;
  const blackLow = isLowTime(blackTime) && running;

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* White clock */}
      <div className={`relative rounded-xl px-4 py-3 flex items-center justify-between transition-all duration-300 overflow-hidden
        ${whiteActive
          ? 'bg-white text-gray-900 shadow-[0_0_30px_-6px_rgba(255,255,255,0.15)] ring-1 ring-white/60'
          : 'bg-[#0f0f14] text-[#94a3b8] ring-1 ring-white/[0.06]'}`}
      >
        {whiteActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 clock-pulse" />
        )}
        <div className="relative flex items-center gap-2.5">
          <span className={`text-[11px] font-semibold uppercase tracking-[0.15em] ${whiteActive ? 'text-gray-400' : 'text-[#64748b]'}`}>
            White
          </span>
          {whiteActive && <ClockIcon />}
        </div>
        <span className={`relative font-mono text-xl font-bold tabular-nums tracking-tight
          ${whiteActive ? 'text-gray-900' : 'text-[#cbd5e1]'}
          ${whiteLow && whiteActive ? 'text-red-600' : ''}`}
        >
          {formatTime(whiteTime)}
        </span>
      </div>

      {/* Black clock */}
      <div className={`relative rounded-xl px-4 py-3 flex items-center justify-between transition-all duration-300 overflow-hidden
        ${blackActive
          ? 'bg-[#111] text-white shadow-[0_0_30px_-6px_rgba(0,0,0,0.4)] ring-1 ring-white/20'
          : 'bg-[#0f0f14] text-[#94a3b8] ring-1 ring-white/[0.06]'}`}
      >
        {blackActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/[0.02] to-white/0 clock-pulse" />
        )}
        <div className="relative flex items-center gap-2.5">
          <span className={`text-[11px] font-semibold uppercase tracking-[0.15em] ${blackActive ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>
            Black
          </span>
          {blackActive && <ClockIcon />}
        </div>
        <span className={`relative font-mono text-xl font-bold tabular-nums tracking-tight
          ${blackActive ? 'text-white' : 'text-[#cbd5e1]'}
          ${blackLow && blackActive ? 'text-red-400' : ''}`}
        >
          {formatTime(blackTime)}
        </span>
      </div>
    </div>
  );
});
