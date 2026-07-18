'use client'

/**
 * page.tsx (Models)
 *
 * Location: app/models/page.tsx
 *
 * Console view onto the AI models installed and available to the
 * workforce — install status, capability flags, and which employees
 * are permitted to use each one.
 */

import { Sidebar } from '@/components/Sidebar'
import { Topbar } from '@/components/Topbar'
import { Cpu, Download, Eye, Brain, Wrench, Code2 } from 'lucide-react'

interface ModelRow {
  readonly id: string
  readonly family: string
  readonly sizeGb: number
  readonly installed: boolean
  readonly enabled: boolean
  readonly capabilities: ('vision' | 'reasoning' | 'tools' | 'coding')[]
}

const MODELS: ModelRow[] = [
  { id: 'anthropic/claude-sonnet-4.5', family: 'Claude', sizeGb: 0, installed: true, enabled: true, capabilities: ['reasoning', 'tools', 'coding'] },
  { id: 'moonshotai/kimi-k2', family: 'Kimi', sizeGb: 62, installed: true, enabled: true, capabilities: ['reasoning', 'tools'] },
  { id: 'qwen/qwen-2.5-72b', family: 'Qwen', sizeGb: 48, installed: true, enabled: true, capabilities: ['reasoning', 'coding'] },
  { id: 'deepseek/deepseek-v3', family: 'DeepSeek', sizeGb: 44, installed: true, enabled: false, capabilities: ['reasoning', 'coding'] },
  { id: 'llama3.2-vision:11b', family: 'Llama', sizeGb: 11, installed: true, enabled: true, capabilities: ['vision'] },
  { id: 'mistral-small:24b', family: 'Mistral', sizeGb: 14, installed: true, enabled: true, capabilities: ['tools'] },
  { id: 'nomic-embed-text', family: 'Nomic', sizeGb: 0.3, installed: true, enabled: true, capabilities: [] },
  { id: 'qwen/qwen-2.5-coder-32b', family: 'Qwen', sizeGb: 20, installed: false, enabled: false, capabilities: ['coding'] },
]

const CAPABILITY_ICON: Record<string, typeof Eye> = {
  vision: Eye,
  reasoning: Brain,
  tools: Wrench,
  coding: Code2,
}

export default function ModelsPage() {
  const installedCount = MODELS.filter((model) => model.installed).length

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="ml-64 flex-1">
        <Topbar title="Models" subtitle={`${installedCount} of ${MODELS.length} models installed`} />

        <main className="px-8 py-8">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#8B93A7]">
              <Cpu className="h-4 w-4" />
              <span className="text-xs">Local and routed model catalogue</span>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-[#3D7CFF]/40 bg-[#3D7CFF]/[0.12] px-3.5 py-2 text-xs font-medium text-[#EDEFF3] transition-colors hover:bg-[#3D7CFF]/[0.2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3D7CFF]"
            >
              <Download className="h-3.5 w-3.5" />
              Install Model
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {MODELS.map((model) => (
              <div
                key={model.id}
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <p className="truncate font-[family-name:var(--font-mono)] text-xs text-[#EDEFF3]">
                      {model.id}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#8B93A7]">
                      {model.family} · {model.sizeGb > 0 ? `${model.sizeGb} GB` : 'hosted'}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                      model.installed
                        ? model.enabled
                          ? 'border-[#35D18C]/25 bg-[#35D18C]/10 text-[#35D18C]'
                          : 'border-white/[0.12] bg-white/[0.04] text-[#8B93A7]'
                        : 'border-[#F5B94D]/25 bg-[#F5B94D]/10 text-[#F5B94D]'
                    }`}
                  >
                    {model.installed ? (model.enabled ? 'Enabled' : 'Disabled') : 'Available'}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  {model.capabilities.length === 0 && (
                    <span className="text-[11px] text-[#8B93A7]">Embedding model</span>
                  )}
                  {model.capabilities.map((capability) => {
                    const Icon = CAPABILITY_ICON[capability]
                    return (
                      <span
                        key={capability}
                        className="flex items-center gap-1 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-[10px] capitalize text-[#8B93A7]"
                      >
                        <Icon className="h-3 w-3" />
                        {capability}
                      </span>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
