'use client'

/**
 * page.tsx (Updates)
 *
 * Location: app/updates/page.tsx
 *
 * Console view onto KDOS's own update pipeline: what's pending
 * deployment to the fleet, and what has already shipped.
 */

import { Sidebar } from '@/components/Sidebar'
import { Topbar } from '@/components/Topbar'
import { RefreshCw, Rocket, CheckCircle2, Clock } from 'lucide-react'

interface UpdateEntry {
  readonly version: string
  readonly title: string
  readonly notes: string[]
  readonly status: 'Pending' | 'Deployed' | 'Scheduled'
  readonly date: string
}

const UPDATES: UpdateEntry[] = [
  {
    version: '2.4.2',
    title: 'Workforce reliability patch',
    notes: ['Fixes automation engineer retry loop', 'Improves plugin system error reporting'],
    status: 'Pending',
    date: 'Ready to deploy',
  },
  {
    version: '2.4.1',
    title: 'Analytics dashboard refresh',
    notes: ['Adds service-mix revenue breakdown', 'Improves monthly report export'],
    status: 'Deployed',
    date: '2026-07-11',
  },
  {
    version: '2.5.0',
    title: 'Multi-model routing',
    notes: ['Adds per-employee model fallback chains', 'Introduces GPU-aware scheduling'],
    status: 'Scheduled',
    date: '2026-07-25',
  },
  {
    version: '2.4.0',
    title: 'Licensing server hardening',
    notes: ['Adds automatic licence renewal reminders', 'Improves suspended-licence handling'],
    status: 'Deployed',
    date: '2026-06-29',
  },
]

const STATUS_META: Record<UpdateEntry['status'], { icon: typeof Clock; className: string }> = {
  Pending: { icon: Clock, className: 'text-[#F5B94D] border-[#F5B94D]/25 bg-[#F5B94D]/10' },
  Deployed: { icon: CheckCircle2, className: 'text-[#35D18C] border-[#35D18C]/25 bg-[#35D18C]/10' },
  Scheduled: { icon: RefreshCw, className: 'text-[#4FD1E8] border-[#4FD1E8]/25 bg-[#4FD1E8]/10' },
}

export default function UpdatesPage() {
  const pendingCount = UPDATES.filter((update) => update.status === 'Pending').length

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="ml-64 flex-1">
        <Topbar title="Updates" subtitle={`${pendingCount} update${pendingCount === 1 ? '' : 's'} pending deployment`} />

        <main className="px-8 py-8">
          <div className="mb-5 flex items-center gap-2 text-[#8B93A7]">
            <RefreshCw className="h-4 w-4" />
            <span className="text-xs">Release history and deployment queue</span>
          </div>

          <div className="space-y-3">
            {UPDATES.map((update) => {
              const meta = STATUS_META[update.status]
              const StatusIcon = meta.icon

              return (
                <div
                  key={update.version}
                  className="flex items-start justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl"
                >
                  <div className="flex gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] font-[family-name:var(--font-mono)] text-[10px] text-[#8B93A7]">
                      {update.version}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#EDEFF3]">{update.title}</p>
                      <ul className="mt-1.5 space-y-0.5">
                        {update.notes.map((note) => (
                          <li key={note} className="text-xs text-[#8B93A7]">
                            · {note}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2 text-[11px] text-[#8B93A7]">{update.date}</p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span
                      className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${meta.className}`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {update.status}
                    </span>
                    {update.status === 'Pending' && (
                      <button
                        type="button"
                        className="flex items-center gap-1.5 rounded-lg border border-[#3D7CFF]/40 bg-[#3D7CFF]/[0.12] px-3 py-1.5 text-xs font-medium text-[#EDEFF3] transition-colors hover:bg-[#3D7CFF]/[0.2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3D7CFF]"
                      >
                        <Rocket className="h-3.5 w-3.5" />
                        Deploy
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </main>
      </div>
    </div>
  )
}
