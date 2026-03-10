"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1628] text-white p-8">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-6xl">🌱</div>
        <h1 className="text-2xl font-bold text-red-400">Something went wrong</h1>
        <p className="text-gray-400 text-sm leading-relaxed">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        {error.digest && (
          <p className="text-xs text-gray-600 font-mono">Error ID: {error.digest}</p>
        )}
        <button
          onClick={reset}
          className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition-colors text-sm font-medium"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
