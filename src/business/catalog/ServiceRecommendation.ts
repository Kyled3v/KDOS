/**
 * ServiceRecommendation
 *
 * Deterministic, rules-based recommendation logic that maps a client's
 * industry, company size, and budget onto a ranked shortlist of
 * ServicePackages from the catalogue. No AI, no external calls — this is
 * plain business logic consumed by Sales AI, Marketing AI, and the CRM
 * to guide proposal creation. Consumes ServiceRegistry rather than the
 * raw catalogue array, so it always reflects the single source of truth.
 */

import { ServiceCategory } from "./ServiceCategory";
import { ServicePackage } from "./ServicePackage";
import { ServiceRegistry } from "./ServiceRegistry";

export enum ClientIndustry {
  RETAIL = "RETAIL",
  HOSPITALITY = "HOSPITALITY",
  PROFESSIONAL_SERVICES = "PROFESSIONAL_SERVICES",
  MINING = "MINING",
  CONSTRUCTION = "CONSTRUCTION",
  LOGISTICS = "LOGISTICS",
  EDUCATION = "EDUCATION",
  HEALTHCARE = "HEALTHCARE",
  FINANCE = "FINANCE",
  MANUFACTURING = "MANUFACTURING",
  TECHNOLOGY = "TECHNOLOGY",
  NON_PROFIT = "NON_PROFIT",
}

export enum ClientCompanySize {
  MICRO = "MICRO",
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
  ENTERPRISE = "ENTERPRISE",
}

export interface RecommendationInput {
  readonly industry: ClientIndustry;
  readonly companySize: ClientCompanySize;
  readonly budgetZAR: number;
}

export interface ScoredRecommendation {
  readonly service: ServicePackage;
  readonly score: number;
  readonly reasons: readonly string[];
}

const INDUSTRY_CATEGORY_WEIGHTS: Readonly<Record<ClientIndustry, Partial<Record<ServiceCategory, number>>>> = {
  [ClientIndustry.RETAIL]: {
    [ServiceCategory.ECOMMERCE]: 3,
    [ServiceCategory.BUSINESS_SYSTEMS]: 2,
    [ServiceCategory.BRANDING_AND_MARKETING]: 2,
    [ServiceCategory.AUTOMATION_AND_AI]: 1,
  },
  [ClientIndustry.HOSPITALITY]: {
    [ServiceCategory.WEB_DEVELOPMENT]: 3,
    [ServiceCategory.AUTOMATION_AND_AI]: 2,
    [ServiceCategory.BRANDING_AND_MARKETING]: 2,
  },
  [ClientIndustry.PROFESSIONAL_SERVICES]: {
    [ServiceCategory.WEB_DEVELOPMENT]: 3,
    [ServiceCategory.BUSINESS_SYSTEMS]: 2,
    [ServiceCategory.BRANDING_AND_MARKETING]: 2,
  },
  [ClientIndustry.MINING]: {
    [ServiceCategory.INDUSTRY_SOLUTIONS]: 3,
    [ServiceCategory.DATA_AND_INTELLIGENCE]: 2,
    [ServiceCategory.SECURITY_AND_COMPLIANCE]: 1,
  },
  [ClientIndustry.CONSTRUCTION]: {
    [ServiceCategory.INDUSTRY_SOLUTIONS]: 3,
    [ServiceCategory.BUSINESS_SYSTEMS]: 1,
    [ServiceCategory.WEB_DEVELOPMENT]: 1,
  },
  [ClientIndustry.LOGISTICS]: {
    [ServiceCategory.INDUSTRY_SOLUTIONS]: 3,
    [ServiceCategory.DATA_AND_INTELLIGENCE]: 2,
    [ServiceCategory.AUTOMATION_AND_AI]: 1,
  },
  [ClientIndustry.EDUCATION]: {
    [ServiceCategory.INDUSTRY_SOLUTIONS]: 3,
    [ServiceCategory.WEB_DEVELOPMENT]: 2,
  },
  [ClientIndustry.HEALTHCARE]: {
    [ServiceCategory.WEB_DEVELOPMENT]: 2,
    [ServiceCategory.BUSINESS_SYSTEMS]: 2,
    [ServiceCategory.SECURITY_AND_COMPLIANCE]: 3,
  },
  [ClientIndustry.FINANCE]: {
    [ServiceCategory.SECURITY_AND_COMPLIANCE]: 3,
    [ServiceCategory.CUSTOM_SOFTWARE]: 2,
    [ServiceCategory.DATA_AND_INTELLIGENCE]: 2,
  },
  [ClientIndustry.MANUFACTURING]: {
    [ServiceCategory.BUSINESS_SYSTEMS]: 3,
    [ServiceCategory.DATA_AND_INTELLIGENCE]: 2,
    [ServiceCategory.AUTOMATION_AND_AI]: 2,
  },
  [ClientIndustry.TECHNOLOGY]: {
    [ServiceCategory.CUSTOM_SOFTWARE]: 3,
    [ServiceCategory.MOBILE_APPLICATIONS]: 2,
    [ServiceCategory.AI_WORKFORCE]: 2,
  },
  [ClientIndustry.NON_PROFIT]: {
    [ServiceCategory.WEB_DEVELOPMENT]: 3,
    [ServiceCategory.BRANDING_AND_MARKETING]: 2,
  },
};

const COMPANY_SIZE_CATEGORY_WEIGHTS: Readonly<Record<ClientCompanySize, Partial<Record<ServiceCategory, number>>>> = {
  [ClientCompanySize.MICRO]: {
    [ServiceCategory.WEB_DEVELOPMENT]: 2,
    [ServiceCategory.BRANDING_AND_MARKETING]: 2,
  },
  [ClientCompanySize.SMALL]: {
    [ServiceCategory.WEB_DEVELOPMENT]: 2,
    [ServiceCategory.ECOMMERCE]: 1,
    [ServiceCategory.AUTOMATION_AND_AI]: 1,
  },
  [ClientCompanySize.MEDIUM]: {
    [ServiceCategory.BUSINESS_SYSTEMS]: 2,
    [ServiceCategory.CUSTOM_SOFTWARE]: 1,
    [ServiceCategory.DATA_AND_INTELLIGENCE]: 1,
  },
  [ClientCompanySize.LARGE]: {
    [ServiceCategory.CUSTOM_SOFTWARE]: 2,
    [ServiceCategory.INDUSTRY_SOLUTIONS]: 2,
    [ServiceCategory.SECURITY_AND_COMPLIANCE]: 1,
  },
  [ClientCompanySize.ENTERPRISE]: {
    [ServiceCategory.CUSTOM_SOFTWARE]: 2,
    [ServiceCategory.INDUSTRY_SOLUTIONS]: 2,
    [ServiceCategory.SECURITY_AND_COMPLIANCE]: 2,
    [ServiceCategory.DATA_AND_INTELLIGENCE]: 2,
  },
};

export class ServiceRecommendation {
  private readonly registry: ServiceRegistry;

  /**
   * Constructs a ServiceRecommendation engine bound to a specific
   * ServiceRegistry, supplied via dependency injection.
   */
  public constructor(registry: ServiceRegistry) {
    this.registry = registry;
  }

  /**
   * Returns a ranked, budget-filtered shortlist of recommended services
   * for the given client profile, highest score first. Services whose
   * startingPriceZAR exceeds the given budget are excluded entirely.
   */
  public recommend(input: RecommendationInput): readonly ScoredRecommendation[] {
    const candidates = this.registry
      .list()
      .filter((service) => service.pricing.startingPriceZAR <= input.budgetZAR);

    const scored = candidates.map((service) => this.score(service, input));

    return scored
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score);
  }

  /**
   * Returns only the top N recommended services for the given client profile.
   */
  public recommendTop(input: RecommendationInput, limit: number): readonly ScoredRecommendation[] {
    if (limit <= 0) {
      throw new Error("ServiceRecommendation.recommendTop requires a positive limit.");
    }
    return this.recommend(input).slice(0, limit);
  }

  /**
   * Scores a single service against the given client profile, combining
   * industry fit and company-size fit, with a bonus for CORE/HIGH_DEMAND
   * priority services.
   */
  private score(service: ServicePackage, input: RecommendationInput): ScoredRecommendation {
    const reasons: string[] = [];
    let score = 0;

    const industryWeight = INDUSTRY_CATEGORY_WEIGHTS[input.industry][service.category] ?? 0;
    if (industryWeight > 0) {
      score += industryWeight;
      reasons.push(`Strong fit for ${input.industry.toLowerCase().replace(/_/g, " ")} businesses.`);
    }

    const sizeWeight = COMPANY_SIZE_CATEGORY_WEIGHTS[input.companySize][service.category] ?? 0;
    if (sizeWeight > 0) {
      score += sizeWeight;
      reasons.push(`Well suited to ${input.companySize.toLowerCase()} companies.`);
    }

    if (service.priority === "CORE") {
      score += 2;
      reasons.push("One of KyleDev's core, most-delivered offerings.");
    } else if (service.priority === "HIGH_DEMAND") {
      score += 1;
      reasons.push("Currently in high client demand.");
    }

    const budgetHeadroom = input.budgetZAR - service.pricing.startingPriceZAR;
    if (budgetHeadroom >= 0 && budgetHeadroom <= input.budgetZAR * 0.3) {
      score += 1;
      reasons.push("Fits comfortably within the stated budget.");
    }

    return { service, score, reasons };
  }
}