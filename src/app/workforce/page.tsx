'use client'

/**
 * page.tsx (AI Workforce)
 *
 * Location: app/workforce/page.tsx
 *
 * Live roster of KyleDev's AI employees — who they are, what
 * department they sit in, and what they're doing right now. This is
 * the console's view onto the employee definitions (CEO.ts, CTO.ts,
 * etc.) built elsewhere in the architecture, not a redefinition of
 * them.
 */

import { Sidebar } from '@/components/Sidebar'
import { Topbar } from '@/components/Topbar'
import { Bot } from 'lucide-react'

type WorkforceStatus = 'Working' | 'Idle' | 'Blocked'

interface WorkforceRow {
  readonly name: string
  readonly title: string
  readonly department: string
  readonly status: WorkforceStatus
  readonly activeTask: string
  readonly model: string
}

const WORKFORCE: WorkforceRow[] = [
  { name: 'Amara', title: 'CEO', department: 'Executive', status: 'Idle', activeTask: '—', model: 'reasoning-tier-1' },
  { name: 'Tebogo', title: 'COO', department: 'Executive', status: 'Working', activeTask: 'Reviewing Q3 delivery capacity', model: 'reasoning-tier-1' },
  { name: 'Ravi', title: 'CTO', department: 'Executive', status: 'Working', activeTask: 'Architecture review — Vantage Logistics', model: 'reasoning-tier-1' },
  { name: 'Zanele', title: 'Sales Director', department: 'Sales', status: 'Working', activeTask: 'Qualifying inbound lead — Coastal Build Co.', model: 'reasoning-tier-2' },
  { name: 'Michael', title: 'Business Consultant', department: 'Sales', status: 'Working', activeTask: 'Discovery call prep — Meridian Manufacturing', model: 'reasoning-tier-2' },
  { name: 'Aisha', title: 'Proposal Specialist', department: 'Sales', status: 'Blocked', activeTask: 'Awaiting scope confirmation', model: 'reasoning-tier-2' },
  { name: 'Johan', title: 'Quotation Specialist', department: 'Sales', status: 'Idle', activeTask: '—', model: 'fast-tier-1' },
  { name: 'Naledi', title: 'Software Architect', department: 'Engineering', status: 'Working', activeTask: 'Designing automation pipeline — Northgate Retail', model: 'reasoning-tier-1' },
  { name: 'Dean', title: 'Frontend Lead', department: 'Engineering', status: 'Working', activeTask: 'Building dashboard components', model: 'reasoning-tier-2' },
  { name: 'Priya', title: 'Backend Lead', department: 'Engineering', status: 'Working', activeTask: 'API integration — payment gateway', model: 'reasoning-tier-2' },
  { name: 'Karabo', title: 'Mobile Lead', department: 'Engineering', status: 'Idle', activeTask: '—', model: 'reasoning-tier-2' },
  { name: 'Ntando', title: 'Automation Engineer', department: 'Engineering', status: 'Working', activeTask: 'Workflow mapping — Lindiwe Health Partners', model: 'reasoning-tier-2' },
  { name: 'Sipho', title: 'DevOps Engineer', department: 'Engineering', status: 'Working', activeTask: 'Deploying update batch 24.3', model: 'fast-tier-1' },
  { name: 'Chantal', title: 'QA Engineer', department: 'Engineering', status: 'Working', activeTask: 'Regression pass — Retief & Associates portal', model: 'fast-tier-1' },
  { name: 'Bongani', title: 'Project Manager', department: 'Operations', status: 'Working', activeTask: 'Tracking 6 active project timelines', model: 'reasoning-tier-2' },
  { name: 'Farah', title: 'Customer Success Manager', department: 'Customer Success', status: 'Working', activeTask: 'Quarterly check-in — Kopano Mining Group', model: 'reasoning-tier-2' },
  { name: 'Liam', title: 'Marketing Director', department: 'Marketing', status: 'Idle', activeTask: '—', model: 'reasoning-tier-2' },
  { name: 'Thandeka', title: 'SEO Specialist', department: 'Marketing', status: 'Working', activeTask: 'Technical audit — Bright Path Academy', model: 'fast-tier-1' },
  { name: 'Werner', title: 'Content Creator', department: 'Marketing', status: 'Working', activeTask: 'Drafting case study — Vantage Logistics', model: 'fast-tier-1' },
  { name: 'Palesa', title: 'Finance Officer', department: 'Finance', status: 'Working', activeTask: 'Reconciling monthly invoices', model: 'fast-tier-1' },
  { name: 'Advocate Mokoena', title: 'Legal Advisor', department: 'Legal', status: 'Idle', activeTask: '—', model: 'reasoning-tier-1' },
  { name: 'Sarah', title: 'HR Manager', department: 'HR', status: 'Idle', activeTask: '—', model: 'fast-tier-1' },
  { name: 'Kagiso', title: 'Support Engineer', department: 'Customer Success', status: 'Working', activeTask: 'Ticket #4021 — login issue triage', model: 'fast-tier-1' },
]

const STATUS_DOT: Record<WorkforceStatus, string> = {
  Working: '#35D18C',
  Idle: '#8B93A7',
  Blocked: '#F5B94D',
}

export default function WorkforcePage() {
  const workingCount = WORKFORCE.filter((employee) => employee.status === 'Working').length

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="ml-64 flex-1">
        <Topbar title="AI Workforce" subtitle={`${workingCount} of ${WORKFORCE.length} employees currently working`} />

        <main className="px-8 py-8">
          <div className="mb-5 flex items-center gap-2 text-[#8B93A7]">
            <Bot className="h-4 w-4" />
            <span className="text-xs">KyleDev's permanent AI employee roster</span>
          </div>

          <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-wide text-[#8B93A7]">
                  <th className="px-5 py-3 font-medium">Employee</th>
                  <th className="px-5 py-3 font-medium">Title</th>
                  <th className="px-5 py-3 font-medium">Department</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Active task</th>
                  <th className="px-5 py-3 font-medium">Model</th>
                </tr>
              </thead>
              <tbody>
                {WORKFORCE.map((employee) => (
                  <tr
                    key={employee.title}
                    className="border-b border-white/[0.04] text-[#EDEFF3] transition-colors last:border-0 hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-3 font-medium">{employee.name}</td>
                    <td className="px-5 py-3 text-[#8B93A7]">{employee.title}</td>
                    <td className="px-5 py-3 text-[#8B93A7]">{employee.department}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: STATUS_DOT[employee.status] }}
                        />
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[#8B93A7]">{employee.activeTask}</td>
                    <td className="px-5 py-3 font-[family-name:var(--font-mono)] text-xs text-[#8B93A7]">
                      {employee.model}
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
