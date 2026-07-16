/**
 * ExecutionScheduler
 *
 * Maintains an ordered schedule of execution ids awaiting a run pass, and
 * a pause/resume gate over that schedule. Not a singleton — ExecutionEngine
 * owns a single instance, but the class itself is a plain reusable data
 * structure. No timers, no background loops: `run()` is a single
 * caller-driven pass that drains and returns due execution ids.
 */

export enum ExecutionSchedulerState {
  RUNNING = "RUNNING",
  PAUSED = "PAUSED",
}

interface ScheduleEntry {
  readonly executionId: string;
  readonly sequence: number;
}

export class ExecutionScheduler {
  private entries: ScheduleEntry[];
  private sequenceCounter: number;
  private state: ExecutionSchedulerState;

  public constructor() {
    this.entries = [];
    this.sequenceCounter = 0;
    this.state = ExecutionSchedulerState.RUNNING;
  }

  /**
   * Adds an execution id to the schedule, preserving FIFO order.
   * Throws if the execution id is already scheduled.
   */
  public schedule(executionId: string): void {
    if (!executionId || executionId.trim().length === 0) {
      throw new Error("ExecutionScheduler requires a non-empty executionId.");
    }
    if (this.entries.some((entry) => entry.executionId === executionId)) {
      throw new Error(`Execution with id "${executionId}" is already scheduled.`);
    }

    this.entries.push({
      executionId,
      sequence: this.sequenceCounter++,
    });
  }

  /**
   * Drains and returns all currently scheduled execution ids, in FIFO
   * order. Returns an empty array if the scheduler is PAUSED or has no
   * entries. Draining clears the returned entries from the schedule.
   */
  public run(): readonly string[] {
    if (this.state === ExecutionSchedulerState.PAUSED) {
      return [];
    }

    const due = this.entries
      .sort((a, b) => a.sequence - b.sequence)
      .map((entry) => entry.executionId);

    this.entries = [];
    return due;
  }

  /**
   * Pauses the scheduler. While paused, run() returns no entries even if
   * the schedule is non-empty.
   */
  public pause(): void {
    this.state = ExecutionSchedulerState.PAUSED;
  }

  /**
   * Resumes the scheduler, allowing run() to drain scheduled entries again.
   */
  public resume(): void {
    this.state = ExecutionSchedulerState.RUNNING;
  }

  /**
   * Returns the current scheduler state.
   */
  public getState(): ExecutionSchedulerState {
    return this.state;
  }

  /**
   * Returns true if the given execution id is currently scheduled.
   */
  public isScheduled(executionId: string): boolean {
    return this.entries.some((entry) => entry.executionId === executionId);
  }

  /**
   * Removes a specific execution id from the schedule, regardless of
   * position. Throws if the execution id is not present.
   */
  public unschedule(executionId: string): void {
    const index = this.entries.findIndex((entry) => entry.executionId === executionId);
    if (index === -1) {
      throw new Error(`Execution with id "${executionId}" is not scheduled.`);
    }
    this.entries.splice(index, 1);
  }

  /**
   * Returns the number of execution ids currently scheduled.
   */
  public size(): number {
    return this.entries.length;
  }
}