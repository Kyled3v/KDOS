/**
 * Retail.ts
 *
 * Location: src/knowledge/industries/Retail.ts
 *
 * Structured industry intelligence for the Retail sector, part of the
 * KyleDev Industry Intelligence Library. Machine-readable only —
 * consumed directly by AI employees, not documentation.
 *
 * `commonObjections` and `objectionResponses` are parallel arrays —
 * see Mining.ts for the shared convention and IndustryKnowledge type.
 */

import type { IndustryKnowledge } from './Mining'

export const RetailKnowledge: IndustryKnowledge = {
  industry: 'Retail',
  overview:
    'South African retail spans independent single-store operators, franchise chains, and multi-branch regional retailers across general merchandise, fashion, grocery, and speciality goods. Margins are tight, competition from e-commerce and national chains is high, and inventory/stock accuracy directly drives profitability.',
  companySizes: [
    'Independent single-store retailer',
    'Small chain (2-10 branches)',
    'Regional chain (10-50 branches)',
    'National retailer/franchise (50+ branches)',
  ],
  commonDepartments: [
    'Store operations',
    'Merchandising and buying',
    'Marketing',
    'Finance',
    'Supply chain and logistics',
    'Customer service',
  ],
  decisionMakers: [
    'Owner / Managing Director',
    'Retail Operations Manager',
    'Marketing Manager',
    'Financial Manager',
    'IT Manager (larger chains)',
  ],
  commonSoftwareUsed: [
    'Point-of-sale (POS) systems (Pastel, Sage, custom/legacy POS)',
    'Excel for stock and sales reporting',
    'Basic e-commerce platforms (Shopify, WooCommerce) if online at all',
    'WhatsApp Business for customer communication',
    'Accounting software (Sage, Xero)',
  ],
  currentProblems: [
    'No unified view of stock across multiple branches',
    'Manual stocktaking prone to error and time-consuming',
    'Limited or no online sales channel',
    'Customer data not captured or used for marketing/loyalty',
    'Sales reporting delayed, limiting timely business decisions',
  ],
  digitalMaturityLevels: [
    'Low: manual/paper stock control, cash-only or basic POS',
    'Medium: POS system in place, but branches not connected centrally',
    'High: centralised POS and inventory, limited online presence',
    'Advanced: integrated omnichannel (in-store, online, mobile) with unified inventory',
  ],
  manualProcesses: [
    'Stocktaking and inventory reconciliation',
    'Sales report consolidation across branches',
    'Supplier order placement',
    'Customer loyalty tracking',
    'Price list updates across branches',
  ],
  automationOpportunities: [
    'Automated stock level alerts and reorder triggers',
    'Automated sales report consolidation across branches',
    'Automated customer loyalty point tracking and communication',
    'Automated price sync across POS and online channels',
  ],
  AIOpportunities: [
    'AI-powered demand forecasting for stock ordering',
    'AI chatbot for customer queries and order status',
    'AI-assisted product description and marketing content generation',
    'Personalised marketing recommendations from purchase history',
  ],
  businessRisks: [
    'Stockouts or overstock from poor inventory visibility',
    'Revenue leakage from stock shrinkage/theft',
    'Loss of customers to competitors with online presence',
    'Cash flow strain from poor sales visibility',
  ],
  recommendedKyleDevServices: ['Web Development', 'Business Automation', 'Desktop Development'],
  crossSellServices: ['SEO', 'Brand Identity', 'AI Integration'],
  estimatedProjectBudgetsZAR: {
    smallEngagement: 20000,
    midSizeEngagement: 80000,
    largeEngagement: 250000,
    enterpriseEngagement: 700000,
  },
  commonDiscoveryQuestions: [
    'How many branches/locations need to be covered?',
    'What POS system do you currently use, if any?',
    'Do you currently sell online, and if so, on what platform?',
    'How is stock currently tracked across locations?',
    'Do you run any customer loyalty or marketing programme today?',
  ],
  proposalTalkingPoints: [
    'Unified stock visibility across all branches',
    'New online sales channel expanding market reach',
    'Automated reporting freeing up management time',
    'Customer data capture enabling targeted marketing',
  ],
  commonObjections: [
    'Our current POS system already works fine.',
    'We do not have the budget for a website right now.',
    'Our customers are mostly walk-in, we do not need online sales.',
  ],
  objectionResponses: [
    'This can integrate with your existing POS rather than replace it, closing the reporting and stock-visibility gaps it currently has.',
    'A phased approach lets us start with the highest-impact piece first, such as inventory automation, before expanding to a full online channel.',
    'Even walk-in-heavy retailers benefit from online visibility for discovery, click-and-collect, and competing with retailers who now have that channel.',
  ],
  salesTriggers: [
    'Recent stock loss or shrinkage incident',
    'Expansion to a new branch/location',
    'Competitor launching an online store',
    'Frustration with manual stocktaking during peak season',
  ],
  painPoints: [
    'Time lost on manual stocktaking',
    'Lost sales from stockouts on popular items',
    'No visibility into which branches are underperforming',
    'Missed marketing opportunities from no customer data',
  ],
  KPIs: [
    'Stock turnover rate',
    'Sales per branch',
    'Stock shrinkage percentage',
    'Customer repeat purchase rate',
  ],
  successMetrics: [
    'Reduction in stockout incidents',
    'Reduction in stocktaking time',
    'Online sales channel revenue growth',
    'Customer loyalty programme engagement rate',
  ],
  futureTechnologyTrends: [
    'Omnichannel inventory and customer experience integration',
    'AI-powered demand forecasting',
    'Self-service and mobile checkout options',
    'Personalised marketing automation',
  ],
  complianceRequirements: [
    'Consumer Protection Act compliance',
    'POPIA for customer data handling',
    'VAT and till-slip regulatory requirements',
  ],
  securityRequirements: [
    'Secure payment processing (PCI-DSS alignment for card payments)',
    'Access control across branch-level POS and admin systems',
    'Customer data protection under POPIA',
  ],
  mobileRequirements: [
    'Mobile stock lookup for staff',
    'Mobile POS options for pop-up or event sales',
    'Customer-facing mobile ordering/loyalty app (for larger chains)',
  ],
  dashboardRequirements: [
    'Multi-branch sales dashboard',
    'Stock level and reorder dashboard',
    'Customer loyalty engagement dashboard',
  ],
  reportingRequirements: [
    'Consolidated sales reports across branches',
    'Stock movement and shrinkage reports',
    'Customer purchase behaviour reports',
  ],
  integrationRequirements: [
    'Integration with existing POS system',
    'Integration with accounting software',
    'Integration with e-commerce platform (if applicable)',
  ],
  recommendedAIWorkers: ['Automation Designer', 'Marketing', 'Quotation Generator'],
  recommendedPlugins: ['Inventory sync module', 'Loyalty programme engine', 'Multi-branch reporting'],
  keywords: ['retail software', 'POS integration', 'inventory management', 'e-commerce', 'stock control', 'customer loyalty'],
  southAfricanMarketConsiderations: [
    'Load shedding requires offline-capable POS to keep trading during outages',
    'Cash remains a significant payment method alongside card and mobile payments',
    'Competition from informal/township retail requires cost-conscious solution design',
    'B-BBEE and local supplier sourcing can factor into larger retail partnerships',
  ],
}