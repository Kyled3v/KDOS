/**
 * ExecutionPipeline
 *
 * Represents the ordered sequence of steps an execution passes through as
 * an EmployeeExecutor processes a task: prepare -> validate -> execute ->
 * finish. Immutable value object; advancing the pipeline returns a new
 * instance rather than mutating state in place.
 */

export enum ExecutionPipelineStepName {
  PREPARE = "PREPARE",
  VALIDATE = "VALIDATE",
  EXECUTE = "EXECUTE",
  FINISH = "FINISH",
}

export enum ExecutionPipelineStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export interface ExecutionPipelineStep {
  readonly name: ExecutionPipelineStepName;
  readonly status: ExecutionPipelineStatus;
}

export interface ExecutionPipelineProps {
  readonly steps: readonly ExecutionPipelineStep[];
  readonly currentStep: number;
  readonly status: ExecutionPipelineStatus;
}

const STEP_ORDER: readonly ExecutionPipelineStepName[] = [
  ExecutionPipelineStepName.PREPARE,
  ExecutionPipelineStepName.VALIDATE,
  ExecutionPipelineStepName.EXECUTE,
  ExecutionPipelineStepName.FINISH,
];

export class ExecutionPipeline {
  public readonly steps: readonly ExecutionPipelineStep[];
  public readonly currentStep: number;
  public readonly status: ExecutionPipelineStatus;

  private constructor(props: ExecutionPipelineProps) {
    this.steps = props.steps;
    this.currentStep = props.currentStep;
    this.status = props.status;
  }

  /**
   * Creates a new ExecutionPipeline with the standard four-step sequence,
   * all steps PENDING, positioned before the first step.
   */
  public static create(): ExecutionPipeline {
    const steps: readonly ExecutionPipelineStep[] = STEP_ORDER.map((name) => ({
      name,
      status: ExecutionPipelineStatus.PENDING,
    }));

    return new ExecutionPipeline({
      steps,
      currentStep: -1,
      status: ExecutionPipelineStatus.PENDING,
    });
  }

  /**
   * Reconstructs an ExecutionPipeline from a stored snapshot.
   */
  public static fromSnapshot(snapshot: ExecutionPipelineProps): ExecutionPipeline {
    return new ExecutionPipeline(snapshot);
  }

  /**
   * Returns the step definition currently active, or null if the pipeline
   * has not started or has finished.
   */
  public activeStep(): ExecutionPipelineStep | null {
    if (this.currentStep < 0 || this.currentStep >= this.steps.length) {
      return null;
    }
    return this.steps[this.currentStep];
  }

  /**
   * Advances the pipeline to the next step, marking the current step
   * COMPLETED and the next step IN_PROGRESS. If this is the first
   * advancement, begins at step 0. If all steps are already completed,
   * transitions overall status to COMPLETED.
   * Throws if the pipeline has already FAILED.
   */
  public advance(): ExecutionPipeline {
    if (this.status === ExecutionPipelineStatus.FAILED) {
      throw new Error("Cannot advance a pipeline that has already FAILED.");
    }
    if (this.status === ExecutionPipelineStatus.COMPLETED) {
      throw new Error("Cannot advance a pipeline that has already COMPLETED.");
    }

    const nextIndex = this.currentStep + 1;

    if (nextIndex >= this.steps.length) {
      throw new Error("Cannot advance beyond the final pipeline step.");
    }

    const updatedSteps = this.steps.map((step, index) => {
      if (index === this.currentStep) {
        return { name: step.name, status: ExecutionPipelineStatus.COMPLETED };
      }
      if (index === nextIndex) {
        return { name: step.name, status: ExecutionPipelineStatus.IN_PROGRESS };
      }
      return step;
    });

    const isFinalStep = nextIndex === this.steps.length - 1;

    return new ExecutionPipeline({
      steps: updatedSteps,
      currentStep: nextIndex,
      status: ExecutionPipelineStatus.IN_PROGRESS,
    });
  }

  /**
   * Marks the pipeline as fully COMPLETED, closing out the final step.
   * Throws if the pipeline is not currently positioned on its final step.
   */
  public complete(): ExecutionPipeline {
    if (this.currentStep !== this.steps.length - 1) {
      throw new Error("Cannot complete a pipeline that has not reached its final step.");
    }

    const updatedSteps = this.steps.map((step, index) =>
      index === this.currentStep
        ? { name: step.name, status: ExecutionPipelineStatus.COMPLETED }
        : step
    );

    return new ExecutionPipeline({
      steps: updatedSteps,
      currentStep: this.currentStep,
      status: ExecutionPipelineStatus.COMPLETED,
    });
  }

  /**
   * Marks the pipeline as FAILED at its currently active step (or overall,
   * if no step has started yet).
   */
  public fail(): ExecutionPipeline {
    const updatedSteps = this.steps.map((step, index) =>
      index === this.currentStep
        ? { name: step.name, status: ExecutionPipelineStatus.FAILED }
        : step
    );

    return new ExecutionPipeline({
      steps: updatedSteps,
      currentStep: this.currentStep,
      status: ExecutionPipelineStatus.FAILED,
    });
  }

  /**
   * Returns true if every step in the pipeline has COMPLETED.
   */
  public isComplete(): boolean {
    return this.status === ExecutionPipelineStatus.COMPLETED;
  }

  /**
   * Returns a plain serialisable snapshot of this pipeline.
   */
  public toSnapshot(): ExecutionPipelineProps {
    return {
      steps: this.steps,
      currentStep: this.currentStep,
      status: this.status,
    };
  }
}