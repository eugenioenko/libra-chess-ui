import React from "react";

const Loader: React.FC = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0d1117] z-50 gap-4">
    <div className="text-4xl">♟</div>
    <div className="w-10 h-10 border-2 border-[#30363d] border-t-emerald-500 rounded-full animate-spin"></div>
    <p className="text-[#8b949e] text-sm font-medium tracking-wide">Loading engine…</p>
  </div>
);

export default Loader;
