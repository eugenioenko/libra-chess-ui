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

  let message = '';
  let icon = '';
  let accentClass = '';
  let scoreClass = '';

  if (playerWon) {
    message = 'You win!';
    icon = '🏆';
    accentClass = 'from-amber-500/20 to-yellow-500/10 ring-amber-500/30';
    scoreClass = 'text-amber-400';
  } else if (isDraw) {
    message = "It's a draw";
    icon = '🤝';
    accentClass = 'from-slate-500/20 to-slate-600/10 ring-slate-500/30';
    scoreClass = 'text-slate-300';
  } else {
    message = 'Libra wins';
    icon = '🤖';
    accentClass = 'from-slate-700/30 to-slate-800/20 ring-slate-600/20';
    scoreClass = 'text-slate-400';
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className={`flex flex-col items-center justify-center bg-gradient-to-b ${accentClass} bg-[#161b22] rounded-2xl shadow-2xl shadow-black/60 ring-1 p-8 text-center min-w-[260px]`}>
        <div className="text-5xl mb-3">{icon}</div>
        <h2 className="text-2xl font-bold text-[#e6edf3] mb-1 tracking-tight">{message}</h2>
        <div className={`text-3xl font-bold font-mono tabular-nums mb-6 ${scoreClass}`}>{score}</div>
        <button
          className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold rounded-xl px-8 py-2.5 transition-colors duration-150 cursor-pointer text-sm tracking-wide"
          onClick={onRestart}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
