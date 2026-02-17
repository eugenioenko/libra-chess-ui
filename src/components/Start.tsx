
type StartProps = {
  playerColor: 'white' | 'black';
  setPlayerColor: (color: 'white' | 'black') => void;
  timeControl: number;
  setTimeControl: (tc: number) => void;
  onStart: () => void;
  level: number;
  setLevel: (level: number) => void;
};

export function Start({ playerColor, setPlayerColor, timeControl, setTimeControl, level, setLevel, onStart }: StartProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center w-full max-w-xs mx-auto p-7 rounded-2xl shadow-2xl shadow-black/60 bg-[#161b22] ring-1 ring-white/10 min-w-[300px]">
        <div className="mb-6 text-center">
          <div className="text-3xl mb-1">♟</div>
          <h2 className="text-xl font-bold text-[#e6edf3] tracking-tight">New Game</h2>
          <p className="text-[#8b949e] text-sm mt-1">Configure your match</p>
        </div>

        <div className="w-full space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[#c9d1d9]">Play as</label>
            <div className="flex rounded-lg overflow-hidden ring-1 ring-white/10">
              <button
                onClick={() => setPlayerColor('white')}
                className={`px-4 py-1.5 text-sm font-medium transition-colors duration-150 cursor-pointer ${
                  playerColor === 'white'
                    ? 'bg-white text-gray-900'
                    : 'bg-[#21262d] text-[#8b949e] hover:text-[#c9d1d9]'
                }`}
              >
                ☀ White
              </button>
              <button
                onClick={() => setPlayerColor('black')}
                className={`px-4 py-1.5 text-sm font-medium transition-colors duration-150 cursor-pointer ${
                  playerColor === 'black'
                    ? 'bg-[#1c1c1c] text-white ring-1 ring-white/20'
                    : 'bg-[#21262d] text-[#8b949e] hover:text-[#c9d1d9]'
                }`}
              >
                ☾ Black
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[#c9d1d9]">Time Control</label>
            <select
              value={timeControl}
              onChange={e => setTimeControl(Number(e.target.value))}
              className="bg-[#21262d] text-[#c9d1d9] text-sm rounded-lg px-3 py-1.5 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
            >
              <option value="60">Bullet (1+0)</option>
              <option value="180">Blitz (3+0)</option>
              <option value="900">Rapid (15+0)</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[#c9d1d9]">Difficulty</label>
            <select
              value={level}
              onChange={e => setLevel(Number(e.target.value))}
              className="bg-[#21262d] text-[#c9d1d9] text-sm rounded-lg px-3 py-1.5 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
            >
              <option value={1}>Easy</option>
              <option value={3}>Medium</option>
              <option value={9}>Hard</option>
              <option value={20}>Extreme</option>
            </select>
          </div>
        </div>

        <button
          className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold rounded-xl px-6 py-2.5 transition-colors duration-150 cursor-pointer text-sm tracking-wide"
          onClick={onStart}
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
