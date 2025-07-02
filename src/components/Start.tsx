type StartProps = {
  playerColor: 'white' | 'black';
  setPlayerColor: (color: 'white' | 'black') => void;
  timeControl: 'bullet' | 'blitz' | 'rapid';
  setTimeControl: (tc: 'bullet' | 'blitz' | 'rapid') => void;
  onStart: () => void;
};

export function Start({ playerColor, setPlayerColor, timeControl, setTimeControl, onStart }: StartProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className={"flex flex-col items-center max-w-sm mx-auto mt-12 p-8 rounded-xl shadow-lg bg-zinc-900 text-zinc-100 min-w-[320px]"}>
        <h2 className="mb-6 text-2xl font-bold text-zinc-200"> New Game</h2>
        <div className="w-full flex items-center justify-between mb-4">
          <label className="text-white">Color</label>
          <select value={playerColor} onChange={e => setPlayerColor(e.target.value as 'white' | 'black')} className="bg-zinc-700 text-white rounded px-2 py-1">
            <option value="white">White</option>
            <option value="black">Black</option>
          </select>
        </div>
        <div className="w-full flex items-center justify-between mb-6">
          <label className="text-white">Time Control</label>
          <select value={timeControl} onChange={e => setTimeControl(e.target.value as 'bullet' | 'blitz' | 'rapid')} className="bg-zinc-700 text-white rounded px-2 py-1">
            <option value="bullet">Bullet (1+0)</option>
            <option value="blitz">Blitz (3+0)</option>
            <option value="rapid">Rapid (15+0)</option>
          </select>
        </div>
        <button
          className="start-btn bg-green-700 hover:bg-green-500 text-white font-semibold rounded px-6 py-2 mt-4 transition-colors duration-150 cursor-pointer"
          onClick={onStart}
        >
          Start Game
        </button>
      </div>
    </div>
  );
}