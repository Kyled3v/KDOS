/**
 * TaskManager
 *
 * Singleton service owning the full Task lifecycle: generation (from a
 * Project), queueing, assignment, execution, completion, failure, and
 * cancellation. Employees never create tasks themselves — this service is
 * the sole entry point for task creation and state transitions. Delegates
 * storage to TaskRegistry and ordering to a single internal TaskQueue.
 */

import { Task, TaskPriority, TaskStatus } from "./Task";
import { TaskAssignment } from "./TaskAssignment";
import { TaskExecution } from "./TaskExecution";
import { TaskQueue } from "./TaskQueue";
import { TaskRegistry } from "./TaskRegistry";

export interface CreateTaskInput {
  readonly id: string;
  readonly projectId: string;
  readonly title: string;
  readonly description: string;
  readonly employeeRole: string;
  readonly priority: TaskPriority;
  readonly estimatedHours: number;
}

export interface ProjectTaskBlueprint {
  readonly idSuffix: string;
  readonly title: string;
  readonly description: string;
  readonly employeeRole: string;
  readonly priority: TaskPriority;
  readonly estimatedHours: number;
}

export class TaskManager {
  private static instance: TaskManager | null = null;

  private readonly registry: TaskRegistry;
  private readonly queue: TaskQueue;

  private constructor(registry: TaskRegistry, queue: TaskQueue) {
    this.registry = registry;
    this.queue = queue;
  }

  /**
   * Returns the singleton instance of TaskManager.
   * Accepts optional registry/queue overrides for dependency injection in tests.
   */
  public static getInstance(registry?: TaskRegistry, queue?: TaskQueue): TaskManager {
    if (TaskManager.instance === null) {
      TaskManager.instance = new TaskManager(
        registry ?? TaskRegistry.getInstance(),
        queue ?? new TaskQueue()
      );
    }
    return TaskManager.instance;
  }

  /**
   * Resets the singleton instance. Intended for test isolation only.
   */
  public static resetInstance(): void {
    TaskManager.instance = null;
  }

  /**
   * Creates a new task in NEW status and registers it.
   */
  public createTask(input: CreateTaskInput): Task {
    const task = Task.create({
      id: input.id,
      projectId: input.projectId,
      title: input.title,
      description: input.description,
      employeeRole: input.employeeRole,
      priority: input.priority,
      estimatedHours: input.estimatedHours,
    });

    this.registry.register(task);
    return task;
  }

  /**
   * Generates a batch of tasks for a project from a set of blueprints,
   * each task beginning in NEW status. Task ids are derived from the
   * project id and each blueprint's idSuffix to guarantee uniqueness.
   */
  public generateProjectTasks(projectId: string, blueprints: readonly ProjectTaskBlueprint[]): readonly Task[] {
    if (blueprints.length === 0) {
      throw new Error("generateProjectTasks requires at least one blueprint.");
    }

    return blueprints.map((blueprint) =>
      this.createTask({
        id: `${projectId}-${blueprint.idSuffix}`,
        projectId,
        title: blueprint.title,
        description: blueprint.description,
        employeeRole: blueprint.employeeRole,
        priority: blueprint.priority,
        estimatedHours: blueprint.estimatedHours,
      })
    );
  }

  /**
   * Moves a task from NEW into QUEUED status and adds it to the internal
   * priority queue.
   */
  public queueTask(taskId: string): Task {
    const existing = this.registry.find(taskId);
    const queued = existing.withStatus(TaskStatus.QUEUED);
    this.registry.update(queued);
    this.queue.enqueue(queued.id, queued.priority);
    return queued;
  }

  /**
   * Dequeues the highest-priority task, assigns it to the given employee,
   * transitions it to ASSIGNED, and records a TaskAssignment.
   */
  public assignTask(employeeId: string): Task {
    const taskId = this.queue.dequeue();
    const existing = this.registry.find(taskId);

    const assigned = existing.withStatus(TaskStatus.ASSIGNED);
    this.registry.update(assigned);

    const assignment = TaskAssignment.create({ taskId: assigned.id, employeeId });
    this.registry.addAssignment(assignment);

    return assigned;
  }

  /**
   * Transitions a task to IN_PROGRESS and opens a new TaskExecution record
   * for the assigned employee.
   */
  public startTask(taskId: string): Task {
    const existing = this.registry.find(taskId);
    const latestAssignment = this.registry.latestAssignment(taskId);

    if (!latestAssignment) {
      throw new Error(`Task with id "${taskId}" has no assignment and cannot be started.`);
    }

    const inProgress = existing.withStatus(TaskStatus.IN_PROGRESS);
    this.registry.update(inProgress);

    const execution = TaskExecution.start({
      taskId: inProgress.id,
      employeeId: latestAssignment.employeeId,
    });
    this.registry.addExecution(execution);

    return inProgress;
  }

  /**
   * Moves a task through REVIEW into COMPLETED and closes its open
   * TaskExecution with the given result.
   */
  public completeTask(taskId: string, result: string): Task {
    const existing = this.registry.find(taskId);
    const openExecution = this.registry.latestExecution(taskId);

    if (!openExecution || !openExecution.isOpen()) {
      throw new Error(`Task with id "${taskId}" has no open execution to complete.`);
    }

    const inReview =
      existing.status === TaskStatus.IN_PROGRESS
        ? existing.withStatus(TaskStatus.REVIEW)
        : existing;

    const completed = inReview.withStatus(TaskStatus.COMPLETED);
    this.registry.update(completed);

    const closedExecution = openExecution.withCompletion(result);
    this.registry.updateLatestExecution(closedExecution);

    return completed;
  }

  /**
   * Transitions a task to FAILED and closes its open TaskExecution with
   * the given failure reason as the result.
   */
  public failTask(taskId: string, reason: string): Task {
    const existing = this.registry.find(taskId);
    const openExecution = this.registry.latestExecution(taskId);

    const failed = existing.withStatus(TaskStatus.FAILED);
    this.registry.update(failed);

    if (openExecution && openExecution.isOpen()) {
      const closedExecution = openExecution.withCompletion(`FAILED: ${reason}`);
      this.registry.updateLatestExecution(closedExecution);
    }

    if (this.queue.contains(taskId)) {
      this.queue.removeTask(taskId);
    }

    return failed;
  }

  /**
   * Transitions a task to CANCELLED, removing it from the queue if present.
   */
  public cancelTask(taskId: string): Task {
    const existing = this.registry.find(taskId);
    const cancelled = existing.withStatus(TaskStatus.CANCELLED);
    this.registry.update(cancelled);

    if (this.queue.contains(taskId)) {
      this.queue.removeTask(taskId);
    }

    return cancelled;
  }
}