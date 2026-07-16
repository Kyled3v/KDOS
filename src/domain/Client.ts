/**
 * Client
 *
 * Shared domain model representing a client relationship — a Company
 * being served by KyleDev, together with its primary point(s) of contact
 * and relationship metadata. Distinct from Company itself: a Client wraps
 * a companyId with relationship-specific context. Pure data shape only:
 * no behaviour, no persistence, no validation logic.
 */

export enum ClientLifecycleStage {
  PROSPECT = "PROSPECT",
  ONBOARDING = "ONBOARDING",
  ACTIVE = "ACTIVE",
  DORMANT = "DORMANT",
  CHURNED = "CHURNED",
}

export interface ClientContact {
  readonly userId: string;
  readonly isPrimary: boolean;
}

export interface Client {
  readonly id: string;
  readonly companyId: string;
  readonly accountManagerId: string | null;
  readonly lifecycleStage: ClientLifecycleStage;
  readonly contacts: readonly ClientContact[];
  readonly currency: string;
  readonly onboardedAt: Date | null;
  readonly createdAt: Date;
}