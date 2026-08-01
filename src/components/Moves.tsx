interface MovesProps {
  moveList: string[];
}

export function Moves({ moveList }: MovesProps) {
  const movePairs = [];
  for (let i = 0; i < moveList.length; i += 2) {
    movePairs.push([moveList[i], moveList[i + 1]]);
  }

  return (
    <div className="lg:w-[200px] shrink-0 rounded-2xl bg-[#0d0d13] ring-1 ring-white/[0.06] shadow-[0_0_40px_-8px_rgba(0,0,0,0.4)] flex flex-col h-[180px] lg:h-auto lg:max-h-[600px] overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-white/[0.05]">
        <h3 className="text-xs font-semibold text-[#64748b] uppercase tracking-[0.2em]">Moves</h3>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[32px_1fr_1fr] px-3 py-2 border-b border-white/[0.04]">
        <div />
        <div className="text-[10px] font-semibold text-[#475569] uppercase tracking-widest px-1.5">W</div>
        <div className="text-[10px] font-semibold text-[#475569] uppercase tracking-widest px-1.5">B</div>
      </div>

      {/* Move list */}
      <div className="overflow-y-auto flex-1 scrollbar-thin">
        {movePairs.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs text-[#334155] font-medium">Waiting for first move...</p>
          </div>
        ) : (
          movePairs.map((pair, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-[32px_1fr_1fr] px-3 py-1.5 text-sm transition-colors ${
                idx % 2 === 0 ? '' : 'bg-white/[0.015]'
              }`}
            >
              <div className="font-mono text-[11px] text-[#334155] self-center">{idx + 1}.</div>
              <div className="font-mono text-[13px] text-[#cbd5e1] px-1.5 py-0.5 rounded hover:bg-white/[0.04] transition-colors tracking-tight">{pair[0]}</div>
              <div className="font-mono text-[13px] text-[#cbd5e1] px-1.5 py-0.5 rounded hover:bg-white/[0.04] transition-colors tracking-tight">{pair[1] || ''}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
