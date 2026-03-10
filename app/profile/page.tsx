'use client'

import { useSession, signOut } from 'next-auth/react'
import { Icon } from '@/components/ui/Icon'
import PageLayout from '@/components/layout/PageLayout'

export default function ProfilePage() {
  const { data: session } = useSession()

  return (
    <PageLayout title="Profile">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="flex flex-col items-center gap-3 py-8">
          <div className="w-20 h-20 rounded-full bg-primary-600/20 flex items-center justify-center">
            <Icon name="account_circle" size={40} className="text-primary-400" />
          </div>
          <h2 className="text-xl font-bold text-text-primary">{session?.user?.name ?? 'User'}</h2>
          {session?.user?.email && (
            <p className="flex items-center gap-1.5 text-sm text-text-muted">
              <Icon name="mail" size={14} /> {session.user.email}
            </p>
          )}
        </div>

        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-medium text-sm hover:bg-red-500/20 transition-colors"
        >
          <Icon name="logout" size={16} />
          Sign Out
        </button>
      </div>
    </PageLayout>
  )
}
