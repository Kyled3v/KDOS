'use client'

/**
 * page.tsx (Settings)
 *
 * Location: app/settings/page.tsx
 *
 * Console-level configuration: runtime behaviour, notification
 * preferences, and account details. Not a client-facing settings
 * screen — this configures the Master Control Centre itself.
 */

import { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { Topbar } from '@/components/Topbar'
import { Settings as SettingsIcon } from 'lucide-react'

interface ToggleRowProps {
  readonly label: string
  readonly description: string
  readonly defaultChecked?: boolean
}

function ToggleRow({ label, description, defaultChecked = false }: ToggleRowProps) {
  const [checked, setChecked] = useState(defaultChecked)

  return (
    <div className="flex items-center justify-between border-b border-white/[0.05] py-4 last:border-0">
      <div>
        <p className="text-sm font-medium text-[#EDEFF3]">{label}</p>
        <p className="mt-0.5 text-xs text-[#8B93A7]">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => setChecked((value) => !value)}
        className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3D7CFF] ${
          checked ? 'border-[#3D7CFF]/50 bg-[#3D7CFF]/40' : 'border-white/[0.12] bg-white/[0.06]'
        }`}
      >
        <span
          className={`absolute top-0.5 h-4.5 w-4.5 rounded-full bg-[#EDEFF3] transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="ml-64 flex-1">
        <Topbar title="Settings" subtitle="Configure the Master Control Centre" />

        <main className="max-w-3xl space-y-6 px-8 py-8">
          <div className="flex items-center gap-2 text-[#8B93A7]">
            <SettingsIcon className="h-4 w-4" />
            <span className="text-xs">Runtime, notifications, and account</span>
          </div>

          <section className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl">
            <h2 className="font-[family-name:var(--font-display)] text-sm font-semibold text-[#EDEFF3]">
              Runtime
            </h2>
            <div className="mt-3">
              <ToggleRow
                label="Auto-deploy scheduled updates"
                description="Apply scheduled updates to the fleet automatically at their release time"
                defaultChecked
              />
              <ToggleRow
                label="GPU-aware model scheduling"
                description="Prefer GPU-accelerated inference for reasoning-tier models when available"
                defaultChecked
              />
              <ToggleRow
                label="Offline fallback mode"
                description="Allow the workforce to continue on locally installed models if hosted models are unreachable"
              />
            </div>
          </section>

          <section className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl">
            <h2 className="font-[family-name:var(--font-display)] text-sm font-semibold text-[#EDEFF3]">
              Notifications
            </h2>
            <div className="mt-3">
              <ToggleRow
                label="Licence expiry alerts"
                description="Notify when a company's licence is within 14 days of expiring"
                defaultChecked
              />
              <ToggleRow
                label="Plugin health alerts"
                description="Notify when a plugin degrades or requires an update"
                defaultChecked
              />
              <ToggleRow
                label="Weekly revenue digest"
                description="Send a weekly summary of revenue and pipeline activity"
              />
            </div>
          </section>

          <section className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl">
            <h2 className="font-[family-name:var(--font-display)] text-sm font-semibold text-[#EDEFF3]">
              Account
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs text-[#8B93A7]" htmlFor="operator-name">
                  Operator name
                </label>
                <input
                  id="operator-name"
                  type="text"
                  defaultValue="Kyle"
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-[#EDEFF3] focus:border-[#3D7CFF]/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-[#8B93A7]" htmlFor="operator-email">
                  Operator email
                </label>
                <input
                  id="operator-email"
                  type="email"
                  defaultValue="kyle@kyledev.co.za"
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-[#EDEFF3] focus:border-[#3D7CFF]/50 focus:outline-none"
                />
              </div>
              <button
                type="button"
                className="rounded-lg border border-[#3D7CFF]/40 bg-[#3D7CFF]/[0.12] px-4 py-2 text-xs font-medium text-[#EDEFF3] transition-colors hover:bg-[#3D7CFF]/[0.2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3D7CFF]"
              >
                Save changes
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
