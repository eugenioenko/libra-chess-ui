import { useState, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Timer, type TimerHandle } from "./components/Timer";
import { Start } from "./components/Start";
import { Moves } from "./components/Moves";
import { Over } from "./components/Over";
import Loader from "./components/Loader";
import ReactConfetti from "react-confetti";
import { useOpeningBook } from "./hooks/useOpeningBook";
import { useGame } from "./hooks/useGame";

export type PlayerColor = 'white' | 'black';
export type GameStatus = 'playing' | 'selection' | 'white' | 'black' | 'draw';

export function App() {
  const [playerColor, setPlayerColor] = useState<PlayerColor>('white');
  const [timeControl, setTimeControl] = useState(180);
  const [level, setLevel] = useState(3);
  const timerRef = useRef<TimerHandle>(null);

  const openingBook = useOpeningBook();
  const { gameStatus, currentTurn, fen, moveList, handleDrop, startGame, endGame } = useGame({
    playerColor,
    timeControl,
    level,
    openingBook,
    timerRef,
  });

  if (!openingBook) {
    return <Loader />;
  }

  return (
    <>
      {gameStatus === playerColor && (
        <ReactConfetti width={window.innerWidth} height={window.innerHeight} />
      )}
      <div className="flex flex-col lg:flex-row gap-4 p-4 lg:p-6 w-full">
        <div className="flex-1 flex flex-col gap-4 relative min-w-0">
          <Timer
            ref={timerRef}
            running={gameStatus === 'playing'}
            currentTurn={currentTurn}
            timeControl={timeControl}
            onTimeout={(winner) => endGame(winner)}
          />
          <div className="rounded-2xl overflow-hidden ring-1 ring-white/[0.07] shadow-[0_0_80px_-12px_rgba(0,0,0,0.5)]">
            <Chessboard
              position={fen}
              onPieceDrop={handleDrop}
              autoPromoteToQueen={true}
              boardOrientation={playerColor}
            />
          </div>
          {gameStatus === 'selection' && (
            <Start
              playerColor={playerColor}
              setPlayerColor={setPlayerColor}
              timeControl={timeControl}
              setTimeControl={setTimeControl}
              onStart={startGame}
              level={level}
              setLevel={setLevel}
            />
          )}
          {gameStatus !== 'selection' && gameStatus !== 'playing' && (
            <Over
              gameStatus={gameStatus}
              playerColor={playerColor}
              onRestart={() => endGame('selection')}
            />
          )}
        </div>
        <Moves moveList={moveList} />
      </div>
    </>
  );
}
