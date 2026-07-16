/**
 * Task
 *
 * Represents a discrete unit of work generated from a Project and destined
 * for execution by an AI employee occupying a specific workforce role.
 * Immutable value object; mutation methods return new instances rather
 * than modifying state in place. Tasks are never created by employees —
 * only by TaskManager, typically derived from a Project.
 */

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum TaskStatus {
  NEW = "NEW",
  QUEUED = "QUEUED",
  ASSIGNED = "ASSIGNED",
  IN_PROGRESS = "IN_PROGRESS",
  REVIEW = "REVIEW",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export interface TaskProps {
  readonly id: string;
  readonly projectId: string;
  readonly title: string;
  readonly description: string;
  readonly employeeRole: string;
  readonly priority: TaskPriority;
  readonly status: TaskStatus;
  readonly estimatedHours: number;
  readonly createdAt: Date;
}

const VALID_TRANSITIONS: Readonly<Record<TaskStatus, readonly TaskStatus[]>> = {
  [TaskStatus.NEW]: [TaskStatus.QUEUED, TaskStatus.CANCELLED],
  [TaskStatus.QUEUED]: [TaskStatus.ASSIGNED, TaskStatus.CANCELLED],
  [TaskStatus.ASSIGNED]: [TaskStatus.IN_PROGRESS, TaskStatus.QUEUED, TaskStatus.CANCELLED],
  [TaskStatus.IN_PROGRESS]: [TaskStatus.REVIEW, TaskStatus.FAILED, TaskStatus.CANCELLED],
  [TaskStatus.REVIEW]: [TaskStatus.COMPLETED, TaskStatus.IN_PROGRESS, TaskStatus.FAILED],
  [TaskStatus.COMPLETED]: [],
  [TaskStatus.FAILED]: [TaskStatus.QUEUED, TaskStatus.CANCELLED],
  [TaskStatus.CANCELLED]: [],
};

export class Task {
  public readonly id: string;
  public readonly projectId: string;
  public readonly title: string;
  public readonly description: string;
  public readonly employeeRole: string;
  public readonly priority: TaskPriority;
  public readonly status: TaskStatus;
  public readonly estimatedHours: number;
  public readonly createdAt: Date;

  private constructor(props: TaskProps) {
    this.id = props.id;
    this.projectId = props.projectId;
    this.title = props.title;
    this.description = props.description;
    this.employeeRole = props.employeeRole;
    this.priority = props.priority;
    this.status = props.status;
    this.estimatedHours = props.estimatedHours;
    this.createdAt = props.createdAt;
  }

  /**
   * Creates a new Task in NEW status.
   */
  public static create(props: {
    id: string;
    projectId: string;
    title: string;
    description: string;
    employeeRole: string;
    priority: TaskPriority;
    estimatedHours: number;
  }): Task {
    if (!props.id || props.id.trim().length === 0) {
      throw new Error("Task requires a non-empty id.");
    }
    if (!props.projectId || props.projectId.trim().length === 0) {
      throw new Error("Task requires a non-empty projectId.");
    }
    if (!props.title || props.title.trim().length === 0) {
      throw new Error("Task requires a non-empty title.");
    }
    if (!props.employeeRole || props.employeeRole.trim().length === 0) {
      throw new Error("Task requires a non-empty employeeRole.");
    }
    if (props.estimatedHours <= 0) {
      throw new Error("Task estimatedHours must be greater than zero.");
    }

    return new Task({
      id: props.id,
      projectId: props.projectId,
      title: props.title,
      description: props.description,
      employeeRole: props.employeeRole,
      priority: props.priority,
      status: TaskStatus.NEW,
      estimatedHours: props.estimatedHours,
      createdAt: new Date(),
    });
  }

  /**
   * Reconstructs a Task from a stored snapshot.
   */
  public static fromSnapshot(snapshot: TaskProps): Task {
    return new Task(snapshot);
  }

  /**
   * Returns a new Task transitioned to the given status.
   * Throws if the transition is not valid from the current status.
   */
  public withStatus(status: TaskStatus): Task {
    const allowed = VALID_TRANSITIONS[this.status];

    if (!allowed.includes(status)) {
      throw new Error(
        `Invalid task status transition from "${this.status}" to "${status}".`
      );
    }

    return new Task({
      id: this.id,
      projectId: this.projectId,
      title: this.title,
      description: this.description,
      employeeRole: this.employeeRole,
      priority: this.priority,
      status,
      estimatedHours: this.estimatedHours,
      createdAt: this.createdAt,
    });
  }

  /**
   * Returns true if this task is in a terminal status.
   */
  public isTerminal(): boolean {
    return (
      this.status === TaskStatus.COMPLETED ||
      this.status === TaskStatus.CANCELLED
    );
  }

  /**
   * Returns a plain serialisable snapshot of this task.
   */
  public toSnapshot(): TaskProps {
    return {
      id: this.id,
      projectId: this.projectId,
      title: this.title,
      description: this.description,
      employeeRole: this.employeeRole,
      priority: this.priority,
      status: this.status,
      estimatedHours: this.estimatedHours,
      createdAt: this.createdAt,
    };
  }
}