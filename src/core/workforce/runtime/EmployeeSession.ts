/**
 * EmployeeSession.ts
 *
 * Location: src/core/workforce/runtime/EmployeeSession.ts
 *
 * EmployeeSession tracks a single employee's presence within
 * WorkforceRuntime for as long as they have work in flight: when
 * their session started, what they're currently doing, and when they
 * were last active. This file contains no logic — it is a pure data
 * shape maintained by WorkforceRuntime.
 */

/**
 * The lifecycle status of an EmployeeSession.
 */
export enum EmployeeSessionStatus {
  IDLE = 'IDLE',
  WORKING = 'WORKING',
  BLOCKED = 'BLOCKED',
  CANCELLED = 'CANCELLED',
  ENDED = 'ENDED',
}

/**
 * A single employee's active runtime session within WorkforceRuntime.
 */
export interface EmployeeSession {
  readonly sessionId: string
  readonly employeeId: string
  readonly startedAt: Date
  readonly lastActivity: Date
  readonly activeTask: string | null
  readonly status: EmployeeSessionStatus
}