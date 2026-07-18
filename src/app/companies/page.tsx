'use client'

/**
 * page.tsx (Companies)
 *
 * Location: app/companies/page.tsx
 *
 * Roster of every company operating under a KDOS licence — the
 * console's client registry, not KyleDev's own org chart (that lives
 * under AI Workforce).
 */

import { Sidebar } from '@/components/Sidebar'
import { Topbar } from '@/components/Topbar'
import { Building2, Plus, MoreHorizontal } from 'lucide-react'

interface CompanyRow {
  readonly name: string
  readonly industry: string
  readonly edition: string
  readonly users: number
  readonly status: 'Active' | 'Trial' | 'Suspended'
  readonly mrr: string
}

const COMPANIES: CompanyRow[] = [
  { name: 'Kopano Mining Group', industry: 'Mining', edition: 'Enterprise', users: 42, status: 'Active', mrr: 'R 38,500' },
  { name: 'Retief & Associates', industry: 'Legal', edition: 'Standard', users: 9, status: 'Active', mrr: 'R 6,200' },
  { name: 'Bright Path Academy', industry: 'Education', edition: 'Standard', users: 14, status: 'Trial', mrr: 'R 0' },
  { name: 'Vantage Logistics', industry: 'Logistics', edition: 'Enterprise', users: 61, status: 'Active', mrr: 'R 41,900' },
  { name: 'Coastal Build Co.', industry: 'Construction', edition: 'Standard', users: 22, status: 'Active', mrr: 'R 11,400' },
  { name: 'Lindiwe Health Partners', industry: 'Healthcare', edition: 'Standard', users: 8, status: 'Suspended', mrr: 'R 0' },
  { name: 'Northgate Retail', industry: 'Retail', edition: 'Enterprise', users: 35, status: 'Active', mrr: 'R 24,700' },
  { name: 'Meridian Manufacturing', industry: 'Manufacturing', edition: 'Standard', users: 18, status: 'Active', mrr: 'R 15,300' },
]

const STATUS_STYLES: Record<CompanyRow['status'], string> = {
  Active: 'bg-[#35D18C]/10 text-[#35D18C] border-[#35D18C]/25',
  Trial: 'bg-[#F5B94D]/10 text-[#F5B94D] border-[#F5B94D]/25',
  Suspended: 'bg-[#F1554C]/10 text-[#F1554C] border-[#F1554C]/25',
}

export default function CompaniesPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="ml-64 flex-1">
        <Topbar title="Companies" subtitle={`${COMPANIES.length} companies under active licence`} />

        <main className="px-8 py-8">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#8B93A7]">
              <Building2 className="h-4 w-4" />
              <span className="text-xs">Client registry</span>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-[#3D7CFF]/40 bg-[#3D7CFF]/[0.12] px-3.5 py-2 text-xs font-medium text-[#EDEFF3] transition-colors hover:bg-[#3D7CFF]/[0.2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3D7CFF]"
            >
              <Plus className="h-3.5 w-3.5" />
              Register Company
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-wide text-[#8B93A7]">
                  <th className="px-5 py-3 font-medium">Company</th>
                  <th className="px-5 py-3 font-medium">Industry</th>
                  <th className="px-5 py-3 font-medium">Edition</th>
                  <th className="px-5 py-3 font-medium">Users</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">MRR</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {COMPANIES.map((company) => (
                  <tr
                    key={company.name}
                    className="border-b border-white/[0.04] text-[#EDEFF3] transition-colors last:border-0 hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-3.5 font-medium">{company.name}</td>
                    <td className="px-5 py-3.5 text-[#8B93A7]">{company.industry}</td>
                    <td className="px-5 py-3.5 text-[#8B93A7]">{company.edition}</td>
                    <td className="px-5 py-3.5 font-[family-name:var(--font-mono)] text-[#8B93A7]">
                      {company.users}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${STATUS_STYLES[company.status]}`}
                      >
                        {company.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-[family-name:var(--font-mono)]">{company.mrr}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        aria-label={`More actions for ${company.name}`}
                        className="text-[#8B93A7] transition-colors hover:text-[#EDEFF3]"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
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
