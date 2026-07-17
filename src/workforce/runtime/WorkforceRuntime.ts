/**
 * WorkforceRuntime
 *
 * Singleton runtime controlling the employee workforce: starting,
 * stopping, pausing, and resuming employee sessions, and tracking their
 * live status. Delegates work dispatch to TaskScheduler and
 * inter-employee communication to MessageBus. Contains no AI
 * implementation and does not decide *what* work an employee performs —
 * that is the Execution Layer's responsibility, invoked separately by
 * whatever composes a session's work. Map-based storage only. No
 * networking, no external dependencies.
 */

import { EmployeeSession } from "./EmployeeSession";
import { EmployeeStatus } from "./EmployeeStatus";
import { TaskScheduler } from "./TaskScheduler";
import { QueueManager, WorkPriority } from "./QueueManager";
import { MessageBus } from "./MessageBus";
import { MessagePriority } from "./EmployeeMessage";
import { WorkAssignment } from "./WorkAssignment";

export class WorkforceRuntime {
  private static instance: WorkforceRuntime | null = null;

  private readonly sessions: Map<string, EmployeeSession>;
  private readonly sessionsByEmployee: Map<string, string>;
  private readonly scheduler: TaskScheduler;
  private readonly messageBus: MessageBus;

  private sessionCounter: number;

  private constructor(scheduler: TaskScheduler, messageBus: MessageBus) {
    this.sessions = new Map<string, EmployeeSession>();
    this.sessionsByEmployee = new Map<string, string>();
    this.scheduler = scheduler;
    this.messageBus = messageBus;
    this.sessionCounter = 0;
  }

  /**
   * Returns the singleton instance of WorkforceRuntime.
   * Accepts optional dependency overrides for dependency injection in tests.
   */
  public static getInstance(scheduler?: TaskScheduler, messageBus?: MessageBus): WorkforceRuntime {
    if (WorkforceRuntime.instance === null) {
      WorkforceRuntime.instance = new WorkforceRuntime(
        scheduler ?? new TaskScheduler(QueueManager.getInstance()),
        messageBus ?? MessageBus.getInstance()
      );
    }
    return WorkforceRuntime.instance;
  }

  /**
   * Resets the singleton instance. Intended for test isolation only.
   */
  public static resetInstance(): void {
    WorkforceRuntime.instance = null;
  }

  /**
   * Starts a new session for an employee, transitioning it from STARTING
   * to READY. Throws if the employee already has an active session.
   */
  public startEmployee(employeeId: string): EmployeeSession {
    if (this.sessionsByEmployee.has(employeeId)) {
      throw new Error(`Employee "${employeeId}" already has an active session.`);
    }

    const sessionId = `session-${this.sessionCounter++}`;
    let session = EmployeeSession.start({ sessionId, employeeId });
    session = session.withStatus(EmployeeStatus.READY);

    this.sessions.set(session.sessionId, session);
    this.sessionsByEmployee.set(employeeId, session.sessionId);

    return session;
  }

  /**
   * Stops an employee's session, transitioning it to STOPPING then
   * OFFLINE, and removes it from active tracking. Throws if the employee
   * has no active session.
   */
  public stopEmployee(employeeId: string): EmployeeSession {
    const session = this.findByEmployee(employeeId);

    const stopping = session.withStatus(EmployeeStatus.STOPPING);
    const offline = stopping.withStatus(EmployeeStatus.OFFLINE);

    this.sessions.delete(offline.sessionId);
    this.sessionsByEmployee.delete(employeeId);

    return offline;
  }

  /**
   * Pauses a working employee's session, transitioning it to WAITING.
   * Throws if the employee has no active session or is not currently
   * eligible to pause.
   */
  public pauseEmployee(employeeId: string): EmployeeSession {
    const session = this.findByEmployee(employeeId);
    const paused = session.withStatus(EmployeeStatus.WAITING);
    this.sessions.set(paused.sessionId, paused);
    return paused;
  }

  /**
   * Resumes a paused employee's session, transitioning it back to WORKING.
   * Throws if the employee has no active session or is not currently
   * eligible to resume.
   */
  public resumeEmployee(employeeId: string): EmployeeSession {
    const session = this.findByEmployee(employeeId);
    const resumed = session.withStatus(EmployeeStatus.WORKING);
    this.sessions.set(resumed.sessionId, resumed);
    return resumed;
  }

  /**
   * Queues work for an employee via the TaskScheduler.
   */
  public assignWork(input: { assignmentId: string; taskId: string; employeeId: string; priority: WorkPriority }): WorkAssignment {
    return this.scheduler.queue(input);
  }

  /**
   * Dispatches the next queued assignment to an employee, binds it as the
   * session's current task, and transitions the session to WORKING.
   */
  public dispatchNextWork(employeeId: string, model: string): WorkAssignment {
    const session = this.findByEmployee(employeeId);
    const assignment = this.scheduler.assign(employeeId);

    const working = session.withStatus(EmployeeStatus.WORKING).withCurrentTask(assignment.taskId, model);
    this.sessions.set(working.sessionId, working);

    return this.scheduler.start(assignment.id);
  }

  /**
   * Completes an employee's current work assignment, clears the session's
   * current task, and returns the session to READY.
   */
  public completeWork(employeeId: string, assignmentId: string): EmployeeSession {
    this.scheduler.complete(assignmentId);

    const session = this.findByEmployee(employeeId);
    const ready = session.withCurrentTask(null, null).withStatus(EmployeeStatus.READY);
    this.sessions.set(ready.sessionId, ready);

    return ready;
  }

  /**
   * Marks an employee's current work assignment as FAILED and transitions
   * the session to ERROR.
   */
  public failWork(employeeId: string, assignmentId: string): EmployeeSession {
    this.scheduler.fail(assignmentId);

    const session = this.findByEmployee(employeeId);
    const errored = session.withStatus(EmployeeStatus.ERROR);
    this.sessions.set(errored.sessionId, errored);

    return errored;
  }

  /**
   * Marks a working employee as BLOCKED (e.g. awaiting external input or
   * a handoff response).
   */
  public blockEmployee(employeeId: string): EmployeeSession {
    const session = this.findByEmployee(employeeId);
    const blocked = session.withStatus(EmployeeStatus.BLOCKED);
    this.sessions.set(blocked.sessionId, blocked);
    return blocked;
  }

  /**
   * Marks a working employee as handing off its current task to another
   * employee, sending a HIGH priority handoff message through the
   * MessageBus.
   */
  public handoffWork(input: { fromEmployeeId: string; toEmployeeId: string; taskId: string; reason: string }): EmployeeSession {
    const session = this.findByEmployee(input.fromEmployeeId);
    const handoff = session.withStatus(EmployeeStatus.HANDOFF);
    this.sessions.set(handoff.sessionId, handoff);

    this.messageBus.send({
      sender: input.fromEmployeeId,
      receiver: input.toEmployeeId,
      priority: MessagePriority.HIGH,
      payload: { taskId: input.taskId, reason: input.reason },
    });

    return handoff;
  }

  /**
   * Finds the active session for an employee. Throws if none exists.
   */
  public findByEmployee(employeeId: string): EmployeeSession {
    const sessionId = this.sessionsByEmployee.get(employeeId);
    if (!sessionId) {
      throw new Error(`Employee "${employeeId}" has no active session.`);
    }
    return this.find(sessionId);
  }

  /**
   * Finds a session by its session id. Throws if none exists.
   */
  public find(sessionId: string): EmployeeSession {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`No session found with id "${sessionId}".`);
    }
    return session;
  }

  /**
   * Returns true if the given employee currently has an active session.
   */
  public isOnline(employeeId: string): boolean {
    return this.sessionsByEmployee.has(employeeId);
  }

  /**
   * Lists every currently active session.
   */
  public listSessions(): readonly EmployeeSession[] {
    return Array.from(this.sessions.values());
  }

  /**
   * Lists every currently active session in the given status.
   */
  public listSessionsByStatus(status: EmployeeStatus): readonly EmployeeSession[] {
    return this.listSessions().filter((session) => session.status === status);
  }
}