/**
 * WorkQueue.ts
 *
 * Location: src/core/workforce/runtime/WorkQueue.ts
 *
 * WorkQueue holds units of work awaiting execution by
 * WorkforceRuntime. It is a pure FIFO data structure — it performs no
 * execution, no AI calls, and no networking; it only knows the order
 * in which queued work should be handed off.
 */

import type { ExecutionContext } from './ExecutionContext'

/**
 * A single unit of work waiting to be executed.
 */
export interface WorkItem {
  readonly id: string
  readonly taskId: string
  readonly context: ExecutionContext
  readonly enqueuedAt: Date
}

/**
 * WorkQueue
 *
 * Single responsibility: hold WorkItem entries in FIFO order and
 * provide enqueue/dequeue/peek/clear/size operations over them.
 *
 * This class:
 *   - Performs no execution of any kind.
 *   - Performs no AI calls or networking.
 *   - Is dependency-injection ready: it takes no external
 *     dependencies, so it can be constructed freely or supplied
 *     wherever a WorkQueue is required.
 */
export class WorkQueue {
  /**
   * Internal storage, kept as a private array so ordering is fully
   * controlled by this class rather than exposed to callers.
   */
  private readonly items: WorkItem[] = []

  /**
   * Adds a WorkItem to the back of the queue.
   *
   * @param item - The WorkItem to enqueue.
   */
  public enqueue(item: WorkItem): void {
    this.items.push(item)
  }

  /**
   * Removes and returns the WorkItem at the front of the queue.
   *
   * @returns The next WorkItem, or null if the queue is empty.
   */
  public dequeue(): WorkItem | null {
    return this.items.shift() ?? null
  }

  /**
   * Returns the WorkItem at the front of the queue without removing
   * it.
   *
   * @returns The next WorkItem, or null if the queue is empty.
   */
  public peek(): WorkItem | null {
    return this.items.length > 0 ? this.items[0] : null
  }

  /**
   * Removes every WorkItem from the queue.
   */
  public clear(): void {
    this.items.length = 0
  }

  /**
   * Returns the number of WorkItems currently in the queue.
   */
  public size(): number {
    return this.items.length
  }
}