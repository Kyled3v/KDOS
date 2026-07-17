/**
 * QueueManager
 *
 * Singleton priority-ordered FIFO queue of pending WorkAssignment ids
 * awaiting scheduling, keyed by target employee id. Distinct from a
 * single global queue: each employee has its own ordered lane, so one
 * busy employee cannot starve another's work. Map-based storage only.
 * No networking, no external dependencies.
 */

export enum WorkPriority {
  LOW = "LOW",
  NORMAL = "NORMAL",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

const PRIORITY_WEIGHT: Readonly<Record<WorkPriority, number>> = {
  [WorkPriority.URGENT]: 4,
  [WorkPriority.HIGH]: 3,
  [WorkPriority.NORMAL]: 2,
  [WorkPriority.LOW]: 1,
};

interface QueueEntry {
  readonly assignmentId: string;
  readonly priority: WorkPriority;
  readonly sequence: number;
}

export class QueueManager {
  private static instance: QueueManager | null = null;

  private readonly lanes: Map<string, QueueEntry[]>;
  private sequenceCounter: number;

  private constructor() {
    this.lanes = new Map<string, QueueEntry[]>();
    this.sequenceCounter = 0;
  }

  /**
   * Returns the singleton instance of QueueManager.
   */
  public static getInstance(): QueueManager {
    if (QueueManager.instance === null) {
      QueueManager.instance = new QueueManager();
    }
    return QueueManager.instance;
  }

  /**
   * Resets the singleton instance. Intended for test isolation only.
   */
  public static resetInstance(): void {
    QueueManager.instance = null;
  }

  /**
   * Enqueues a work assignment id into an employee's lane. Throws if the
   * assignment id is already queued for that employee.
   */
  public enqueue(employeeId: string, assignmentId: string, priority: WorkPriority): void {
    if (!employeeId || employeeId.trim().length === 0) {
      throw new Error("QueueManager requires a non-empty employeeId.");
    }
    if (!assignmentId || assignmentId.trim().length === 0) {
      throw new Error("QueueManager requires a non-empty assignmentId.");
    }

    const lane = this.lanes.get(employeeId) ?? [];
    if (lane.some((entry) => entry.assignmentId === assignmentId)) {
      throw new Error(`Assignment "${assignmentId}" is already queued for employee "${employeeId}".`);
    }

    lane.push({ assignmentId, priority, sequence: this.sequenceCounter++ });
    lane.sort((a, b) => {
      const priorityDiff = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
      return priorityDiff !== 0 ? priorityDiff : a.sequence - b.sequence;
    });

    this.lanes.set(employeeId, lane);
  }

  /**
   * Dequeues the next assignment id for an employee. Throws if that
   * employee's lane is empty.
   */
  public dequeue(employeeId: string): string {
    const lane = this.lanes.get(employeeId) ?? [];
    const entry = lane.shift();
    if (!entry) {
      throw new Error(`Cannot dequeue from empty queue lane for employee "${employeeId}".`);
    }
    this.lanes.set(employeeId, lane);
    return entry.assignmentId;
  }

  /**
   * Returns the next assignment id for an employee without removing it.
   * Throws if that employee's lane is empty.
   */
  public peek(employeeId: string): string {
    const lane = this.lanes.get(employeeId) ?? [];
    const entry = lane[0];
    if (!entry) {
      throw new Error(`Cannot peek empty queue lane for employee "${employeeId}".`);
    }
    return entry.assignmentId;
  }

  /**
   * Removes a specific assignment id from an employee's lane. Throws if
   * not present.
   */
  public remove(employeeId: string, assignmentId: string): void {
    const lane = this.lanes.get(employeeId) ?? [];
    const index = lane.findIndex((entry) => entry.assignmentId === assignmentId);
    if (index === -1) {
      throw new Error(`Assignment "${assignmentId}" is not queued for employee "${employeeId}".`);
    }
    lane.splice(index, 1);
    this.lanes.set(employeeId, lane);
  }

  /**
   * Re-prioritises an already-queued assignment within its employee's lane.
   * Throws if not present.
   */
  public prioritize(employeeId: string, assignmentId: string, priority: WorkPriority): void {
    const lane = this.lanes.get(employeeId) ?? [];
    const index = lane.findIndex((entry) => entry.assignmentId === assignmentId);
    if (index === -1) {
      throw new Error(`Assignment "${assignmentId}" is not queued for employee "${employeeId}".`);
    }

    const existing = lane[index];
    lane[index] = { assignmentId: existing.assignmentId, priority, sequence: existing.sequence };
    lane.sort((a, b) => {
      const priorityDiff = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
      return priorityDiff !== 0 ? priorityDiff : a.sequence - b.sequence;
    });

    this.lanes.set(employeeId, lane);
  }

  /**
   * Returns true if the given assignment id is queued in an employee's lane.
   */
  public contains(employeeId: string, assignmentId: string): boolean {
    return (this.lanes.get(employeeId) ?? []).some((entry) => entry.assignmentId === assignmentId);
  }

  /**
   * Returns the number of assignments queued for a given employee.
   */
  public size(employeeId: string): number {
    return this.lanes.get(employeeId)?.length ?? 0;
  }

  /**
   * Clears an employee's entire queue lane.
   */
  public clear(employeeId: string): void {
    this.lanes.set(employeeId, []);
  }
}