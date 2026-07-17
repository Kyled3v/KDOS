/**
 * Construction.ts
 *
 * Location: src/knowledge/industries/Construction.ts
 *
 * Structured industry intelligence for the Construction sector, part
 * of the KyleDev Industry Intelligence Library. Machine-readable
 * only — consumed directly by AI employees, not documentation.
 *
 * `commonObjections` and `objectionResponses` are parallel arrays —
 * see Mining.ts for the shared convention and IndustryKnowledge type.
 */

import type { IndustryKnowledge } from './Mining'

export const ConstructionKnowledge: IndustryKnowledge = {
  industry: 'Construction',
  overview:
    'South African construction spans residential, commercial, civil, and infrastructure contractors, from small building firms to large civil engineering groups. The sector is project-based, cash-flow sensitive, and heavily reliant on coordination between site, project management, and finance teams.',
  companySizes: [
    'Small contractor/builder (under 20 staff)',
    'Mid-size construction company (20-150 staff)',
    'Large civil/commercial contractor (150-1000+ staff)',
  ],
  commonDepartments: [
    'Project management',
    'Site operations',
    'Quantity surveying',
    'Procurement and supply chain',
    'Finance',
    'Health and safety',
    'Human resources',
  ],
  decisionMakers: [
    'Managing Director / Owner',
    'Project Director',
    'Financial Manager',
    'Operations Manager',
    'Quantity Surveyor (senior)',
  ],
  commonSoftwareUsed: [
    'Excel-based project costing and scheduling',
    'Sage or Pastel for accounting',
    'CCS Candy or similar for estimating/quantity surveying',
    'WhatsApp for site communication (informal)',
    'Manual/paper site diaries and progress reports',
  ],
  currentProblems: [
    'Project costs tracked in disconnected spreadsheets, causing budget overruns to go unnoticed',
    'Site progress reporting delayed and inconsistent across foremen',
    'No centralised document control for drawings, variations, and RFIs',
    'Manual invoice and payment certificate processing slowing cash flow',
    'Safety compliance documentation scattered across sites',
  ],
  digitalMaturityLevels: [
    'Low: paper site diaries, spreadsheet costing, no central system',
    'Medium: accounting software in place, but site data still manual',
    'High: project management software adopted, but poor integration with finance',
    'Advanced: integrated project, finance, and site reporting systems',
  ],
  manualProcesses: [
    'Site progress and diary reporting',
    'Variation order tracking',
    'Payment certificate preparation',
    'Subcontractor invoice reconciliation',
    'Safety file compilation per site',
  ],
  automationOpportunities: [
    'Automated site progress report consolidation',
    'Automated payment certificate generation from site data',
    'Automated variation order tracking and approval workflow',
    'Automated subcontractor invoice matching against purchase orders',
  ],
  AIOpportunities: [
    'AI-assisted document processing for drawings, RFIs, and variation orders',
    'AI-powered project risk flagging from progress and cost data trends',
    'Internal knowledge assistant for site procedures and compliance documentation',
    'Automated snag list generation from site photos/notes',
  ],
  businessRisks: [
    'Cash flow strain from delayed payment certificate processing',
    'Cost overruns going undetected until project completion',
    'Safety incidents from inconsistent compliance documentation',
    'Disputes arising from poor variation order and RFI tracking',
  ],
  recommendedKyleDevServices: ['Business Automation', 'Web Development', 'Desktop Development'],
  crossSellServices: ['AI Integration', 'Cyber Security', 'Hosting'],
  estimatedProjectBudgetsZAR: {
    smallEngagement: 30000,
    midSizeEngagement: 120000,
    largeEngagement: 350000,
    enterpriseEngagement: 900000,
  },
  commonDiscoveryQuestions: [
    'How is project cost currently tracked against budget?',
    'How are site progress reports captured and shared with head office?',
    'What is your current process for payment certificates and variations?',
    'How many active sites/projects are typically running at once?',
    'What accounting or ERP system do you currently use?',
  ],
  proposalTalkingPoints: [
    'Real-time visibility of project costs against budget',
    'Faster payment certificate turnaround improving cash flow',
    'Centralised document control reducing dispute risk',
    'Site-to-office reporting without manual re-entry',
  ],
  commonObjections: [
    'Our site staff will not use another system.',
    'We already use WhatsApp and Excel, it works fine.',
    'This sounds expensive for a construction company our size.',
  ],
  objectionResponses: [
    'We design for simple, field-friendly capture — often simpler than the current WhatsApp/Excel workflow, with mobile-first data entry.',
    'WhatsApp and Excel work until project volume grows past what manual reconciliation can handle; this closes the gaps before they become budget overruns.',
    'We scope engagements to match company size, starting with the highest-impact process rather than a full system overhaul.',
  ],
  salesTriggers: [
    'Recent cost overrun or disputed variation on a major project',
    'Rapid growth in number of concurrent projects',
    'Cash flow strain from slow payment certificate turnaround',
    'New project requiring tighter compliance documentation',
  ],
  painPoints: [
    'Budget overruns discovered too late to correct',
    'Slow payment certificate processing delaying cash flow',
    'Site progress data inconsistent between foremen',
    'Disputes from poorly tracked variations and RFIs',
  ],
  KPIs: [
    'Project cost variance against budget',
    'Payment certificate turnaround time',
    'Days sales outstanding (DSO)',
    'Safety incident rate',
  ],
  successMetrics: [
    'Reduction in cost overrun frequency',
    'Reduction in payment certificate processing time',
    'Improved on-time project completion rate',
    'Reduction in unresolved variation disputes',
  ],
  futureTechnologyTrends: [
    'Drone-based site progress monitoring',
    'BIM (Building Information Modelling) integration',
    'AI-assisted cost forecasting from historical project data',
    'IoT-enabled equipment and material tracking',
  ],
  complianceRequirements: [
    'Construction Regulations under the Occupational Health and Safety Act',
    'CIDB (Construction Industry Development Board) grading and reporting requirements',
    'POPIA for staff and subcontractor personal data',
  ],
  securityRequirements: [
    'Access control for financial and project cost data',
    'Secure document control for drawings and contracts',
    'Audit trail for variation order and payment approvals',
  ],
  mobileRequirements: [
    'Mobile site progress and diary capture',
    'Mobile photo-based snag and defect logging',
    'Offline capability for sites with poor connectivity',
  ],
  dashboardRequirements: [
    'Project cost-to-budget dashboard',
    'Site progress dashboard across active projects',
    'Payment certificate status tracker',
    'Safety compliance dashboard',
  ],
  reportingRequirements: [
    'Project cost variance reports',
    'Site progress reports',
    'Payment certificate and variation order reports',
    'CIDB-aligned compliance reports',
  ],
  integrationRequirements: [
    'Integration with accounting software (Sage, Pastel)',
    'Integration with estimating/QS software where applicable',
    'Integration with document storage systems',
  ],
  recommendedAIWorkers: ['Automation Designer', 'Business Analyst', 'Quotation Generator'],
  recommendedPlugins: ['Payment certificate generator', 'Variation order workflow', 'Site diary module'],
  keywords: ['construction software', 'site reporting', 'payment certificates', 'CIDB', 'project cost tracking', 'variation orders'],
  southAfricanMarketConsiderations: [
    'CIDB grading requirements affect eligibility for tender categories',
    'Cash flow pressure is acute given typical payment terms in the industry',
    'Load shedding affects site equipment and connectivity planning',
    'B-BBEE status is often a factor in tender qualification and reporting',
  ],
}