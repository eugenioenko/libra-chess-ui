import { useEffect, useState, useRef } from "react";
import { Chessboard } from "react-chessboard";
import type { Square } from "react-chessboard/dist/chessboard/types";
import { Timer, type TimerHandle } from "./components/Timer";
import { libraWorkerClient } from "./worker/libraWorkerClient";
import { Start } from "./components/Start";
import { Moves } from "./components/Moves";
import { Chess } from "chess.js";
import { Over } from "./components/Over";
import ReactConfetti from "react-confetti";

export type PlayerColor = 'white' | 'black';
export type GameStatus = 'playing' | 'selection' | 'white' | 'black' | 'draw';
const timeOptions = {
  bullet: 60,
  blitz: 180,
  rapid: 900,
};

export function App() {
  const [gameStatus, setGameStatus] = useState<GameStatus>('selection');
  const [playerColor, setPlayerColor] = useState<PlayerColor>('white');
  const [timeControl, setTimeControl] = useState<'bullet' | 'blitz' | 'rapid'>('blitz');
  const [moveList, setMoveList] = useState<string[]>([]);
  const [currentTurn, setCurrentTurn] = useState<PlayerColor>('white');
  const [chess, setChess] = useState(new Chess());
  const [fen, setFen] = useState(chess.fen());
  const timerRef = useRef<TimerHandle>(null);

  useEffect(() => {
    if (gameStatus === 'playing') {
      setMoveList([]);

      setCurrentTurn('white');
      libraWorkerClient.libraLoadInitial().then(async () => {
        const initial = await libraWorkerClient.libraToFEN();
        setFen(initial);
        if (playerColor === 'black') {
          setTimeout(() => { calculateMoveAsync(); }, 500);
        }
      });
    }
  }, [gameStatus, timeControl, playerColor]);


  function handleMoveSync(move: string): void {
    const from = move.substring(0, 2) as Square;
    const to = move.substring(2, 4) as Square;
    const promotion = 'q';
    chess.move({ from, to, promotion });
    if (chess.game_over()) {
      let winner: 'white' | 'black' | null = null;
      if (chess.in_checkmate()) {
        winner = currentTurn === 'white' ? 'black' : 'white';
        setGameStatus(winner);
      } else {
        setGameStatus('draw');
      }
    }
    setFen(chess.fen());
    handleMoveAsync(move);
  }

  async function handleMoveAsync(move: string) {
    await libraWorkerClient.libraMove(move);
    const position = await libraWorkerClient.libraToFEN();
    setFen(position);
    setMoveList((prev) => [...prev, move]);
    setCurrentTurn((t) => (t === 'white' ? 'black' : 'white'));
  }

  async function calculateMoveAsync(): Promise<void> {
    let duration = 300;
    switch (timeControl) {
      case 'bullet':
        duration = 300;
        break;
      case 'blitz':
        duration = 900;
        break;
      case 'rapid':
        duration = 3000;
        break;
    }
    const move = await libraWorkerClient.libraIterativeDeepeningSearch(duration);
    handleMoveSync(move);
  }

  function handleDrop(from: Square, to: Square): boolean {
    if (
      gameStatus !== 'playing' ||
      (currentTurn === 'white' && playerColor !== 'white') ||
      (currentTurn === 'black' && playerColor !== 'black')
    ) {
      return false;
    }

    const result = chess.move({ from, to, promotion: 'q' });
    if (!result) {
      return false;
    }

    chess.undo();
    handleMoveSync(`${from}${to}`);
    setTimeout(() => { calculateMoveAsync(); }, 100);
    return true;
  }


  function startGame() {
    setChess(new Chess());
    setGameStatus('playing');
    timerRef.current?.resetTimer();
  }

  return (
    <>
      {gameStatus === playerColor ? <ReactConfetti width={window.innerWidth} height={window.innerHeight} /> : null}
      <div className="relative flex flex-col md:flex-row max-w-6xl mx-auto p-4 gap-4 md:gap-6">
        <div className="flex-grow flex flex-col gap-4 md:gap-6 relative">
          <Timer
            ref={timerRef}
            running={gameStatus === 'playing'}
            currentTurn={currentTurn}
            timeControl={timeOptions[timeControl]}
            onTimeout={(winner) => setGameStatus(winner)}
          />
          <Chessboard
            position={fen}
            onPieceDrop={handleDrop}
            autoPromoteToQueen={true}
            boardOrientation={playerColor}
          />
          {gameStatus === 'selection' ? <Start
            playerColor={playerColor}
            setPlayerColor={setPlayerColor}
            timeControl={timeControl}
            setTimeControl={setTimeControl}
            onStart={startGame}
          /> : null}
          {gameStatus !== 'selection' && gameStatus !== 'playing' ? <Over
            gameStatus={gameStatus}
            playerColor={playerColor}
            onRestart={() => setGameStatus('selection')}
          /> : null}
        </div>
        <div>
          <Moves moveList={moveList} />
        </div>
      </div>
    </>
  );
}


