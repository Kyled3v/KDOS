import type { Metadata } from 'next'
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

/**
 * layout.tsx
 *
 * Location: app/layout.tsx
 *
 * Root layout for the KDOS Master Control Centre — KyleDev's internal
 * desktop application, not the client-facing product. Establishes the
 * black/glass/blue design system's typography and ambient background
 * that every page in the console sits on top of.
 *
 * Design tokens (referenced throughout the console via Tailwind
 * arbitrary values, no config changes required):
 *   --void         #06070A   page background
 *   --panel        #0B0D12   base panel fill before glass overlay
 *   --border-glass rgba(255,255,255,0.08)
 *   --text-primary #EDEFF3
 *   --text-muted   #8B93A7
 *   --accent       #3D7CFF   primary blue accent
 *   --accent-soft  #7FA8FF   glow/gradient variant
 *   --accent-cyan  #4FD1E8   secondary telemetry accent
 *   --status-ok    #35D18C
 *   --status-warn  #F5B94D
 *   --status-crit  #F1554C
 */

const displayFont = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
})

const bodyFont = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
})

const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'KDOS — Master Control Centre',
  description: "KyleDev's internal command centre for companies, workforce, models, and licensing.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}>
      <body className="relative min-h-screen bg-[#06070A] font-[family-name:var(--font-body)] text-[#EDEFF3] antialiased">
        {/* Ambient background: two soft blue radial glows, fixed behind all content */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-[560px] w-[560px] rounded-full bg-[#3D7CFF]/[0.10] blur-[140px]" />
          <div className="absolute -bottom-40 right-0 h-[480px] w-[480px] rounded-full bg-[#4FD1E8]/[0.07] blur-[140px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />
        </div>

        <div className="relative z-10">{children}</div>
      </body>
    </html>
  )
}