/**
 * Mining.ts
 *
 * Location: src/knowledge/industries/Mining.ts
 *
 * Structured industry intelligence for the Mining sector, part of the
 * KyleDev Industry Intelligence Library. Machine-readable only —
 * consumed directly by AI employees (Sales, Marketing, Business
 * Analyst, Proposal Generator, Quotation Generator, Automation
 * Designer, etc.), not documentation.
 *
 * `commonObjections` and `objectionResponses` are parallel arrays:
 * the response at a given index answers the objection at the same
 * index. This pairing convention is shared across every industry file
 * in this library.
 *
 * South African context throughout (regulatory bodies, currency,
 * market conditions) as of 2025/2026; review periodically as
 * regulation and market conditions evolve.
 */

export interface EstimatedProjectBudgetsZAR {
  readonly smallEngagement: number
  readonly midSizeEngagement: number
  readonly largeEngagement: number
  readonly enterpriseEngagement: number
}

export interface IndustryKnowledge {
  readonly industry: string
  readonly overview: string
  readonly companySizes: string[]
  readonly commonDepartments: string[]
  readonly decisionMakers: string[]
  readonly commonSoftwareUsed: string[]
  readonly currentProblems: string[]
  readonly digitalMaturityLevels: string[]
  readonly manualProcesses: string[]
  readonly automationOpportunities: string[]
  readonly AIOpportunities: string[]
  readonly businessRisks: string[]
  readonly recommendedKyleDevServices: string[]
  readonly crossSellServices: string[]
  readonly estimatedProjectBudgetsZAR: EstimatedProjectBudgetsZAR
  readonly commonDiscoveryQuestions: string[]
  readonly proposalTalkingPoints: string[]
  readonly commonObjections: string[]
  readonly objectionResponses: string[]
  readonly salesTriggers: string[]
  readonly painPoints: string[]
  readonly KPIs: string[]
  readonly successMetrics: string[]
  readonly futureTechnologyTrends: string[]
  readonly complianceRequirements: string[]
  readonly securityRequirements: string[]
  readonly mobileRequirements: string[]
  readonly dashboardRequirements: string[]
  readonly reportingRequirements: string[]
  readonly integrationRequirements: string[]
  readonly recommendedAIWorkers: string[]
  readonly recommendedPlugins: string[]
  readonly keywords: string[]
  readonly southAfricanMarketConsiderations: string[]
}

export const MiningKnowledge: IndustryKnowledge = {
  industry: 'Mining',
  overview:
    'South African mining spans large-scale JSE-listed operations (gold, platinum, coal, diamonds, iron ore) down to junior miners and contract mining outfits. The sector is capital-intensive, safety-regulated, and increasingly under pressure to digitise site operations, safety compliance, and reporting to shareholders and regulators.',
  companySizes: [
    'Junior miner / exploration company (under 50 staff)',
    'Mid-tier mining company (50-500 staff)',
    'Major mining house (500-10,000+ staff, multiple sites)',
    'Contract mining and mining services company',
  ],
  commonDepartments: [
    'Mine planning and engineering',
    'Health, safety, and environment (HSE)',
    'Operations',
    'Finance and supply chain',
    'Human resources and labour relations',
    'Compliance and regulatory affairs',
    'IT and OT (operational technology)',
  ],
  decisionMakers: [
    'Chief Executive Officer',
    'Chief Financial Officer',
    'General Manager (site)',
    'Head of Health and Safety',
    'IT Manager / Head of Digital Transformation',
    'Chief Operating Officer',
  ],
  commonSoftwareUsed: [
    'SAP or Sage for finance/ERP',
    'Micromine or Surpac for mine planning',
    'Excel-based shift and production reporting',
    'Legacy safety incident logging systems',
    'Fleet management systems for heavy equipment',
  ],
  currentProblems: [
    'Shift and production data still captured on paper and re-entered manually',
    'Safety incident reporting delayed due to manual processes',
    'Disconnected systems between site operations and head office finance',
    'Poor visibility of real-time production and equipment status',
    'Compliance reporting (DMRE, Mine Health and Safety Council) consuming significant admin time',
  ],
  digitalMaturityLevels: [
    'Low: paper-based shift reports, no centralised system',
    'Medium: spreadsheet-based reporting, some standalone software per department',
    'High: integrated ERP with site-level dashboards, still limited real-time visibility',
    'Advanced: real-time IoT/sensor data feeding centralised operational dashboards',
  ],
  manualProcesses: [
    'Shift handover reporting',
    'Safety incident and near-miss logging',
    'Production data consolidation across sites',
    'Compliance report compilation for DMRE submissions',
    'Equipment maintenance scheduling',
  ],
  automationOpportunities: [
    'Automated shift report consolidation from site to head office',
    'Automated safety incident escalation and notification workflows',
    'Automated compliance report generation from operational data',
    'Equipment maintenance scheduling triggered by usage/condition data',
  ],
  AIOpportunities: [
    'AI-assisted safety incident pattern analysis to flag high-risk conditions',
    'Document processing for compliance submissions and audit trails',
    'AI-powered internal knowledge assistant for site procedures and SOPs',
    'Predictive maintenance flagging from equipment log data',
  ],
  businessRisks: [
    'Safety incidents leading to regulatory shutdown risk',
    'Non-compliance with DMRE reporting deadlines',
    'Data loss from paper-based or unsecured legacy systems',
    'Production downtime from poor visibility into equipment status',
  ],
  recommendedKyleDevServices: [
    'Business Automation',
    'Desktop Development',
    'AI Integration',
    'Cyber Security',
  ],
  crossSellServices: ['Web Development', 'Hosting', 'Maintenance'],
  estimatedProjectBudgetsZAR: {
    smallEngagement: 45000,
    midSizeEngagement: 180000,
    largeEngagement: 500000,
    enterpriseEngagement: 1500000,
  },
  commonDiscoveryQuestions: [
    'How is shift and production data currently captured and reported?',
    'What compliance reports do you submit, and how are they compiled today?',
    'Do your sites have reliable internet connectivity?',
    'What systems currently exist for safety incident reporting?',
    'How many sites need to be covered by this solution?',
  ],
  proposalTalkingPoints: [
    'Offline-first tooling suited to sites with unreliable connectivity',
    'Faster, auditable compliance reporting reducing regulatory risk',
    'Real-time visibility from site to head office',
    'Reduced manual admin burden on site supervisors',
  ],
  commonObjections: [
    'Our sites do not have reliable internet for a digital system.',
    'Our staff are not tech-savvy enough for new software.',
    'We already have an ERP system, why do we need this?',
  ],
  objectionResponses: [
    'We design offline-first tools that sync when connectivity is available, so unreliable internet is not a blocker.',
    'Interfaces are designed for field use with minimal training required, and we provide hands-on onboarding for site staff.',
    'This complements your ERP by automating the data capture and reporting layer that currently feeds into it manually.',
  ],
  salesTriggers: [
    'Recent safety incident or near-miss triggering compliance scrutiny',
    'New site opening requiring new operational systems',
    'DMRE audit or compliance deadline approaching',
    'Leadership change prioritising digital transformation',
  ],
  painPoints: [
    'Time lost reconciling paper-based site data',
    'Compliance reporting deadlines causing last-minute scrambles',
    'Lack of real-time visibility for head office decision-making',
    'Safety incidents not escalated quickly enough',
  ],
  KPIs: [
    'Production volume per shift',
    'Safety incident rate (LTIFR)',
    'Equipment uptime percentage',
    'Compliance report submission timeliness',
  ],
  successMetrics: [
    'Reduction in shift report turnaround time',
    'Reduction in safety incident escalation time',
    'Compliance report preparation time reduction',
    'Reduction in unplanned equipment downtime',
  ],
  futureTechnologyTrends: [
    'IoT sensor integration for real-time equipment and environmental monitoring',
    'AI-assisted predictive maintenance',
    'Autonomous and remote-operated equipment',
    'Centralised digital twin site modelling',
  ],
  complianceRequirements: [
    'Mine Health and Safety Act compliance',
    'DMRE (Department of Mineral Resources and Energy) reporting requirements',
    'Mining Charter reporting obligations',
    'POPIA for any personal/employee data handled digitally',
  ],
  securityRequirements: [
    'Access control for sensitive production and financial data',
    'Secure handling of employee personal information (POPIA)',
    'Audit trails for compliance-related data changes',
    'Protection of OT systems from unauthorised access',
  ],
  mobileRequirements: [
    'Offline-capable mobile/tablet data capture for site supervisors',
    'Mobile safety incident reporting from the field',
    'Push notifications for urgent safety escalations',
  ],
  dashboardRequirements: [
    'Real-time production dashboard by site and shift',
    'Safety incident tracking dashboard',
    'Equipment status and maintenance dashboard',
    'Compliance submission status tracker',
  ],
  reportingRequirements: [
    'DMRE-aligned compliance reports',
    'Shift and production summary reports',
    'Safety incident and near-miss reports',
    'Executive summary reporting for head office',
  ],
  integrationRequirements: [
    'Integration with existing ERP (SAP, Sage)',
    'Integration with mine planning software where applicable',
    'Integration with fleet/equipment management systems',
  ],
  recommendedAIWorkers: ['Automation Designer', 'Business Analyst', 'Quotation Generator'],
  recommendedPlugins: ['Offline data sync module', 'Compliance report generator', 'Safety incident workflow'],
  keywords: ['mining software', 'DMRE compliance', 'site reporting', 'mine safety', 'offline data capture', 'production tracking'],
  southAfricanMarketConsiderations: [
    'DMRE and Mine Health and Safety Council reporting obligations are non-negotiable and time-sensitive',
    'Remote sites often have poor or no reliable connectivity, requiring offline-first design',
    'Load shedding affects on-site power availability for connected systems',
    'Mining Charter and transformation reporting may be relevant to broader digital reporting needs',
  ],
}