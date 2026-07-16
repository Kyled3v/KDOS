/**
 * TaskQueue
 *
 * A priority-ordered FIFO queue of task ids awaiting assignment. Not a
 * singleton — TaskManager owns a single instance, but the class itself
 * is a plain reusable data structure. Ordering: higher TaskPriority values
 * are dequeued before lower ones; among equal priorities, insertion order
 * (FIFO) is preserved.
 */

import { TaskPriority } from "./Task";

interface QueueEntry {
  readonly taskId: string;
  readonly priority: TaskPriority;
  readonly sequence: number;
}

const PRIORITY_WEIGHT: Readonly<Record<TaskPriority, number>> = {
  [TaskPriority.CRITICAL]: 4,
  [TaskPriority.HIGH]: 3,
  [TaskPriority.MEDIUM]: 2,
  [TaskPriority.LOW]: 1,
};

export class TaskQueue {
  private entries: QueueEntry[];
  private sequenceCounter: number;

  public constructor() {
    this.entries = [];
    this.sequenceCounter = 0;
  }

  /**
   * Adds a task id to the queue with the given priority.
   * Throws if the task id is already present in the queue.
   */
  public enqueue(taskId: string, priority: TaskPriority): void {
    if (!taskId || taskId.trim().length === 0) {
      throw new Error("TaskQueue requires a non-empty taskId.");
    }
    if (this.entries.some((entry) => entry.taskId === taskId)) {
      throw new Error(`Task with id "${taskId}" is already queued.`);
    }

    this.entries.push({
      taskId,
      priority,
      sequence: this.sequenceCounter++,
    });

    this.entries.sort((a, b) => {
      const priorityDiff = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
      return priorityDiff !== 0 ? priorityDiff : a.sequence - b.sequence;
    });
  }

  /**
   * Removes and returns the highest-priority, earliest-queued task id.
   * Throws if the queue is empty.
   */
  public dequeue(): string {
    const entry = this.entries.shift();
    if (!entry) {
      throw new Error("Cannot dequeue from an empty TaskQueue.");
    }
    return entry.taskId;
  }

  /**
   * Returns the highest-priority, earliest-queued task id without removing it.
   * Throws if the queue is empty.
   */
  public peek(): string {
    const entry = this.entries[0];
    if (!entry) {
      throw new Error("Cannot peek an empty TaskQueue.");
    }
    return entry.taskId;
  }

  /**
   * Removes all entries from the queue.
   */
  public clear(): void {
    this.entries = [];
  }

  /**
   * Returns the number of task ids currently queued.
   */
  public size(): number {
    return this.entries.length;
  }

  /**
   * Returns true if the queue contains no entries.
   */
  public isEmpty(): boolean {
    return this.entries.length === 0;
  }

  /**
   * Returns true if the given task id is currently queued.
   */
  public contains(taskId: string): boolean {
    return this.entries.some((entry) => entry.taskId === taskId);
  }

  /**
   * Removes a specific task id from the queue, regardless of position.
   * Throws if the task id is not present.
   */
  public removeTask(taskId: string): void {
    const index = this.entries.findIndex((entry) => entry.taskId === taskId);
    if (index === -1) {
      throw new Error(`Task with id "${taskId}" is not queued.`);
    }
    this.entries.splice(index, 1);
  }

  /**
   * Returns a snapshot array of currently queued task ids, in dequeue order.
   */
  public toSnapshot(): readonly string[] {
    return this.entries.map((entry) => entry.taskId);
  }
}