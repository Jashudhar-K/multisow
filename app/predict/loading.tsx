export default function PredictLoading() {
  return (
    <div className="min-h-screen bg-[#0a1628] p-6 space-y-6 animate-pulse">
      {/* KPI row */}
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-white/5" />
        ))}
      </div>
      {/* Explanation card */}
      <div className="h-28 rounded-xl bg-white/5" />
      {/* Layer result cards */}
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-32 rounded-xl bg-white/5" />
      ))}
    </div>
  );
}
