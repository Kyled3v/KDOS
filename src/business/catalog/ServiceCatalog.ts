/**
 * ServiceCatalog
 *
 * The master, hand-curated list of every real, sellable KyleDev service,
 * priced in ZAR at realistic 2026 South African market rates. This is
 * the single source of truth consumed by CRM, Proposal Engine, Quotation
 * Engine, Project Engine, Invoice Engine, Sales AI, Marketing AI,
 * Customer Success, the public website, and the desktop app. No
 * placeholder or lorem ipsum content — every entry is commercially usable
 * as-is.
 */

import { ServiceCategory } from "./ServiceCategory";
import { ServicePackage, ServicePriority } from "./ServicePackage";
import { ServicePricing } from "./ServicePricing";

export const SERVICE_CATALOG: readonly ServicePackage[] = [
  // ---------------------------------------------------------------------
  // Web Development
  // ---------------------------------------------------------------------
  ServicePackage.create({
    id: "web-landing-page",
    name: "Landing Page",
    category: ServiceCategory.WEB_DEVELOPMENT,
    description:
      "A single, high-converting marketing page for a product launch, campaign, or lead-generation offer, built for speed and mobile responsiveness.",
    estimatedDurationWeeks: { min: 1, max: 2 },
    pricing: ServicePricing.fixed(8500),
    minimumTeamSize: 1,
    deliverables: [
      "Custom-designed single-page website",
      "Mobile-responsive layout",
      "Contact/lead capture form",
      "Basic on-page SEO setup",
      "Google Analytics integration",
    ],
    recommendedAddOnIds: ["marketing-seo-starter", "infra-hosting-standard"],
    requiredEmployeeRoles: ["Frontend Engineer", "UI Designer"],
    priority: ServicePriority.HIGH_DEMAND,
  }),

  ServicePackage.create({
    id: "web-business-website",
    name: "Business Website",
    category: ServiceCategory.WEB_DEVELOPMENT,
    description:
      "A multi-page website for a small or growing business, covering home, about, services, and contact pages, with a content management system for self-editing.",
    estimatedDurationWeeks: { min: 2, max: 4 },
    pricing: ServicePricing.fixed(22000),
    minimumTeamSize: 2,
    deliverables: [
      "5-8 page custom website",
      "Content management system access",
      "Mobile-responsive design",
      "Contact forms with email routing",
      "Basic SEO configuration",
      "Google Business Profile linkage",
    ],
    recommendedAddOnIds: ["marketing-seo-starter", "infra-hosting-standard", "infra-maintenance-monthly"],
    requiredEmployeeRoles: ["Frontend Engineer", "Backend Engineer", "UI Designer"],
    priority: ServicePriority.HIGH_DEMAND,
  }),

  ServicePackage.create({
    id: "web-corporate-website",
    name: "Corporate Website",
    category: ServiceCategory.WEB_DEVELOPMENT,
    description:
      "A premium, enterprise-grade website for established companies, including investor/media sections, careers pages, multi-language support options, and advanced brand storytelling.",
    estimatedDurationWeeks: { min: 4, max: 8 },
    pricing: ServicePricing.fixed(65000),
    minimumTeamSize: 3,
    deliverables: [
      "10-20 page custom website",
      "Advanced CMS with role-based editing",
      "Careers/investor relations sections",
      "Custom animations and interactions",
      "Multi-language readiness",
      "Full technical SEO implementation",
      "Performance optimisation (Core Web Vitals)",
    ],
    recommendedAddOnIds: ["marketing-seo-advanced", "infra-hosting-enterprise", "security-audit-standard"],
    requiredEmployeeRoles: ["Frontend Engineer", "Backend Engineer", "UI Designer", "QA Engineer"],
    priority: ServicePriority.STANDARD,
  }),

  ServicePackage.create({
    id: "web-client-portal",
    name: "Client Portal",
    category: ServiceCategory.WEB_DEVELOPMENT,
    description:
      "A secure, authenticated web portal where a business's clients can log in to view documents, track project or order status, and communicate directly.",
    estimatedDurationWeeks: { min: 4, max: 10 },
    pricing: ServicePricing.fixed(58000),
    minimumTeamSize: 3,
    deliverables: [
      "Secure authentication and role-based access",
      "Client dashboard with status tracking",
      "Document upload/download centre",
      "In-portal messaging",
      "Email notification system",
      "Admin management interface",
    ],
    recommendedAddOnIds: ["security-audit-standard", "infra-hosting-enterprise"],
    requiredEmployeeRoles: ["Frontend Engineer", "Backend Engineer", "QA Engineer"],
    priority: ServicePriority.STANDARD,
  }),

  ServicePackage.create({
    id: "web-booking-system",
    name: "Booking System",
    category: ServiceCategory.WEB_DEVELOPMENT,
    description:
      "An online booking and scheduling platform for appointments, venues, or services, with calendar sync, automated reminders, and payment collection at time of booking.",
    estimatedDurationWeeks: { min: 3, max: 6 },
    pricing: ServicePricing.fixed(42000),
    minimumTeamSize: 2,
    deliverables: [
      "Public-facing booking calendar",
      "Admin scheduling dashboard",
      "Automated SMS/email reminders",
      "Payment gateway integration",
      "Staff/resource availability management",
      "Booking analytics dashboard",
    ],
    recommendedAddOnIds: ["automation-workflow-standard", "infra-hosting-standard"],
    requiredEmployeeRoles: ["Frontend Engineer", "Backend Engineer"],
    priority: ServicePriority.STANDARD,
  }),

  // ---------------------------------------------------------------------
  // E-commerce
  // ---------------------------------------------------------------------
  ServicePackage.create({
    id: "ecommerce-starter",
    name: "E-commerce Starter Store",
    category: ServiceCategory.ECOMMERCE,
    description:
      "A fully functional online store for up to 100 products, with South African payment gateway integration, courier/shipping setup, and inventory tracking.",
    estimatedDurationWeeks: { min: 3, max: 6 },
    pricing: ServicePricing.fixed(38000),
    minimumTeamSize: 2,
    deliverables: [
      "Product catalogue (up to 100 SKUs)",
      "Shopping cart and checkout flow",
      "PayFast/Yoco/PayGate payment integration",
      "Courier Guy/PostNet shipping setup",
      "Inventory and stock tracking",
      "Order management dashboard",
    ],
    recommendedAddOnIds: ["marketing-seo-starter", "automation-workflow-standard", "infra-hosting-standard"],
    requiredEmployeeRoles: ["Frontend Engineer", "Backend Engineer", "UI Designer"],
    priority: ServicePriority.HIGH_DEMAND,
  }),

  ServicePackage.create({
    id: "ecommerce-enterprise",
    name: "Enterprise E-commerce Platform",
    category: ServiceCategory.ECOMMERCE,
    description:
      "A large-scale online retail platform supporting thousands of SKUs, multi-warehouse inventory, B2B pricing tiers, and integration with existing accounting/ERP systems.",
    estimatedDurationWeeks: { min: 8, max: 16 },
    pricing: ServicePricing.tiered(180000),
    minimumTeamSize: 4,
    deliverables: [
      "Unlimited product catalogue with variants",
      "Multi-warehouse inventory management",
      "B2B and B2C pricing tiers",
      "Accounting/ERP system integration",
      "Advanced analytics and reporting",
      "Custom checkout and promotions engine",
      "Load-tested for high-traffic sale events",
    ],
    recommendedAddOnIds: ["data-bi-dashboard", "security-audit-advanced", "infra-hosting-enterprise"],
    requiredEmployeeRoles: ["Frontend Engineer", "Backend Engineer", "DevOps Engineer", "QA Engineer"],
    priority: ServicePriority.SPECIALIST,
  }),

  // ---------------------------------------------------------------------
  // Custom Software
  // ---------------------------------------------------------------------
  ServicePackage.create({
    id: "software-custom-web-app",
    name: "Custom Web Application",
    category: ServiceCategory.CUSTOM_SOFTWARE,
    description:
      "A bespoke web application built around a business's specific operational workflow — not a template, not a page builder, but purpose-built software for how the business actually runs.",
    estimatedDurationWeeks: { min: 6, max: 16 },
    pricing: ServicePricing.tiered(95000),
    minimumTeamSize: 3,
    deliverables: [
      "Discovery and requirements specification",
      "Custom database schema design",
      "Full-stack application build",
      "Role-based access control",
      "API layer for future integrations",
      "Automated testing suite",
      "Deployment and handover documentation",
    ],
    recommendedAddOnIds: ["infra-hosting-enterprise", "security-audit-standard", "kdos-training"],
    requiredEmployeeRoles: ["Backend Engineer", "Frontend Engineer", "QA Engineer", "Solutions Architect"],
    priority: ServicePriority.CORE,
  }),

  ServicePackage.create({
    id: "software-desktop-application",
    name: "Desktop Application",
    category: ServiceCategory.CUSTOM_SOFTWARE,
    description:
      "A native or cross-platform desktop application for Windows/macOS, suited to businesses needing offline capability, hardware integration (e.g. scanners, POS peripherals), or heavy local data processing.",
    estimatedDurationWeeks: { min: 6, max: 14 },
    pricing: ServicePricing.tiered(85000),
    minimumTeamSize: 2,
    deliverables: [
      "Cross-platform desktop application (Windows/macOS)",
      "Local data storage and sync",
      "Hardware/peripheral integration where required",
      "Auto-update mechanism",
      "Installer packaging",
      "User training documentation",
    ],
    recommendedAddOnIds: ["kdos-training", "infra-maintenance-monthly"],
    requiredEmployeeRoles: ["Backend Engineer", "Frontend Engineer", "QA Engineer"],
    priority: ServicePriority.STANDARD,
  }),

  ServicePackage.create({
    id: "software-api-development",
    name: "API Development",
    category: ServiceCategory.CUSTOM_SOFTWARE,
    description:
      "Design and build of a secure, documented REST or GraphQL API to connect a business's internal systems, mobile apps, or third-party integrations.",
    estimatedDurationWeeks: { min: 3, max: 8 },
    pricing: ServicePricing.hourly(950, 32000),
    minimumTeamSize: 1,
    deliverables: [
      "API architecture and endpoint design",
      "Authentication and authorisation (OAuth2/JWT)",
      "Full API documentation (OpenAPI/Swagger)",
      "Rate limiting and monitoring",
      "Integration test suite",
    ],
    recommendedAddOnIds: ["security-audit-standard", "infra-hosting-standard"],
    requiredEmployeeRoles: ["Backend Engineer"],
    priority: ServicePriority.STANDARD,
  }),

  ServicePackage.create({
    id: "software-cloud-migration",
    name: "Cloud Migration",
    category: ServiceCategory.CUSTOM_SOFTWARE,
    description:
      "Migration of an existing on-premise system or legacy application to modern cloud infrastructure, with minimal downtime and full data integrity verification.",
    estimatedDurationWeeks: { min: 3, max: 10 },
    pricing: ServicePricing.tiered(75000),
    minimumTeamSize: 2,
    deliverables: [
      "Current infrastructure audit",
      "Migration strategy and rollback plan",
      "Cloud environment provisioning",
      "Data migration with integrity checks",
      "Cutover execution and monitoring",
      "Post-migration performance report",
    ],
    recommendedAddOnIds: ["infra-hosting-enterprise", "security-audit-standard"],
    requiredEmployeeRoles: ["DevOps Engineer", "Backend Engineer"],
    priority: ServicePriority.SPECIALIST,
  }),

  // ---------------------------------------------------------------------
  // Mobile Applications
  // ---------------------------------------------------------------------
  ServicePackage.create({
    id: "mobile-android-app",
    name: "Android App",
    category: ServiceCategory.MOBILE_APPLICATIONS,
    description:
      "A native Android application published to the Google Play Store, built for a business's specific customer-facing or internal operational needs.",
    estimatedDurationWeeks: { min: 6, max: 12 },
    pricing: ServicePricing.tiered(78000),
    minimumTeamSize: 2,
    deliverables: [
      "Native Android application",
      "Google Play Store listing and submission",
      "Push notification integration",
      "Backend API integration",
      "Crash reporting and analytics",
    ],
    recommendedAddOnIds: ["software-api-development", "infra-hosting-standard"],
    requiredEmployeeRoles: ["Mobile Engineer", "Backend Engineer", "QA Engineer"],
    priority: ServicePriority.STANDARD,
  }),

  ServicePackage.create({
    id: "mobile-ios-app",
    name: "iOS App",
    category: ServiceCategory.MOBILE_APPLICATIONS,
    description:
      "A native iOS application published to the Apple App Store, built for a business's specific customer-facing or internal operational needs.",
    estimatedDurationWeeks: { min: 6, max: 12 },
    pricing: ServicePricing.tiered(82000),
    minimumTeamSize: 2,
    deliverables: [
      "Native iOS application",
      "Apple App Store listing and submission",
      "Push notification integration",
      "Backend API integration",
      "Crash reporting and analytics",
    ],
    recommendedAddOnIds: ["software-api-development", "infra-hosting-standard"],
    requiredEmployeeRoles: ["Mobile Engineer", "Backend Engineer", "QA Engineer"],
    priority: ServicePriority.STANDARD,
  }),

  ServicePackage.create({
    id: "mobile-cross-platform-app",
    name: "Cross-Platform App",
    category: ServiceCategory.MOBILE_APPLICATIONS,
    description:
      "A single React Native/Flutter codebase deployed to both Android and iOS, reducing cost and time-to-market versus building two native apps.",
    estimatedDurationWeeks: { min: 8, max: 14 },
    pricing: ServicePricing.tiered(110000),
    minimumTeamSize: 2,
    deliverables: [
      "Single cross-platform codebase (iOS + Android)",
      "App Store and Play Store submission",
      "Push notification integration",
      "Backend API integration",
      "Crash reporting and analytics",
      "Offline-first data sync where required",
    ],
    recommendedAddOnIds: ["software-api-development", "infra-hosting-enterprise"],
    requiredEmployeeRoles: ["Mobile Engineer", "Backend Engineer", "QA Engineer"],
    priority: ServicePriority.HIGH_DEMAND,
  }),

  // ---------------------------------------------------------------------
  // Business Systems
  // ---------------------------------------------------------------------
  ServicePackage.create({
    id: "systems-crm",
    name: "CRM System",
    category: ServiceCategory.BUSINESS_SYSTEMS,
    description:
      "A custom customer relationship management system tailored to a business's actual sales process — lead tracking, pipeline stages, follow-up automation, and reporting.",
    estimatedDurationWeeks: { min: 5, max: 10 },
    pricing: ServicePricing.tiered(72000),
    minimumTeamSize: 2,
    deliverables: [
      "Custom pipeline stages matching sales process",
      "Contact and company records",
      "Follow-up and reminder automation",
      "Sales reporting dashboard",
      "Email integration",
      "Role-based team access",
    ],
    recommendedAddOnIds: ["automation-workflow-standard", "data-bi-dashboard"],
    requiredEmployeeRoles: ["Backend Engineer", "Frontend Engineer"],
    priority: ServicePriority.CORE,
  }),

  ServicePackage.create({
    id: "systems-erp",
    name: "ERP System",
    category: ServiceCategory.BUSINESS_SYSTEMS,
    description:
      "An enterprise resource planning system unifying finance, inventory, procurement, and HR data into a single operational platform for mid-to-large businesses.",
    estimatedDurationWeeks: { min: 12, max: 24 },
    pricing: ServicePricing.tiered(320000),
    minimumTeamSize: 4,
    deliverables: [
      "Unified finance, inventory, and procurement modules",
      "HR and payroll data integration",
      "Multi-department role-based access",
      "Custom reporting and dashboards",
      "Accounting system integration (Sage/Xero/Pastel)",
      "Data migration from legacy systems",
    ],
    recommendedAddOnIds: ["data-bi-dashboard", "security-audit-advanced", "kdos-training"],
    requiredEmployeeRoles: ["Solutions Architect", "Backend Engineer", "Frontend Engineer", "QA Engineer", "DevOps Engineer"],
    priority: ServicePriority.SPECIALIST,
  }),

  ServicePackage.create({
    id: "systems-pos",
    name: "POS System",
    category: ServiceCategory.BUSINESS_SYSTEMS,
    description:
      "A point-of-sale system for retail or hospitality businesses, covering till operations, stock deduction, staff shifts, and daily reconciliation.",
    estimatedDurationWeeks: { min: 5, max: 10 },
    pricing: ServicePricing.tiered(68000),
    minimumTeamSize: 2,
    deliverables: [
      "Till/checkout interface",
      "Real-time stock deduction",
      "Staff shift and till reconciliation",
      "Receipt printing integration",
      "Sales reporting dashboard",
      "Offline mode with sync",
    ],
    recommendedAddOnIds: ["systems-inventory", "infra-maintenance-monthly"],
    requiredEmployeeRoles: ["Backend Engineer", "Frontend Engineer"],
    priority: ServicePriority.STANDARD,
  }),

  ServicePackage.create({
    id: "systems-inventory",
    name: "Inventory Management System",
    category: ServiceCategory.BUSINESS_SYSTEMS,
    description:
      "A stock and inventory tracking system covering multiple locations, purchase orders, low-stock alerts, and supplier management.",
    estimatedDurationWeeks: { min: 4, max: 8 },
    pricing: ServicePricing.fixed(54000),
    minimumTeamSize: 2,
    deliverables: [
      "Multi-location stock tracking",
      "Purchase order management",
      "Low-stock automated alerts",
      "Supplier and reorder management",
      "Barcode/QR scanning support",
      "Stock movement reporting",
    ],
    recommendedAddOnIds: ["systems-pos", "automation-workflow-standard"],
    requiredEmployeeRoles: ["Backend Engineer", "Frontend Engineer"],
    priority: ServicePriority.STANDARD,
  }),

  // ---------------------------------------------------------------------
  // Industry Solutions
  // ---------------------------------------------------------------------
  ServicePackage.create({
    id: "industry-school-management",
    name: "School Management System",
    category: ServiceCategory.INDUSTRY_SOLUTIONS,
    description:
      "A system for schools covering learner enrolment, fee management, timetabling, attendance, and parent communication portals.",
    estimatedDurationWeeks: { min: 8, max: 16 },
    pricing: ServicePricing.tiered(145000),
    minimumTeamSize: 3,
    deliverables: [
      "Learner enrolment and records management",
      "Fee invoicing and payment tracking",
      "Timetable and attendance management",
      "Parent communication portal",
      "Teacher gradebook and reporting",
      "SMS/email notifications to parents",
    ],
    recommendedAddOnIds: ["kdos-training", "infra-hosting-enterprise"],
    requiredEmployeeRoles: ["Backend Engineer", "Frontend Engineer", "QA Engineer"],
    priority: ServicePriority.SPECIALIST,
  }),

  ServicePackage.create({
    id: "industry-mining-dashboard",
    name: "Mining Operations Dashboard",
    category: ServiceCategory.INDUSTRY_SOLUTIONS,
    description:
      "A real-time operational dashboard for mining sites tracking production volumes, equipment uptime, safety incidents, and compliance reporting.",
    estimatedDurationWeeks: { min: 8, max: 18 },
    pricing: ServicePricing.tiered(210000),
    minimumTeamSize: 3,
    deliverables: [
      "Real-time production tracking dashboard",
      "Equipment uptime and downtime monitoring",
      "Safety incident logging and reporting",
      "Regulatory compliance reporting exports",
      "Multi-site aggregated reporting",
      "Role-based access for site managers and executives",
    ],
    recommendedAddOnIds: ["data-bi-dashboard", "security-audit-advanced"],
    requiredEmployeeRoles: ["Solutions Architect", "Backend Engineer", "Frontend Engineer", "Data Engineer"],
    priority: ServicePriority.SPECIALIST,
  }),

  ServicePackage.create({
    id: "industry-construction-management",
    name: "Construction Management System",
    category: ServiceCategory.INDUSTRY_SOLUTIONS,
    description:
      "A project and site management system for construction companies, covering project timelines, subcontractor management, material tracking, and site progress reporting with photo documentation.",
    estimatedDurationWeeks: { min: 8, max: 16 },
    pricing: ServicePricing.tiered(160000),
    minimumTeamSize: 3,
    deliverables: [
      "Project timeline and milestone tracking",
      "Subcontractor and labour management",
      "Material and equipment tracking",
      "Site progress reporting with photo uploads",
      "Budget vs actual cost tracking",
      "Client-facing progress portal",
    ],
    recommendedAddOnIds: ["web-client-portal", "data-bi-dashboard"],
    requiredEmployeeRoles: ["Backend Engineer", "Frontend Engineer", "QA Engineer"],
    priority: ServicePriority.SPECIALIST,
  }),

  ServicePackage.create({
    id: "industry-fleet-management",
    name: "Fleet Management System",
    category: ServiceCategory.INDUSTRY_SOLUTIONS,
    description:
      "A vehicle and fleet tracking system for logistics or transport businesses, covering GPS tracking integration, maintenance scheduling, fuel consumption, and driver performance.",
    estimatedDurationWeeks: { min: 8, max: 16 },
    pricing: ServicePricing.tiered(175000),
    minimumTeamSize: 3,
    deliverables: [
      "GPS tracking integration",
      "Vehicle maintenance scheduling",
      "Fuel consumption tracking and reporting",
      "Driver performance and behaviour reporting",
      "Route history and analytics",
      "Automated service reminder alerts",
    ],
    recommendedAddOnIds: ["data-bi-dashboard", "automation-workflow-standard"],
    requiredEmployeeRoles: ["Backend Engineer", "Frontend Engineer", "Data Engineer"],
    priority: ServicePriority.SPECIALIST,
  }),

  // ---------------------------------------------------------------------
  // Automation & AI
  // ---------------------------------------------------------------------
  ServicePackage.create({
    id: "automation-ai-chatbot",
    name: "AI Chatbot",
    category: ServiceCategory.AUTOMATION_AND_AI,
    description:
      "A conversational AI chatbot deployed on a business's website or WhatsApp for customer support, lead qualification, or FAQ handling, trained on the business's own knowledge base.",
    estimatedDurationWeeks: { min: 3, max: 6 },
    pricing: ServicePricing.fixed(35000),
    minimumTeamSize: 2,
    deliverables: [
      "Trained conversational AI chatbot",
      "Website and/or WhatsApp deployment",
      "Custom knowledge base integration",
      "Lead capture and handoff to sales team",
      "Conversation analytics dashboard",
    ],
    recommendedAddOnIds: ["automation-business-standard", "ai-workforce-deployment"],
    requiredEmployeeRoles: ["Backend Engineer", "AI Integration Engineer"],
    priority: ServicePriority.HIGH_DEMAND,
  }),

  ServicePackage.create({
    id: "automation-business-standard",
    name: "Business Automation",
    category: ServiceCategory.AUTOMATION_AND_AI,
    description:
      "Automation of repetitive manual business processes — invoicing, data entry, follow-ups, reporting — connecting existing tools so staff spend less time on admin.",
    estimatedDurationWeeks: { min: 2, max: 6 },
    pricing: ServicePricing.hourly(850, 24000),
    minimumTeamSize: 1,
    deliverables: [
      "Process mapping and automation plan",
      "Automated workflows across existing tools",
      "Scheduled report generation",
      "Error handling and monitoring alerts",
      "Documentation of automated processes",
    ],
    recommendedAddOnIds: ["automation-workflow-standard", "ai-workforce-deployment"],
    requiredEmployeeRoles: ["Automation Engineer"],
    priority: ServicePriority.HIGH_DEMAND,
  }),

  ServicePackage.create({
    id: "automation-workflow-standard",
    name: "Workflow Automation",
    category: ServiceCategory.AUTOMATION_AND_AI,
    description:
      "Design and implementation of automated multi-step business workflows (approvals, notifications, task assignment) within an existing system or KDOS-powered platform.",
    estimatedDurationWeeks: { min: 2, max: 5 },
    pricing: ServicePricing.hourly(850, 20000),
    minimumTeamSize: 1,
    deliverables: [
      "Workflow design documentation",
      "Automated approval and notification chains",
      "Task assignment automation",
      "Integration with existing systems",
      "Monitoring and audit trail",
    ],
    recommendedAddOnIds: ["automation-business-standard"],
    requiredEmployeeRoles: ["Automation Engineer"],
    priority: ServicePriority.STANDARD,
  }),

  // ---------------------------------------------------------------------
  // Branding & Marketing
  // ---------------------------------------------------------------------
  ServicePackage.create({
    id: "marketing-brand-identity",
    name: "Brand Identity",
    category: ServiceCategory.BRANDING_AND_MARKETING,
    description:
      "A complete visual identity package for a business — logo, colour palette, typography, and brand guidelines — ready for use across web, print, and social media.",
    estimatedDurationWeeks: { min: 2, max: 4 },
    pricing: ServicePricing.fixed(18000),
    minimumTeamSize: 1,
    deliverables: [
      "Primary and secondary logo variations",
      "Colour palette and typography system",
      "Brand guideline document",
      "Business card and letterhead templates",
      "Social media profile assets",
    ],
    recommendedAddOnIds: ["web-business-website", "marketing-seo-starter"],
    requiredEmployeeRoles: ["Brand Designer"],
    priority: ServicePriority.STANDARD,
  }),

  ServicePackage.create({
    id: "marketing-seo-starter",
    name: "SEO Starter",
    category: ServiceCategory.BRANDING_AND_MARKETING,
    description:
      "Foundational search engine optimisation for a business website — keyword research, on-page optimisation, and technical SEO fixes to improve organic visibility.",
    estimatedDurationWeeks: { min: 2, max: 4 },
    pricing: ServicePricing.fixed(9500),
    minimumTeamSize: 1,
    deliverables: [
      "Keyword research report",
      "On-page SEO optimisation",
      "Technical SEO audit and fixes",
      "Meta titles and descriptions",
      "XML sitemap and robots.txt configuration",
    ],
    recommendedAddOnIds: ["marketing-seo-advanced", "marketing-google-business"],
    requiredEmployeeRoles: ["SEO Specialist"],
    priority: ServicePriority.HIGH_DEMAND,
  }),

  ServicePackage.create({
    id: "marketing-seo-advanced",
    name: "Advanced SEO & Content Strategy",
    category: ServiceCategory.BRANDING_AND_MARKETING,
    description:
      "Ongoing monthly SEO management including content strategy, link building, competitor analysis, and monthly performance reporting.",
    estimatedDurationWeeks: { min: 4, max: 4 },
    pricing: ServicePricing.retainer(12000),
    minimumTeamSize: 1,
    deliverables: [
      "Monthly content strategy and publishing",
      "Link building campaign",
      "Competitor SEO analysis",
      "Monthly ranking and traffic report",
      "Ongoing technical SEO monitoring",
    ],
    recommendedAddOnIds: ["marketing-seo-starter"],
    requiredEmployeeRoles: ["SEO Specialist", "Content Strategist"],
    priority: ServicePriority.STANDARD,
  }),

  ServicePackage.create({
    id: "marketing-google-business",
    name: "Google Business Optimisation",
    category: ServiceCategory.BRANDING_AND_MARKETING,
    description:
      "Setup and optimisation of a business's Google Business Profile to improve local search visibility, reviews management, and map pack rankings.",
    estimatedDurationWeeks: { min: 1, max: 2 },
    pricing: ServicePricing.fixed(4500),
    minimumTeamSize: 1,
    deliverables: [
      "Google Business Profile setup/claim",
      "Category and service area optimisation",
      "Photo and post scheduling setup",
      "Review response templates and strategy",
      "Local citation consistency check",
    ],
    recommendedAddOnIds: ["marketing-seo-starter"],
    requiredEmployeeRoles: ["SEO Specialist"],
    priority: ServicePriority.STANDARD,
  }),

  // ---------------------------------------------------------------------
  // Infrastructure & Hosting
  // ---------------------------------------------------------------------
  ServicePackage.create({
    id: "infra-hosting-standard",
    name: "Standard Hosting",
    category: ServiceCategory.INFRASTRUCTURE_AND_HOSTING,
    description:
      "Managed hosting for small to medium business websites and applications, including SSL, backups, and uptime monitoring.",
    estimatedDurationWeeks: { min: 1, max: 1 },
    pricing: ServicePricing.retainer(650),
    minimumTeamSize: 1,
    deliverables: [
      "Managed server hosting",
      "SSL certificate management",
      "Daily automated backups",
      "Uptime monitoring and alerts",
      "Monthly security patching",
    ],
    recommendedAddOnIds: ["infra-hosting-enterprise", "infra-maintenance-monthly"],
    requiredEmployeeRoles: ["DevOps Engineer"],
    priority: ServicePriority.CORE,
  }),

  ServicePackage.create({
    id: "infra-hosting-enterprise",
    name: "Enterprise Hosting",
    category: ServiceCategory.INFRASTRUCTURE_AND_HOSTING,
    description:
      "High-availability managed hosting for business-critical applications, with load balancing, auto-scaling, and 24/7 monitoring.",
    estimatedDurationWeeks: { min: 1, max: 1 },
    pricing: ServicePricing.retainer(3200),
    minimumTeamSize: 1,
    deliverables: [
      "Load-balanced, auto-scaling infrastructure",
      "24/7 uptime monitoring with alerting",
      "Daily automated backups with retention policy",
      "SSL and CDN configuration",
      "Quarterly infrastructure review",
    ],
    recommendedAddOnIds: ["security-audit-advanced"],
    requiredEmployeeRoles: ["DevOps Engineer"],
    priority: ServicePriority.STANDARD,
  }),

  ServicePackage.create({
    id: "infra-maintenance-monthly",
    name: "Website & App Maintenance",
    category: ServiceCategory.INFRASTRUCTURE_AND_HOSTING,
    description:
      "Ongoing monthly maintenance covering software updates, bug fixes, content changes, and performance monitoring for an existing website or application.",
    estimatedDurationWeeks: { min: 1, max: 1 },
    pricing: ServicePricing.retainer(2800),
    minimumTeamSize: 1,
    deliverables: [
      "Monthly software and dependency updates",
      "Bug fix allocation (up to agreed hours)",
      "Minor content and design changes",
      "Performance monitoring report",
      "Priority support response",
    ],
    recommendedAddOnIds: ["infra-hosting-standard"],
    requiredEmployeeRoles: ["Backend Engineer"],
    priority: ServicePriority.HIGH_DEMAND,
  }),

  ServicePackage.create({
    id: "infra-backup-solutions",
    name: "Backup Solutions",
    category: ServiceCategory.INFRASTRUCTURE_AND_HOSTING,
    description:
      "Automated, tested backup systems for a business's critical data and systems, including offsite storage and documented recovery procedures.",
    estimatedDurationWeeks: { min: 1, max: 3 },
    pricing: ServicePricing.fixed(14500),
    minimumTeamSize: 1,
    deliverables: [
      "Automated backup schedule configuration",
      "Offsite/cloud backup storage",
      "Documented disaster recovery procedure",
      "Quarterly restore testing",
      "Backup monitoring and failure alerts",
    ],
    recommendedAddOnIds: ["infra-hosting-enterprise", "security-audit-standard"],
    requiredEmployeeRoles: ["DevOps Engineer"],
    priority: ServicePriority.STANDARD,
  }),

  // ---------------------------------------------------------------------
  // Security & Compliance
  // ---------------------------------------------------------------------
  ServicePackage.create({
    id: "security-audit-standard",
    name: "Cyber Security Audit",
    category: ServiceCategory.SECURITY_AND_COMPLIANCE,
    description:
      "A comprehensive security assessment of a business's website, application, or internal systems, identifying vulnerabilities with a prioritised remediation plan.",
    estimatedDurationWeeks: { min: 1, max: 3 },
    pricing: ServicePricing.fixed(22000),
    minimumTeamSize: 1,
    deliverables: [
      "Vulnerability scan and manual assessment",
      "Prioritised risk report",
      "Remediation recommendations",
      "Follow-up verification scan",
    ],
    recommendedAddOnIds: ["security-audit-advanced", "infra-backup-solutions"],
    requiredEmployeeRoles: ["Security Engineer"],
    priority: ServicePriority.STANDARD,
  }),

  ServicePackage.create({
    id: "security-audit-advanced",
    name: "Advanced Security & Penetration Testing",
    category: ServiceCategory.SECURITY_AND_COMPLIANCE,
    description:
      "In-depth penetration testing and compliance-readiness assessment (POPIA-aligned) for businesses handling sensitive customer data or operating regulated systems.",
    estimatedDurationWeeks: { min: 2, max: 5 },
    pricing: ServicePricing.fixed(48000),
    minimumTeamSize: 2,
    deliverables: [
      "Full penetration test (external and internal)",
      "POPIA compliance-readiness assessment",
      "Detailed exploit and impact report",
      "Executive summary for leadership",
      "Remediation retest included",
    ],
    recommendedAddOnIds: ["security-audit-standard"],
    requiredEmployeeRoles: ["Security Engineer"],
    priority: ServicePriority.SPECIALIST,
  }),

  // ---------------------------------------------------------------------
  // Data & Intelligence
  // ---------------------------------------------------------------------
  ServicePackage.create({
    id: "data-bi-dashboard",
    name: "Business Intelligence Dashboard",
    category: ServiceCategory.DATA_AND_INTELLIGENCE,
    description:
      "A real-time analytics dashboard consolidating a business's sales, operations, and financial data into a single executive view, built on existing data sources.",
    estimatedDurationWeeks: { min: 4, max: 10 },
    pricing: ServicePricing.tiered(68000),
    minimumTeamSize: 2,
    deliverables: [
      "Data source integration (CRM/ERP/accounting)",
      "Executive KPI dashboard",
      "Department-level drill-down views",
      "Automated data refresh scheduling",
      "Exportable reporting",
    ],
    recommendedAddOnIds: ["software-api-development", "infra-hosting-enterprise"],
    requiredEmployeeRoles: ["Data Engineer", "Frontend Engineer"],
    priority: ServicePriority.STANDARD,
  }),

  // ---------------------------------------------------------------------
  // AI Workforce
  // ---------------------------------------------------------------------
  ServicePackage.create({
    id: "ai-workforce-deployment",
    name: "AI Employee Deployment",
    category: ServiceCategory.AI_WORKFORCE,
    description:
      "Deployment of one or more AI employees into a business's operations — handling defined roles such as customer support, lead qualification, scheduling, or reporting — configured on the business's own processes and data.",
    estimatedDurationWeeks: { min: 3, max: 8 },
    pricing: ServicePricing.tiered(45000),
    minimumTeamSize: 2,
    deliverables: [
      "AI employee role definition and scoping",
      "Configuration on business processes and data",
      "Integration with existing business systems",
      "Human escalation handoff procedures",
      "Performance monitoring dashboard",
    ],
    recommendedAddOnIds: ["kdos-installation", "automation-business-standard"],
    requiredEmployeeRoles: ["AI Integration Engineer", "Automation Engineer"],
    priority: ServicePriority.CORE,
  }),

  // ---------------------------------------------------------------------
  // KDOS Services
  // ---------------------------------------------------------------------
  ServicePackage.create({
    id: "kdos-installation",
    name: "KDOS Installation",
    category: ServiceCategory.KDOS_SERVICES,
    description:
      "Deployment and configuration of KyleDev's own operating system (KDOS) for a client business — CRM, workflow automation, task management, and AI workforce coordination set up around their operations.",
    estimatedDurationWeeks: { min: 4, max: 10 },
    pricing: ServicePricing.tiered(120000),
    minimumTeamSize: 3,
    deliverables: [
      "KDOS core deployment and configuration",
      "CRM and workflow setup matched to business processes",
      "AI workforce role configuration",
      "Data migration from existing systems",
      "Admin and staff account provisioning",
    ],
    recommendedAddOnIds: ["kdos-training", "ai-workforce-deployment"],
    requiredEmployeeRoles: ["Solutions Architect", "Backend Engineer", "Automation Engineer"],
    priority: ServicePriority.CORE,
  }),

  ServicePackage.create({
    id: "kdos-training",
    name: "KDOS Training",
    category: ServiceCategory.KDOS_SERVICES,
    description:
      "Structured training sessions for a client's staff and management on using KDOS day-to-day — CRM workflows, task boards, reporting, and AI employee oversight.",
    estimatedDurationWeeks: { min: 1, max: 2 },
    pricing: ServicePricing.fixed(9500),
    minimumTeamSize: 1,
    deliverables: [
      "Staff training sessions (live or recorded)",
      "Management reporting walkthrough",
      "Custom training documentation",
      "Q&A support session",
      "30-day post-training support window",
    ],
    recommendedAddOnIds: ["kdos-installation"],
    requiredEmployeeRoles: ["Customer Success Specialist"],
    priority: ServicePriority.STANDARD,
  }),
];