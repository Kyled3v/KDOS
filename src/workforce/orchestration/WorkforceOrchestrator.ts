/**
 * WorkforceOrchestrator
 *
 * Singleton top-level coordinator that composes WorkforceRuntime with
 * the platform subsystems it depends on (Execution Engine, Workflow
 * Engine, Knowledge Engine, Plugin Manager, License Manager), all
 * received through a RuntimeContext dependency-injection boundary. The
 * orchestrator implements none of these subsystems itself — it verifies
 * license entitlement before starting an employee, and coordinates the
 * runtime, scheduler, and message bus into single higher-level
 * operations (onboarding an employee, running a dispatch cycle).
 */

import { WorkforceRuntime } from "./WorkforceRuntime";
import { RuntimeContext, LicenseManagerCapability } from "./RuntimeContext";
import { EmployeeSession } from "./EmployeeSession";
import { WorkAssignment } from "./WorkAssignment";
import { WorkPriority } from "./QueueManager";

/**
 * LicenseGate
 *
 * Dependency-injection boundary describing what WorkforceOrchestrator
 * needs from the License Manager to decide whether an employee may be
 * started. The concrete implementation is owned and supplied by the
 * License Manager, not by this file.
 */
export interface LicenseGate {
  isEmployeeLicensed(employeeId: string): boolean;
}

export interface OnboardEmployeeInput {
  readonly employeeId: string;
}

export interface DispatchCycleResult {
  readonly employeeId: string;
  readonly assignment: WorkAssignment | null;
}

export class WorkforceOrchestrator {
  private static instance: WorkforceOrchestrator | null = null;

  private readonly runtime: WorkforceRuntime;
  private readonly context: RuntimeContext;
  private readonly licenseGate: LicenseGate;

  private constructor(runtime: WorkforceRuntime, context: RuntimeContext, licenseGate: LicenseGate) {
    this.runtime = runtime;
    this.context = context;
    this.licenseGate = licenseGate;
  }

  /**
   * Returns the singleton instance of WorkforceOrchestrator.
   * Accepts optional dependency overrides for dependency injection in tests.
   */
  public static getInstance(
    context: RuntimeContext,
    licenseGate?: LicenseGate,
    runtime?: WorkforceRuntime
  ): WorkforceOrchestrator {
    if (WorkforceOrchestrator.instance === null) {
      WorkforceOrchestrator.instance = new WorkforceOrchestrator(
        runtime ?? WorkforceRuntime.getInstance(),
        context,
        licenseGate ?? { isEmployeeLicensed: () => true }
      );
    }
    return WorkforceOrchestrator.instance;
  }

  /**
   * Resets the singleton instance. Intended for test isolation only.
   */
  public static resetInstance(): void {
    WorkforceOrchestrator.instance = null;
  }

  /**
   * Onboards an employee into the runtime: verifies license entitlement
   * via the injected LicenseGate, then starts the employee's session.
   * Throws if the employee is not licensed.
   */
  public onboardEmployee(input: OnboardEmployeeInput): EmployeeSession {
    if (!this.licenseGate.isEmployeeLicensed(input.employeeId)) {
      throw new Error(`Employee "${input.employeeId}" is not licensed for activation.`);
    }

    return this.runtime.startEmployee(input.employeeId);
  }

  /**
   * Offboards an employee from the runtime, stopping their session.
   */
  public offboardEmployee(employeeId: string): EmployeeSession {
    return this.runtime.stopEmployee(employeeId);
  }

  /**
   * Pauses an employee's session.
   */
  public pauseEmployee(employeeId: string): EmployeeSession {
    return this.runtime.pauseEmployee(employeeId);
  }

  /**
   * Resumes a paused employee's session.
   */
  public resumeEmployee(employeeId: string): EmployeeSession {
    return this.runtime.resumeEmployee(employeeId);
  }

  /**
   * Routes a piece of work to an employee by queueing it in the runtime.
   */
  public routeWork(input: { assignmentId: string; taskId: string; employeeId: string; priority: WorkPriority }): WorkAssignment {
    return this.runtime.assignWork(input);
  }

  /**
   * Runs a single dispatch cycle for an employee: if the employee is
   * online and has queued work, dispatches the next assignment using the
   * given model; otherwise returns a null assignment. This method
   * performs no AI work itself — invoking the assigned model against the
   * dispatched assignment is the Execution Layer's responsibility,
   * reachable through this.context.executionEngine by the caller.
   */
  public runDispatchCycle(employeeId: string, model: string): DispatchCycleResult {
    if (!this.runtime.isOnline(employeeId)) {
      return { employeeId, assignment: null };
    }

    try {
      const assignment = this.runtime.dispatchNextWork(employeeId, model);
      return { employeeId, assignment };
    } catch {
      return { employeeId, assignment: null };
    }
  }

  /**
   * Coordinates a handoff of work from one employee to another.
   */
  public coordinateHandoff(input: { fromEmployeeId: string; toEmployeeId: string; taskId: string; reason: string }): EmployeeSession {
    return this.runtime.handoffWork(input);
  }

  /**
   * Returns the RuntimeContext this orchestrator was composed with, for
   * callers that need direct access to a specific subsystem capability
   * (e.g. the Execution Engine, to actually run dispatched work).
   */
  public getContext(): RuntimeContext {
    return this.context;
  }
}