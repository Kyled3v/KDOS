/**
 * Hosting.ts
 *
 * Location: src/knowledge/services/Hosting.ts
 *
 * Structured business intelligence for KyleDev's Hosting service
 * line. Machine-readable only — consumed directly by AI employees,
 * not documentation.
 *
 * Pricing in South African Rand (ZAR), reflecting realistic
 * mid-market South African rates as of 2025/2026; review against
 * KyleDev's current rate card before client-facing use. Pricing
 * shown is monthly recurring.
 */

import type { ServiceKnowledge } from './WebDevelopment'

export const HostingKnowledge: ServiceKnowledge = {
  serviceName: 'Hosting',
  description:
    'Managed hosting, uptime monitoring, and infrastructure management for websites, applications, and backend services built by KyleDev or migrated from elsewhere.',
  idealClients: [
    'Clients with a KyleDev-built website or application needing production hosting',
    'Businesses on unreliable or unmanaged hosting experiencing downtime',
    'Companies wanting a single point of accountability for uptime',
    'Businesses needing compliance-conscious infrastructure (backups, access control)',
  ],
  companySizes: ['Small business (2-20 staff)', 'Mid-market (21-200 staff)', 'Enterprise (200+ staff)'],
  industries: ['Retail', 'Healthcare', 'Accounting', 'Legal', 'Education', 'Hospitality'],
  businessProblems: [
    'Frequent downtime on current hosting provider',
    'No one accountable for infrastructure when something breaks',
    'No automated backups in place',
    'Slow site/app performance due to poor server configuration',
    'No monitoring or alerting when the site goes down',
  ],
  businessBenefits: [
    'Improved uptime and reliability',
    'Automated backups reducing data-loss risk',
    'Faster performance through optimised infrastructure',
    'Proactive monitoring and alerting before issues escalate',
    'Single point of accountability for infrastructure issues',
  ],
  commonDiscoveryQuestions: [
    'What is currently hosted, and where?',
    'What is your expected traffic/usage volume?',
    'Do you have compliance or data residency requirements?',
    'What is your tolerance for downtime (RTO/RPO expectations)?',
    'Do you need staging environments in addition to production?',
    'Who currently manages DNS and domain records?',
  ],
  deliverables: [
    'Production hosting environment configured and deployed',
    'Automated backup schedule',
    'Uptime monitoring and alerting',
    'SSL certificate management',
    'CDN and caching configuration',
    'Monthly infrastructure health report',
  ],
  technologies: ['Vercel', 'Cloudflare', 'Docker', 'PostgreSQL', 'Supabase', 'Node.js'],
  estimatedTimeline: 'Ongoing monthly service; initial setup 1-2 weeks',
  startingPrice: 650,
  averagePrice: 1800,
  enterprisePrice: 6500,
  recommendedAddOns: ['Maintenance', 'Cyber Security', 'Business Automation'],
  requiredEmployees: ['Software Engineer', 'Customer Success'],
  requiredAIWorkers: ['Quotation Generator'],
  proposalSections: [
    'Current infrastructure assessment',
    'Proposed hosting architecture',
    'Backup and monitoring plan',
    'Service level expectations',
    'Monthly investment',
    'Migration plan (if applicable)',
  ],
  quotationItems: [
    'Infrastructure setup',
    'Domain and SSL configuration',
    'Backup automation setup',
    'Monitoring and alerting setup',
    'CDN/caching configuration',
    'Monthly management fee',
  ],
  projectPhases: [
    'Infrastructure assessment',
    'Environment provisioning',
    'Migration (if applicable)',
    'Monitoring and backup setup',
    'Go-live',
    'Ongoing management',
  ],
  qualityChecklist: [
    'Uptime monitoring active and alerting correctly',
    'Backups verified as restorable',
    'SSL certificates auto-renewing',
    'CDN/caching configured and verified',
    'Access controls reviewed and locked down',
  ],
  upsellServices: ['Maintenance', 'Cyber Security', 'Business Automation'],
  crossSellServices: ['Web Development', 'Mobile Development', 'Desktop Development'],
  maintenanceRequirements: [
    'Server/platform patching',
    'Backup verification',
    'SSL renewal monitoring',
    'Performance monitoring and tuning',
    'Incident response for downtime',
  ],
  successMetrics: [
    'Uptime percentage',
    'Average response time',
    'Backup success rate',
    'Time to resolution on incidents',
  ],
  commonRisks: [
    'Traffic spikes exceeding provisioned capacity',
    'Third-party platform outages outside direct control',
    'Migration data-loss risk if not properly staged',
    'DNS misconfiguration causing downtime during cutover',
  ],
  commonClientQuestions: [
    'What happens if the site goes down at 2am?',
    'How often are backups taken, and can they be restored?',
    'Can we scale hosting as traffic grows?',
    'Do you handle domain and DNS management too?',
    'What is included in the monthly fee versus billed separately?',
  ],
  objectionHandling: [
    {
      objection: 'Our current host is cheaper.',
      response:
        'Cheaper hosting typically means no monitoring, no accountability, and no rapid response when something breaks — the cost difference reflects the reliability and support layered on top.',
    },
    {
      objection: 'Can we just host it ourselves?',
      response:
        'Self-hosting is possible, but requires in-house expertise for monitoring, patching, and incident response around the clock — this service replaces that overhead.',
    },
  ],
  keywords: ['hosting', 'uptime', 'infrastructure', 'backups', 'monitoring', 'DevOps', 'CDN'],
}