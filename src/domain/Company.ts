/**
 * Company
 *
 * Shared domain model representing a business entity operated within
 * KDOS — either KyleDev itself or a client company. Pure data shape only:
 * no behaviour, no persistence, no validation logic. Every subsystem that
 * references a company depends on this interface rather than defining
 * its own shape.
 */

export enum CompanyType {
  AGENCY = "AGENCY",
  CLIENT = "CLIENT",
  PARTNER = "PARTNER",
}

export enum CompanySize {
  MICRO = "MICRO",
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
  ENTERPRISE = "ENTERPRISE",
}

export interface CompanyAddress {
  readonly line1: string;
  readonly line2: string | null;
  readonly city: string;
  readonly province: string;
  readonly postalCode: string;
  readonly country: string;
}

export interface Company {
  readonly id: string;
  readonly name: string;
  readonly type: CompanyType;
  readonly industry: string;
  readonly size: CompanySize;
  readonly registrationNumber: string | null;
  readonly vatNumber: string | null;
  readonly address: CompanyAddress;
  readonly website: string | null;
  readonly createdAt: Date;
}