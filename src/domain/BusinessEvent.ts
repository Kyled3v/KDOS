/**
 * BusinessEvent
 *
 * Shared domain model representing a discrete, recorded occurrence within
 * KDOS's business operations — the common shape underlying timelines,
 * audit trails, and cross-subsystem event data (distinct from the
 * Platform Kernel's own in-process PlatformEvents bus, which carries
 * kernel lifecycle signals rather than business-domain occurrences).
 * Pure data shape only: no behaviour, no persistence, no validation logic.
 */

export enum BusinessEventCategory {
  LEAD = "LEAD",
  PROPOSAL = "PROPOSAL",
  QUOTATION = "QUOTATION",
  PROJECT = "PROJECT",
  INVOICE = "INVOICE",
  SUBSCRIPTION = "SUBSCRIPTION",
  AUTOMATION = "AUTOMATION",
  WORKFORCE = "WORKFORCE",
}

export interface BusinessEvent {
  readonly id: string;
  readonly category: BusinessEventCategory;
  readonly type: string;
  readonly description: string;
  readonly companyId: string | null;
  readonly clientId: string | null;
  readonly relatedEntityId: string | null;
  readonly occurredAt: Date;
}