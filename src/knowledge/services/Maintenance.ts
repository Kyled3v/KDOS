/**
 * Maintenance.ts
 *
 * Location: src/knowledge/services/Maintenance.ts
 *
 * Structured business intelligence for KyleDev's Maintenance service
 * line. Machine-readable only — consumed directly by AI employees,
 * not documentation.
 *
 * Pricing in South African Rand (ZAR), reflecting realistic
 * mid-market South African rates as of 2025/2026; review against
 * KyleDev's current rate card before client-facing use. Pricing
 * shown is monthly recurring.
 */

import type { ServiceKnowledge } from './WebDevelopment'

export const MaintenanceKnowledge: ServiceKnowledge = {
  serviceName: 'Maintenance',
  description:
    'Ongoing technical maintenance for websites, applications, and systems: updates, bug fixes, dependency management, and small enhancement requests.',
  idealClients: [
    'Businesses with a live website/app that needs ongoing upkeep',
    'Companies without in-house technical staff to manage updates',
    'Clients who need a retainer for small, ongoing change requests',
    'Businesses wanting proactive issue prevention rather than reactive firefighting',
  ],
  companySizes: ['Small business (2-20 staff)', 'Mid-market (21-200 staff)', 'Enterprise (200+ staff)'],
  industries: ['Retail', 'Healthcare', 'Accounting', 'Legal', 'Education', 'Hospitality', 'Construction'],
  businessProblems: [
    'Outdated dependencies creating security vulnerabilities',
    'No one available to fix bugs or issues as they arise',
    'Small feature/content requests piling up with no capacity to action them',
    'Site/app degrading in performance over time with no upkeep',
    'No proactive monitoring catching issues before customers notice',
  ],
  businessBenefits: [
    'Reduced security risk through timely patching',
    'Faster turnaround on bug fixes and small requests',
    'Consistent performance and reliability over time',
    'Predictable monthly cost instead of unplanned emergency work',
    'Proactive issue detection before it affects customers',
  ],
  commonDiscoveryQuestions: [
    'What system(s) need ongoing maintenance?',
    'What is the expected monthly volume of change requests?',
    'What is your tolerance for response time on urgent issues?',
    'Are there existing known issues or technical debt to address?',
    'Who currently handles updates and bug fixes, if anyone?',
  ],
  deliverables: [
    'Monthly dependency and security updates',
    'Bug fix turnaround within agreed SLA',
    'Allotted hours for small enhancement requests',
    'Monthly maintenance and activity report',
    'Priority support channel access',
  ],
  technologies: ['Node.js', 'TypeScript', 'React', 'PostgreSQL', 'Docker', 'Vercel', 'Cloudflare'],
  estimatedTimeline: 'Ongoing monthly retainer',
  startingPrice: 2500,
  averagePrice: 6000,
  enterprisePrice: 18000,
  recommendedAddOns: ['Hosting', 'Cyber Security', 'Business Automation'],
  requiredEmployees: ['Software Engineer', 'Customer Success'],
  requiredAIWorkers: ['Quotation Generator'],
  proposalSections: [
    'Current system assessment',
    'Proposed maintenance scope',
    'Response time commitments (SLA)',
    'Included hours and overage policy',
    'Monthly investment',
  ],
  quotationItems: [
    'Monthly dependency updates',
    'Security patching',
    'Bug fix allocation',
    'Enhancement request hours',
    'Monthly reporting',
  ],
  projectPhases: [
    'Onboarding and system audit',
    'Baseline updates and cleanup',
    'Ongoing monthly maintenance cycle',
    'Quarterly review',
  ],
  qualityChecklist: [
    'All dependencies within supported version range',
    'No outstanding critical security advisories',
    'Response times within agreed SLA',
    'Monthly report delivered on schedule',
    'Backup/rollback plan verified before major updates',
  ],
  upsellServices: ['Cyber Security', 'Business Automation', 'Hosting'],
  crossSellServices: ['Web Development', 'AI Integration', 'Mobile Development'],
  maintenanceRequirements: [
    'This is itself the ongoing maintenance service',
    'Periodic scope review as the underlying system evolves',
  ],
  successMetrics: [
    'Average response time to reported issues',
    'Number of critical vulnerabilities outstanding',
    'Client satisfaction with turnaround',
    'System uptime/stability trend over time',
  ],
  commonRisks: [
    'Underlying system has significant undocumented technical debt',
    'Change requests exceeding allotted monthly hours',
    'Third-party dependency breaking changes requiring larger remediation',
  ],
  commonClientQuestions: [
    'What counts as a "small" change request versus a new project?',
    'What happens if we exceed our monthly hours?',
    'How quickly will urgent issues be addressed?',
    'Can we pause or adjust the retainer if needed?',
    'What is included in the monthly report?',
  ],
  objectionHandling: [
    {
      objection: 'We will just call you when something breaks instead of a retainer.',
      response:
        'Ad-hoc emergency work is billed at a premium rate and depends on availability; a retainer guarantees priority response and keeps small issues from becoming emergencies in the first place.',
    },
    {
      objection: 'Our system has not needed maintenance so far.',
      response:
        'Dependencies and security advisories accumulate silently until an update or exploit forces the issue — proactive maintenance avoids that becoming an urgent, costly fix.',
    },
  ],
  keywords: ['maintenance', 'support retainer', 'bug fixes', 'updates', 'SLA', 'ongoing support'],
}