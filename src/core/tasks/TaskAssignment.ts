/**
 * TaskAssignment
 *
 * Represents the binding of a Task to a specific AI employee. Immutable
 * value object. A Task may accumulate multiple TaskAssignment records over
 * its lifetime (e.g. reassignment after failure), each preserved as a
 * discrete historical record rather than overwritten.
 */

export interface TaskAssignmentProps {
  readonly taskId: string;
  readonly employeeId: string;
  readonly assignedAt: Date;
}

export class TaskAssignment {
  public readonly taskId: string;
  public readonly employeeId: string;
  public readonly assignedAt: Date;

  private constructor(props: TaskAssignmentProps) {
    this.taskId = props.taskId;
    this.employeeId = props.employeeId;
    this.assignedAt = props.assignedAt;
  }

  /**
   * Creates a new TaskAssignment, timestamped at the moment of creation.
   */
  public static create(props: { taskId: string; employeeId: string }): TaskAssignment {
    if (!props.taskId || props.taskId.trim().length === 0) {
      throw new Error("TaskAssignment requires a non-empty taskId.");
    }
    if (!props.employeeId || props.employeeId.trim().length === 0) {
      throw new Error("TaskAssignment requires a non-empty employeeId.");
    }

    return new TaskAssignment({
      taskId: props.taskId,
      employeeId: props.employeeId,
      assignedAt: new Date(),
    });
  }

  /**
   * Reconstructs a TaskAssignment from a stored snapshot.
   */
  public static fromSnapshot(snapshot: TaskAssignmentProps): TaskAssignment {
    return new TaskAssignment(snapshot);
  }

  /**
   * Returns a plain serialisable snapshot of this assignment.
   */
  public toSnapshot(): TaskAssignmentProps {
    return {
      taskId: this.taskId,
      employeeId: this.employeeId,
      assignedAt: this.assignedAt,
    };
  }
}