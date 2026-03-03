import React from "react";

export function SkeletonCard({ className = "", lines = 4 }: { className?: string; lines?: number }) {
  return (
    <div className={`animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800 p-4 shadow ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-300 dark:bg-neutral-700 rounded mb-2 last:mb-0"
          style={{ width: `${80 - i * 10}%` }}
        />
      ))}
    </div>
  );
}
