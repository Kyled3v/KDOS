/**
 * Automation
 *
 * Shared domain model representing a configured automated workflow
 * (e.g. lead automation, follow-up sequences, workforce triggers) as
 * referenced across KDOS subsystems. Pure data shape only: no behaviour,
 * no persistence, no validation logic.
 */

export enum AutomationTriggerType {
  EVENT = "EVENT",
  SCHEDULE = "SCHEDULE",
  MANUAL = "MANUAL",
}

export enum AutomationStatus {
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  DISABLED = "DISABLED",
}

export interface AutomationCondition {
  readonly field: string;
  readonly operator: string;
  readonly value: string;
}

export interface AutomationAction {
  readonly id: string;
  readonly actionType: string;
  readonly order: number;
}

export interface Automation {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly triggerType: AutomationTriggerType;
  readonly triggerReference: string;
  readonly conditions: readonly AutomationCondition[];
  readonly actions: readonly AutomationAction[];
  readonly status: AutomationStatus;
  readonly createdAt: Date;
}