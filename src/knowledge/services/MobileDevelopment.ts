/**
 * MobileDevelopment.ts
 *
 * Location: src/knowledge/services/MobileDevelopment.ts
 *
 * Structured business intelligence for KyleDev's Mobile Development
 * service line. Machine-readable only — consumed directly by AI
 * employees, not documentation.
 *
 * Pricing in South African Rand (ZAR), reflecting realistic
 * mid-market South African rates as of 2025/2026; review against
 * KyleDev's current rate card before client-facing use.
 */

import type { ServiceKnowledge } from './WebDevelopment'

export const MobileDevelopmentKnowledge: ServiceKnowledge = {
  serviceName: 'Mobile Development',
  description:
    'Native and cross-platform mobile application design and development for iOS and Android, from MVP to full-featured production apps.',
  idealClients: [
    'Businesses launching a customer-facing app (ordering, booking, loyalty)',
    'Companies needing a field-service or logistics app for staff',
    'Startups validating a mobile-first product idea',
    'Existing web-platform businesses extending to mobile',
  ],
  companySizes: ['Startup', 'Small business (2-20 staff)', 'Mid-market (21-200 staff)', 'Enterprise (200+ staff)'],
  industries: [
    'Retail',
    'Healthcare',
    'Logistics',
    'Hospitality',
    'Construction',
    'Education',
    'Mining',
    'Manufacturing',
  ],
  businessProblems: [
    'No mobile channel for customers who expect an app',
    'Field staff relying on paper forms or disconnected tools',
    'Existing app has poor performance or outdated UX',
    'No offline capability for staff working in low-connectivity areas',
    'Push notification and re-engagement channel missing',
  ],
  businessBenefits: [
    'Direct engagement channel via push notifications',
    'Improved field operations efficiency and data accuracy',
    'Higher customer retention through loyalty and convenience features',
    'Offline-capable workflows for remote or low-connectivity sites',
    'New revenue channel (in-app purchases, bookings, orders)',
  ],
  commonDiscoveryQuestions: [
    'Is this consumer-facing, internal, or both?',
    'iOS, Android, or both platforms?',
    'Does the app need offline functionality?',
    'What backend systems must it integrate with?',
    'Do you need push notifications?',
    'Is there an existing design system or brand guideline?',
    'What is the target launch date and app store submission timeline?',
  ],
  deliverables: [
    'Native or cross-platform mobile application',
    'App store and Play Store listing assets',
    'Backend API integration',
    'Push notification setup',
    'Analytics and crash reporting integration',
    'App store submission and approval support',
    'Handover documentation',
  ],
  technologies: [
    'React Native',
    'TypeScript',
    'Node.js',
    'Supabase',
    'PostgreSQL',
    'Expo',
    'Firebase',
    'Docker',
  ],
  estimatedTimeline: '6-16 weeks depending on scope and platform count',
  startingPrice: 65000,
  averagePrice: 180000,
  enterprisePrice: 450000,
  recommendedAddOns: ['Backend API build', 'AI Integration', 'Hosting', 'Business Automation'],
  requiredEmployees: ['Software Engineer', 'Business Analyst', 'Proposal Generator'],
  requiredAIWorkers: ['Quotation Generator', 'Automation Designer'],
  proposalSections: [
    'Executive summary',
    'Problem statement',
    'Platform recommendation',
    'Feature scope',
    'Technology stack',
    'Timeline',
    'Investment',
    'App store process and terms',
  ],
  quotationItems: [
    'Discovery and UX planning',
    'UI design',
    'Application development',
    'Backend/API integration',
    'Push notification setup',
    'QA across devices',
    'App store submission',
    'Training and handover',
  ],
  projectPhases: [
    'Discovery',
    'Wireframes and UX flow',
    'UI design',
    'Development',
    'Backend integration',
    'Device QA and testing',
    'App store submission',
    'Launch and post-launch support',
  ],
  qualityChecklist: [
    'Tested on multiple device sizes and OS versions',
    'Offline behaviour verified where applicable',
    'Push notifications delivering correctly',
    'Crash-free session rate above target threshold',
    'App store guideline compliance checked',
    'Performance profiling completed',
  ],
  upsellServices: ['AI Integration', 'Business Automation', 'Hosting', 'Maintenance'],
  crossSellServices: ['Web Development', 'Brand Identity', 'Cyber Security'],
  maintenanceRequirements: [
    'OS version compatibility updates',
    'App store policy compliance updates',
    'Dependency and SDK updates',
    'Crash monitoring and bug fixes',
    'Backend uptime monitoring',
  ],
  successMetrics: [
    'App store rating and reviews',
    'Daily/monthly active users',
    'Retention rate at 7/30 days',
    'Crash-free session percentage',
    'Push notification opt-in rate',
  ],
  commonRisks: [
    'App store review rejection delaying launch',
    'Third-party SDK/API limitations',
    'Device fragmentation on Android',
    'Scope creep on feature requests mid-build',
  ],
  commonClientQuestions: [
    'Do we need both iOS and Android from day one?',
    'How long does app store approval take?',
    'Who owns the app store developer account?',
    'What happens when Apple/Google change their policies?',
    'Can we add features after launch?',
  ],
  objectionHandling: [
    {
      objection: 'A mobile app is too expensive for our stage.',
      response:
        'We can scope a focused MVP covering only the core workflow first, validating demand before investing in the full feature set.',
    },
    {
      objection: 'Why not just build a mobile-friendly website instead?',
      response:
        'A responsive website is a valid starting point for informational content, but push notifications, offline access, and app-store discoverability are only available through a native or cross-platform app.',
    },
  ],
  keywords: ['mobile app', 'iOS', 'Android', 'React Native', 'app development', 'push notifications'],
}