/**
 * /settings — Redirects to /profile.
 * Settings functionality has been consolidated into the Profile page.
 */
import { redirect } from 'next/navigation'

export default function SettingsPage() {
  redirect('/profile')
}
