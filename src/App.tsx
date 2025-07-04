import { useState, useRef, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import type { Square } from "react-chessboard/dist/chessboard/types";
import { Timer, type TimerHandle } from "./components/Timer";
import { libraClient } from "./worker/libra-client";
import { Start } from "./components/Start";
import { Moves } from "./components/Moves";
import { Chess } from "chess.js";
import { Over } from "./components/Over";
import ReactConfetti from "react-confetti";
import Loader from "./components/Loader";


export type PlayerColor = 'white' | 'black';
export type GameStatus = 'playing' | 'selection' | 'white' | 'black' | 'draw';

export function App() {
  const [chessOpeningBook, setChessOpeningBook] = useState<Record<string, string[]> | undefined>(undefined);
  const [gameStatus, setGameStatus] = useState<GameStatus>('selection');
  const [playerColor, setPlayerColor] = useState<PlayerColor>('white');
  const [timeControl, setTimeControl] = useState(180);
  const [level, setLevel] = useState(3);
  const [moveList, setMoveList] = useState<string[]>([]);
  const [currentTurn, setCurrentTurn] = useState<PlayerColor>('white');
  const [chess] = useState(new Chess());
  const [fen, setFen] = useState(chess.fen());
  const timerRef = useRef<TimerHandle>(null);

  useEffect(() => {
    async function loadOpeningBook() {
      const response = await fetch('/libra-chess-ui/openings.json');
      if (!response.ok) {
        console.warn('Failed to load opening book');
        return;
      }
      const data = await response.json();
      setChessOpeningBook(data);
    }
    if (!chessOpeningBook) {
      loadOpeningBook();
    }
  }, []);


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
    await libraClient.libraMove(move);
    const position = await libraClient.libraToFEN();
    setFen(position);
    setMoveList((prev) => [...prev, move]);
    setCurrentTurn((t) => (t === 'white' ? 'black' : 'white'));
  }

  async function calculateMoveAsync(): Promise<void> {
    const duration = level * 1000;
    const hash = await libraClient.libraZobristHash();

    if (chessOpeningBook) {
      const moves = chessOpeningBook[hash] || [];
      if (moves.length > 0) {
        const move = moves[Math.floor(Math.random() * moves.length)];
        console.log(`info string opening move ${move}`);
        await handleMoveSync(move);
        return;
      }
    }
    const move = await libraClient.libraIterativeDeepeningSearch(duration);
    await handleMoveSync(move);

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


  async function startGame() {
    timerRef.current?.resetTimer();
    setMoveList([]);
    setCurrentTurn('white');
    setGameStatus('playing');
    await libraClient.libraLoadInitial()
    const initial = await libraClient.libraToFEN();
    chess.reset();
    setFen(initial);
    if (playerColor === 'black') {
      await calculateMoveAsync();
    }
  }

  if (!chessOpeningBook) {
    return <Loader />;
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
            timeControl={timeControl}
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
            level={level}
            setLevel={setLevel}
          /> : null}
          {gameStatus !== 'selection' && gameStatus !== 'playing' ? <Over
            gameStatus={gameStatus}
            playerColor={playerColor}
            onRestart={() => setGameStatus('selection')}
          /> : null}
        </div>
        <Moves moveList={moveList} />
      </div>
    </>
  );
}


