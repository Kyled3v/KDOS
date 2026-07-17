/**
 * Education.ts
 *
 * Location: src/knowledge/industries/Education.ts
 *
 * Structured industry intelligence for the Education sector, part of
 * the KyleDev Industry Intelligence Library. Machine-readable only —
 * consumed directly by AI employees, not documentation.
 *
 * `commonObjections` and `objectionResponses` are parallel arrays —
 * see Mining.ts for the shared convention and IndustryKnowledge type.
 */

import type { IndustryKnowledge } from './Mining'

export const EducationKnowledge: IndustryKnowledge = {
  industry: 'Education',
  overview:
    'South African education covers private schools, tutoring centres, training providers, and higher education support services. Institutions face pressure around admissions/enrolment management, fee collection, parent/student communication, and, for accredited providers, SETA/regulatory reporting.',
  companySizes: [
    'Small tutoring centre or training provider (under 10 staff)',
    'Private school or mid-size training institution (10-100 staff)',
    'Larger private school group or accredited training provider (100+ staff)',
  ],
  commonDepartments: [
    'Admissions/enrolment',
    'Academic/teaching staff',
    'Finance and fee collection',
    'Marketing and recruitment',
    'Administration',
    'Compliance (for accredited providers)',
  ],
  decisionMakers: [
    'Principal / School Owner',
    'Head of Admissions',
    'Financial Manager / Bursar',
    'Academic Director',
    'Training Provider Manager (SETA-accredited institutions)',
  ],
  commonSoftwareUsed: [
    'D6 Communicator or similar school communication apps',
    'Excel-based fee tracking and admissions records',
    'Basic websites with static content',
    'Email/WhatsApp for parent and student communication',
    'Learning management systems (larger institutions)',
  ],
  currentProblems: [
    'Manual admissions and enrolment processing causing delays',
    'Fee collection tracked manually, leading to arrears going unnoticed',
    'Inconsistent parent/student communication channels',
    'No centralised system for SETA/accreditation reporting',
    'Outdated website failing to attract prospective students',
  ],
  digitalMaturityLevels: [
    'Low: paper-based admissions and fee tracking',
    'Medium: communication app in place, but admissions/fees still manual',
    'High: digital enrolment and fee tracking, limited automation',
    'Advanced: integrated admissions, fees, communication, and compliance reporting',
  ],
  manualProcesses: [
    'Admissions application processing',
    'Fee invoicing and arrears follow-up',
    'Parent/student communication and notices',
    'Compliance/accreditation report compilation',
    'Timetable and scheduling management',
  ],
  automationOpportunities: [
    'Automated admissions application intake and status tracking',
    'Automated fee reminder and arrears escalation workflows',
    'Automated parent/student notification broadcasts',
    'Automated compliance report generation from enrolment data',
  ],
  AIOpportunities: [
    'AI chatbot for prospective parent/student enquiries',
    'AI-assisted content generation for marketing and recruitment',
    'Document processing for admissions application review',
    'Internal knowledge assistant for policy and procedure queries',
  ],
  businessRisks: [
    'Revenue loss from unmanaged fee arrears',
    'Enrolment decline from poor prospective-parent digital experience',
    'Compliance risk for accredited providers missing SETA reporting deadlines',
    'Reputational risk from inconsistent communication',
  ],
  recommendedKyleDevServices: ['Web Development', 'Business Automation', 'Mobile Development'],
  crossSellServices: ['SEO', 'Brand Identity', 'AI Integration'],
  estimatedProjectBudgetsZAR: {
    smallEngagement: 16000,
    midSizeEngagement: 55000,
    largeEngagement: 170000,
    enterpriseEngagement: 480000,
  },
  commonDiscoveryQuestions: [
    'How are admissions applications currently processed?',
    'How is fee collection and arrears tracking currently handled?',
    'What communication channels do you currently use with parents/students?',
    'Are you a SETA-accredited provider with specific reporting requirements?',
    'What is your current website doing well or falling short on for recruitment?',
  ],
  proposalTalkingPoints: [
    'Faster, more professional admissions experience for prospective families',
    'Reduced fee arrears through automated reminders',
    'Consistent, centralised communication with parents and students',
    'Simplified compliance reporting for accredited providers',
  ],
  commonObjections: [
    'Parents are not tech-savvy enough for a new system.',
    'We already use a communication app.',
    'Budget is tight, we are a school not a corporate.',
  ],
  objectionResponses: [
    'We design parent-facing tools for simplicity, typically via SMS/WhatsApp/email channels parents already use daily.',
    'A communication app handles notices, but admissions, fee tracking, and compliance reporting often remain manual — we can integrate alongside what you have.',
    'We scope engagements to fit institutional budgets, starting with the highest-impact process such as fee collection or admissions.',
  ],
  salesTriggers: [
    'Declining enrolment numbers',
    'Growing fee arrears affecting cash flow',
    'Upcoming SETA/accreditation audit or reporting deadline',
    'Competitor institution launching a stronger digital presence',
  ],
  painPoints: [
    'Time lost on manual admissions processing',
    'Fee arrears accumulating unnoticed',
    'Inconsistent parent communication causing frustration',
    'Compliance reporting consuming significant admin time',
  ],
  KPIs: [
    'Enrolment/admissions conversion rate',
    'Fee collection rate',
    'Parent/student satisfaction',
    'Compliance report submission timeliness',
  ],
  successMetrics: [
    'Increase in admissions conversion rate',
    'Reduction in fee arrears',
    'Reduction in admin time spent on communication',
    'Improved compliance reporting turnaround',
  ],
  futureTechnologyTrends: [
    'AI-assisted personalised learning support tools',
    'Digital-first admissions and enrolment platforms',
    'Automated compliance and accreditation reporting',
    'Parent/student mobile apps as standard expectation',
  ],
  complianceRequirements: [
    'SETA accreditation and reporting requirements (for accredited providers)',
    'Department of Basic Education registration requirements (private schools)',
    'POPIA for student and parent personal data',
  ],
  securityRequirements: [
    'Access control for student records and financial data',
    'Secure handling of minors\' personal information under POPIA',
    'Audit trail for admissions and fee record changes',
  ],
  mobileRequirements: [
    'Mobile-friendly parent communication and notifications',
    'Mobile fee payment status checking',
    'Mobile admissions application submission',
  ],
  dashboardRequirements: [
    'Admissions pipeline dashboard',
    'Fee collection and arrears dashboard',
    'Enrolment trend dashboard',
  ],
  reportingRequirements: [
    'Admissions and enrolment reports',
    'Fee collection and arrears reports',
    'SETA/accreditation compliance reports',
  ],
  integrationRequirements: [
    'Integration with existing communication apps (D6 or similar)',
    'Integration with accounting/fee software',
    'Integration with SMS/WhatsApp messaging providers',
  ],
  recommendedAIWorkers: ['Automation Designer', 'Marketing', 'Quotation Generator'],
  recommendedPlugins: ['Admissions pipeline tracker', 'Fee reminder engine', 'Parent communication broadcast module'],
  keywords: ['school software', 'admissions management', 'fee collection', 'parent communication', 'SETA compliance', 'enrolment'],
  southAfricanMarketConsiderations: [
    'POPIA compliance is especially strict for data belonging to minors',
    'SETA accreditation reporting is a recurring compliance obligation for training providers',
    'Fee affordability pressure makes arrears management a sensitive, high-value process to automate',
    'WhatsApp is a dominant parent communication channel and should be a first-class integration',
  ],
}