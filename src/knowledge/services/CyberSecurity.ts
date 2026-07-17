/**
 * CyberSecurity.ts
 *
 * Location: src/knowledge/services/CyberSecurity.ts
 *
 * Structured business intelligence for KyleDev's Cyber Security
 * service line. Machine-readable only — consumed directly by AI
 * employees, not documentation.
 *
 * Pricing in South African Rand (ZAR), reflecting realistic
 * mid-market South African rates as of 2025/2026; review against
 * KyleDev's current rate card before client-facing use.
 */

import type { ServiceKnowledge } from './WebDevelopment'

export const CyberSecurityKnowledge: ServiceKnowledge = {
  serviceName: 'Cyber Security',
  description:
    'Security assessment, hardening, and ongoing protection for websites, applications, and business systems, including vulnerability testing and access control review.',
  idealClients: [
    'Businesses handling sensitive customer or financial data',
    'Companies without a formal security review of their systems',
    'Businesses required to demonstrate compliance (POPIA, industry regulation)',
    'Companies that have experienced a prior security incident',
  ],
  companySizes: ['Small business (2-20 staff)', 'Mid-market (21-200 staff)', 'Enterprise (200+ staff)'],
  industries: ['Healthcare', 'Legal', 'Accounting', 'Retail', 'Mining', 'Manufacturing'],
  businessProblems: [
    'No formal security assessment ever conducted',
    'Weak or shared access credentials across staff',
    'Outdated software with known vulnerabilities',
    'No incident response plan in place',
    'Compliance requirements (POPIA) not yet addressed',
  ],
  businessBenefits: [
    'Reduced risk of data breach and associated liability',
    'Clear compliance posture against regulatory requirements',
    'Documented incident response readiness',
    'Improved customer trust through demonstrable security practices',
    'Early detection of vulnerabilities before exploitation',
  ],
  commonDiscoveryQuestions: [
    'Has a security assessment ever been conducted on your systems?',
    'What sensitive data do you store or process (personal, financial, health)?',
    'What compliance requirements apply to your business (POPIA, PCI-DSS)?',
    'Do you have an incident response plan currently?',
    'How is access to systems and data currently controlled?',
    'Have you experienced any prior security incidents?',
  ],
  deliverables: [
    'Security assessment report with prioritised findings',
    'Vulnerability remediation for identified issues',
    'Access control review and hardening',
    'Incident response plan documentation',
    'Compliance gap assessment (POPIA-aligned)',
  ],
  technologies: ['Cloudflare', 'Docker', 'PostgreSQL', 'Node.js', 'OWASP ZAP', 'Snyk'],
  estimatedTimeline: '2-6 weeks for assessment and remediation; ongoing monitoring optional',
  startingPrice: 12000,
  averagePrice: 38000,
  enterprisePrice: 130000,
  recommendedAddOns: ['Maintenance', 'Hosting', 'Business Automation'],
  requiredEmployees: ['Software Engineer', 'Business Analyst', 'Proposal Generator'],
  requiredAIWorkers: ['Quotation Generator'],
  proposalSections: [
    'Current security posture assessment',
    'Risk findings summary',
    'Proposed remediation plan',
    'Compliance alignment summary',
    'Timeline',
    'Investment',
  ],
  quotationItems: [
    'Security assessment and vulnerability scan',
    'Access control review',
    'Remediation implementation',
    'Incident response plan drafting',
    'Compliance gap assessment',
    'Retest after remediation',
  ],
  projectPhases: [
    'Discovery and asset inventory',
    'Vulnerability assessment',
    'Findings review with client',
    'Remediation',
    'Retest and verification',
    'Documentation handover',
  ],
  qualityChecklist: [
    'All critical/high findings remediated or formally accepted as risk',
    'Access controls verified against least-privilege principle',
    'Retest confirms remediation effectiveness',
    'Incident response plan reviewed with client stakeholders',
    'Compliance gaps documented with clear next steps',
  ],
  upsellServices: ['Maintenance', 'Hosting', 'Business Automation'],
  crossSellServices: ['Web Development', 'Mobile Development', 'Desktop Development'],
  maintenanceRequirements: [
    'Periodic re-assessment (recommended annually or after major changes)',
    'Ongoing vulnerability monitoring',
    'Access control review on staff changes',
    'Incident response plan review and drills',
  ],
  successMetrics: [
    'Number of critical/high vulnerabilities remediated',
    'Time to remediate newly discovered issues',
    'Compliance gap closure rate',
    'Incident response readiness (drill completion)',
  ],
  commonRisks: [
    'Legacy systems with vulnerabilities that cannot be fully remediated without a rebuild',
    'Third-party vendor systems outside direct control',
    'Staff process/behaviour risk not addressed by technical controls alone',
    'Compliance requirements evolving after initial assessment',
  ],
  commonClientQuestions: [
    'Are we currently compliant with POPIA?',
    'What is our biggest security risk right now?',
    'What happens if we experience a breach after this assessment?',
    'How often should we redo this assessment?',
    'Will this slow down our systems or staff workflows?',
  ],
  objectionHandling: [
    {
      objection: 'We have never had a breach, so we are probably fine.',
      response:
        'Absence of a known breach is not the same as absence of vulnerability; an assessment identifies exposure before it is exploited, rather than after.',
    },
    {
      objection: 'This seems expensive for something that might never happen.',
      response:
        'The cost of a data breach — regulatory penalties, reputational damage, and remediation — is typically far higher than the cost of a proactive assessment and fix.',
    },
  ],
  keywords: ['cyber security', 'penetration testing', 'vulnerability assessment', 'POPIA compliance', 'data protection', 'access control'],
}