/**
 * Service
 *
 * Shared domain model representing an offering KyleDev delivers to
 * clients — the catalogue-level definition referenced by proposals,
 * quotations, and projects. Pure data shape only: no behaviour, no
 * persistence, no validation logic.
 */

export enum ServiceCategory {
  ENGINEERING = "ENGINEERING",
  DESIGN = "DESIGN",
  AUTOMATION = "AUTOMATION",
  CONSULTING = "CONSULTING",
  SUPPORT = "SUPPORT",
}

export enum ServicePricingModel {
  HOURLY = "HOURLY",
  FIXED = "FIXED",
  RETAINER = "RETAINER",
}

export interface Service {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: ServiceCategory;
  readonly pricingModel: ServicePricingModel;
  readonly basePrice: number;
  readonly currency: string;
  readonly active: boolean;
  readonly createdAt: Date;
}