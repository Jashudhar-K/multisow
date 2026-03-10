export default function GlobalLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1628]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Loading…</p>
      </div>
    </div>
  );
}
