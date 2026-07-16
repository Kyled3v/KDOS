/**
 * Subscription
 *
 * Shared domain model representing a recurring commercial arrangement —
 * either a client's retainer/support plan or KyleDev's own license from
 * the License Manager's perspective. Pure data shape only: no behaviour,
 * no persistence, no validation logic.
 */

export enum SubscriptionPlan {
  STARTER = "STARTER",
  GROWTH = "GROWTH",
  ENTERPRISE = "ENTERPRISE",
  CUSTOM = "CUSTOM",
}

export enum SubscriptionBillingCycle {
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  ANNUAL = "ANNUAL",
}

export enum SubscriptionStatus {
  TRIALING = "TRIALING",
  ACTIVE = "ACTIVE",
  PAST_DUE = "PAST_DUE",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
}

export interface Subscription {
  readonly id: string;
  readonly clientId: string;
  readonly plan: SubscriptionPlan;
  readonly billingCycle: SubscriptionBillingCycle;
  readonly price: number;
  readonly currency: string;
  readonly status: SubscriptionStatus;
  readonly startedAt: Date;
  readonly currentPeriodEnd: Date;
  readonly cancelledAt: Date | null;
  readonly createdAt: Date;
}