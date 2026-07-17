/**
 * AIIntegration.ts
 *
 * Location: src/knowledge/services/AIIntegration.ts
 *
 * Structured business intelligence for KyleDev's AI Integration
 * service line. Machine-readable only — consumed directly by AI
 * employees, not documentation.
 *
 * Pricing in South African Rand (ZAR), reflecting realistic
 * mid-market South African rates as of 2025/2026; review against
 * KyleDev's current rate card before client-facing use.
 */

import type { ServiceKnowledge } from './WebDevelopment'

export const AIIntegrationKnowledge: ServiceKnowledge = {
  serviceName: 'AI Integration',
  description:
    'Embedding AI capabilities (chatbots, document processing, content generation, intelligent search, AI employees) into existing business systems and workflows.',
  idealClients: [
    'Businesses fielding high volumes of repetitive customer queries',
    'Companies with large volumes of unstructured documents needing processing',
    'Sales/marketing teams needing content generation at scale',
    'Businesses wanting an internal knowledge assistant for staff',
  ],
  companySizes: ['Small business (2-20 staff)', 'Mid-market (21-200 staff)', 'Enterprise (200+ staff)'],
  industries: ['Retail', 'Healthcare', 'Legal', 'Accounting', 'Education', 'Customer Success', 'Marketing'],
  businessProblems: [
    'High customer support volume overwhelming staff',
    'Manual document review consuming significant staff hours',
    'Inconsistent or slow content production for marketing/sales',
    'No searchable internal knowledge base for staff',
    'Missed leads due to slow response times',
  ],
  businessBenefits: [
    'Faster response times to customers via AI-assisted support',
    'Reduced manual document review time',
    'Consistent, scalable content production',
    'Staff able to self-serve answers via internal AI assistant',
    'Improved lead response speed and conversion',
  ],
  commonDiscoveryQuestions: [
    'What repetitive task is currently consuming the most staff time?',
    'What data/documents would the AI need access to?',
    'Is this customer-facing, internal, or both?',
    'What is the acceptable error tolerance for this use case?',
    'Are there existing systems the AI needs to integrate with (CRM, helpdesk, CMS)?',
    'What is the expected query/request volume?',
  ],
  deliverables: [
    'Integrated AI capability (chatbot, document processor, generator, or assistant)',
    'Prompt/logic configuration tuned to the business context',
    'Integration with existing systems (CRM, helpdesk, CMS as applicable)',
    'Monitoring and usage dashboard',
    'Handover documentation and training',
  ],
  technologies: ['Node.js', 'TypeScript', 'PostgreSQL', 'Supabase', 'Docker', 'Claude API', 'OpenAI API', 'Vercel'],
  estimatedTimeline: '3-10 weeks depending on scope and integration complexity',
  startingPrice: 18000,
  averagePrice: 60000,
  enterprisePrice: 220000,
  recommendedAddOns: ['Business Automation', 'Hosting', 'Cyber Security'],
  requiredEmployees: ['Software Engineer', 'Business Analyst', 'Proposal Generator'],
  requiredAIWorkers: ['Automation Designer', 'Quotation Generator'],
  proposalSections: [
    'Executive summary',
    'Use case definition',
    'Proposed AI capability and architecture',
    'Data and integration requirements',
    'Timeline',
    'Investment',
    'Risk and accuracy expectations',
  ],
  quotationItems: [
    'Use case discovery',
    'Data preparation and access setup',
    'AI capability build/configuration',
    'System integration',
    'Testing and accuracy tuning',
    'Monitoring dashboard setup',
    'Training and handover',
  ],
  projectPhases: [
    'Discovery and use case definition',
    'Data and access preparation',
    'Build and configuration',
    'Integration',
    'Testing and accuracy tuning',
    'Pilot with limited scope',
    'Full deployment',
  ],
  qualityChecklist: [
    'Accuracy tested against representative real queries/documents',
    'Fallback/escalation path defined for low-confidence cases',
    'Data privacy and access controls verified',
    'Integration tested end-to-end with connected systems',
    'Monitoring in place for usage and error rates',
  ],
  upsellServices: ['Business Automation', 'Hosting', 'Cyber Security'],
  crossSellServices: ['Web Development', 'Mobile Development', 'CRM setup'],
  maintenanceRequirements: [
    'Model/API version monitoring',
    'Prompt/logic tuning as usage patterns evolve',
    'Usage cost monitoring',
    'Accuracy review and retuning on a regular cadence',
  ],
  successMetrics: [
    'Query/task resolution rate without human escalation',
    'Reduction in staff hours spent on the automated task',
    'Response time improvement',
    'User/staff satisfaction with AI outputs',
  ],
  commonRisks: [
    'AI outputs requiring human review for high-stakes decisions',
    'Data quality issues limiting AI accuracy',
    'Underlying model/API changes affecting behaviour over time',
    'Over-reliance on AI without an escalation path for edge cases',
  ],
  commonClientQuestions: [
    'How accurate will the AI be?',
    'What happens when the AI gets something wrong?',
    'Is our data safe and private?',
    'Will this replace staff roles?',
    'How much will ongoing usage cost beyond the build?',
  ],
  objectionHandling: [
    {
      objection: 'We are worried about AI making mistakes with customers.',
      response:
        'We design a defined escalation path for low-confidence or high-stakes cases, so the AI handles routine volume while anything uncertain routes to a human.',
    },
    {
      objection: 'Is our business data safe if we use AI?',
      response:
        'Data access and retention policies are scoped explicitly per integration, and sensitive data handling follows the same access controls as your existing systems.',
    },
  ],
  keywords: ['AI', 'chatbot', 'automation', 'AI employee', 'document processing', 'content generation', 'AI assistant'],
}