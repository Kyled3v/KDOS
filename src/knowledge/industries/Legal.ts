/**
 * Legal.ts
 *
 * Location: src/knowledge/industries/Legal.ts
 *
 * Structured industry intelligence for the Legal sector, part of the
 * KyleDev Industry Intelligence Library. Machine-readable only —
 * consumed directly by AI employees, not documentation.
 *
 * `commonObjections` and `objectionResponses` are parallel arrays —
 * see Mining.ts for the shared convention and IndustryKnowledge type.
 */

import type { IndustryKnowledge } from './Mining'

export const LegalKnowledge: IndustryKnowledge = {
  industry: 'Legal',
  overview:
    'South African legal practices range from sole practitioner attorneys to mid-size and large law firms across conveyancing, litigation, commercial, and family law. Matter management, trust account compliance, and document-heavy workflows dominate day-to-day operations.',
  companySizes: [
    'Sole practitioner',
    'Small firm (2-15 staff)',
    'Mid-size firm (15-75 staff)',
    'Larger regional/commercial firm (75+ staff)',
  ],
  commonDepartments: [
    'Fee earners / attorneys',
    'Conveyancing',
    'Litigation support',
    'Trust accounting/finance',
    'Practice administration',
    'Compliance and risk',
  ],
  decisionMakers: [
    'Managing Partner / Sole Practitioner',
    'Practice Manager',
    'Financial Manager (trust accounting)',
    'IT Manager (larger firms)',
  ],
  commonSoftwareUsed: [
    'Legal practice management systems (LEXIS Convey, GhostConvey, LawPro)',
    'Microsoft Word/Outlook for document and correspondence handling',
    'Excel for matter and billing tracking in smaller firms',
    'Trust accounting software',
  ],
  currentProblems: [
    'Matter status tracked inconsistently across fee earners',
    'Document version control issues on active matters',
    'Manual time recording and billing leading to revenue leakage',
    'Client communication and status updates handled ad hoc',
    'Trust account reconciliation done manually, high compliance risk',
  ],
  digitalMaturityLevels: [
    'Low: paper files, manual time recording, no central matter system',
    'Medium: practice management software adopted, but limited automation',
    'High: digital matter management with document control',
    'Advanced: integrated matter management, billing, and client communication automation',
  ],
  manualProcesses: [
    'Time recording and billing',
    'Matter status updates to clients',
    'Document drafting and version control',
    'Trust account reconciliation',
    'Conflict of interest checks',
  ],
  automationOpportunities: [
    'Automated time recording capture and billing generation',
    'Automated client matter status update communication',
    'Automated document template generation for standard matters',
    'Automated trust account reconciliation alerts',
  ],
  AIOpportunities: [
    'AI-assisted document review and summarisation',
    'AI-powered legal document drafting from templates',
    'Internal knowledge assistant for precedent and procedure lookup',
    'AI-assisted client intake and conflict check screening',
  ],
  businessRisks: [
    'Trust account compliance breaches carrying serious regulatory consequences',
    'Revenue leakage from unbilled or under-recorded time',
    'Missed matter deadlines/prescription risk',
    'Client dissatisfaction from poor communication on matter status',
  ],
  recommendedKyleDevServices: ['Business Automation', 'AI Integration', 'Cyber Security'],
  crossSellServices: ['Web Development', 'Hosting', 'Maintenance'],
  estimatedProjectBudgetsZAR: {
    smallEngagement: 20000,
    midSizeEngagement: 70000,
    largeEngagement: 220000,
    enterpriseEngagement: 600000,
  },
  commonDiscoveryQuestions: [
    'What practice management system do you currently use, if any?',
    'How is time currently recorded and billed?',
    'How is trust accounting reconciliation currently handled?',
    'How do you currently communicate matter status updates to clients?',
    'What document types are most frequently drafted, and are templates used?',
  ],
  proposalTalkingPoints: [
    'Reduced revenue leakage through accurate automated time capture',
    'Lower compliance risk through automated trust account checks',
    'Improved client experience through proactive status updates',
    'Faster document turnaround through template automation',
  ],
  commonObjections: [
    'Legal work is too specialised to automate.',
    'We are concerned about confidentiality with any new system.',
    'Our fee earners will resist changing how they work.',
  ],
  objectionResponses: [
    'The goal is automating the administrative layer around matters — time capture, status updates, reconciliation — not the legal judgement itself, which remains entirely with your fee earners.',
    'Confidentiality and access control are designed in from the outset, with role-based permissions and audit trails matching the sensitivity of legal work.',
    'We design for minimal workflow disruption, integrating with existing tools like Outlook and Word rather than forcing a full process change.',
  ],
  salesTriggers: [
    'Recent trust account compliance finding or audit concern',
    'Firm growth outpacing manual billing/time-tracking capacity',
    'Partner frustration with unbilled time or revenue leakage',
    'Client complaints about lack of matter status communication',
  ],
  painPoints: [
    'Revenue lost to unbilled or forgotten time entries',
    'Trust account reconciliation consuming significant staff hours',
    'Client frustration from lack of proactive communication',
    'Document version confusion on active matters',
  ],
  KPIs: [
    'Billable hours realisation rate',
    'Trust account reconciliation accuracy',
    'Average time to matter resolution',
    'Client satisfaction/retention rate',
  ],
  successMetrics: [
    'Increase in billed-hours capture rate',
    'Reduction in trust account reconciliation time',
    'Reduction in client status-update complaints',
    'Faster average document turnaround time',
  ],
  futureTechnologyTrends: [
    'AI-assisted contract and document review',
    'Automated legal document drafting from precedent libraries',
    'Digital client portals for matter status and document sharing',
    'AI-assisted legal research tools',
  ],
  complianceRequirements: [
    'Legal Practice Council trust accounting rules',
    'POPIA for client personal and case data',
    'FICA requirements for client due diligence',
    'Attorney fidelity fund and audit requirements',
  ],
  securityRequirements: [
    'Strict access control by matter and fee earner',
    'Encrypted storage of client documents and correspondence',
    'Audit trail for all document and trust account activity',
    'Secure client communication channels',
  ],
  mobileRequirements: [
    'Mobile access to matter status for fee earners',
    'Mobile time recording capture',
    'Secure mobile document access',
  ],
  dashboardRequirements: [
    'Matter status dashboard across fee earners',
    'Billing and time recording dashboard',
    'Trust account reconciliation dashboard',
  ],
  reportingRequirements: [
    'Billable hours and revenue reports',
    'Trust account reconciliation reports',
    'Matter status and deadline reports',
  ],
  integrationRequirements: [
    'Integration with existing practice management system',
    'Integration with Outlook/Word for document workflows',
    'Integration with trust accounting software',
  ],
  recommendedAIWorkers: ['Automation Designer', 'Business Analyst', 'Quotation Generator'],
  recommendedPlugins: ['Time capture automation', 'Trust account reconciliation alerts', 'Client status update module'],
  keywords: ['legal practice management', 'trust accounting', 'matter management', 'legal billing', 'document automation', 'law firm software'],
  southAfricanMarketConsiderations: [
    'Legal Practice Council trust account compliance carries serious regulatory consequences for breaches',
    'FICA due diligence requirements apply to client onboarding',
    'POPIA compliance is critical given the sensitivity of legal case data',
    'Conveyancing volume is closely tied to the property market cycle, affecting firm cash flow and priorities',
  ],
}