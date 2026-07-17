/**
 * SEO.ts
 *
 * Location: src/knowledge/services/SEO.ts
 *
 * Structured business intelligence for KyleDev's SEO service line.
 * Machine-readable only — consumed directly by AI employees, not
 * documentation.
 *
 * Pricing in South African Rand (ZAR), reflecting realistic
 * mid-market South African rates as of 2025/2026; review against
 * KyleDev's current rate card before client-facing use. Pricing
 * shown is monthly recurring.
 */

import type { ServiceKnowledge } from './WebDevelopment'

export const SEOKnowledge: ServiceKnowledge = {
  serviceName: 'SEO',
  description:
    'Ongoing search engine optimisation: technical SEO, on-page optimisation, content strategy, and local search visibility to grow organic traffic and leads.',
  idealClients: [
    'Businesses relying on paid ads with no organic search presence',
    'Companies not appearing on the first page for their core services',
    'Local businesses not showing up in "near me" or map pack searches',
    'Businesses with a website but declining or stagnant organic traffic',
  ],
  companySizes: ['Small business (2-20 staff)', 'Mid-market (21-200 staff)', 'Enterprise (200+ staff)'],
  industries: ['Retail', 'Healthcare', 'Legal', 'Accounting', 'Hospitality', 'Construction', 'Education'],
  businessProblems: [
    'Website not ranking for relevant search terms',
    'Poor technical SEO health (slow site, broken links, no sitemap)',
    'No content strategy targeting customer search intent',
    'Not appearing in local/map pack search results',
    'Reliance on paid ads with no organic growth strategy',
  ],
  businessBenefits: [
    'Increased organic (free) traffic over time',
    'Reduced long-term dependency on paid advertising',
    'Improved local visibility for location-based searches',
    'Higher quality leads from intent-driven search traffic',
    'Stronger domain authority and search credibility',
  ],
  commonDiscoveryQuestions: [
    'What are your core products/services you want to rank for?',
    'Who are your main competitors in search results?',
    'Do you have Google Business Profile set up and verified?',
    'What is your current organic traffic and ranking baseline?',
    'Is there an existing content/blog strategy in place?',
    'What geographic area(s) do you serve?',
  ],
  deliverables: [
    'Technical SEO audit and fixes',
    'On-page optimisation for target pages',
    'Keyword and content strategy',
    'Google Business Profile optimisation',
    'Monthly ranking and traffic report',
    'Ongoing content recommendations',
  ],
  technologies: ['Next.js', 'Cloudflare', 'Google Search Console', 'Google Analytics', 'Ahrefs', 'Semrush'],
  estimatedTimeline: 'Ongoing monthly service; initial audit and fixes in first 2-4 weeks',
  startingPrice: 4500,
  averagePrice: 9000,
  enterprisePrice: 22000,
  recommendedAddOns: ['Web Development', 'Brand Identity', 'Business Automation'],
  requiredEmployees: ['Marketing', 'Business Analyst', 'Proposal Generator'],
  requiredAIWorkers: ['Quotation Generator'],
  proposalSections: [
    'Current search visibility assessment',
    'Competitor benchmark',
    'Proposed SEO strategy',
    'Timeline and expected trajectory',
    'Monthly investment',
    'Reporting cadence',
  ],
  quotationItems: [
    'Technical SEO audit',
    'On-page optimisation',
    'Keyword research and content strategy',
    'Google Business Profile setup/optimisation',
    'Monthly reporting and strategy review',
  ],
  projectPhases: [
    'Technical audit',
    'Priority fixes implementation',
    'On-page optimisation rollout',
    'Content strategy execution',
    'Ongoing monitoring and iteration',
    'Monthly reporting cycle',
  ],
  qualityChecklist: [
    'No critical technical SEO issues outstanding (broken links, missing meta, crawl errors)',
    'Target pages optimised for primary keywords',
    'Google Business Profile fully completed and verified',
    'Sitemap submitted and indexed correctly',
    'Core Web Vitals within acceptable range',
  ],
  upsellServices: ['Web Development', 'Business Automation', 'Brand Identity'],
  crossSellServices: ['Web Development', 'AI Integration'],
  maintenanceRequirements: [
    'This is itself an ongoing service requiring continuous iteration',
    'Algorithm update monitoring and strategy adjustment',
    'Content refresh on a regular cadence',
  ],
  successMetrics: [
    'Organic traffic growth month over month',
    'Keyword ranking position improvement',
    'Local pack/map visibility',
    'Organic lead/conversion volume',
  ],
  commonRisks: [
    'Search algorithm updates affecting rankings unpredictably',
    'Highly competitive keyword space limiting near-term gains',
    'Client-side content delivery delays slowing content strategy execution',
    'Unrealistic timeline expectations given SEO is a compounding, not instant, channel',
  ],
  commonClientQuestions: [
    'How long until we see results?',
    'Can you guarantee a first-page ranking?',
    'Why does SEO require an ongoing monthly commitment?',
    'How do you measure success?',
    'Will this replace our paid advertising?',
  ],
  objectionHandling: [
    {
      objection: 'Can you guarantee we will rank #1?',
      response:
        'No ethical SEO provider can guarantee a specific ranking position, since search algorithms are outside anyone\'s direct control — we can commit to a defined strategy, transparent reporting, and measurable progress toward visibility goals.',
    },
    {
      objection: 'SEO seems slow compared to paid ads.',
      response:
        'Paid ads deliver immediate but temporary visibility that stops the moment spend stops; SEO compounds over time and continues generating traffic without ongoing ad spend — the two work best as complementary channels.',
    },
  ],
  keywords: ['SEO', 'search engine optimisation', 'organic traffic', 'Google ranking', 'local SEO', 'content strategy'],
}