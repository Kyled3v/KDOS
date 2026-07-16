/**
 * ExecutionEngine
 *
 * Singleton service owning the full Execution lifecycle: submitting a
 * task's work to an EmployeeExecutor, driving its ExecutionPipeline through
 * prepare/validate/execute/finish, and recording the terminal outcome as
 * an ExecutionHistory entry. Employees never call this engine's internal
 * dependencies (e.g. the Model Manager) directly — they only ever submit
 * work through executeTask(). This file contains no AI implementation, no
 * networking, and no concrete Model Manager logic; all model interaction is
 * delegated through the ModelManagerPort injected into each EmployeeExecutor.
 */

import { EmployeeExecutor, EmployeeExecutionInput } from "./EmployeeExecutor";
import { ExecutionPipeline } from "./ExecutionPipeline";
import { ExecutionHistory, ExecutionHistoryStatus } from "./ExecutionHistory";
import { ExecutionRegistry } from "./ExecutionRegistry";
import { ExecutionScheduler } from "./ExecutionScheduler";

export enum ExecutionStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export interface ExecutionProps {
  readonly id: string;
  readonly taskId: string;
  readonly employeeId: string;
  readonly employeeRole: string;
  readonly instructions: string;
  readonly pipeline: ExecutionPipeline;
  readonly status: ExecutionStatus;
  readonly attempt: number;
  readonly startedAt: Date;
  readonly completedAt: Date | null;
  readonly output: string | null;
  readonly failureReason: string | null;
}

const VALID_TRANSITIONS: Readonly<Record<ExecutionStatus, readonly ExecutionStatus[]>> = {
  [ExecutionStatus.PENDING]: [ExecutionStatus.RUNNING, ExecutionStatus.CANCELLED],
  [ExecutionStatus.RUNNING]: [ExecutionStatus.COMPLETED, ExecutionStatus.FAILED, ExecutionStatus.CANCELLED],
  [ExecutionStatus.COMPLETED]: [],
  [ExecutionStatus.FAILED]: [ExecutionStatus.PENDING],
  [ExecutionStatus.CANCELLED]: [],
};

/**
 * Execution
 *
 * Immutable value object representing a single attempt to execute a task's
 * work through an EmployeeExecutor. Owned and mutated exclusively via
 * ExecutionEngine.
 */
export class Execution {
  public readonly id: string;
  public readonly taskId: string;
  public readonly employeeId: string;
  public readonly employeeRole: string;
  public readonly instructions: string;
  public readonly pipeline: ExecutionPipeline;
  public readonly status: ExecutionStatus;
  public readonly attempt: number;
  public readonly startedAt: Date;
  public readonly completedAt: Date | null;
  public readonly output: string | null;
  public readonly failureReason: string | null;

  private constructor(props: ExecutionProps) {
    this.id = props.id;
    this.taskId = props.taskId;
    this.employeeId = props.employeeId;
    this.employeeRole = props.employeeRole;
    this.instructions = props.instructions;
    this.pipeline = props.pipeline;
    this.status = props.status;
    this.attempt = props.attempt;
    this.startedAt = props.startedAt;
    this.completedAt = props.completedAt;
    this.output = props.output;
    this.failureReason = props.failureReason;
  }

  /**
   * Creates a new Execution in PENDING status, attempt 1, with a fresh pipeline.
   */
  public static create(props: {
    id: string;
    taskId: string;
    employeeId: string;
    employeeRole: string;
    instructions: string;
  }): Execution {
    if (!props.id || props.id.trim().length === 0) {
      throw new Error("Execution requires a non-empty id.");
    }
    if (!props.taskId || props.taskId.trim().length === 0) {
      throw new Error("Execution requires a non-empty taskId.");
    }
    if (!props.employeeId || props.employeeId.trim().length === 0) {
      throw new Error("Execution requires a non-empty employeeId.");
    }

    return new Execution({
      id: props.id,
      taskId: props.taskId,
      employeeId: props.employeeId,
      employeeRole: props.employeeRole,
      instructions: props.instructions,
      pipeline: ExecutionPipeline.create(),
      status: ExecutionStatus.PENDING,
      attempt: 1,
      startedAt: new Date(),
      completedAt: null,
      output: null,
      failureReason: null,
    });
  }

  /**
   * Reconstructs an Execution from a stored snapshot.
   */
  public static fromSnapshot(snapshot: ExecutionProps): Execution {
    return new Execution(snapshot);
  }

  /**
   * Returns a new Execution transitioned to the given status.
   * Throws if the transition is not valid from the current status.
   */
  public withStatus(status: ExecutionStatus): Execution {
    const allowed = VALID_TRANSITIONS[this.status];

    if (!allowed.includes(status)) {
      throw new Error(
        `Invalid execution status transition from "${this.status}" to "${status}".`
      );
    }

    return new Execution({
      id: this.id,
      taskId: this.taskId,
      employeeId: this.employeeId,
      employeeRole: this.employeeRole,
      instructions: this.instructions,
      pipeline: this.pipeline,
      status,
      attempt: this.attempt,
      startedAt: this.startedAt,
      completedAt: this.completedAt,
      output: this.output,
      failureReason: this.failureReason,
    });
  }

  /**
   * Returns a new Execution with an updated pipeline.
   */
  public withPipeline(pipeline: ExecutionPipeline): Execution {
    return new Execution({
      id: this.id,
      taskId: this.taskId,
      employeeId: this.employeeId,
      employeeRole: this.employeeRole,
      instructions: this.instructions,
      pipeline,
      status: this.status,
      attempt: this.attempt,
      startedAt: this.startedAt,
      completedAt: this.completedAt,
      output: this.output,
      failureReason: this.failureReason,
    });
  }

  /**
   * Returns a new Execution marked COMPLETED with the given output.
   */
  public withCompletion(output: string): Execution {
    const completed = this.withStatus(ExecutionStatus.COMPLETED);

    return new Execution({
      id: completed.id,
      taskId: completed.taskId,
      employeeId: completed.employeeId,
      employeeRole: completed.employeeRole,
      instructions: completed.instructions,
      pipeline: completed.pipeline,
      status: completed.status,
      attempt: completed.attempt,
      startedAt: completed.startedAt,
      completedAt: new Date(),
      output,
      failureReason: null,
    });
  }

  /**
   * Returns a new Execution marked FAILED with the given failure reason.
   */
  public withFailure(failureReason: string): Execution {
    const failed = this.withStatus(ExecutionStatus.FAILED);

    return new Execution({
      id: failed.id,
      taskId: failed.taskId,
      employeeId: failed.employeeId,
      employeeRole: failed.employeeRole,
      instructions: failed.instructions,
      pipeline: failed.pipeline,
      status: failed.status,
      attempt: failed.attempt,
      startedAt: failed.startedAt,
      completedAt: new Date(),
      output: null,
      failureReason,
    });
  }

  /**
   * Returns a new Execution reset for a retry: PENDING status, incremented
   * attempt count, fresh pipeline, cleared completion fields.
   */
  public withRetry(): Execution {
    const reset = this.withStatus(ExecutionStatus.PENDING);

    return new Execution({
      id: reset.id,
      taskId: reset.taskId,
      employeeId: reset.employeeId,
      employeeRole: reset.employeeRole,
      instructions: reset.instructions,
      pipeline: ExecutionPipeline.create(),
      status: reset.status,
      attempt: reset.attempt + 1,
      startedAt: new Date(),
      completedAt: null,
      output: null,
      failureReason: null,
    });
  }

  /**
   * Returns true if this execution is in a terminal status.
   */
  public isTerminal(): boolean {
    return (
      this.status === ExecutionStatus.COMPLETED ||
      this.status === ExecutionStatus.CANCELLED
    );
  }

  /**
   * Returns the duration in milliseconds between start and completion.
   * Throws if the execution has not yet reached a completed/failed state.
   */
  public duration(): number {
    if (!this.completedAt) {
      throw new Error(`Execution with id "${this.id}" has not completed and has no duration.`);
    }
    return this.completedAt.getTime() - this.startedAt.getTime();
  }

  /**
   * Returns a plain serialisable snapshot of this execution.
   */
  public toSnapshot(): ExecutionProps {
    return {
      id: this.id,
      taskId: this.taskId,
      employeeId: this.employeeId,
      employeeRole: this.employeeRole,
      instructions: this.instructions,
      pipeline: this.pipeline,
      status: this.status,
      attempt: this.attempt,
      startedAt: this.startedAt,
      completedAt: this.completedAt,
      output: this.output,
      failureReason: this.failureReason,
    };
  }
}

export interface ExecuteTaskInput {
  readonly executionId: string;
  readonly taskId: string;
  readonly employeeId: string;
  readonly employeeRole: string;
  readonly instructions: string;
  readonly executor: EmployeeExecutor;
}

export class ExecutionEngine {
  private static instance: ExecutionEngine | null = null;

  private readonly registry: ExecutionRegistry;
  private readonly scheduler: ExecutionScheduler;

  private constructor(registry: ExecutionRegistry, scheduler: ExecutionScheduler) {
    this.registry = registry;
    this.scheduler = scheduler;
  }

  /**
   * Returns the singleton instance of ExecutionEngine.
   * Accepts optional registry/scheduler overrides for dependency injection in tests.
   */
  public static getInstance(registry?: ExecutionRegistry, scheduler?: ExecutionScheduler): ExecutionEngine {
    if (ExecutionEngine.instance === null) {
      ExecutionEngine.instance = new ExecutionEngine(
        registry ?? ExecutionRegistry.getInstance(),
        scheduler ?? new ExecutionScheduler()
      );
    }
    return ExecutionEngine.instance;
  }

  /**
   * Resets the singleton instance. Intended for test isolation only.
   */
  public static resetInstance(): void {
    ExecutionEngine.instance = null;
  }

  /**
   * Runs a task's work through the full execution pipeline: creates the
   * Execution record, schedules it, drives it through prepare -> validate
   * -> execute -> finish via the supplied EmployeeExecutor, and resolves
   * to COMPLETED or FAILED. The executor's ModelManagerPort dependency is
   * the only point of contact with the Model Manager subsystem.
   */
  public executeTask(input: ExecuteTaskInput): Execution {
    let execution = Execution.create({
      id: input.executionId,
      taskId: input.taskId,
      employeeId: input.employeeId,
      employeeRole: input.employeeRole,
      instructions: input.instructions,
    });

    this.registry.register(execution);
    this.scheduler.schedule(execution.id);

    execution = execution.withStatus(ExecutionStatus.RUNNING);
    this.registry.update(execution);
    this.scheduler.unschedule(execution.id);

    const executionInput: EmployeeExecutionInput = {
      taskId: execution.taskId,
      employeeId: execution.employeeId,
      employeeRole: execution.employeeRole,
      instructions: execution.instructions,
    };

    try {
      input.executor.validate(executionInput);
      execution = execution.withPipeline(execution.pipeline.advance());
      this.registry.update(execution);

      const submission = input.executor.prepare(executionInput);
      execution = execution.withPipeline(execution.pipeline.advance());
      this.registry.update(execution);

      const result = input.executor.execute(submission);
      execution = execution.withPipeline(execution.pipeline.advance());
      this.registry.update(execution);

      const finished = input.executor.finish(executionInput, result);

      if (!finished.success) {
        return this.fail(execution.id, "Employee executor reported an unsuccessful result.");
      }

      execution = execution.withPipeline(execution.pipeline.complete());
      this.registry.update(execution);

      return this.complete(execution.id, finished.output);
    } catch (error) {
      const reason = error instanceof Error ? error.message : "Unknown execution error.";
      return this.fail(execution.id, reason);
    }
  }

  /**
   * Transitions an execution to CANCELLED, removing it from the scheduler
   * if still present.
   */
  public cancelExecution(executionId: string): Execution {
    const existing = this.registry.find(executionId);
    const cancelled = existing.withStatus(ExecutionStatus.CANCELLED);
    this.registry.update(cancelled);

    if (this.scheduler.isScheduled(executionId)) {
      this.scheduler.unschedule(executionId);
    }

    return cancelled;
  }

  /**
   * Resets a FAILED execution to PENDING with an incremented attempt count
   * and a fresh pipeline, then re-schedules it. Throws if the execution is
   * not currently FAILED.
   */
  public retry(executionId: string): Execution {
    const existing = this.registry.find(executionId);
    const retried = existing.withRetry();
    this.registry.update(retried);
    this.scheduler.schedule(retried.id);
    return retried;
  }

  /**
   * Retrieves an execution by id. Throws if none exists.
   */
  public getExecution(executionId: string): Execution {
    return this.registry.find(executionId);
  }

  /**
   * Marks an execution COMPLETED with the given output and records a
   * COMPLETED ExecutionHistory entry.
   */
  public complete(executionId: string, output: string): Execution {
    const existing = this.registry.find(executionId);
    const completed = existing.withCompletion(output);
    this.registry.update(completed);

    this.registry.addHistory(
      ExecutionHistory.record({
        executionId: completed.id,
        taskId: completed.taskId,
        employeeId: completed.employeeId,
        duration: completed.duration(),
        status: ExecutionHistoryStatus.COMPLETED,
      })
    );

    return completed;
  }

  /**
   * Marks an execution FAILED with the given failure reason and records a
   * FAILED ExecutionHistory entry.
   */
  public fail(executionId: string, reason: string): Execution {
    const existing = this.registry.find(executionId);
    const failed = existing.withFailure(reason);
    this.registry.update(failed);

    this.registry.addHistory(
      ExecutionHistory.record({
        executionId: failed.id,
        taskId: failed.taskId,
        employeeId: failed.employeeId,
        duration: failed.duration(),
        status: ExecutionHistoryStatus.FAILED,
      })
    );

    return failed;
  }
}