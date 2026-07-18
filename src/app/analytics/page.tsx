'use client'

/**
 * page.tsx (Analytics)
 *
 * Location: app/analytics/page.tsx
 *
 * Operational analytics across the KyleDev business: revenue trend
 * and service-line mix. Charts are built from plain divs rather than
 * a charting library, since this console's existing dependency set
 * isn't known — swap in a charting library here if one is already
 * part of the project.
 */

import { Sidebar } from '@/components/Sidebar'
import { Topbar } from '@/components/Topbar'
import { motion } from 'framer-motion'
import { BarChart3 } from 'lucide-react'

interface MonthlyRevenue {
  readonly month: string
  readonly amount: number
}

interface ServiceShare {
  readonly service: string
  readonly percent: number
  readonly color: string
}

const REVENUE: MonthlyRevenue[] = [
  { month: 'Feb', amount: 312000 },
  { month: 'Mar', amount: 338000 },
  { month: 'Apr', amount: 356000 },
  { month: 'May', amount: 349000 },
  { month: 'Jun', amount: 401000 },
  { month: 'Jul', amount: 486200 },
]

const SERVICE_MIX: ServiceShare[] = [
  { service: 'Business Automation', percent: 28, color: '#3D7CFF' },
  { service: 'Web Development', percent: 24, color: '#4FD1E8' },
  { service: 'AI Integration', percent: 18, color: '#7FA8FF' },
  { service: 'Hosting & Maintenance', percent: 16, color: '#35D18C' },
  { service: 'Mobile & Desktop', percent: 9, color: '#F5B94D' },
  { service: 'Other', percent: 5, color: '#8B93A7' },
]

const maxRevenue = Math.max(...REVENUE.map((entry) => entry.amount))

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="ml-64 flex-1">
        <Topbar title="Analytics" subtitle="Revenue and service performance across the business" />

        <main className="space-y-6 px-8 py-8">
          <div className="flex items-center gap-2 text-[#8B93A7]">
            <BarChart3 className="h-4 w-4" />
            <span className="text-xs">Trailing six-month view</span>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl lg:col-span-2">
              <div className="mb-6 flex items-baseline justify-between">
                <h2 className="font-[family-name:var(--font-display)] text-sm font-semibold text-[#EDEFF3]">
                  Monthly Revenue
                </h2>
                <p className="font-[family-name:var(--font-mono)] text-lg font-semibold text-[#EDEFF3]">
                  R {REVENUE[REVENUE.length - 1].amount.toLocaleString('en-ZA')}
                </p>
              </div>

              <div className="flex h-48 items-end gap-4">
                {REVENUE.map((entry, index) => (
                  <div key={entry.month} className="flex flex-1 flex-col items-center gap-2">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(entry.amount / maxRevenue) * 100}%` }}
                      transition={{ duration: 0.6, delay: index * 0.06, ease: 'easeOut' }}
                      className="w-full rounded-t-md bg-gradient-to-t from-[#3D7CFF]/40 to-[#7FA8FF] shadow-[0_0_16px_rgba(61,124,255,0.25)]"
                      style={{ minHeight: '4px' }}
                    />
                    <span className="text-[10px] text-[#8B93A7]">{entry.month}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl">
              <h2 className="mb-5 font-[family-name:var(--font-display)] text-sm font-semibold text-[#EDEFF3]">
                Revenue by Service
              </h2>

              <div className="mb-5 flex h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                {SERVICE_MIX.map((entry) => (
                  <div key={entry.service} style={{ width: `${entry.percent}%`, backgroundColor: entry.color }} />
                ))}
              </div>

              <div className="space-y-2.5">
                {SERVICE_MIX.map((entry) => (
                  <div key={entry.service} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-[#8B93A7]">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                      {entry.service}
                    </span>
                    <span className="font-[family-name:var(--font-mono)] text-[#EDEFF3]">{entry.percent}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl">
              <p className="text-xs text-[#8B93A7]">Average project value</p>
              <p className="mt-1 font-[family-name:var(--font-mono)] text-xl font-semibold text-[#EDEFF3]">
                R 94,300
              </p>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl">
              <p className="text-xs text-[#8B93A7]">Client retention rate</p>
              <p className="mt-1 font-[family-name:var(--font-mono)] text-xl font-semibold text-[#EDEFF3]">
                91.4%
              </p>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl">
              <p className="text-xs text-[#8B93A7]">Proposal win rate</p>
              <p className="mt-1 font-[family-name:var(--font-mono)] text-xl font-semibold text-[#EDEFF3]">
                38.2%
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
