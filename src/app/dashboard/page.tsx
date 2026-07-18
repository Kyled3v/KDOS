'use client'

/**
 * page.tsx (Dashboard)
 *
 * Location: app/dashboard/page.tsx
 *
 * The Master Control Centre's home view: headline metrics across the
 * KyleDev operation, live system telemetry, and one-tap shortcuts
 * into the most common operator actions.
 */

import { Sidebar } from '@/components/Sidebar'
import { Topbar } from '@/components/Topbar'
import { DashboardCard } from '@/components/DashboardCard'
import { QuickAction } from '@/components/QuickAction'
import { SystemStatus } from '@/components/SystemStatus'
import {
  Building2,
  Bot,
  Cpu,
  Wallet,
  FolderKanban,
  RefreshCw,
  HeartPulse,
  UserPlus,
  KeySquare,
  Download,
  Rocket,
  FileText,
} from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="ml-64 flex-1">
        <Topbar title="Dashboard" subtitle="Live overview of the KyleDev operation" />

        <main className="space-y-8 px-8 py-8">
          <section>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <DashboardCard
                label="Active Companies"
                value="18"
                icon={Building2}
                trend={{ direction: 'up', value: '+2 this month' }}
                accent="blue"
                index={0}
              />
              <DashboardCard
                label="Online Workforce"
                value="23 / 23"
                icon={Bot}
                trend={{ direction: 'flat', value: 'all reporting' }}
                accent="cyan"
                index={1}
              />
              <DashboardCard
                label="Installed Models"
                value="7"
                icon={Cpu}
                trend={{ direction: 'up', value: '+1 this week' }}
                accent="blue"
                index={2}
              />
              <DashboardCard
                label="Monthly Revenue"
                value="R 486,200"
                icon={Wallet}
                trend={{ direction: 'up', value: '+12.4%' }}
                accent="green"
                index={3}
              />
              <DashboardCard
                label="Projects"
                value="34"
                icon={FolderKanban}
                trend={{ direction: 'up', value: '+5 active' }}
                accent="blue"
                index={4}
              />
              <DashboardCard
                label="Pending Updates"
                value="3"
                icon={RefreshCw}
                trend={{ direction: 'down', value: '-2 resolved' }}
                accent="amber"
                index={5}
              />
              <DashboardCard
                label="System Health"
                value="Nominal"
                icon={HeartPulse}
                trend={{ direction: 'flat', value: 'no incidents' }}
                accent="green"
                index={6}
              />
            </div>
          </section>

          <section>
            <SystemStatus
              resources={[
                { label: 'CPU', percent: 41 },
                { label: 'RAM', percent: 63 },
                { label: 'GPU', percent: 28 },
              ]}
              services={[
                { label: 'KDOS Runtime', state: 'online', detail: 'Uptime 14d 6h' },
                { label: 'Ollama Status', state: 'online', detail: '7 models loaded' },
                { label: 'License Server', state: 'online', detail: 'Sync 2 min ago' },
                { label: 'Plugin System', state: 'degraded', detail: '1 plugin needs update' },
              ]}
            />
          </section>

          <section>
            <h2 className="mb-4 font-[family-name:var(--font-display)] text-sm font-semibold text-[#EDEFF3]">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <QuickAction
                label="Register Company"
                description="Onboard a new client company into KDOS"
                icon={UserPlus}
                index={0}
              />
              <QuickAction
                label="Issue License"
                description="Activate a licence for a registered company"
                icon={KeySquare}
                index={1}
              />
              <QuickAction
                label="Install Model"
                description="Pull and register a new AI model"
                icon={Download}
                index={2}
              />
              <QuickAction
                label="Deploy Update"
                description="Push a pending update to the fleet"
                icon={Rocket}
                index={3}
              />
              <QuickAction
                label="Create Proposal"
                description="Start a new proposal from a template"
                icon={FileText}
                index={4}
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
