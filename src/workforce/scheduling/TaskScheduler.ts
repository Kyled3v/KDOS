/**
 * TaskScheduler
 *
 * Owns the WorkAssignment lifecycle: creation, queueing (via
 * QueueManager), assignment to a dispatched state, cancellation,
 * re-prioritisation, and retry after failure. Not a singleton;
 * WorkforceRuntime owns a single instance. Map-based storage only.
 * No networking, no external dependencies.
 */

import { WorkAssignment, WorkAssignmentStatus } from "./WorkAssignment";
import { QueueManager, WorkPriority } from "./QueueManager";

export class TaskScheduler {
  private readonly assignments: Map<string, WorkAssignment>;
  private readonly queue: QueueManager;

  /**
   * Constructs a TaskScheduler bound to a specific QueueManager, supplied
   * via dependency injection.
   */
  public constructor(queue: QueueManager) {
    this.assignments = new Map<string, WorkAssignment>();
    this.queue = queue;
  }

  /**
   * Creates a new WorkAssignment and immediately queues it for the target
   * employee at the given priority.
   */
  public queue(input: { assignmentId: string; taskId: string; employeeId: string; priority: WorkPriority }): WorkAssignment {
    if (this.assignments.has(input.assignmentId)) {
      throw new Error(`Work assignment with id "${input.assignmentId}" already exists.`);
    }

    let assignment = WorkAssignment.create({
      id: input.assignmentId,
      taskId: input.taskId,
      employeeId: input.employeeId,
    });

    assignment = assignment.withStatus(WorkAssignmentStatus.QUEUED);
    this.assignments.set(assignment.id, assignment);

    this.queue.enqueue(input.employeeId, assignment.id, input.priority);

    return assignment;
  }

  /**
   * Dequeues the next assignment for an employee and transitions it to
   * DISPATCHED. Throws if the employee's queue lane is empty.
   */
  public assign(employeeId: string): WorkAssignment {
    const assignmentId = this.queue.dequeue(employeeId);
    const existing = this.find(assignmentId);

    const dispatched = existing.withStatus(WorkAssignmentStatus.DISPATCHED);
    this.assignments.set(dispatched.id, dispatched);

    return dispatched;
  }

  /**
   * Cancels a work assignment, removing it from the queue if still queued.
   */
  public cancel(assignmentId: string): WorkAssignment {
    const existing = this.find(assignmentId);

    if (this.queue.contains(existing.employeeId, assignmentId)) {
      this.queue.remove(existing.employeeId, assignmentId);
    }

    const cancelled = existing.withStatus(WorkAssignmentStatus.CANCELLED);
    this.assignments.set(cancelled.id, cancelled);

    return cancelled;
  }

  /**
   * Re-prioritises an already-queued assignment. Throws if the assignment
   * is not currently queued.
   */
  public prioritize(assignmentId: string, priority: WorkPriority): WorkAssignment {
    const existing = this.find(assignmentId);

    if (existing.status !== WorkAssignmentStatus.QUEUED) {
      throw new Error(`Cannot prioritize assignment "${assignmentId}" that is not QUEUED.`);
    }

    this.queue.prioritize(existing.employeeId, assignmentId, priority);
    return existing;
  }

  /**
   * Re-queues a FAILED assignment for another attempt, at the given
   * priority. Throws if the assignment is not currently FAILED.
   */
  public retry(assignmentId: string, priority: WorkPriority): WorkAssignment {
    const existing = this.find(assignmentId);

    const requeued = existing.withStatus(WorkAssignmentStatus.QUEUED);
    this.assignments.set(requeued.id, requeued);

    this.queue.enqueue(requeued.employeeId, requeued.id, priority);

    return requeued;
  }

  /**
   * Marks a DISPATCHED assignment as IN_PROGRESS.
   */
  public start(assignmentId: string): WorkAssignment {
    const existing = this.find(assignmentId);
    const started = existing.withStatus(WorkAssignmentStatus.IN_PROGRESS);
    this.assignments.set(started.id, started);
    return started;
  }

  /**
   * Marks an IN_PROGRESS assignment as COMPLETED.
   */
  public complete(assignmentId: string): WorkAssignment {
    const existing = this.find(assignmentId);
    const completed = existing.withStatus(WorkAssignmentStatus.COMPLETED);
    this.assignments.set(completed.id, completed);
    return completed;
  }

  /**
   * Marks an assignment as FAILED.
   */
  public fail(assignmentId: string): WorkAssignment {
    const existing = this.find(assignmentId);
    const failed = existing.withStatus(WorkAssignmentStatus.FAILED);
    this.assignments.set(failed.id, failed);
    return failed;
  }

  /**
   * Finds a work assignment by id. Throws if none exists.
   */
  public find(assignmentId: string): WorkAssignment {
    const assignment = this.assignments.get(assignmentId);
    if (!assignment) {
      throw new Error(`No work assignment found with id "${assignmentId}".`);
    }
    return assignment;
  }

  /**
   * Lists every work assignment currently tracked, regardless of status.
   */
  public list(): readonly WorkAssignment[] {
    return Array.from(this.assignments.values());
  }

  /**
   * Lists every work assignment for a given employee.
   */
  public listByEmployee(employeeId: string): readonly WorkAssignment[] {
    return this.list().filter((assignment) => assignment.employeeId === employeeId);
  }
}