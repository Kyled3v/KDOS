/**
 * Logistics.ts
 *
 * Location: src/knowledge/industries/Logistics.ts
 *
 * Structured industry intelligence for the Logistics sector, part of
 * the KyleDev Industry Intelligence Library. Machine-readable only —
 * consumed directly by AI employees, not documentation.
 *
 * `commonObjections` and `objectionResponses` are parallel arrays —
 * see Mining.ts for the shared convention and IndustryKnowledge type.
 */

import type { IndustryKnowledge } from './Mining'

export const LogisticsKnowledge: IndustryKnowledge = {
  industry: 'Logistics',
  overview:
    'South African logistics and transport companies range from small courier and delivery operators to larger freight, warehousing, and fleet management businesses. Route efficiency, fleet visibility, proof-of-delivery, and warehouse stock accuracy are central to margins in a fuel-cost-sensitive sector.',
  companySizes: [
    'Small courier/transport operator (under 20 staff, small fleet)',
    'Mid-size logistics company (20-150 staff, larger fleet)',
    'Larger freight/warehousing operation (150+ staff, multiple depots)',
  ],
  commonDepartments: [
    'Dispatch and route planning',
    'Fleet/driver management',
    'Warehouse operations',
    'Finance and billing',
    'Customer service',
    'Compliance and safety',
  ],
  decisionMakers: [
    'Managing Director / Owner',
    'Operations Manager',
    'Fleet Manager',
    'Warehouse Manager',
    'Financial Manager',
  ],
  commonSoftwareUsed: [
    'Fleet tracking/telematics systems (Mix Telematics, Cartrack)',
    'Excel for route planning and delivery scheduling',
    'Basic warehouse stock spreadsheets',
    'Manual proof-of-delivery (paper waybills)',
    'Accounting software for billing',
  ],
  currentProblems: [
    'Manual route planning leading to inefficient fuel usage',
    'Paper-based proof-of-delivery causing billing disputes and delays',
    'Limited real-time visibility into fleet location and status',
    'Warehouse stock discrepancies from manual tracking',
    'Customer delivery status enquiries handled manually via phone',
  ],
  digitalMaturityLevels: [
    'Low: paper waybills, manual route planning, no fleet tracking',
    'Medium: fleet tracking in place, but delivery/billing still manual',
    'High: digital proof-of-delivery and route planning, limited integration',
    'Advanced: integrated fleet tracking, route optimisation, digital POD, and customer visibility',
  ],
  manualProcesses: [
    'Route planning and scheduling',
    'Proof-of-delivery capture and filing',
    'Warehouse stock counting',
    'Delivery status communication to customers',
    'Fuel and mileage reconciliation',
  ],
  automationOpportunities: [
    'Automated route planning and optimisation',
    'Digital proof-of-delivery with automatic billing trigger',
    'Automated customer delivery status notifications',
    'Automated warehouse stock level alerts',
  ],
  AIOpportunities: [
    'AI-powered route optimisation based on traffic and delivery windows',
    'AI-assisted demand forecasting for warehouse stock planning',
    'Document processing for waybills and delivery documentation',
    'Predictive maintenance for fleet vehicles from usage data',
  ],
  businessRisks: [
    'Billing disputes from lost or illegible paper proof-of-delivery',
    'Fuel cost overruns from inefficient routing',
    'Customer dissatisfaction from lack of delivery visibility',
    'Warehouse stock discrepancies affecting fulfilment accuracy',
  ],
  recommendedKyleDevServices: ['Business Automation', 'Mobile Development', 'Desktop Development'],
  crossSellServices: ['AI Integration', 'Cyber Security', 'Hosting'],
  estimatedProjectBudgetsZAR: {
    smallEngagement: 30000,
    midSizeEngagement: 110000,
    largeEngagement: 320000,
    enterpriseEngagement: 850000,
  },
  commonDiscoveryQuestions: [
    'How is route planning currently done?',
    'How is proof-of-delivery currently captured and stored?',
    'Do you currently have fleet tracking/telematics in place?',
    'How do customers currently get delivery status updates?',
    'How is warehouse stock tracked, if applicable?',
  ],
  proposalTalkingPoints: [
    'Reduced fuel costs through optimised route planning',
    'Faster billing cycles through digital proof-of-delivery',
    'Improved customer satisfaction through real-time delivery visibility',
    'More accurate warehouse stock through digital tracking',
  ],
  commonObjections: [
    'Our drivers will not use a mobile app.',
    'We already have fleet tracking hardware installed.',
    'This seems expensive compared to just hiring more admin staff.',
  ],
  objectionResponses: [
    'Driver-facing apps are designed to be simpler than paper waybills, often reducing rather than adding to their daily workload once adopted.',
    'This can integrate with your existing telematics hardware to add the missing proof-of-delivery, billing, and customer visibility layer on top.',
    'Automation typically costs less over time than additional admin headcount, while also reducing the error rate that headcount alone would not fix.',
  ],
  salesTriggers: [
    'Recent billing dispute from lost proof-of-delivery',
    'Rising fuel costs prompting route efficiency review',
    'Customer complaints about lack of delivery visibility',
    'Fleet or warehouse expansion requiring better systems',
  ],
  painPoints: [
    'Billing delays from paper-based proof-of-delivery',
    'Fuel cost overruns from inefficient routes',
    'Customer service overwhelmed by manual status enquiries',
    'Warehouse stock discrepancies affecting order accuracy',
  ],
  KPIs: [
    'On-time delivery rate',
    'Fuel cost per delivery/route',
    'Proof-of-delivery turnaround time',
    'Warehouse stock accuracy rate',
  ],
  successMetrics: [
    'Reduction in fuel cost per route',
    'Reduction in billing dispute frequency',
    'Improvement in on-time delivery rate',
    'Reduction in warehouse stock discrepancies',
  ],
  futureTechnologyTrends: [
    'AI-powered dynamic route optimisation',
    'Real-time customer delivery tracking as standard expectation',
    'IoT-enabled fleet and cargo monitoring',
    'Automated warehouse management systems',
  ],
  complianceRequirements: [
    'National Road Traffic Act compliance for fleet operations',
    'Cross-Border Road Transport Agency requirements where applicable',
    'POPIA for customer and driver personal data',
    'Occupational Health and Safety Act for warehouse operations',
  ],
  securityRequirements: [
    'Access control for fleet and customer data',
    'Secure handling of delivery and billing records',
    'Driver data protection under POPIA',
  ],
  mobileRequirements: [
    'Mobile driver app for route navigation and proof-of-delivery capture',
    'Mobile customer delivery tracking',
    'Offline capability for areas with poor connectivity',
  ],
  dashboardRequirements: [
    'Fleet status and route dashboard',
    'Delivery performance dashboard',
    'Warehouse stock dashboard',
  ],
  reportingRequirements: [
    'Delivery performance and on-time rate reports',
    'Fuel cost and route efficiency reports',
    'Proof-of-delivery and billing reports',
  ],
  integrationRequirements: [
    'Integration with existing fleet tracking/telematics systems',
    'Integration with accounting/billing software',
    'Integration with warehouse management systems where applicable',
  ],
  recommendedAIWorkers: ['Automation Designer', 'Business Analyst', 'Quotation Generator'],
  recommendedPlugins: ['Digital proof-of-delivery module', 'Route optimisation engine', 'Customer delivery tracking portal'],
  keywords: ['logistics software', 'fleet management', 'proof of delivery', 'route optimisation', 'warehouse management', 'delivery tracking'],
  southAfricanMarketConsiderations: [
    'Fuel price volatility makes route efficiency directly material to margins',
    'Road infrastructure quality varies significantly by region, affecting route planning assumptions',
    'Cross-border logistics into neighbouring SADC countries involves additional customs/compliance considerations',
    'Load shedding affects warehouse operations and requires backup power planning for critical systems',
  ],
}