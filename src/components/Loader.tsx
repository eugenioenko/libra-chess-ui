const Loader = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#060609] z-50 gap-5">
    <div className="text-5xl animate-pulse">♟</div>
    <div className="w-8 h-8 border-2 border-white/[0.06] border-t-emerald-500 rounded-full animate-spin" />
    <p className="text-[#64748b] text-sm font-medium tracking-wide">Loading engine...</p>
  </div>
);

export default Loader;
