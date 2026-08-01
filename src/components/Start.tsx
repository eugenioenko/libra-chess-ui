

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
    <div className="absolute inset-0 flex items-center justify-center z-10 backdrop-blur-[1px]">
      <div className="animate-fade-in flex flex-col items-center w-full max-w-sm p-6 rounded-2xl bg-[#0d0d13] ring-1 ring-white/[0.08] shadow-[0_0_60px_-12px_rgba(0,0,0,0.6)]">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="text-4xl mb-2">♟</div>
          <h2 className="text-xl font-bold text-[#e2e8f0] tracking-tight">New Game</h2>
          <p className="text-[#64748b] text-sm mt-0.5">Configure your match</p>
        </div>

        <div className="w-full space-y-4">
          {/* Color picker */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[#cbd5e1]">Play as</label>
            <div className="flex rounded-lg overflow-hidden ring-1 ring-white/[0.08]">
              <button
                onClick={() => setPlayerColor('white')}
                className={`px-4 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
                  playerColor === 'white'
                    ? 'bg-white text-gray-900 shadow-inner'
                    : 'bg-[#16161e] text-[#64748b] hover:text-[#94a3b8] hover:bg-[#1a1a24]'
                }`}
              >
                White
              </button>
              <button
                onClick={() => setPlayerColor('black')}
                className={`px-4 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
                  playerColor === 'black'
                    ? 'bg-[#1a1a1a] text-white ring-1 ring-white/10'
                    : 'bg-[#16161e] text-[#64748b] hover:text-[#94a3b8] hover:bg-[#1a1a24]'
                }`}
              >
                Black
              </button>
            </div>
          </div>

          {/* Time control */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[#cbd5e1]">Time</label>
            <select
              value={timeControl}
              onChange={e => setTimeControl(Number(e.target.value))}
              className="bg-[#16161e] text-[#cbd5e1] text-sm rounded-lg px-3 py-1.5 ring-1 ring-white/[0.08] focus:outline-none focus:ring-2 focus:ring-emerald-500/40 cursor-pointer transition-all"
            >
              <option value="60">Bullet · 1+0</option>
              <option value="180">Blitz · 3+0</option>
              <option value="300">Blitz · 5+0</option>
              <option value="600">Rapid · 10+0</option>
              <option value="900">Rapid · 15+0</option>
            </select>
          </div>

          {/* Difficulty */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[#cbd5e1]">Difficulty</label>
            <select
              value={level}
              onChange={e => setLevel(Number(e.target.value))}
              className="bg-[#16161e] text-[#cbd5e1] text-sm rounded-lg px-3 py-1.5 ring-1 ring-white/[0.08] focus:outline-none focus:ring-2 focus:ring-emerald-500/40 cursor-pointer transition-all"
            >
              <option value={1}>Easy</option>
              <option value={3}>Medium</option>
              <option value={6}>Hard</option>
              <option value={12}>Expert</option>
              <option value={20}>Master</option>
            </select>
          </div>
        </div>

        {/* Start button */}
        <button
          className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold rounded-xl px-6 py-2.5 transition-all duration-200 cursor-pointer text-sm tracking-wide shadow-[0_4px_20px_-6px_rgba(16,185,129,0.35)] hover:shadow-[0_6px_24px_-6px_rgba(16,185,129,0.45)]"
          onClick={onStart}
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
