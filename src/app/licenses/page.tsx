'use client'

/**
 * page.tsx (Licenses)
 *
 * Location: app/licenses/page.tsx
 *
 * Console view onto every issued licence: which company holds it,
 * what edition, its status, and when it expires or was last checked.
 */

import { Sidebar } from '@/components/Sidebar'
import { Topbar } from '@/components/Topbar'
import { KeySquare, Plus } from 'lucide-react'

type LicenseStatus = 'Active' | 'Trial' | 'Expired' | 'Suspended'

interface LicenseRow {
  readonly company: string
  readonly edition: string
  readonly status: LicenseStatus
  readonly issuedAt: string
  readonly expiresAt: string
  readonly lastCheck: string
}

const LICENSES: LicenseRow[] = [
  { company: 'Kopano Mining Group', edition: 'Enterprise', status: 'Active', issuedAt: '2024-02-11', expiresAt: '2026-02-11', lastCheck: '3 min ago' },
  { company: 'Retief & Associates', edition: 'Standard', status: 'Active', issuedAt: '2025-01-06', expiresAt: '2026-01-06', lastCheck: '17 min ago' },
  { company: 'Bright Path Academy', edition: 'Standard', status: 'Trial', issuedAt: '2026-06-30', expiresAt: '2026-07-14', lastCheck: '2 hours ago' },
  { company: 'Vantage Logistics', edition: 'Enterprise', status: 'Active', issuedAt: '2023-11-02', expiresAt: '2026-11-02', lastCheck: '5 min ago' },
  { company: 'Coastal Build Co.', edition: 'Standard', status: 'Active', issuedAt: '2025-05-19', expiresAt: '2026-05-19', lastCheck: '1 hour ago' },
  { company: 'Lindiwe Health Partners', edition: 'Standard', status: 'Suspended', issuedAt: '2024-09-01', expiresAt: '2026-09-01', lastCheck: '4 days ago' },
  { company: 'Northgate Retail', edition: 'Enterprise', status: 'Active', issuedAt: '2024-03-27', expiresAt: '2026-03-27', lastCheck: '9 min ago' },
  { company: 'Legacy Freight SA', edition: 'Standard', status: 'Expired', issuedAt: '2023-01-10', expiresAt: '2025-01-10', lastCheck: '61 days ago' },
]

const STATUS_STYLES: Record<LicenseStatus, string> = {
  Active: 'bg-[#35D18C]/10 text-[#35D18C] border-[#35D18C]/25',
  Trial: 'bg-[#4FD1E8]/10 text-[#4FD1E8] border-[#4FD1E8]/25',
  Expired: 'bg-white/[0.06] text-[#8B93A7] border-white/[0.12]',
  Suspended: 'bg-[#F1554C]/10 text-[#F1554C] border-[#F1554C]/25',
}

export default function LicensesPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="ml-64 flex-1">
        <Topbar title="Licenses" subtitle={`${LICENSES.length} licences issued`} />

        <main className="px-8 py-8">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#8B93A7]">
              <KeySquare className="h-4 w-4" />
              <span className="text-xs">Licence registry and renewal status</span>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-[#3D7CFF]/40 bg-[#3D7CFF]/[0.12] px-3.5 py-2 text-xs font-medium text-[#EDEFF3] transition-colors hover:bg-[#3D7CFF]/[0.2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3D7CFF]"
            >
              <Plus className="h-3.5 w-3.5" />
              Issue License
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-wide text-[#8B93A7]">
                  <th className="px-5 py-3 font-medium">Company</th>
                  <th className="px-5 py-3 font-medium">Edition</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Issued</th>
                  <th className="px-5 py-3 font-medium">Expires</th>
                  <th className="px-5 py-3 font-medium">Last check</th>
                </tr>
              </thead>
              <tbody>
                {LICENSES.map((license) => (
                  <tr
                    key={license.company}
                    className="border-b border-white/[0.04] text-[#EDEFF3] transition-colors last:border-0 hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-3.5 font-medium">{license.company}</td>
                    <td className="px-5 py-3.5 text-[#8B93A7]">{license.edition}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${STATUS_STYLES[license.status]}`}
                      >
                        {license.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-[family-name:var(--font-mono)] text-xs text-[#8B93A7]">
                      {license.issuedAt}
                    </td>
                    <td className="px-5 py-3.5 font-[family-name:var(--font-mono)] text-xs text-[#8B93A7]">
                      {license.expiresAt}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-[#8B93A7]">{license.lastCheck}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  )
}
