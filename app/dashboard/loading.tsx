export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#0a1628] p-6 space-y-6 animate-pulse">
      {/* Farm banner */}
      <div className="h-20 rounded-xl bg-white/5" />
      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-white/5" />
        ))}
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-64 rounded-xl bg-white/5" />
        <div className="h-64 rounded-xl bg-white/5" />
      </div>
    </div>
  );
}
