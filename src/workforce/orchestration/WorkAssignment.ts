/**
 * WorkAssignment
 *
 * Represents a single unit of work routed to a specific employee by the
 * Workforce Runtime — the runtime-level binding between a KDOS Task and
 * the employee session that will carry it out. Immutable value object;
 * mutation methods return new instances rather than modifying state in
 * place. Distinct from the Task Engine's own Task/TaskAssignment records:
 * WorkAssignment is the runtime's dispatch-level view.
 */

export enum WorkAssignmentStatus {
  PENDING = "PENDING",
  QUEUED = "QUEUED",
  DISPATCHED = "DISPATCHED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export interface WorkAssignmentProps {
  readonly id: string;
  readonly taskId: string;
  readonly employeeId: string;
  readonly status: WorkAssignmentStatus;
  readonly createdAt: Date;
  readonly dispatchedAt: Date | null;
  readonly completedAt: Date | null;
}

const VALID_TRANSITIONS: Readonly<Record<WorkAssignmentStatus, readonly WorkAssignmentStatus[]>> = {
  [WorkAssignmentStatus.PENDING]: [WorkAssignmentStatus.QUEUED, WorkAssignmentStatus.CANCELLED],
  [WorkAssignmentStatus.QUEUED]: [WorkAssignmentStatus.DISPATCHED, WorkAssignmentStatus.CANCELLED],
  [WorkAssignmentStatus.DISPATCHED]: [WorkAssignmentStatus.IN_PROGRESS, WorkAssignmentStatus.CANCELLED, WorkAssignmentStatus.FAILED],
  [WorkAssignmentStatus.IN_PROGRESS]: [WorkAssignmentStatus.COMPLETED, WorkAssignmentStatus.FAILED, WorkAssignmentStatus.CANCELLED],
  [WorkAssignmentStatus.COMPLETED]: [],
  [WorkAssignmentStatus.FAILED]: [WorkAssignmentStatus.QUEUED, WorkAssignmentStatus.CANCELLED],
  [WorkAssignmentStatus.CANCELLED]: [],
};

export class WorkAssignment {
  public readonly id: string;
  public readonly taskId: string;
  public readonly employeeId: string;
  public readonly status: WorkAssignmentStatus;
  public readonly createdAt: Date;
  public readonly dispatchedAt: Date | null;
  public readonly completedAt: Date | null;

  private constructor(props: WorkAssignmentProps) {
    this.id = props.id;
    this.taskId = props.taskId;
    this.employeeId = props.employeeId;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.dispatchedAt = props.dispatchedAt;
    this.completedAt = props.completedAt;
  }

  /**
   * Creates a new WorkAssignment in PENDING status.
   */
  public static create(props: { id: string; taskId: string; employeeId: string }): WorkAssignment {
    if (!props.id || props.id.trim().length === 0) {
      throw new Error("WorkAssignment requires a non-empty id.");
    }
    if (!props.taskId || props.taskId.trim().length === 0) {
      throw new Error("WorkAssignment requires a non-empty taskId.");
    }
    if (!props.employeeId || props.employeeId.trim().length === 0) {
      throw new Error("WorkAssignment requires a non-empty employeeId.");
    }

    return new WorkAssignment({
      id: props.id,
      taskId: props.taskId,
      employeeId: props.employeeId,
      status: WorkAssignmentStatus.PENDING,
      createdAt: new Date(),
      dispatchedAt: null,
      completedAt: null,
    });
  }

  /**
   * Reconstructs a WorkAssignment from a stored snapshot.
   */
  public static fromSnapshot(snapshot: WorkAssignmentProps): WorkAssignment {
    return new WorkAssignment(snapshot);
  }

  /**
   * Returns a new WorkAssignment transitioned to the given status.
   * Throws if the transition is not valid from the current status.
   * Automatically stamps dispatchedAt/completedAt for the relevant
   * transitions.
   */
  public withStatus(status: WorkAssignmentStatus): WorkAssignment {
    const allowed = VALID_TRANSITIONS[this.status];

    if (!allowed.includes(status)) {
      throw new Error(
        `Invalid work assignment status transition from "${this.status}" to "${status}" for assignment "${this.id}".`
      );
    }

    const dispatchedAt = status === WorkAssignmentStatus.DISPATCHED ? new Date() : this.dispatchedAt;
    const completedAt =
      status === WorkAssignmentStatus.COMPLETED || status === WorkAssignmentStatus.FAILED
        ? new Date()
        : this.completedAt;

    return new WorkAssignment({
      id: this.id,
      taskId: this.taskId,
      employeeId: this.employeeId,
      status,
      createdAt: this.createdAt,
      dispatchedAt,
      completedAt,
    });
  }

  /**
   * Returns true if this assignment is in a terminal status.
   */
  public isTerminal(): boolean {
    return (
      this.status === WorkAssignmentStatus.COMPLETED ||
      this.status === WorkAssignmentStatus.CANCELLED
    );
  }

  /**
   * Returns a plain serialisable snapshot of this assignment.
   */
  public toSnapshot(): WorkAssignmentProps {
    return {
      id: this.id,
      taskId: this.taskId,
      employeeId: this.employeeId,
      status: this.status,
      createdAt: this.createdAt,
      dispatchedAt: this.dispatchedAt,
      completedAt: this.completedAt,
    };
  }
}