/**
 * Project
 *
 * Shared domain model representing a client engagement at the level
 * every subsystem (CRM, workforce, invoicing, automation) refers to it —
 * distinct from the Project Engine's richer internal aggregate, which
 * owns lifecycle behaviour built on top of this shared shape. Pure data
 * shape only: no behaviour, no persistence, no validation logic.
 */

export enum ProjectDomainStatus {
  PLANNING = "PLANNING",
  ACTIVE = "ACTIVE",
  ON_HOLD = "ON_HOLD",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface Project {
  readonly id: string;
  readonly clientId: string;
  readonly companyId: string;
  readonly name: string;
  readonly serviceIds: readonly string[];
  readonly status: ProjectDomainStatus;
  readonly ownerId: string;
  readonly startDate: Date;
  readonly targetCompletion: Date;
  readonly createdAt: Date;
}