/**
 * AIWorker
 *
 * Shared domain model representing an AI employee occupying a workforce
 * role within KDOS, as referenced by the Task Engine, Execution Layer,
 * and Workforce Runtime. Pure data shape only: no behaviour, no
 * persistence, no validation logic, and critically no AI implementation —
 * this is a reference shape, not a model invocation.
 */

export enum AIWorkerDepartment {
  FRONTEND = "FRONTEND",
  BACKEND = "BACKEND",
  QA = "QA",
  DEVOPS = "DEVOPS",
  UI = "UI",
  SALES = "SALES",
  SUPPORT = "SUPPORT",
  RESEARCH = "RESEARCH",
}

export enum AIWorkerStatus {
  IDLE = "IDLE",
  BUSY = "BUSY",
  OFFLINE = "OFFLINE",
  DECOMMISSIONED = "DECOMMISSIONED",
}

export interface AIWorker {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly department: AIWorkerDepartment;
  readonly status: AIWorkerStatus;
  readonly skills: readonly string[];
  readonly activatedAt: Date;
  readonly createdAt: Date;
}