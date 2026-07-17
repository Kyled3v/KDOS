/**
 * EmployeeStatus
 *
 * The lifecycle states an employee session can occupy within the
 * Workforce Runtime, and the guarded transitions between them. Pure
 * enum and transition-rule module — no session state lives here.
 */

export enum EmployeeStatus {
  OFFLINE = "OFFLINE",
  STARTING = "STARTING",
  READY = "READY",
  WORKING = "WORKING",
  WAITING = "WAITING",
  BLOCKED = "BLOCKED",
  HANDOFF = "HANDOFF",
  ERROR = "ERROR",
  STOPPING = "STOPPING",
}

export const EMPLOYEE_STATUS_TRANSITIONS: Readonly<Record<EmployeeStatus, readonly EmployeeStatus[]>> = {
  [EmployeeStatus.OFFLINE]: [EmployeeStatus.STARTING],
  [EmployeeStatus.STARTING]: [EmployeeStatus.READY, EmployeeStatus.ERROR],
  [EmployeeStatus.READY]: [EmployeeStatus.WORKING, EmployeeStatus.STOPPING, EmployeeStatus.ERROR],
  [EmployeeStatus.WORKING]: [
    EmployeeStatus.WAITING,
    EmployeeStatus.BLOCKED,
    EmployeeStatus.HANDOFF,
    EmployeeStatus.READY,
    EmployeeStatus.ERROR,
    EmployeeStatus.STOPPING,
  ],
  [EmployeeStatus.WAITING]: [EmployeeStatus.WORKING, EmployeeStatus.BLOCKED, EmployeeStatus.STOPPING, EmployeeStatus.ERROR],
  [EmployeeStatus.BLOCKED]: [EmployeeStatus.WORKING, EmployeeStatus.WAITING, EmployeeStatus.ERROR, EmployeeStatus.STOPPING],
  [EmployeeStatus.HANDOFF]: [EmployeeStatus.READY, EmployeeStatus.WORKING, EmployeeStatus.ERROR],
  [EmployeeStatus.ERROR]: [EmployeeStatus.STARTING, EmployeeStatus.STOPPING],
  [EmployeeStatus.STOPPING]: [EmployeeStatus.OFFLINE],
};

/**
 * Validates that a status transition is legal. Throws if not.
 */
export function assertValidStatusTransition(from: EmployeeStatus, to: EmployeeStatus): void {
  const allowed = EMPLOYEE_STATUS_TRANSITIONS[from];
  if (!allowed.includes(to)) {
    throw new Error(`Invalid employee status transition from "${from}" to "${to}".`);
  }
}

/**
 * Returns true if the given status represents an employee actively
 * occupied with work (as opposed to idle, offline, or errored).
 */
export function isActiveStatus(status: EmployeeStatus): boolean {
  return (
    status === EmployeeStatus.WORKING ||
    status === EmployeeStatus.WAITING ||
    status === EmployeeStatus.BLOCKED ||
    status === EmployeeStatus.HANDOFF
  );
}