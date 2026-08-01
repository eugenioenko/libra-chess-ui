import type { GameStatus, PlayerColor } from "../App";

type OverProps = {
  gameStatus: GameStatus;
  playerColor: PlayerColor;
  onRestart: () => void;
};

export function Over({ gameStatus, onRestart, playerColor }: OverProps) {
  let score = '';
  if (gameStatus === 'draw') {
    score = '½ - ½';
  } else if (gameStatus === 'white') {
    score = '1 - 0';
  } else if (gameStatus === 'black') {
    score = '0 - 1';
  }

  const playerWon = gameStatus === playerColor;
  const isDraw = gameStatus === 'draw';

  let title = '';
  let subtitle = '';
  let icon = '';
  let accentBorder = '';
  let accentBg = '';
  let scoreColor = '';
  let titleColor = '';

  if (playerWon) {
    title = 'You win!';
    subtitle = 'Well played';
    icon = '🏆';
    accentBorder = 'ring-amber-500/30';
    accentBg = 'from-amber-500/8 to-yellow-500/4';
    scoreColor = 'text-amber-400';
    titleColor = 'text-amber-100';
  } else if (isDraw) {
    title = 'Draw';
    subtitle = 'Well fought';
    icon = '🤝';
    accentBorder = 'ring-slate-500/20';
    accentBg = 'from-slate-500/8 to-slate-600/4';
    scoreColor = 'text-slate-300';
    titleColor = 'text-slate-100';
  } else {
    title = 'Libra wins';
    subtitle = 'Try again';
    icon = '🤖';
    accentBorder = 'ring-slate-600/20';
    accentBg = 'from-slate-700/8 to-slate-800/4';
    scoreColor = 'text-slate-400';
    titleColor = 'text-slate-200';
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center z-10 backdrop-blur-[1px]">
      <div className={`animate-fade-in flex flex-col items-center justify-center bg-gradient-to-b ${accentBg} bg-[#0d0d13] rounded-2xl ring-1 ${accentBorder} p-8 text-center min-w-[260px] shadow-[0_0_60px_-12px_rgba(0,0,0,0.5)]`}>
        <div className="text-5xl mb-3">{icon}</div>
        <h2 className={`text-2xl font-bold mb-0.5 tracking-tight ${titleColor}`}>{title}</h2>
        <p className="text-[#64748b] text-sm mb-4">{subtitle}</p>
        <div className={`text-4xl font-bold font-mono tabular-nums mb-6 tracking-tight ${scoreColor}`}>{score}</div>
        <button
          className="bg-white/[0.06] hover:bg-white/[0.10] active:bg-white/[0.04] text-[#e2e8f0] font-medium rounded-xl px-8 py-2.5 transition-all duration-200 cursor-pointer text-sm ring-1 ring-white/[0.08] hover:ring-white/[0.14]"
          onClick={onRestart}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
