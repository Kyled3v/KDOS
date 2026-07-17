/**
 * Accounting.ts
 *
 * Location: src/knowledge/industries/Accounting.ts
 *
 * Structured industry intelligence for the Accounting sector, part of
 * the KyleDev Industry Intelligence Library. Machine-readable only —
 * consumed directly by AI employees, not documentation.
 *
 * `commonObjections` and `objectionResponses` are parallel arrays —
 * see Mining.ts for the shared convention and IndustryKnowledge type.
 */

import type { IndustryKnowledge } from './Mining'

export const AccountingKnowledge: IndustryKnowledge = {
  industry: 'Accounting',
  overview:
    'South African accounting and bookkeeping firms range from sole practitioners serving small businesses to mid-size firms offering audit, tax, and advisory services. Client volume, compliance deadlines (SARS, CIPC), and manual data capture from client records are the dominant operational pressures.',
  companySizes: [
    'Sole practitioner / bookkeeper',
    'Small accounting firm (2-15 staff)',
    'Mid-size firm (15-75 staff)',
    'Larger regional firm (75+ staff)',
  ],
  commonDepartments: [
    'Bookkeeping',
    'Tax compliance',
    'Audit (larger firms)',
    'Payroll administration',
    'Client advisory',
    'Practice administration',
  ],
  decisionMakers: [
    'Practice Owner / Partner',
    'Practice Manager',
    'Senior Accountant / Tax Manager',
    'IT Manager (larger firms)',
  ],
  commonSoftwareUsed: [
    'Sage, Xero, or QuickBooks for client bookkeeping',
    'SARS eFiling and CIPC portals',
    'Draftworx or CaseWare for financial statement drafting',
    'Excel for client data reconciliation',
    'Email for client document exchange',
  ],
  currentProblems: [
    'Client source documents received via email/WhatsApp with no central intake system',
    'Manual data entry from client records into accounting software',
    'Compliance deadline tracking done manually across many clients',
    'No client self-service portal for document submission or query status',
    'Time-consuming manual reconciliation between systems',
  ],
  digitalMaturityLevels: [
    'Low: paper/email-based client document exchange, manual capture',
    'Medium: cloud accounting software adopted, but client intake still manual',
    'High: client portal for document submission, partial automation',
    'Advanced: automated data capture, reconciliation, and compliance deadline tracking',
  ],
  manualProcesses: [
    'Client source document collection and organisation',
    'Bank statement reconciliation',
    'Compliance deadline tracking across the client base',
    'Financial statement drafting and review',
    'Client query and status communication',
  ],
  automationOpportunities: [
    'Automated client document intake and organisation',
    'Automated bank feed reconciliation',
    'Automated compliance deadline reminders (SARS, CIPC)',
    'Automated client status update communication',
  ],
  AIOpportunities: [
    'AI-assisted document processing for source document data extraction',
    'AI-powered anomaly detection in reconciliations',
    'Internal knowledge assistant for tax legislation and practice procedures',
    'AI-assisted draft financial statement narrative generation',
  ],
  businessRisks: [
    'Missed SARS/CIPC compliance deadlines leading to penalties',
    'Client data security breaches given sensitive financial information',
    'Capacity constraints during peak filing season',
    'Errors from manual data capture affecting client trust',
  ],
  recommendedKyleDevServices: ['Business Automation', 'AI Integration', 'Web Development'],
  crossSellServices: ['Cyber Security', 'Hosting', 'Maintenance'],
  estimatedProjectBudgetsZAR: {
    smallEngagement: 15000,
    midSizeEngagement: 55000,
    largeEngagement: 160000,
    enterpriseEngagement: 450000,
  },
  commonDiscoveryQuestions: [
    'How do clients currently submit their source documents?',
    'What accounting software do you and your clients use?',
    'How do you currently track compliance deadlines across your client base?',
    'How many clients do you service, and what is your peak season volume?',
    'Do you currently offer clients any self-service portal?',
  ],
  proposalTalkingPoints: [
    'Reduced manual data capture time per client',
    'Automated compliance deadline tracking reducing penalty risk',
    'Centralised client document intake reducing email/WhatsApp chaos',
    'Improved client experience through status visibility',
  ],
  commonObjections: [
    'Our clients are used to emailing documents, they will not use a portal.',
    'We already use cloud accounting software, that is enough.',
    'This seems like a lot of change during our busy season.',
  ],
  objectionResponses: [
    'A simple, low-friction portal typically reduces client effort compared to email, and we can design onboarding to ease the transition gradually.',
    'Cloud accounting software handles bookkeeping, but the document intake, reconciliation, and deadline tracking around it is often still manual — this closes that gap.',
    'We can time implementation for your quieter period and pilot with a small client segment first to avoid disruption during peak season.',
  ],
  salesTriggers: [
    'Missed compliance deadline or SARS penalty incident',
    'Firm growth outpacing manual capacity',
    'Staff turnover creating knowledge gaps in client handling',
    'Client complaints about slow turnaround or communication',
  ],
  painPoints: [
    'Time lost chasing client documents',
    'Peak season capacity strain',
    'Compliance deadlines tracked manually across many clients',
    'Client dissatisfaction from lack of status visibility',
  ],
  KPIs: [
    'Average turnaround time per client engagement',
    'Compliance deadline adherence rate',
    'Client capacity (clients served per staff member)',
    'Client retention rate',
  ],
  successMetrics: [
    'Reduction in document intake and capture time',
    'Reduction in missed compliance deadlines',
    'Increase in client capacity without additional headcount',
    'Improved client satisfaction scores',
  ],
  futureTechnologyTrends: [
    'AI-assisted bookkeeping and reconciliation',
    'Real-time SARS/CIPC integration for compliance status',
    'Client self-service portals as standard practice',
    'Automated financial statement drafting assistance',
  ],
  complianceRequirements: [
    'SARS tax compliance and filing deadlines',
    'CIPC annual return and company filing requirements',
    'POPIA for client financial and personal data',
    'SAICA/SAIPA professional body requirements where applicable',
  ],
  securityRequirements: [
    'Encrypted storage of client financial data',
    'Role-based access control for staff by client assignment',
    'Secure client document transfer (no unsecured email attachments)',
    'Audit trail for all financial data access and changes',
  ],
  mobileRequirements: [
    'Mobile document capture/upload for clients',
    'Mobile status checking for compliance deadlines',
  ],
  dashboardRequirements: [
    'Compliance deadline tracker across all clients',
    'Client engagement status dashboard',
    'Staff capacity and workload dashboard',
  ],
  reportingRequirements: [
    'Compliance deadline status reports',
    'Client engagement turnaround reports',
    'Practice capacity and productivity reports',
  ],
  integrationRequirements: [
    'Integration with cloud accounting platforms (Sage, Xero, QuickBooks)',
    'Integration with SARS eFiling where technically feasible',
    'Integration with document storage systems',
  ],
  recommendedAIWorkers: ['Automation Designer', 'Business Analyst', 'Quotation Generator'],
  recommendedPlugins: ['Client document intake portal', 'Compliance deadline tracker', 'Reconciliation assistant'],
  keywords: ['accounting software', 'SARS compliance', 'CIPC', 'bookkeeping automation', 'client portal', 'tax deadline tracking'],
  southAfricanMarketConsiderations: [
    'SARS filing deadlines and eFiling requirements drive seasonal workload spikes',
    'CIPC annual return compliance is a recurring administrative burden across the client base',
    'POPIA compliance for client financial data is a strict requirement',
    'Many small business clients have low digital literacy, requiring simple client-facing tools',
  ],
}