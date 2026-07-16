/**
 * ExecutionHistory
 *
 * Represents a single, immutable historical record of a finished execution
 * attempt (either COMPLETED or FAILED). One ExecutionHistory entry is
 * appended each time an execution reaches a terminal state; entries are
 * never modified once created, preserving an accurate audit trail.
 */

export enum ExecutionHistoryStatus {
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export interface ExecutionHistoryProps {
  readonly executionId: string;
  readonly taskId: string;
  readonly employeeId: string;
  readonly duration: number;
  readonly status: ExecutionHistoryStatus;
  readonly timestamp: Date;
}

export class ExecutionHistory {
  public readonly executionId: string;
  public readonly taskId: string;
  public readonly employeeId: string;
  public readonly duration: number;
  public readonly status: ExecutionHistoryStatus;
  public readonly timestamp: Date;

  private constructor(props: ExecutionHistoryProps) {
    this.executionId = props.executionId;
    this.taskId = props.taskId;
    this.employeeId = props.employeeId;
    this.duration = props.duration;
    this.status = props.status;
    this.timestamp = props.timestamp;
  }

  /**
   * Records a new ExecutionHistory entry, timestamped at the moment of creation.
   */
  public static record(props: {
    executionId: string;
    taskId: string;
    employeeId: string;
    duration: number;
    status: ExecutionHistoryStatus;
  }): ExecutionHistory {
    if (!props.executionId || props.executionId.trim().length === 0) {
      throw new Error("ExecutionHistory requires a non-empty executionId.");
    }
    if (!props.taskId || props.taskId.trim().length === 0) {
      throw new Error("ExecutionHistory requires a non-empty taskId.");
    }
    if (!props.employeeId || props.employeeId.trim().length === 0) {
      throw new Error("ExecutionHistory requires a non-empty employeeId.");
    }
    if (props.duration < 0) {
      throw new Error("ExecutionHistory duration cannot be negative.");
    }

    return new ExecutionHistory({
      executionId: props.executionId,
      taskId: props.taskId,
      employeeId: props.employeeId,
      duration: props.duration,
      status: props.status,
      timestamp: new Date(),
    });
  }

  /**
   * Reconstructs an ExecutionHistory entry from a stored snapshot.
   */
  public static fromSnapshot(snapshot: ExecutionHistoryProps): ExecutionHistory {
    return new ExecutionHistory(snapshot);
  }

  /**
   * Returns a plain serialisable snapshot of this history entry.
   */
  public toSnapshot(): ExecutionHistoryProps {
    return {
      executionId: this.executionId,
      taskId: this.taskId,
      employeeId: this.employeeId,
      duration: this.duration,
      status: this.status,
      timestamp: this.timestamp,
    };
  }
}