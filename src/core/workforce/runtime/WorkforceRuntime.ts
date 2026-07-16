/**
 * WorkforceRuntime.ts
 *
 * Location: src/core/workforce/runtime/WorkforceRuntime.ts
 *
 * WorkforceRuntime is the execution engine of KDOS. Employees never
 * execute work directly — every unit of work flows through this
 * class: queued, dispatched, tracked via an EmployeeSession, and
 * recorded as an ExecutionResult.
 *
 * WorkforceRuntime contains no AI implementation, no API calls, and
 * no networking of its own. The actual work of "doing" a task is
 * delegated to an injected TaskExecutor — this class is a pure
 * orchestration layer around that executor, responsible for queuing,
 * session tracking, timing, and result shaping, not for the work
 * itself.
 */

import type { ExecutionContext } from './ExecutionContext'
import type { EmployeeSession } from './EmployeeSession'
import { EmployeeSessionStatus } from './EmployeeSession'
import { WorkQueue } from './WorkQueue'
import type { WorkItem } from './WorkQueue'
import type { ExecutionResult } from './ExecutionResult'

/**
 * The lifecycle state of the WorkforceRuntime itself.
 */
export enum WorkforceRuntimeStatus {
  STOPPED = 'STOPPED',
  RUNNING = 'RUNNING',
}

/**
 * The outcome of actually carrying out a task, as produced by a
 * TaskExecutor. Deliberately narrower than ExecutionResult — it
 * carries no employeeId, taskId, or timing, since WorkforceRuntime
 * itself owns and attaches all of that.
 */
export interface TaskExecutionOutcome {
  readonly success: boolean
  readonly summary: string
  readonly output: string
  readonly errors?: string[]
  readonly warnings?: string[]
}

/**
 * The pluggable strategy that actually performs a unit of work.
 * WorkforceRuntime depends only on this interface — it contains no
 * knowledge of what an implementation does internally (call an AI
 * model, run a script, defer to a human, etc.).
 */
export interface TaskExecutor {
  /**
   * Carries out the work described by an ExecutionContext.
   */
  run(context: ExecutionContext, taskId: string): Promise<TaskExecutionOutcome>

  /**
   * Checks whether this executor is currently able to carry out
   * work.
   */
  healthCheck(): Promise<boolean>
}

/**
 * WorkforceRuntime
 *
 * Single responsibility: orchestrate the execution of queued work
 * through an injected TaskExecutor, while tracking employee sessions
 * and producing ExecutionResults.
 *
 * This class:
 *   - Is a singleton — use WorkforceRuntime.getInstance() rather than
 *     `new`.
 *   - Contains no AI implementation, no API calls, no Ollama
 *     integration, no database, and no networking.
 *   - Delegates all actual task execution to an injected
 *     TaskExecutor.
 *   - Is dependency-injection ready: TaskExecutor and WorkQueue are
 *     both supplied at construction.
 */
export class WorkforceRuntime {
  private static instance: WorkforceRuntime | null = null

  private readonly executor: TaskExecutor
  private readonly workQueue: WorkQueue
  private readonly sessions = new Map<string, EmployeeSession>()
  private status: WorkforceRuntimeStatus = WorkforceRuntimeStatus.STOPPED
  private sequence = 0

  /**
   * Private constructor — WorkforceRuntime is a singleton and must be
   * created via getInstance(), never directly.
   */
  private constructor(executor: TaskExecutor, workQueue: WorkQueue) {
    this.executor = executor
    this.workQueue = workQueue
  }

  /**
   * Retrieves the singleton WorkforceRuntime instance, creating it on
   * first call with the supplied dependencies.
   *
   * @param executor - The TaskExecutor to delegate work to. Only
   *        used the first time getInstance() is called.
   * @param workQueue - An optional WorkQueue to use instead of a
   *        freshly created one. Only used the first time
   *        getInstance() is called.
   * @returns The singleton WorkforceRuntime instance.
   * @throws Error if called for the first time without an executor.
   */
  public static getInstance(executor?: TaskExecutor, workQueue?: WorkQueue): WorkforceRuntime {
    if (!WorkforceRuntime.instance) {
      if (!executor) {
        throw new Error('WorkforceRuntime: initial call to getInstance() requires a TaskExecutor.')
      }
      WorkforceRuntime.instance = new WorkforceRuntime(executor, workQueue ?? new WorkQueue())
    }
    return WorkforceRuntime.instance
  }

  /**
   * Resets the singleton instance. Intended for test isolation only.
   */
  public static resetInstance(): void {
    WorkforceRuntime.instance = null
  }

  /**
   * Starts the runtime, allowing execute() to be called. Idempotent —
   * calling start() while already running has no additional effect.
   */
  public async start(): Promise<void> {
    this.status = WorkforceRuntimeStatus.RUNNING
  }

  /**
   * Stops the runtime, preventing further execute() calls, ends every
   * active EmployeeSession, and clears the work queue. Idempotent —
   * calling stop() while already stopped has no additional effect.
   */
  public async stop(): Promise<void> {
    for (const session of this.sessions.values()) {
      this.saveSession({ ...session, status: EmployeeSessionStatus.ENDED })
    }
    this.workQueue.clear()
    this.status = WorkforceRuntimeStatus.STOPPED
  }

  /**
   * Adds a unit of work to the queue for later execution.
   *
   * @param taskId - The id of the task to queue.
   * @param context - The ExecutionContext describing the work.
   * @returns The queued WorkItem.
   */
  public queue(taskId: string, context: ExecutionContext): WorkItem {
    const item: WorkItem = Object.freeze({
      id: this.generateId('work'),
      taskId,
      context,
      enqueuedAt: new Date(),
    })

    this.workQueue.enqueue(item)
    return item
  }

  /**
   * Executes a single unit of work through the injected TaskExecutor,
   * creating or updating the employee's EmployeeSession around the
   * call and producing an ExecutionResult regardless of whether the
   * underlying call succeeds or fails.
   *
   * @param taskId - The id of the task to execute.
   * @param context - The ExecutionContext describing the work.
   * @returns The ExecutionResult for this task.
   * @throws Error if the runtime is not currently running.
   */
  public async execute(taskId: string, context: ExecutionContext): Promise<ExecutionResult> {
    if (this.status !== WorkforceRuntimeStatus.RUNNING) {
      throw new Error('WorkforceRuntime: cannot execute work while the runtime is stopped.')
    }

    const session = this.beginSession(context.employeeId, taskId)
    const startedAt = Date.now()

    try {
      const outcome = await this.executor.run(context, taskId)
      const executionTime = Date.now() - startedAt

      this.endSession(session.sessionId, outcome.success)

      return Object.freeze({
        success: outcome.success,
        employeeId: context.employeeId,
        taskId,
        executionTime,
        summary: outcome.summary,
        output: outcome.output,
        errors: outcome.errors ?? [],
        warnings: outcome.warnings ?? [],
      })
    } catch (caught) {
      const executionTime = Date.now() - startedAt
      const message = caught instanceof Error ? caught.message : String(caught)

      this.endSession(session.sessionId, false)

      return Object.freeze({
        success: false,
        employeeId: context.employeeId,
        taskId,
        executionTime,
        summary: `Task "${taskId}" failed.`,
        output: '',
        errors: [message],
        warnings: [],
      })
    }
  }

  /**
   * Cancels an employee's active session, marking it CANCELLED and
   * clearing its active task. Does not remove any already-queued
   * WorkItems for that employee from the WorkQueue.
   *
   * @param sessionId - The id of the EmployeeSession to cancel.
   * @throws Error if no session exists for the given id.
   */
  public cancel(sessionId: string): void {
    const session = this.requireSession(sessionId)

    this.saveSession({
      ...session,
      status: EmployeeSessionStatus.CANCELLED,
      activeTask: null,
      lastActivity: new Date(),
    })
  }

  /**
   * Returns the WorkQueue backing this runtime, for callers that need
   * direct read access to queued work.
   */
  public getQueue(): WorkQueue {
    return this.workQueue
  }

  /**
   * Returns every EmployeeSession currently tracked by the runtime
   * that is not in a terminal state (CANCELLED or ENDED).
   */
  public getActiveSessions(): EmployeeSession[] {
    return [...this.sessions.values()].filter(
      (session) =>
        session.status !== EmployeeSessionStatus.CANCELLED &&
        session.status !== EmployeeSessionStatus.ENDED
    )
  }

  /**
   * Retrieves a single EmployeeSession by id, regardless of status.
   *
   * @param sessionId - The id of the session to retrieve.
   * @returns The EmployeeSession, or undefined if none exists for
   *          the given id.
   */
  public getSession(sessionId: string): EmployeeSession | undefined {
    return this.sessions.get(sessionId)
  }

  /**
   * Checks whether the runtime is running and its underlying
   * TaskExecutor is healthy.
   *
   * @returns true if the runtime is RUNNING and the executor's
   *          healthCheck() resolves true.
   */
  public async healthCheck(): Promise<boolean> {
    if (this.status !== WorkforceRuntimeStatus.RUNNING) {
      return false
    }
    return this.executor.healthCheck()
  }

  /**
   * Creates a new EmployeeSession in WORKING status for the given
   * employee and task, and stores it.
   */
  private beginSession(employeeId: string, taskId: string): EmployeeSession {
    const now = new Date()

    const session: EmployeeSession = Object.freeze({
      sessionId: this.generateId('session'),
      employeeId,
      startedAt: now,
      lastActivity: now,
      activeTask: taskId,
      status: EmployeeSessionStatus.WORKING,
    })

    this.saveSession(session)
    return session
  }

  /**
   * Transitions a session out of WORKING status once its task has
   * finished, based on whether the task succeeded.
   */
  private endSession(sessionId: string, success: boolean): void {
    const session = this.sessions.get(sessionId)
    if (!session) {
      return
    }

    this.saveSession({
      ...session,
      status: success ? EmployeeSessionStatus.IDLE : EmployeeSessionStatus.BLOCKED,
      activeTask: null,
      lastActivity: new Date(),
    })
  }

  /**
   * Persists an EmployeeSession record, replacing any previous
   * version for that session's id.
   */
  private saveSession(session: EmployeeSession): void {
    this.sessions.set(session.sessionId, Object.freeze(session))
  }

  /**
   * Retrieves an EmployeeSession by id or throws if none exists, so
   * calling methods can operate on a guaranteed-defined session.
   */
  private requireSession(sessionId: string): EmployeeSession {
    const session = this.sessions.get(sessionId)
    if (!session) {
      throw new Error(`WorkforceRuntime: no session found for id "${sessionId}".`)
    }
    return session
  }

  /**
   * Generates a deterministic-format, prefixed, collision-resistant
   * identifier using an internal monotonic sequence.
   */
  private generateId(prefix: string): string {
    this.sequence += 1
    return `${prefix}-${Date.now()}-${this.sequence}`
  }
}