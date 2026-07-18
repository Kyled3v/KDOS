import { redirect } from 'next/navigation'

/**
 * page.tsx
 *
 * Location: app/page.tsx
 *
 * The Master Control Centre has no standalone landing page — it opens
 * straight into the Dashboard, the same way an aircraft's console
 * doesn't have a "home screen" separate from its instrument panel.
 */
export default function RootPage() {
  redirect('/dashboard')
}