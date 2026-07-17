/**
 * WebDevelopment.ts
 *
 * Location: src/knowledge/services/WebDevelopment.ts
 *
 * Structured business intelligence for KyleDev's Web Development
 * service line. Consumed directly by AI employees (Sales, Marketing,
 * Customer Success, Software Engineer, Business Analyst, Executive
 * Assistant, Proposal Generator, Quotation Generator, Automation
 * Designer, Website Generator, Desktop App Generator) — not
 * documentation, no markdown, machine-readable only.
 *
 * Pricing in South African Rand (ZAR). Figures reflect realistic
 * mid-market South African digital agency rates as of 2025/2026 and
 * should be reviewed against KyleDev's actual current rate card
 * before being surfaced to a client.
 */

export interface ServiceKnowledge {
  readonly serviceName: string
  readonly description: string
  readonly idealClients: string[]
  readonly companySizes: string[]
  readonly industries: string[]
  readonly businessProblems: string[]
  readonly businessBenefits: string[]
  readonly commonDiscoveryQuestions: string[]
  readonly deliverables: string[]
  readonly technologies: string[]
  readonly estimatedTimeline: string
  readonly startingPrice: number
  readonly averagePrice: number
  readonly enterprisePrice: number
  readonly recommendedAddOns: string[]
  readonly requiredEmployees: string[]
  readonly requiredAIWorkers: string[]
  readonly proposalSections: string[]
  readonly quotationItems: string[]
  readonly projectPhases: string[]
  readonly qualityChecklist: string[]
  readonly upsellServices: string[]
  readonly crossSellServices: string[]
  readonly maintenanceRequirements: string[]
  readonly successMetrics: string[]
  readonly commonRisks: string[]
  readonly commonClientQuestions: string[]
  readonly objectionHandling: { objection: string; response: string }[]
  readonly keywords: string[]
}

export const WebDevelopmentKnowledge: ServiceKnowledge = {
  serviceName: 'Web Development',
  description:
    'Design, build, and launch of custom business websites and web applications, from marketing sites to client portals and internal tools.',
  idealClients: [
    'Businesses without a website or with an outdated one',
    'Companies replacing a template/DIY site (Wix, GoDaddy) that has outgrown their needs',
    'Businesses needing a client portal, booking system, or internal tool',
    'Franchises needing a multi-location site',
  ],
  companySizes: ['Sole proprietor', 'Small business (2-20 staff)', 'Mid-market (21-200 staff)', 'Enterprise (200+ staff)'],
  industries: [
    'Mining',
    'Construction',
    'Retail',
    'Healthcare',
    'Accounting',
    'Legal',
    'Manufacturing',
    'Education',
    'Hospitality',
    'Logistics',
  ],
  businessProblems: [
    'No online presence or an outdated site losing credibility',
    'Site not mobile responsive, losing mobile traffic',
    'No lead capture or online booking mechanism',
    'Slow load times causing high bounce rate',
    'Site not ranking on Google',
    'No way to update content without a developer',
  ],
  businessBenefits: [
    'Increased inbound leads via forms, calls, and bookings',
    'Improved brand credibility and trust',
    'Faster page loads improving conversion and SEO ranking',
    'Self-service content management for the client team',
    'Scalable foundation for future features (e-commerce, portals)',
  ],
  commonDiscoveryQuestions: [
    'What is the primary goal of the website (leads, sales, information, bookings)?',
    'Who is the target audience?',
    'Do you have existing brand assets (logo, colours, fonts)?',
    'Do you need a content management system, or is content static?',
    'What is your expected timeline and launch date?',
    'Do you have an existing domain and hosting provider?',
    'What integrations are required (CRM, payment gateway, booking system)?',
  ],
  deliverables: [
    'Custom-designed responsive website',
    'Content management system access',
    'On-page SEO setup',
    'Contact/lead capture forms',
    'Analytics and tracking integration',
    'Deployment to production hosting',
    'Handover documentation and training session',
  ],
  technologies: [
    'Next.js',
    'React',
    'TypeScript',
    'Node.js',
    'Tailwind CSS',
    'Framer Motion',
    'Supabase',
    'PostgreSQL',
    'Vercel',
    'Cloudflare',
  ],
  estimatedTimeline: '3-8 weeks depending on scope',
  startingPrice: 18000,
  averagePrice: 55000,
  enterprisePrice: 250000,
  recommendedAddOns: [
    'SEO service',
    'Hosting and maintenance plan',
    'Brand identity package',
    'Copywriting service',
    'Analytics dashboard',
  ],
  requiredEmployees: ['Software Engineer', 'Business Analyst', 'Proposal Generator'],
  requiredAIWorkers: ['Website Generator', 'Quotation Generator'],
  proposalSections: [
    'Executive summary',
    'Problem statement',
    'Proposed solution',
    'Scope of work',
    'Technology stack',
    'Timeline',
    'Investment',
    'Terms and next steps',
  ],
  quotationItems: [
    'Discovery and UX planning',
    'UI design',
    'Frontend development',
    'CMS integration',
    'SEO setup',
    'Testing and QA',
    'Deployment',
    'Training and handover',
  ],
  projectPhases: [
    'Discovery',
    'Information architecture and wireframes',
    'UI design',
    'Development',
    'Content population',
    'QA and testing',
    'Launch',
    'Post-launch support window',
  ],
  qualityChecklist: [
    'Mobile responsive across breakpoints',
    'Core Web Vitals within acceptable range',
    'Cross-browser tested',
    'Forms tested end-to-end',
    'SSL configured',
    'Analytics firing correctly',
    'Accessibility basics (alt text, contrast, semantic HTML)',
  ],
  upsellServices: ['SEO', 'Business Automation', 'AI Integration', 'Hosting'],
  crossSellServices: ['Brand Identity', 'Cyber Security', 'Mobile Development'],
  maintenanceRequirements: [
    'Framework and dependency updates',
    'Security patching',
    'Uptime monitoring',
    'Content backups',
    'Performance monitoring',
  ],
  successMetrics: [
    'Organic traffic growth',
    'Lead form conversion rate',
    'Bounce rate reduction',
    'Page load time',
    'Google PageSpeed score',
  ],
  commonRisks: [
    'Scope creep from undefined content requirements',
    'Delays from client-side content delivery',
    'Third-party integration limitations',
    'Browser/device compatibility edge cases',
  ],
  commonClientQuestions: [
    'How long will the website take?',
    'Will I be able to update the content myself?',
    'Do you handle hosting?',
    'What happens after launch if something breaks?',
    'Will the site rank on Google?',
  ],
  objectionHandling: [
    {
      objection: 'This is more expensive than a template site.',
      response:
        'A template constrains you to generic functionality and design; a custom build is engineered around your specific conversion goals and scales with the business, which a template cannot.',
    },
    {
      objection: 'I can build this myself on Wix or Squarespace.',
      response:
        'DIY builders are viable for very simple sites, but they limit performance, custom functionality, and SEO control — a custom build removes those ceilings.',
    },
  ],
  keywords: ['website', 'web app', 'web development', 'landing page', 'CMS', 'redesign', 'online presence'],
}