/**
 * EmployeeSession
 *
 * Represents a single employee's live runtime session — the fact that
 * an employee (human or AI) is started and occupying a status, possibly
 * bound to a current task and model. Immutable value object; mutation
 * methods return new instances rather than modifying state in place.
 */

import { EmployeeStatus, assertValidStatusTransition } from "./EmployeeStatus";

export interface EmployeeSessionProps {
  readonly sessionId: string;
  readonly employeeId: string;
  readonly startedAt: Date;
  readonly lastActivity: Date;
  readonly currentTask: string | null;
  readonly currentModel: string | null;
  readonly memoryUsage: number;
  readonly status: EmployeeStatus;
}

export class EmployeeSession {
  public readonly sessionId: string;
  public readonly employeeId: string;
  public readonly startedAt: Date;
  public readonly lastActivity: Date;
  public readonly currentTask: string | null;
  public readonly currentModel: string | null;
  public readonly memoryUsage: number;
  public readonly status: EmployeeStatus;

  private constructor(props: EmployeeSessionProps) {
    this.sessionId = props.sessionId;
    this.employeeId = props.employeeId;
    this.startedAt = props.startedAt;
    this.lastActivity = props.lastActivity;
    this.currentTask = props.currentTask;
    this.currentModel = props.currentModel;
    this.memoryUsage = props.memoryUsage;
    this.status = props.status;
  }

  /**
   * Creates a new EmployeeSession in STARTING status, with no current
   * task or model and zero memory usage.
   */
  public static start(props: { sessionId: string; employeeId: string }): EmployeeSession {
    if (!props.sessionId || props.sessionId.trim().length === 0) {
      throw new Error("EmployeeSession requires a non-empty sessionId.");
    }
    if (!props.employeeId || props.employeeId.trim().length === 0) {
      throw new Error("EmployeeSession requires a non-empty employeeId.");
    }

    const now = new Date();

    return new EmployeeSession({
      sessionId: props.sessionId,
      employeeId: props.employeeId,
      startedAt: now,
      lastActivity: now,
      currentTask: null,
      currentModel: null,
      memoryUsage: 0,
      status: EmployeeStatus.STARTING,
    });
  }

  /**
   * Reconstructs an EmployeeSession from a stored snapshot.
   */
  public static fromSnapshot(snapshot: EmployeeSessionProps): EmployeeSession {
    return new EmployeeSession(snapshot);
  }

  /**
   * Returns a new EmployeeSession transitioned to the given status,
   * touching lastActivity. Throws if the transition is not valid.
   */
  public withStatus(status: EmployeeStatus): EmployeeSession {
    assertValidStatusTransition(this.status, status);

    return new EmployeeSession({
      sessionId: this.sessionId,
      employeeId: this.employeeId,
      startedAt: this.startedAt,
      lastActivity: new Date(),
      currentTask: this.currentTask,
      currentModel: this.currentModel,
      memoryUsage: this.memoryUsage,
      status,
    });
  }

  /**
   * Returns a new EmployeeSession bound to the given task and model,
   * touching lastActivity.
   */
  public withCurrentTask(taskId: string | null, model: string | null): EmployeeSession {
    return new EmployeeSession({
      sessionId: this.sessionId,
      employeeId: this.employeeId,
      startedAt: this.startedAt,
      lastActivity: new Date(),
      currentTask: taskId,
      currentModel: model,
      memoryUsage: this.memoryUsage,
      status: this.status,
    });
  }

  /**
   * Returns a new EmployeeSession with an updated memory usage figure.
   * Throws if the value is negative.
   */
  public withMemoryUsage(memoryUsage: number): EmployeeSession {
    if (memoryUsage < 0) {
      throw new Error("EmployeeSession memoryUsage cannot be negative.");
    }

    return new EmployeeSession({
      sessionId: this.sessionId,
      employeeId: this.employeeId,
      startedAt: this.startedAt,
      lastActivity: new Date(),
      currentTask: this.currentTask,
      currentModel: this.currentModel,
      memoryUsage,
      status: this.status,
    });
  }

  /**
   * Returns the session's uptime in milliseconds relative to the given
   * reference time.
   */
  public uptime(referenceTime: Date = new Date()): number {
    return referenceTime.getTime() - this.startedAt.getTime();
  }

  /**
   * Returns the time in milliseconds since the session's last recorded
   * activity, relative to the given reference time.
   */
  public idleTime(referenceTime: Date = new Date()): number {
    return referenceTime.getTime() - this.lastActivity.getTime();
  }

  /**
   * Returns a plain serialisable snapshot of this session.
   */
  public toSnapshot(): EmployeeSessionProps {
    return {
      sessionId: this.sessionId,
      employeeId: this.employeeId,
      startedAt: this.startedAt,
      lastActivity: this.lastActivity,
      currentTask: this.currentTask,
      currentModel: this.currentModel,
      memoryUsage: this.memoryUsage,
      status: this.status,
    };
  }
}