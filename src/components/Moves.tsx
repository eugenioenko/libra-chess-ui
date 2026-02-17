interface MovesProps {
  moveList: string[];
}

export function Moves({ moveList }: MovesProps) {
  const movePairs = [];
  for (let i = 0; i < moveList.length; i += 2) {
    movePairs.push([moveList[i], moveList[i + 1]]);
  }

  return (
    <div className="min-w-[180px] rounded-xl bg-[#161b22] ring-1 ring-white/5 shadow-xl shadow-black/40 flex flex-col h-[160px] md:h-auto md:max-h-[640px] overflow-hidden">
      <div className="px-4 pt-4 pb-2 border-b border-white/5">
        <h3 className="text-xs font-semibold text-[#8b949e] uppercase tracking-widest">Moves</h3>
      </div>
      <div className="grid grid-cols-[28px_1fr_1fr] px-2 py-1 border-b border-white/5">
        <div></div>
        <div className="text-[10px] font-semibold text-[#8b949e] uppercase tracking-widest px-2">White</div>
        <div className="text-[10px] font-semibold text-[#8b949e] uppercase tracking-widest px-2">Black</div>
      </div>
      <div className="overflow-y-auto flex-1">
        {movePairs.map((pair, idx) => (
          <div
            key={idx}
            className={`grid grid-cols-[28px_1fr_1fr] px-2 py-1 text-sm ${idx % 2 === 0 ? '' : 'bg-white/[0.02]'}`}
          >
            <div className="font-mono text-xs text-[#484f58] self-center">{idx + 1}.</div>
            <div className="font-mono text-[#c9d1d9] px-2 py-0.5 rounded hover:bg-white/5 transition-colors">{pair[0]}</div>
            <div className="font-mono text-[#c9d1d9] px-2 py-0.5 rounded hover:bg-white/5 transition-colors">{pair[1] || ''}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
