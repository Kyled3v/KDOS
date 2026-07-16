/**
 * TaskExecution
 *
 * Represents a single execution attempt of a Task by an AI employee,
 * capturing timing and outcome. Immutable value object. An execution
 * begins "open" (no completedAt/duration/result) and is closed exactly
 * once via withCompletion.
 */

export interface TaskExecutionProps {
  readonly taskId: string;
  readonly employeeId: string;
  readonly startedAt: Date;
  readonly completedAt: Date | null;
  readonly duration: number | null;
  readonly result: string | null;
}

export class TaskExecution {
  public readonly taskId: string;
  public readonly employeeId: string;
  public readonly startedAt: Date;
  public readonly completedAt: Date | null;
  public readonly duration: number | null;
  public readonly result: string | null;

  private constructor(props: TaskExecutionProps) {
    this.taskId = props.taskId;
    this.employeeId = props.employeeId;
    this.startedAt = props.startedAt;
    this.completedAt = props.completedAt;
    this.duration = props.duration;
    this.result = props.result;
  }

  /**
   * Starts a new, open TaskExecution.
   */
  public static start(props: { taskId: string; employeeId: string }): TaskExecution {
    if (!props.taskId || props.taskId.trim().length === 0) {
      throw new Error("TaskExecution requires a non-empty taskId.");
    }
    if (!props.employeeId || props.employeeId.trim().length === 0) {
      throw new Error("TaskExecution requires a non-empty employeeId.");
    }

    return new TaskExecution({
      taskId: props.taskId,
      employeeId: props.employeeId,
      startedAt: new Date(),
      completedAt: null,
      duration: null,
      result: null,
    });
  }

  /**
   * Reconstructs a TaskExecution from a stored snapshot.
   */
  public static fromSnapshot(snapshot: TaskExecutionProps): TaskExecution {
    return new TaskExecution(snapshot);
  }

  /**
   * Returns true if this execution has not yet been completed.
   */
  public isOpen(): boolean {
    return this.completedAt === null;
  }

  /**
   * Closes this execution with a result, computing duration in milliseconds.
   * Throws if the execution has already been completed.
   */
  public withCompletion(result: string): TaskExecution {
    if (!this.isOpen()) {
      throw new Error(`TaskExecution for task "${this.taskId}" has already been completed.`);
    }
    if (!result || result.trim().length === 0) {
      throw new Error("TaskExecution completion requires a non-empty result.");
    }

    const completedAt = new Date();
    const duration = completedAt.getTime() - this.startedAt.getTime();

    return new TaskExecution({
      taskId: this.taskId,
      employeeId: this.employeeId,
      startedAt: this.startedAt,
      completedAt,
      duration,
      result,
    });
  }

  /**
   * Returns a plain serialisable snapshot of this execution.
   */
  public toSnapshot(): TaskExecutionProps {
    return {
      taskId: this.taskId,
      employeeId: this.employeeId,
      startedAt: this.startedAt,
      completedAt: this.completedAt,
      duration: this.duration,
      result: this.result,
    };
  }
}