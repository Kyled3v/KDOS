/**
 * BusinessAutomation.ts
 *
 * Location: src/knowledge/services/BusinessAutomation.ts
 *
 * Structured business intelligence for KyleDev's Business Automation
 * service line. Machine-readable only — consumed directly by AI
 * employees, not documentation.
 *
 * Pricing in South African Rand (ZAR), reflecting realistic
 * mid-market South African rates as of 2025/2026; review against
 * KyleDev's current rate card before client-facing use.
 */

import type { ServiceKnowledge } from './WebDevelopment'

export const BusinessAutomationKnowledge: ServiceKnowledge = {
  serviceName: 'Business Automation',
  description:
    'Design and implementation of automated workflows connecting existing business systems, removing manual, repetitive administrative work.',
  idealClients: [
    'Businesses with manual, repetitive admin processes (invoicing, data entry, reporting)',
    'Companies using multiple disconnected tools (CRM, accounting, email) with no integration',
    'Operations teams spending significant hours on manual reconciliation',
    'Businesses scaling headcount to cope with process volume instead of automating',
  ],
  companySizes: ['Small business (2-20 staff)', 'Mid-market (21-200 staff)', 'Enterprise (200+ staff)'],
  industries: ['Accounting', 'Retail', 'Construction', 'Logistics', 'Healthcare', 'Legal', 'Manufacturing'],
  businessProblems: [
    'Manual data entry between disconnected systems',
    'Repetitive administrative tasks consuming staff hours',
    'Delayed or error-prone reporting due to manual compilation',
    'No automated notifications for key business events',
    'Inconsistent process execution across staff members',
  ],
  businessBenefits: [
    'Significant reduction in manual admin hours',
    'Fewer data entry errors and reconciliation issues',
    'Faster turnaround on repetitive processes',
    'Consistent, auditable process execution',
    'Staff freed up for higher-value work',
  ],
  commonDiscoveryQuestions: [
    'Which processes currently take the most manual staff time?',
    'What systems/tools are currently in use (CRM, accounting, email, spreadsheets)?',
    'Do these systems have existing APIs or integrations available?',
    'What triggers should start each workflow?',
    'Who needs to be notified, and how, when a workflow completes or fails?',
    'What is the current error rate or rework rate on this process?',
  ],
  deliverables: [
    'Mapped and documented workflow',
    'Automated integration between specified systems',
    'Error handling and notification logic',
    'Monitoring dashboard or log for workflow runs',
    'Handover documentation and training',
  ],
  technologies: ['Node.js', 'TypeScript', 'PostgreSQL', 'Supabase', 'Docker', 'n8n', 'Zapier', 'Make'],
  estimatedTimeline: '2-8 weeks depending on number and complexity of workflows',
  startingPrice: 12000,
  averagePrice: 42000,
  enterprisePrice: 150000,
  recommendedAddOns: ['AI Integration', 'Hosting', 'CRM setup'],
  requiredEmployees: ['Business Analyst', 'Software Engineer', 'Proposal Generator'],
  requiredAIWorkers: ['Automation Designer', 'Quotation Generator'],
  proposalSections: [
    'Executive summary',
    'Current process mapping',
    'Proposed automated workflow',
    'Systems and integrations involved',
    'Timeline',
    'Investment',
    'Expected time/cost savings',
  ],
  quotationItems: [
    'Process discovery and mapping',
    'Workflow design',
    'System integration build',
    'Error handling and notifications',
    'Testing with real data',
    'Monitoring setup',
    'Training and handover',
  ],
  projectPhases: [
    'Process discovery',
    'Workflow mapping and design',
    'Integration build',
    'Testing with live data',
    'Pilot run',
    'Full deployment',
    'Monitoring handover',
  ],
  qualityChecklist: [
    'Workflow tested against real historical data',
    'Error handling verified for common failure cases',
    'Notifications firing correctly to the right people',
    'No data duplication or loss across systems',
    'Monitoring/logging in place for every workflow run',
  ],
  upsellServices: ['AI Integration', 'Hosting', 'Maintenance'],
  crossSellServices: ['Web Development', 'CRM setup', 'Desktop Development'],
  maintenanceRequirements: [
    'API/integration compatibility monitoring as connected systems update',
    'Workflow error monitoring',
    'Periodic process review as business needs evolve',
    'Credential/token renewal for connected services',
  ],
  successMetrics: [
    'Hours of manual work saved per week',
    'Error/rework rate reduction',
    'Process turnaround time reduction',
    'Workflow success rate (percentage of runs without error)',
  ],
  commonRisks: [
    'Underlying systems lacking reliable API access',
    'Data quality issues in source systems surfacing during automation',
    'Process changes on the client side breaking automation logic',
    'Scope creep from stakeholders wanting every process automated at once',
  ],
  commonClientQuestions: [
    'Which processes should we automate first?',
    'What happens if a workflow fails partway through?',
    'Will this replace staff, or free them up?',
    'How do we know the automation is working correctly?',
    'Can this scale as our process volume grows?',
  ],
  objectionHandling: [
    {
      objection: 'Automation sounds like it will replace our staff.',
      response:
        'The goal is removing repetitive manual work so staff can focus on judgement-based, higher-value tasks — automation handles the mechanical steps, not the decisions.',
    },
    {
      objection: "We're not sure our systems can even be integrated.",
      response:
        'Most modern business tools expose an API or at minimum a CSV/webhook interface; we assess integration feasibility during discovery before any commitment is made.',
    },
  ],
  keywords: ['automation', 'workflow', 'integration', 'process improvement', 'no-code', 'operational efficiency'],
}