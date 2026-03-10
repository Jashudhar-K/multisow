export default function DesignerLoading() {
  return (
    <div className="flex h-screen bg-[#0a1628] animate-pulse">
      {/* Left panel */}
      <div className="w-72 border-r border-white/10 p-4 space-y-3">
        <div className="h-8 rounded-lg bg-white/5" />
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-14 rounded-lg bg-white/5" />
        ))}
      </div>
      {/* Canvas area */}
      <div className="flex-1 bg-[#0c1a2e]" />
      {/* Right panel */}
      <div className="w-72 border-l border-white/10 p-4 space-y-3">
        <div className="h-8 rounded-lg bg-white/5" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 rounded-lg bg-white/5" />
        ))}
      </div>
    </div>
  );
}
