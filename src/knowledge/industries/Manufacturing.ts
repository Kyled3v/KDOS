/**
 * Manufacturing.ts
 *
 * Location: src/knowledge/industries/Manufacturing.ts
 *
 * Structured industry intelligence for the Manufacturing sector, part
 * of the KyleDev Industry Intelligence Library. Machine-readable
 * only — consumed directly by AI employees, not documentation.
 *
 * `commonObjections` and `objectionResponses` are parallel arrays —
 * see Mining.ts for the shared convention and IndustryKnowledge type.
 */

import type { IndustryKnowledge } from './Mining'

export const ManufacturingKnowledge: IndustryKnowledge = {
  industry: 'Manufacturing',
  overview:
    'South African manufacturing spans small job-shop operations to larger production facilities across food processing, metals, textiles, plastics, and light industrial goods. Production efficiency, quality control, and supply chain visibility are the dominant operational concerns, often constrained by power reliability.',
  companySizes: [
    'Small manufacturer/job shop (under 30 staff)',
    'Mid-size manufacturer (30-200 staff)',
    'Larger production facility (200+ staff)',
  ],
  commonDepartments: [
    'Production/operations',
    'Quality control',
    'Supply chain and procurement',
    'Finance',
    'Maintenance',
    'Sales and dispatch',
  ],
  decisionMakers: [
    'Managing Director / Owner',
    'Operations Manager',
    'Production Manager',
    'Financial Manager',
    'Quality Manager',
  ],
  commonSoftwareUsed: [
    'Sage or SAP Business One for ERP/finance',
    'Excel for production scheduling and quality logs',
    'Basic MRP (material requirements planning) tools where present',
    'Paper-based quality control checklists',
  ],
  currentProblems: [
    'Production scheduling done manually, causing inefficiency',
    'Quality control records kept on paper, difficult to trace issues',
    'Limited visibility into raw material stock levels',
    'Downtime from unplanned equipment failure',
    'Manual order-to-dispatch process causing delays',
  ],
  digitalMaturityLevels: [
    'Low: paper-based production and quality records',
    'Medium: ERP for finance, but production floor still manual',
    'High: digital production scheduling and quality tracking',
    'Advanced: integrated MRP/ERP with real-time production visibility',
  ],
  manualProcesses: [
    'Production scheduling',
    'Quality control checklist completion',
    'Raw material stock counting',
    'Maintenance scheduling',
    'Order-to-dispatch coordination',
  ],
  automationOpportunities: [
    'Automated production scheduling based on order and capacity data',
    'Digitised quality control checklists with automatic issue flagging',
    'Automated raw material reorder triggers',
    'Automated maintenance scheduling based on usage data',
  ],
  AIOpportunities: [
    'AI-assisted quality defect pattern analysis',
    'Predictive maintenance from equipment usage data',
    'AI-powered demand forecasting for production planning',
    'Document processing for supplier and compliance paperwork',
  ],
  businessRisks: [
    'Production downtime from unplanned equipment failure',
    'Quality issues going undetected due to poor traceability',
    'Stockouts of raw materials halting production',
    'Loss of contracts due to inconsistent delivery reliability',
  ],
  recommendedKyleDevServices: ['Business Automation', 'Desktop Development', 'AI Integration'],
  crossSellServices: ['Cyber Security', 'Hosting', 'Web Development'],
  estimatedProjectBudgetsZAR: {
    smallEngagement: 35000,
    midSizeEngagement: 140000,
    largeEngagement: 400000,
    enterpriseEngagement: 1100000,
  },
  commonDiscoveryQuestions: [
    'How is production currently scheduled and tracked?',
    'How are quality control checks currently recorded?',
    'How is raw material stock tracked and reordered?',
    'What ERP/finance system do you currently use?',
    'How frequently does unplanned downtime occur, and what causes it?',
  ],
  proposalTalkingPoints: [
    'Improved production efficiency through digital scheduling',
    'Full traceability on quality control issues',
    'Reduced stockouts through automated reorder triggers',
    'Reduced unplanned downtime through predictive maintenance',
  ],
  commonObjections: [
    'Our production floor staff will not adopt digital tools.',
    'We already have an ERP system.',
    'Load shedding makes digital systems unreliable for us anyway.',
  ],
  objectionResponses: [
    'We design floor-level tools for simplicity — often tablet-based checklists that are faster than paper, with minimal training required.',
    'This can integrate with your existing ERP to close the gap between the production floor and the finance/planning system it already feeds.',
    'We design with offline capability and local data caching so brief outages do not interrupt production data capture.',
  ],
  salesTriggers: [
    'Recent quality control failure or client complaint',
    'Repeated unplanned downtime incidents',
    'New contract requiring improved delivery reliability',
    'Growth outpacing current manual production planning capacity',
  ],
  painPoints: [
    'Production inefficiency from manual scheduling',
    'Difficulty tracing the source of quality issues',
    'Unplanned downtime disrupting delivery commitments',
    'Stockouts of raw materials halting production',
  ],
  KPIs: [
    'Overall equipment effectiveness (OEE)',
    'Quality defect rate',
    'On-time delivery rate',
    'Unplanned downtime hours',
  ],
  successMetrics: [
    'Reduction in unplanned downtime',
    'Reduction in quality defect rate',
    'Improvement in on-time delivery rate',
    'Reduction in raw material stockout incidents',
  ],
  futureTechnologyTrends: [
    'IoT sensor integration for real-time equipment monitoring',
    'AI-assisted predictive maintenance',
    'Digital quality management systems',
    'Automated production scheduling optimisation',
  ],
  complianceRequirements: [
    'Occupational Health and Safety Act compliance',
    'Industry-specific quality standards (ISO 9001 where applicable)',
    'SABS/NRCS product compliance requirements where applicable',
    'POPIA for employee personal data',
  ],
  securityRequirements: [
    'Access control for production and financial data',
    'Protection of proprietary production processes/formulas',
    'Audit trail for quality control record changes',
  ],
  mobileRequirements: [
    'Mobile/tablet-based quality control checklist capture',
    'Mobile production status visibility for supervisors',
    'Mobile stock level checking',
  ],
  dashboardRequirements: [
    'Production status dashboard',
    'Quality control issue dashboard',
    'Raw material stock level dashboard',
    'Maintenance schedule dashboard',
  ],
  reportingRequirements: [
    'Production efficiency reports',
    'Quality control and defect reports',
    'Stock level and reorder reports',
    'Maintenance history reports',
  ],
  integrationRequirements: [
    'Integration with existing ERP (SAP Business One, Sage)',
    'Integration with equipment/machine data where available',
    'Integration with supplier ordering systems',
  ],
  recommendedAIWorkers: ['Automation Designer', 'Business Analyst', 'Quotation Generator'],
  recommendedPlugins: ['Digital quality checklist module', 'Maintenance scheduling engine', 'Stock reorder automation'],
  keywords: ['manufacturing software', 'production scheduling', 'quality control', 'predictive maintenance', 'MRP', 'OEE'],
  southAfricanMarketConsiderations: [
    'Load shedding directly affects production uptime and requires resilient, offline-capable digital tools',
    'Local content and B-BBEE requirements can factor into supplier and contract relationships',
    'SABS/NRCS compliance is relevant for regulated product categories',
    'Skills availability for advanced automation may require phased implementation with strong training support',
  ],
}