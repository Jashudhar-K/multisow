'use client';
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Icon } from '@/components/ui/Icon';
import Link from 'next/link';

export default function OfflinePage() {
  return (
    <PageLayout title="Offline Mode">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mb-6">
          <Icon name="wifi_off" size={40} className="text-orange-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">You are offline</h1>
        <p className="text-neutral-400 max-w-md mb-8 leading-relaxed">
          It looks like you've lost your internet connection. Some features of MultiSow require an active connection, but you can still access cached pages.
        </p>
        <div className="flex gap-4">
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl transition flex items-center gap-2"
          >
            <Icon name="refresh" size={18} />
            Try Again
          </button>
          <Link href="/dashboard" className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition border border-white/10">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
