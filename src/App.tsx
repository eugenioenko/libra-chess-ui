import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import type { Square } from "react-chessboard/dist/chessboard/types";
import './App.css';
import { Timer } from "./Timer";

declare var libraFromFEN: (fen: string) => void;
declare var libraToFEN: () => string;
declare var libraPerft: (depth: number) => number;
declare var libraPerftParallel: (depth: number) => number;
declare var libraMove: (move: string) => boolean;
declare var libraLoadInitial: () => void;
declare var libraIterativeDeepeningSearch: (ms: number) => string;


export function App() {
  const [fen, setFen] = useState<string>();
  const [gameStarted, setGameStarted] = useState(false);
  const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white');
  const [timeControl, setTimeControl] = useState<'bullet' | 'blitz' | 'rapid'>('blitz');
  const [whiteTime, setWhiteTime] = useState(0);
  const [blackTime, setBlackTime] = useState(0);
  const [moveList, setMoveList] = useState<string[]>([]);
  const [currentTurn, setCurrentTurn] = useState<'white' | 'black'>('white');

  // Time in seconds for each control
  const timeOptions = {
    bullet: 60,
    blitz: 180,
    rapid: 600,
  };

  useEffect(() => {
    if (gameStarted) {
      setWhiteTime(timeOptions[timeControl]);
      setBlackTime(timeOptions[timeControl]);
      setMoveList([]);
      setCurrentTurn('white');
      libraLoadInitial();
      const initial = libraToFEN();
      setFen(initial);
    }
    // eslint-disable-next-line
  }, [gameStarted, timeControl]);

  // Timer logic is now in Timer component

  function handleMove(move: string) {
    libraMove(move);
    const position = libraToFEN();
    setFen(position);
    setMoveList((prev) => [...prev, move]);
    setCurrentTurn((t) => (t === 'white' ? 'black' : 'white'));
  }

  function calculateMove(): void {
    const move = libraIterativeDeepeningSearch(900);
    handleMove(move);
  }

  function handleDrop(from: Square, to: Square): boolean {
    if (!gameStarted) return false;
    if ((currentTurn === 'white' && playerColor !== 'white') || (currentTurn === 'black' && playerColor !== 'black')) return false;
    handleMove(`${from}${to}`);
    setTimeout(calculateMove, 500);
    return true;
  }

  function startGame() {
    setGameStarted(true);
  }

  function formatTime(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  if (!gameStarted) {
    return (
      <div className="setup-container">
        <h2>Start New Game</h2>
        <div className="setup-row">
          <label>Color:</label>
          <select value={playerColor} onChange={e => setPlayerColor(e.target.value as 'white' | 'black')}>
            <option value="white">White</option>
            <option value="black">Black</option>
          </select>
        </div>
        <div className="setup-row">
          <label>Time Control:</label>
          <select value={timeControl} onChange={e => setTimeControl(e.target.value as 'bullet' | 'blitz' | 'rapid')}>
            <option value="bullet">Bullet (1+0)</option>
            <option value="blitz">Blitz (3+0)</option>
            <option value="rapid">Rapid (10+0)</option>
          </select>
        </div>
        <button className="start-btn" onClick={startGame}>Start Game</button>
      </div>
    );
  }

  if (!fen) {
    return null;
  }

  return (
    <div className="container">
      <Timer
        running={gameStarted}
        currentTurn={currentTurn}
        whiteTime={whiteTime}
        blackTime={blackTime}
        setWhiteTime={setWhiteTime}
        setBlackTime={setBlackTime}
      />
      <div className="clocks">
        <div className={`clock ${currentTurn === 'white' ? 'active' : ''}`}>White: {formatTime(whiteTime)}</div>
        <div className={`clock ${currentTurn === 'black' ? 'active' : ''}`}>Black: {formatTime(blackTime)}</div>
      </div>
      <Chessboard
        position={fen}
        onPieceDrop={handleDrop}
        autoPromoteToQueen={true}
        boardOrientation={playerColor}
      />
      <div className="notation">
        <h3>Moves</h3>
        <ol>
          {moveList.map((move, idx) => (
            <li key={idx}>{move}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}