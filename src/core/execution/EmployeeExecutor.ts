/**
 * EmployeeExecutor
 *
 * Represents the boundary through which an AI employee's work is prepared,
 * validated, executed, and finished. An EmployeeExecutor NEVER calls an AI
 * model or Ollama directly — it delegates the actual execution step to a
 * ModelManagerPort, an injected dependency representing the contract with
 * the (separately owned) Model Manager subsystem. This file contains no AI
 * implementation, no networking, and no concrete Model Manager logic.
 */

/**
 * ModelManagerPort
 *
 * Dependency-injection boundary describing what the Execution Layer needs
 * from the Model Manager subsystem. The concrete implementation is owned
 * and supplied by the Model Manager, not by this layer.
 */
export interface ModelManagerPort {
  /**
   * Submits prepared work for a task/employee pair and returns a result
   * payload once execution completes. Implementation lives outside the
   * Execution Layer.
   */
  submit(input: ModelManagerSubmission): ModelManagerResult;
}

export interface ModelManagerSubmission {
  readonly taskId: string;
  readonly employeeId: string;
  readonly employeeRole: string;
  readonly instructions: string;
}

export interface ModelManagerResult {
  readonly success: boolean;
  readonly output: string;
}

export interface EmployeeExecutionInput {
  readonly taskId: string;
  readonly employeeId: string;
  readonly employeeRole: string;
  readonly instructions: string;
}

export interface EmployeeExecutionOutput {
  readonly taskId: string;
  readonly employeeId: string;
  readonly success: boolean;
  readonly output: string;
}

export class EmployeeExecutor {
  private readonly modelManager: ModelManagerPort;

  /**
   * Constructs an EmployeeExecutor bound to a specific ModelManagerPort
   * implementation, supplied via dependency injection.
   */
  public constructor(modelManager: ModelManagerPort) {
    this.modelManager = modelManager;
  }

  /**
   * Validates that the execution input is well-formed before any work begins.
   * Throws if any required field is missing or empty.
   */
  public validate(input: EmployeeExecutionInput): void {
    if (!input.taskId || input.taskId.trim().length === 0) {
      throw new Error("EmployeeExecutor requires a non-empty taskId.");
    }
    if (!input.employeeId || input.employeeId.trim().length === 0) {
      throw new Error("EmployeeExecutor requires a non-empty employeeId.");
    }
    if (!input.employeeRole || input.employeeRole.trim().length === 0) {
      throw new Error("EmployeeExecutor requires a non-empty employeeRole.");
    }
    if (!input.instructions || input.instructions.trim().length === 0) {
      throw new Error("EmployeeExecutor requires non-empty instructions.");
    }
  }

  /**
   * Prepares a ModelManagerSubmission from validated execution input.
   * Performs no AI work itself — only shapes the payload boundary.
   */
  public prepare(input: EmployeeExecutionInput): ModelManagerSubmission {
    return {
      taskId: input.taskId,
      employeeId: input.employeeId,
      employeeRole: input.employeeRole,
      instructions: input.instructions,
    };
  }

  /**
   * Executes prepared work by delegating to the injected ModelManagerPort.
   * This is the only method that crosses into Model Manager territory, and
   * it does so purely through the injected interface.
   */
  public execute(submission: ModelManagerSubmission): ModelManagerResult {
    return this.modelManager.submit(submission);
  }

  /**
   * Finalises a ModelManagerResult into an EmployeeExecutionOutput bound
   * back to the originating task and employee.
   */
  public finish(
    input: EmployeeExecutionInput,
    result: ModelManagerResult
  ): EmployeeExecutionOutput {
    return {
      taskId: input.taskId,
      employeeId: input.employeeId,
      success: result.success,
      output: result.output,
    };
  }
}