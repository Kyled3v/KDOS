/**
 * Healthcare.ts
 *
 * Location: src/knowledge/industries/Healthcare.ts
 *
 * Structured industry intelligence for the Healthcare sector, part of
 * the KyleDev Industry Intelligence Library. Machine-readable only —
 * consumed directly by AI employees, not documentation.
 *
 * `commonObjections` and `objectionResponses` are parallel arrays —
 * see Mining.ts for the shared convention and IndustryKnowledge type.
 */

import type { IndustryKnowledge } from './Mining'

export const HealthcareKnowledge: IndustryKnowledge = {
  industry: 'Healthcare',
  overview:
    'South African private healthcare includes GP and specialist practices, dental practices, allied health practitioners, clinics, and small private hospital groups, operating alongside medical aid administrators. Patient data sensitivity, appointment/booking efficiency, and medical aid billing accuracy are central operational concerns.',
  companySizes: [
    'Solo practitioner',
    'Small practice/clinic (2-15 staff)',
    'Multi-practitioner clinic or small hospital group (15-100 staff)',
    'Larger healthcare group (100+ staff, multiple facilities)',
  ],
  commonDepartments: [
    'Clinical/practitioner staff',
    'Reception and patient administration',
    'Billing and medical aid claims',
    'Practice management',
    'Compliance and quality assurance',
  ],
  decisionMakers: [
    'Practice Owner / Principal Practitioner',
    'Practice Manager',
    'Financial Manager (larger groups)',
    'Clinical Director (multi-practitioner groups)',
  ],
  commonSoftwareUsed: [
    'Practice management systems (Elixir, GoodX, Healthbridge)',
    'Medical aid billing/claims switching software',
    'Excel for scheduling and reporting in smaller practices',
    'Basic websites with limited booking functionality',
  ],
  currentProblems: [
    'Manual appointment scheduling leading to double-bookings and no-shows',
    'Medical aid claim rejections from data entry errors',
    'Patient records fragmented across paper and digital systems',
    'Limited online presence for patient acquisition',
    'No automated patient reminder system, increasing no-show rates',
  ],
  digitalMaturityLevels: [
    'Low: paper patient files, phone-only booking',
    'Medium: digital practice management system, but no online patient portal',
    'High: online booking and digital records, limited automation',
    'Advanced: fully integrated patient portal, automated billing, and reminders',
  ],
  manualProcesses: [
    'Appointment scheduling and confirmation',
    'Medical aid claim submission and follow-up',
    'Patient record filing and retrieval',
    'Appointment reminder calls',
    'New patient intake form processing',
  ],
  automationOpportunities: [
    'Automated appointment reminders via SMS/WhatsApp/email',
    'Automated medical aid claim status tracking',
    'Automated patient intake form digitisation',
    'Automated recall reminders for follow-up visits',
  ],
  AIOpportunities: [
    'AI chatbot for appointment booking and common patient queries',
    'AI-assisted claim rejection reason analysis',
    'Document processing for patient intake and referral letters',
    'Internal knowledge assistant for practice administrative procedures',
  ],
  businessRisks: [
    'Patient data breaches and POPIA non-compliance',
    'Revenue loss from unclaimed or rejected medical aid billing',
    'Reputational damage from booking/scheduling errors',
    'Compliance risk with the Health Professions Council of South Africa (HPCSA)',
  ],
  recommendedKyleDevServices: ['Web Development', 'Business Automation', 'AI Integration'],
  crossSellServices: ['Cyber Security', 'Hosting', 'Mobile Development'],
  estimatedProjectBudgetsZAR: {
    smallEngagement: 18000,
    midSizeEngagement: 65000,
    largeEngagement: 200000,
    enterpriseEngagement: 550000,
  },
  commonDiscoveryQuestions: [
    'What practice management system do you currently use, if any?',
    'How are appointments currently booked and confirmed?',
    'What is your current no-show rate?',
    'How are medical aid claims currently processed and tracked?',
    'Do you need a patient-facing online booking option?',
  ],
  proposalTalkingPoints: [
    'Reduced no-show rate through automated reminders',
    'Faster, more accurate medical aid claims processing',
    'Improved patient acquisition through online booking and presence',
    'POPIA-conscious data handling for patient records',
  ],
  commonObjections: [
    'Patient data is too sensitive to move to a new system.',
    'Our current system already handles billing.',
    'Our patients are older and prefer to phone in.',
  ],
  objectionResponses: [
    'Patient data handling follows strict access control and POPIA-aligned practices, and we can design the solution to integrate with rather than replace sensitive record storage.',
    'This layer can sit alongside your existing billing system to automate reminders and claim tracking without replacing what already works.',
    'Phone booking can remain available alongside automated reminders and optional online booking, so no patient loses their preferred channel.',
  ],
  salesTriggers: [
    'High no-show rate affecting revenue',
    'Frequent medical aid claim rejections',
    'Practice expansion adding practitioners or a second location',
    'Patient complaints about booking difficulty',
  ],
  painPoints: [
    'Revenue lost to no-shows and unclaimed billing',
    'Reception staff overwhelmed by phone-only booking',
    'Delayed medical aid payments affecting cash flow',
    'Fragmented patient records across systems',
  ],
  KPIs: [
    'No-show rate',
    'Medical aid claim rejection rate',
    'Average time to claim payment',
    'New patient acquisition rate',
  ],
  successMetrics: [
    'Reduction in no-show rate',
    'Reduction in claim rejection rate',
    'Reduction in claim payment turnaround time',
    'Increase in online booking adoption',
  ],
  futureTechnologyTrends: [
    'Telehealth and remote consultation integration',
    'AI-assisted clinical documentation support',
    'Wearable/health data integration for chronic care management',
    'Digital patient portals for records and billing',
  ],
  complianceRequirements: [
    'POPIA (Protection of Personal Information Act) for patient data',
    'HPCSA (Health Professions Council of South Africa) practice regulations',
    'National Health Act record-keeping requirements',
    'Medical aid scheme billing code compliance',
  ],
  securityRequirements: [
    'Encrypted storage of patient health records',
    'Strict role-based access control to clinical data',
    'Audit trails for all patient record access',
    'Secure transmission of medical aid claims data',
  ],
  mobileRequirements: [
    'Mobile-friendly patient booking',
    'SMS/WhatsApp appointment reminders',
    'Mobile access for practitioners to schedules and basic patient info',
  ],
  dashboardRequirements: [
    'Appointment schedule dashboard',
    'Claims status and revenue dashboard',
    'No-show and cancellation tracking dashboard',
  ],
  reportingRequirements: [
    'Medical aid claims and revenue reports',
    'Appointment and no-show reports',
    'Patient acquisition and retention reports',
  ],
  integrationRequirements: [
    'Integration with existing practice management system',
    'Integration with medical aid claims switching services',
    'Integration with SMS/WhatsApp messaging providers',
  ],
  recommendedAIWorkers: ['Automation Designer', 'Customer Success', 'Quotation Generator'],
  recommendedPlugins: ['Appointment reminder engine', 'Claims tracking module', 'Online booking widget'],
  keywords: ['healthcare software', 'medical practice management', 'patient booking', 'medical aid claims', 'POPIA', 'HPCSA'],
  southAfricanMarketConsiderations: [
    'Medical aid scheme billing rules and codes vary and change periodically, requiring adaptable claims handling',
    'POPIA compliance for patient data is a strict, non-negotiable requirement',
    'Load shedding affects practices without backup power for digital systems',
    'A meaningful proportion of patients still prefer phone-based interaction, so digital tools should supplement rather than replace it',
  ],
}