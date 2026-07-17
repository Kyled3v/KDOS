/**
 * BrandIdentity.ts
 *
 * Location: src/knowledge/services/BrandIdentity.ts
 *
 * Structured business intelligence for KyleDev's Brand Identity
 * service line. Machine-readable only — consumed directly by AI
 * employees, not documentation.
 *
 * Pricing in South African Rand (ZAR), reflecting realistic
 * mid-market South African rates as of 2025/2026; review against
 * KyleDev's current rate card before client-facing use.
 */

import type { ServiceKnowledge } from './WebDevelopment'

export const BrandIdentityKnowledge: ServiceKnowledge = {
  serviceName: 'Brand Identity',
  description:
    "Development of a business's visual and verbal brand identity: logo, colour palette, typography, brand guidelines, and core messaging.",
  idealClients: [
    'New businesses launching without an established brand',
    'Businesses rebranding after outgrowing their original identity',
    'Companies with an inconsistent visual identity across channels',
    'Businesses preparing for a website or product launch needing brand foundations first',
  ],
  companySizes: ['Startup', 'Small business (2-20 staff)', 'Mid-market (21-200 staff)'],
  industries: ['Retail', 'Hospitality', 'Construction', 'Healthcare', 'Education', 'Accounting'],
  businessProblems: [
    'No professional logo or visual identity',
    'Inconsistent branding across website, social media, and print',
    'Brand identity that no longer reflects the business positioning',
    'No documented brand guidelines for staff or contractors to follow',
    'Difficulty standing out from competitors visually',
  ],
  businessBenefits: [
    'Professional, consistent brand presence across all channels',
    'Increased perceived credibility and trust',
    'Clear guidelines enabling consistent use by staff and partners',
    'Stronger differentiation from competitors',
    'Foundation that speeds up future website and marketing work',
  ],
  commonDiscoveryQuestions: [
    'What does your business do, and who is your target audience?',
    'Do you have an existing logo or identity to evolve from, or starting fresh?',
    'Who are your key competitors, and how do you want to differentiate?',
    'What tone should the brand convey (premium, approachable, technical, bold)?',
    'Where will this brand identity be applied (web, print, signage, uniforms)?',
  ],
  deliverables: [
    'Primary logo and variations (horizontal, stacked, icon-only)',
    'Colour palette with usage guidelines',
    'Typography selection',
    'Brand guidelines document',
    'Core messaging and tagline direction',
    'Source files in editable and production formats',
  ],
  technologies: ['Figma', 'Adobe Illustrator', 'Framer Motion'],
  estimatedTimeline: '2-5 weeks',
  startingPrice: 9000,
  averagePrice: 26000,
  enterprisePrice: 85000,
  recommendedAddOns: ['Web Development', 'SEO', 'Marketing collateral design'],
  requiredEmployees: ['Business Analyst', 'Proposal Generator'],
  requiredAIWorkers: ['Quotation Generator'],
  proposalSections: [
    'Brand discovery summary',
    'Positioning and audience',
    'Proposed identity direction',
    'Deliverables scope',
    'Timeline',
    'Investment',
  ],
  quotationItems: [
    'Brand discovery workshop',
    'Logo concept design',
    'Colour and typography system',
    'Brand guidelines document',
    'Messaging direction',
    'Final file delivery',
  ],
  projectPhases: [
    'Discovery and positioning',
    'Concept exploration',
    'Refinement based on feedback',
    'Finalisation',
    'Guidelines documentation',
    'File handover',
  ],
  qualityChecklist: [
    'Logo tested at small sizes and in monochrome',
    'Colour palette meets accessibility contrast where applicable',
    'All file formats delivered (vector, raster, print-ready)',
    'Guidelines document covers correct and incorrect usage',
    'Identity reviewed against stated positioning and audience',
  ],
  upsellServices: ['Web Development', 'SEO', 'Marketing collateral'],
  crossSellServices: ['Web Development', 'Mobile Development'],
  maintenanceRequirements: [
    'Periodic brand refresh as the business evolves',
    'Guideline updates as new applications arise (merchandise, signage)',
  ],
  successMetrics: [
    'Brand consistency across channels post-rollout',
    'Client and stakeholder satisfaction with final identity',
    'Recognition/differentiation improvement (qualitative feedback)',
  ],
  commonRisks: [
    'Stakeholder disagreement extending revision rounds beyond scope',
    'Unclear positioning at the outset delaying concept direction',
    'Trademark conflicts with existing marks discovered late',
  ],
  commonClientQuestions: [
    'How many logo concepts will we see?',
    'How many rounds of revisions are included?',
    'Will we own the final files outright?',
    'Can you also design our website to match?',
    'What if we want to change the brand again in future?',
  ],
  objectionHandling: [
    {
      objection: 'We can get a logo cheaper from a freelance marketplace.',
      response:
        'A marketplace logo is typically a standalone graphic; this service delivers a complete, strategically grounded identity system with guidelines that stay consistent as the business grows.',
    },
    {
      objection: 'Our current logo is fine, we do not need this.',
      response:
        'A brand review can confirm what is working and refine only what is holding the business back, rather than starting from zero.',
    },
  ],
  keywords: ['branding', 'logo design', 'brand identity', 'brand guidelines', 'visual identity', 'rebrand'],
}