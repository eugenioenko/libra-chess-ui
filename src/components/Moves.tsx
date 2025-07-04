interface MovesProps {
  moveList: string[];
}

export function Moves({ moveList }: MovesProps) {
  const movePairs = [];
  for (let i = 0; i < moveList.length; i += 2) {
    movePairs.push([moveList[i], moveList[i + 1]]);
  }

  return (
    <div className="min-w-[200px] min-h-[200px] rounded-xl shadow-lg bg-zinc-900 text-zinc-100 p-3 h-[200px] md:h-auto md:max-h-[660px] overflow-hidden pb-12">
      <h3 className="text-base font-semibold mb-2">Moves</h3>
      <div className="overflow-y-auto max-h-full">
        {movePairs.map((pair, idx) => (
          <div key={idx} className="flex gap-4 items-baseline mb-2">
            <div className="font-mono text-xs text-gray-500 w-6">{idx + 1}.</div>
            <div>{pair[0]}</div>
            <div>{pair[1] || ''}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
