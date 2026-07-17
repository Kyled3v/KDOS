/**
 * DesktopDevelopment.ts
 *
 * Location: src/knowledge/services/DesktopDevelopment.ts
 *
 * Structured business intelligence for KyleDev's Desktop Development
 * service line. Machine-readable only — consumed directly by AI
 * employees, not documentation.
 *
 * Pricing in South African Rand (ZAR), reflecting realistic
 * mid-market South African rates as of 2025/2026; review against
 * KyleDev's current rate card before client-facing use.
 */

import type { ServiceKnowledge } from './WebDevelopment'

export const DesktopDevelopmentKnowledge: ServiceKnowledge = {
  serviceName: 'Desktop Development',
  description:
    'Cross-platform desktop application development for internal tools, point-of-sale systems, and offline-capable business software running on Windows, macOS, or Linux.',
  idealClients: [
    'Businesses needing an offline-first internal tool (no reliable internet on site)',
    'Companies replacing legacy desktop software (VB6, old Delphi/Access systems)',
    'Retailers or warehouses needing a point-of-sale or inventory system',
    'Engineering/technical teams needing a specialised desktop utility',
  ],
  companySizes: ['Small business (2-20 staff)', 'Mid-market (21-200 staff)', 'Enterprise (200+ staff)'],
  industries: ['Mining', 'Manufacturing', 'Retail', 'Construction', 'Logistics', 'Accounting'],
  businessProblems: [
    'Legacy desktop software no longer supported or maintainable',
    'Sites with unreliable or no internet connectivity',
    'Need for direct hardware integration (scanners, printers, scales)',
    'Data entry processes still reliant on spreadsheets or paper',
    'No centralised system for site-based operational data',
  ],
  businessBenefits: [
    'Offline-first reliability regardless of connectivity',
    'Direct integration with peripheral hardware',
    'Faster performance than browser-based equivalents for data-heavy tasks',
    'Reduced licensing costs versus legacy proprietary software',
    'Centralised, auditable operational data',
  ],
  commonDiscoveryQuestions: [
    'What operating systems must be supported?',
    'Does the tool need to work fully offline?',
    'What hardware, if any, must it integrate with (scanners, printers, scales)?',
    'Is there existing legacy software this is replacing?',
    'How many concurrent users/workstations?',
    'Does data need to sync to a central server when connectivity is available?',
  ],
  deliverables: [
    'Installable desktop application (Windows/macOS/Linux as scoped)',
    'Local data storage with optional sync to central database',
    'Hardware/peripheral integration where required',
    'Auto-update mechanism',
    'Installer and deployment package',
    'User training and handover documentation',
  ],
  technologies: [
    'Electron',
    'TypeScript',
    'React',
    'Node.js',
    'SQLite',
    'PostgreSQL',
    'Docker',
  ],
  estimatedTimeline: '6-14 weeks depending on scope and hardware integration complexity',
  startingPrice: 55000,
  averagePrice: 150000,
  enterprisePrice: 400000,
  recommendedAddOns: ['Business Automation', 'Cyber Security', 'Hosting for sync backend'],
  requiredEmployees: ['Software Engineer', 'Business Analyst', 'Proposal Generator'],
  requiredAIWorkers: ['Desktop App Generator', 'Quotation Generator'],
  proposalSections: [
    'Executive summary',
    'Current-state problem statement',
    'Proposed solution and architecture',
    'Hardware/integration requirements',
    'Timeline',
    'Investment',
    'Deployment and rollout plan',
  ],
  quotationItems: [
    'Discovery and requirements mapping',
    'UI design',
    'Application development',
    'Hardware/peripheral integration',
    'Local/offline data layer',
    'Sync backend (if required)',
    'Testing across target OS versions',
    'Deployment and training',
  ],
  projectPhases: [
    'Discovery',
    'Requirements and workflow mapping',
    'UI design',
    'Development',
    'Hardware integration',
    'QA across target machines',
    'Pilot rollout',
    'Full deployment and training',
  ],
  qualityChecklist: [
    'Tested on all target operating systems',
    'Offline mode verified end-to-end',
    'Hardware integrations tested with real peripherals',
    'Data integrity verified under sync conflicts',
    'Installer tested on clean machines',
    'Auto-update mechanism verified',
  ],
  upsellServices: ['Business Automation', 'AI Integration', 'Cyber Security'],
  crossSellServices: ['Web Development', 'Hosting', 'Maintenance'],
  maintenanceRequirements: [
    'OS compatibility updates',
    'Security patching',
    'Bug fixes and version updates',
    'Sync backend uptime monitoring',
    'Hardware driver compatibility checks',
  ],
  successMetrics: [
    'Reduction in manual data entry time',
    'System uptime on site',
    'User adoption rate',
    'Data sync success rate',
    'Support ticket volume post-launch',
  ],
  commonRisks: [
    'Hardware/peripheral compatibility issues discovered late',
    'Site connectivity assumptions proving incorrect',
    'Legacy data migration complexity',
    'OS version fragmentation across client machines',
  ],
  commonClientQuestions: [
    'Will this work without internet on site?',
    'Can it integrate with our existing scanners/printers?',
    'What happens to our old data from the legacy system?',
    'How are updates deployed across all machines?',
    'What is the licensing model per workstation?',
  ],
  objectionHandling: [
    {
      objection: 'Why not just use a web app instead?',
      response:
        'A web app depends on connectivity and browser performance; for offline-first, hardware-integrated, or data-heavy workflows, a native desktop application is materially more reliable.',
    },
    {
      objection: 'Our legacy system still works, why replace it?',
      response:
        'Unsupported legacy software carries growing security and compatibility risk with every OS update; migrating now, on our terms, avoids a forced emergency migration later.',
    },
  ],
  keywords: ['desktop app', 'Electron', 'offline software', 'point of sale', 'legacy system replacement', 'internal tool'],
}