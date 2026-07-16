/**
 * ProjectTask
 *
 * Represents a unit of work within a Project, assigned to a workforce role.
 * Immutable value object; mutation methods return new instances rather than
 * modifying state in place.
 */

export enum ProjectTaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum ProjectTaskStatus {
  BACKLOG = "BACKLOG",
  ASSIGNED = "ASSIGNED",
  IN_PROGRESS = "IN_PROGRESS",
  BLOCKED = "BLOCKED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface ProjectTaskProps {
  readonly id: string;
  readonly projectId: string;
  readonly assignedRole: string;
  readonly title: string;
  readonly description: string;
  readonly priority: ProjectTaskPriority;
  readonly status: ProjectTaskStatus;
  readonly estimatedHours: number;
}

const VALID_TRANSITIONS: Readonly<Record<ProjectTaskStatus, readonly ProjectTaskStatus[]>> = {
  [ProjectTaskStatus.BACKLOG]: [ProjectTaskStatus.ASSIGNED, ProjectTaskStatus.CANCELLED],
  [ProjectTaskStatus.ASSIGNED]: [ProjectTaskStatus.IN_PROGRESS, ProjectTaskStatus.BACKLOG, ProjectTaskStatus.CANCELLED],
  [ProjectTaskStatus.IN_PROGRESS]: [ProjectTaskStatus.BLOCKED, ProjectTaskStatus.COMPLETED, ProjectTaskStatus.CANCELLED],
  [ProjectTaskStatus.BLOCKED]: [ProjectTaskStatus.IN_PROGRESS, ProjectTaskStatus.CANCELLED],
  [ProjectTaskStatus.COMPLETED]: [],
  [ProjectTaskStatus.CANCELLED]: [],
};

export class ProjectTask {
  public readonly id: string;
  public readonly projectId: string;
  public readonly assignedRole: string;
  public readonly title: string;
  public readonly description: string;
  public readonly priority: ProjectTaskPriority;
  public readonly status: ProjectTaskStatus;
  public readonly estimatedHours: number;

  private constructor(props: ProjectTaskProps) {
    this.id = props.id;
    this.projectId = props.projectId;
    this.assignedRole = props.assignedRole;
    this.title = props.title;
    this.description = props.description;
    this.priority = props.priority;
    this.status = props.status;
    this.estimatedHours = props.estimatedHours;
  }

  /**
   * Creates a new ProjectTask in BACKLOG status.
   */
  public static create(props: {
    id: string;
    projectId: string;
    assignedRole: string;
    title: string;
    description: string;
    priority: ProjectTaskPriority;
    estimatedHours: number;
  }): ProjectTask {
    if (!props.id || props.id.trim().length === 0) {
      throw new Error("ProjectTask requires a non-empty id.");
    }
    if (!props.projectId || props.projectId.trim().length === 0) {
      throw new Error("ProjectTask requires a non-empty projectId.");
    }
    if (!props.assignedRole || props.assignedRole.trim().length === 0) {
      throw new Error("ProjectTask requires a non-empty assignedRole.");
    }
    if (!props.title || props.title.trim().length === 0) {
      throw new Error("ProjectTask requires a non-empty title.");
    }
    if (props.estimatedHours <= 0) {
      throw new Error("ProjectTask estimatedHours must be greater than zero.");
    }

    return new ProjectTask({
      id: props.id,
      projectId: props.projectId,
      assignedRole: props.assignedRole,
      title: props.title,
      description: props.description,
      priority: props.priority,
      status: ProjectTaskStatus.BACKLOG,
      estimatedHours: props.estimatedHours,
    });
  }

  /**
   * Reconstructs a ProjectTask from a stored snapshot.
   */
  public static fromSnapshot(snapshot: ProjectTaskProps): ProjectTask {
    return new ProjectTask(snapshot);
  }

  /**
   * Returns a new ProjectTask transitioned to the given status.
   * Throws if the transition is not valid from the current status.
   */
  public withStatus(status: ProjectTaskStatus): ProjectTask {
    const allowed = VALID_TRANSITIONS[this.status];

    if (!allowed.includes(status)) {
      throw new Error(
        `Invalid task status transition from "${this.status}" to "${status}".`
      );
    }

    return new ProjectTask({
      id: this.id,
      projectId: this.projectId,
      assignedRole: this.assignedRole,
      title: this.title,
      description: this.description,
      priority: this.priority,
      status,
      estimatedHours: this.estimatedHours,
    });
  }

  /**
   * Returns a new ProjectTask reassigned to a different workforce role.
   * Throws if the task has already been completed or cancelled.
   */
  public withAssignedRole(assignedRole: string): ProjectTask {
    if (!assignedRole || assignedRole.trim().length === 0) {
      throw new Error("ProjectTask requires a non-empty assignedRole.");
    }
    if (this.status === ProjectTaskStatus.COMPLETED || this.status === ProjectTaskStatus.CANCELLED) {
      throw new Error(`Cannot reassign a task in terminal status "${this.status}".`);
    }

    return new ProjectTask({
      id: this.id,
      projectId: this.projectId,
      assignedRole,
      title: this.title,
      description: this.description,
      priority: this.priority,
      status: this.status,
      estimatedHours: this.estimatedHours,
    });
  }

  /**
   * Returns a plain serialisable snapshot of this task.
   */
  public toSnapshot(): ProjectTaskProps {
    return {
      id: this.id,
      projectId: this.projectId,
      assignedRole: this.assignedRole,
      title: this.title,
      description: this.description,
      priority: this.priority,
      status: this.status,
      estimatedHours: this.estimatedHours,
    };
  }
}