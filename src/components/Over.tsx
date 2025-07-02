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

  let message = '';
  if (gameStatus === playerColor) {
    message = 'You win!';
  } else if (gameStatus === 'draw') {
    message = 'It\'s a draw';
  } else {
    message = 'Libra wins';
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center min-h-[200px] bg-zinc-900  rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-100 mb-4">{message}</h2>
        <h2 className="text-3xl font-bold mb-4 text-gray-100">{score}</h2>
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded px-6 py-2 transition-colors duration-150"
          onClick={onRestart}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
