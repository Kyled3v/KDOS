/**
 * Hospitality.ts
 *
 * Location: src/knowledge/industries/Hospitality.ts
 *
 * Structured industry intelligence for the Hospitality sector, part
 * of the KyleDev Industry Intelligence Library. Machine-readable
 * only — consumed directly by AI employees, not documentation.
 *
 * `commonObjections` and `objectionResponses` are parallel arrays —
 * see Mining.ts for the shared convention and IndustryKnowledge type.
 */

import type { IndustryKnowledge } from './Mining'

export const HospitalityKnowledge: IndustryKnowledge = {
  industry: 'Hospitality',
  overview:
    'South African hospitality includes guesthouses, boutique hotels, lodges, restaurants, and event venues, heavily reliant on tourism (both local and international) and online booking channels. Occupancy/booking management, guest experience, and online reputation are central to profitability.',
  companySizes: [
    'Small guesthouse/B&B (under 10 staff)',
    'Boutique hotel/lodge (10-50 staff)',
    'Larger hotel or hospitality group (50+ staff, multiple properties)',
  ],
  commonDepartments: [
    'Front office/reservations',
    'Food and beverage',
    'Housekeeping',
    'Marketing and sales',
    'Finance',
    'Guest relations',
  ],
  decisionMakers: [
    'Owner / General Manager',
    'Reservations Manager',
    'Marketing Manager',
    'Operations Manager',
  ],
  commonSoftwareUsed: [
    'Property management systems (Opera, Nightsbridge, Little Hotelier)',
    'Online travel agent channels (Booking.com, Airbnb, Expedia)',
    'Excel for manual booking tracking (smaller properties)',
    'Basic websites without direct booking integration',
  ],
  currentProblems: [
    'Bookings managed across multiple disconnected channels causing double-bookings',
    'No direct booking channel on the website, losing revenue to OTA commissions',
    'Manual guest communication for pre-arrival and post-stay follow-up',
    'Limited visibility into occupancy and revenue trends',
    'Online review management handled reactively, not proactively',
  ],
  digitalMaturityLevels: [
    'Low: manual/phone bookings, no property management system',
    'Medium: PMS in place, but not synced with website or OTAs',
    'High: channel-synced booking system with direct website bookings',
    'Advanced: fully integrated PMS, direct booking, guest CRM, and revenue management',
  ],
  manualProcesses: [
    'Booking confirmation and calendar reconciliation across channels',
    'Guest pre-arrival and post-stay communication',
    'Housekeeping task assignment',
    'Revenue and occupancy reporting',
    'Online review monitoring and response',
  ],
  automationOpportunities: [
    'Automated channel-synced booking calendar to prevent double-bookings',
    'Automated guest pre-arrival and post-stay communication',
    'Automated housekeeping task assignment based on bookings',
    'Automated review request follow-up after checkout',
  ],
  AIOpportunities: [
    'AI chatbot for booking enquiries and guest questions',
    'AI-assisted dynamic pricing recommendations based on occupancy trends',
    'AI-generated marketing content for property listings',
    'Sentiment analysis on guest reviews for service improvement insights',
  ],
  businessRisks: [
    'Revenue loss from double-bookings across channels',
    'High OTA commission costs eating into margins',
    'Reputational damage from unmanaged negative reviews',
    'Guest experience inconsistency from manual communication',
  ],
  recommendedKyleDevServices: ['Web Development', 'Business Automation', 'AI Integration'],
  crossSellServices: ['SEO', 'Brand Identity', 'Mobile Development'],
  estimatedProjectBudgetsZAR: {
    smallEngagement: 20000,
    midSizeEngagement: 70000,
    largeEngagement: 220000,
    enterpriseEngagement: 600000,
  },
  commonDiscoveryQuestions: [
    'What property management system, if any, do you currently use?',
    'Which booking channels do you currently use (OTAs, direct, phone)?',
    'Do you have direct booking capability on your website?',
    'How is guest communication currently handled pre- and post-stay?',
    'What percentage of bookings currently come through OTAs versus direct?',
  ],
  proposalTalkingPoints: [
    'Reduced OTA commission costs through direct website bookings',
    'Elimination of double-bookings through channel-synced calendars',
    'Improved guest experience through automated, timely communication',
    'Better occupancy and revenue visibility for decision-making',
  ],
  commonObjections: [
    'We rely on Booking.com and Airbnb, we do not need our own booking system.',
    'Our guests book by phone, not online.',
    'This seems like a lot of investment for a small property.',
  ],
  objectionResponses: [
    'OTAs remain valuable for discovery, but a direct booking channel reduces commission costs on repeat and referred guests, improving overall margin.',
    'A direct online booking option does not replace phone bookings, it captures the growing share of guests who prefer to book online before ever calling.',
    'We can scope a focused solution — such as just a direct booking widget — sized appropriately for a smaller property\'s budget and needs.',
  ],
  salesTriggers: [
    'Rising OTA commission costs eating into margins',
    'Recent double-booking incident causing guest complaints',
    'Seasonal occupancy planning ahead of peak tourism season',
    'Negative review pattern affecting booking conversion',
  ],
  painPoints: [
    'High commission costs from OTA dependency',
    'Double-bookings causing guest dissatisfaction',
    'Time lost on manual guest communication',
    'Limited visibility into which channels drive the most profitable bookings',
  ],
  KPIs: [
    'Occupancy rate',
    'Average daily rate (ADR)',
    'Direct booking percentage versus OTA',
    'Guest review score',
  ],
  successMetrics: [
    'Increase in direct booking percentage',
    'Reduction in double-booking incidents',
    'Improvement in average guest review score',
    'Reduction in OTA commission spend',
  ],
  futureTechnologyTrends: [
    'AI-powered dynamic pricing and revenue management',
    'Contactless check-in/check-out technology',
    'AI chatbots for 24/7 booking and guest support',
    'Integrated guest CRM for personalised marketing',
  ],
  complianceRequirements: [
    'Tourism grading body requirements (where applicable)',
    'POPIA for guest personal and payment data',
    'Consumer Protection Act compliance for bookings and cancellations',
  ],
  securityRequirements: [
    'Secure payment processing for booking deposits',
    'Protection of guest personal data (POPIA)',
    'Access control for booking and financial systems',
  ],
  mobileRequirements: [
    'Mobile-friendly direct booking experience',
    'Mobile guest communication (SMS/WhatsApp)',
    'Mobile housekeeping task management',
  ],
  dashboardRequirements: [
    'Occupancy and booking channel dashboard',
    'Revenue and ADR dashboard',
    'Guest review and sentiment dashboard',
  ],
  reportingRequirements: [
    'Occupancy and revenue reports',
    'Booking channel performance reports',
    'Guest satisfaction and review reports',
  ],
  integrationRequirements: [
    'Integration with property management system',
    'Integration with OTA channel managers (Booking.com, Airbnb, Expedia)',
    'Integration with payment gateways',
  ],
  recommendedAIWorkers: ['Automation Designer', 'Marketing', 'Quotation Generator'],
  recommendedPlugins: ['Direct booking widget', 'Channel sync manager', 'Guest communication automation'],
  keywords: ['hospitality software', 'property management system', 'direct booking', 'OTA integration', 'guest experience', 'revenue management'],
  southAfricanMarketConsiderations: [
    'Seasonal international tourism patterns significantly affect booking volume and pricing strategy',
    'Exchange rate fluctuations influence international guest booking behaviour',
    'Load shedding affects guest experience and requires contingency communication',
    'Local tourism grading (Tourism Grading Council) can influence marketing credibility',
  ],
}