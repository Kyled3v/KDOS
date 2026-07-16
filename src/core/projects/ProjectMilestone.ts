/**
 * ProjectMilestone
 *
 * Represents a significant checkpoint within a Project's delivery timeline.
 * Immutable value object; mutation methods return new instances rather than
 * modifying state in place.
 */

export enum ProjectMilestoneStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  MISSED = "MISSED",
}

export interface ProjectMilestoneProps {
  readonly id: string;
  readonly projectId: string;
  readonly title: string;
  readonly description: string;
  readonly status: ProjectMilestoneStatus;
  readonly dueDate: Date;
}

const VALID_TRANSITIONS: Readonly<Record<ProjectMilestoneStatus, readonly ProjectMilestoneStatus[]>> = {
  [ProjectMilestoneStatus.PENDING]: [ProjectMilestoneStatus.IN_PROGRESS, ProjectMilestoneStatus.MISSED],
  [ProjectMilestoneStatus.IN_PROGRESS]: [ProjectMilestoneStatus.COMPLETED, ProjectMilestoneStatus.MISSED],
  [ProjectMilestoneStatus.COMPLETED]: [],
  [ProjectMilestoneStatus.MISSED]: [ProjectMilestoneStatus.IN_PROGRESS],
};

export class ProjectMilestone {
  public readonly id: string;
  public readonly projectId: string;
  public readonly title: string;
  public readonly description: string;
  public readonly status: ProjectMilestoneStatus;
  public readonly dueDate: Date;

  private constructor(props: ProjectMilestoneProps) {
    this.id = props.id;
    this.projectId = props.projectId;
    this.title = props.title;
    this.description = props.description;
    this.status = props.status;
    this.dueDate = props.dueDate;
  }

  /**
   * Creates a new ProjectMilestone in PENDING status.
   */
  public static create(props: {
    id: string;
    projectId: string;
    title: string;
    description: string;
    dueDate: Date;
  }): ProjectMilestone {
    if (!props.id || props.id.trim().length === 0) {
      throw new Error("ProjectMilestone requires a non-empty id.");
    }
    if (!props.projectId || props.projectId.trim().length === 0) {
      throw new Error("ProjectMilestone requires a non-empty projectId.");
    }
    if (!props.title || props.title.trim().length === 0) {
      throw new Error("ProjectMilestone requires a non-empty title.");
    }

    return new ProjectMilestone({
      id: props.id,
      projectId: props.projectId,
      title: props.title,
      description: props.description,
      status: ProjectMilestoneStatus.PENDING,
      dueDate: props.dueDate,
    });
  }

  /**
   * Reconstructs a ProjectMilestone from a stored snapshot.
   */
  public static fromSnapshot(snapshot: ProjectMilestoneProps): ProjectMilestone {
    return new ProjectMilestone(snapshot);
  }

  /**
   * Returns a new ProjectMilestone transitioned to the given status.
   * Throws if the transition is not valid from the current status.
   */
  public withStatus(status: ProjectMilestoneStatus): ProjectMilestone {
    const allowed = VALID_TRANSITIONS[this.status];

    if (!allowed.includes(status)) {
      throw new Error(
        `Invalid milestone status transition from "${this.status}" to "${status}".`
      );
    }

    return new ProjectMilestone({
      id: this.id,
      projectId: this.projectId,
      title: this.title,
      description: this.description,
      status,
      dueDate: this.dueDate,
    });
  }

  /**
   * Returns true if this milestone's due date has passed and it is not yet completed.
   */
  public isOverdue(referenceTime: Date = new Date()): boolean {
    return (
      this.status !== ProjectMilestoneStatus.COMPLETED &&
      referenceTime.getTime() > this.dueDate.getTime()
    );
  }

  /**
   * Returns a plain serialisable snapshot of this milestone.
   */
  public toSnapshot(): ProjectMilestoneProps {
    return {
      id: this.id,
      projectId: this.projectId,
      title: this.title,
      description: this.description,
      status: this.status,
      dueDate: this.dueDate,
    };
  }
}