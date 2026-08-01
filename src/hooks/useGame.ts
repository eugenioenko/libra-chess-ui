import { useState, useRef, useCallback } from "react";
import type { Square } from "react-chessboard/dist/chessboard/types";
import { Chess } from "chess.js";
import { libraClient } from "../worker/libra-client";
import type { PlayerColor, GameStatus } from "../App";
import type { TimerHandle } from "../components/Timer";

interface UseGameOptions {
  playerColor: PlayerColor;
  timeControl: number;
  level: number;
  openingBook: Record<string, string[]> | undefined;
  timerRef: React.RefObject<TimerHandle | null>;
}

interface UseGameReturn {
  gameStatus: GameStatus;
  currentTurn: PlayerColor;
  fen: string;
  moveList: string[];
  handleDrop: (from: Square, to: Square) => boolean;
  startGame: () => Promise<void>;
  /** Call when the timer expires or the user wants to restart. */
  endGame: (status: GameStatus) => void;
}

/**
 * Calculate how long the engine should think on this move.
 *
 * Uses a percentage of the remaining clock — higher levels get a larger
 * share, so the engine thinks deeper when it matters. The percentage
 * approach is self-correcting: as the clock runs low the engine
 * automatically speeds up, so it never flags.
 *
 * Level → % of remaining time per move:
 *   Easy   (1)  →  4%    Medium (3)  →  6%
 *   Hard   (6)  →  9%    Expert (12) → 13%
 *   Master (20) → 17%
 */
function calcThinkTime(remainingSec: number, level: number, timeControl: number): number {
  // Map discrete levels to a base percentage of remaining clock time.
  // sqrt curve tightens the gap at the top so Master doesn't dominate the clock.
  const pct = 0.012 + Math.sqrt(level) * 0.015;

  // Scale down for fast time controls so the engine doesn't flag in bullet.
  const tempoFactor = Math.min(1.0, timeControl / 120);

  const durationMs = Math.floor(remainingSec * pct * tempoFactor * 1000);
  return Math.max(500, Math.min(durationMs, 60_000));
}

/**
 * Core game state machine — owns the chess.js instance, orchestrates
 * player moves, engine moves, and end-of-game detection.
 */
export function useGame({
  playerColor,
  timeControl,
  level,
  openingBook,
  timerRef,
}: UseGameOptions): UseGameReturn {
  const [gameStatus, setGameStatus] = useState<GameStatus>('selection');
  const [currentTurn, setCurrentTurn] = useState<PlayerColor>('white');
  const [moveList, setMoveList] = useState<string[]>([]);
  const [fen, setFen] = useState(() => new Chess().fen());

  // chess.js lives in a ref — it never needs to trigger re-renders.
  const chessRef = useRef(new Chess());
  // Track game-over so async continuations can bail out early.
  const gameOverRef = useRef(false);

  const chess = chessRef.current;

  /** Mark the game as ended. */
  const endGame = useCallback((status: GameStatus) => {
    gameOverRef.current = true;
    setGameStatus(status);
  }, []);

  /** Apply a move to the internal chess.js board and check for game over. */
  const applyPlayerMove = useCallback((move: string): boolean => {
    const from = move.substring(0, 2) as Square;
    const to = move.substring(2, 4) as Square;
    const result = chess.move({ from, to, promotion: 'q' });
    if (!result) return false;

    if (chess.game_over()) {
      if (chess.in_checkmate()) {
        // After chess.move(), the turn flipped — chess.turn() is now the
        // side that is in checkmate (the loser). Winner is the opposite.
        endGame(chess.turn() === 'w' ? 'black' : 'white');
      } else {
        endGame('draw');
      }
      setFen(chess.fen());
      return true;
    }

    setFen(chess.fen());
    return true;
  }, [chess, endGame]);

  /** Sync a move to the WASM engine and advance the turn. */
  const syncToEngine = useCallback(async (move: string) => {
    await libraClient.libraMove(move);
    const position = await libraClient.libraToFEN();
    setFen(position);
    setMoveList((prev) => [...prev, move]);
    setCurrentTurn((t) => (t === 'white' ? 'black' : 'white'));
  }, []);

  /** Ask the engine to calculate and play its move. */
  const playEngineMove = useCallback(async () => {
    if (gameOverRef.current || chess.game_over()) return;

    const aiColor: PlayerColor = playerColor === 'white' ? 'black' : 'white';
    const remaining = timerRef.current?.getRemainingTime(aiColor) ?? timeControl;
    const duration = calcThinkTime(remaining, level, timeControl);

    // Try opening book first.
    if (openingBook) {
      const hash = await libraClient.libraZobristHash();
      const moves = openingBook[hash] || [];
      if (moves.length > 0) {
        const bookMove = moves[Math.floor(Math.random() * moves.length)];
        console.log(`info string opening move ${bookMove}`);
        applyPlayerMove(bookMove);
        await syncToEngine(bookMove);
        return;
      }
    }

    const engineMove = await libraClient.libraIterativeDeepeningSearch(duration);
    if (engineMove) {
      applyPlayerMove(engineMove);
      await syncToEngine(engineMove);
    }
  }, [playerColor, timeControl, level, openingBook, timerRef, chess, applyPlayerMove, syncToEngine]);

  /** Called when the user drops a piece on the board. */
  const handleDrop = useCallback((from: Square, to: Square): boolean => {
    if (
      gameStatus !== 'playing' ||
      gameOverRef.current ||
      (currentTurn === 'white' && playerColor !== 'white') ||
      (currentTurn === 'black' && playerColor !== 'black')
    ) {
      return false;
    }

    const moveStr = `${from}${to}`;
    // Dry-run to validate, then undo and apply for real.
    const result = chess.move({ from, to, promotion: 'q' });
    if (!result) return false;
    chess.undo();

    applyPlayerMove(moveStr);
    syncToEngine(moveStr);

    // Brief delay before the engine responds.
    setTimeout(() => { playEngineMove(); }, 100);
    return true;
  }, [gameStatus, currentTurn, playerColor, chess, applyPlayerMove, syncToEngine, playEngineMove]);

  /** Reset everything and start a fresh game. */
  const startGame = useCallback(async () => {
    gameOverRef.current = false;
    timerRef.current?.resetTimer();
    setMoveList([]);
    setCurrentTurn('white');
    setGameStatus('playing');

    await libraClient.libraLoadInitial();
    const initial = await libraClient.libraToFEN();
    chess.reset();
    setFen(initial);

    if (playerColor === 'black') {
      await playEngineMove();
    }
  }, [playerColor, timerRef, chess, playEngineMove]);

  return {
    gameStatus,
    currentTurn,
    fen,
    moveList,
    handleDrop,
    startGame,
    endGame,
  };
}
