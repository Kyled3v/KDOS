/**
 * WorkflowEngine.ts
 *
 * Location: src/core/workflow/WorkflowEngine.ts
 *
 * WorkflowEngine controls how work moves through KDOS. Employees
 * never call each other directly — WorkflowEngine alone decides,
 * based on a Workflow's step dependencies and conditions, who works
 * next. It executes nothing itself; it only tracks WorkflowExecution
 * state and resolves step eligibility.
 *
 * WorkflowEngine contains no AI, no database, and no networking — it
 * is a pure orchestration layer over Workflow definitions held in a
 * WorkflowRegistry.
 */

import type { Workflow } from './Workflow'
import type { WorkflowStep, WorkflowStepCondition } from './WorkflowStep'
import type { WorkflowExecution } from './WorkflowExecution'
import { WorkflowExecutionStatus } from './WorkflowExecution'
import { WorkflowRegistry } from './WorkflowRegistry'

/**
 * WorkflowEngine
 *
 * Single responsibility: start, advance, pause, resume, and cancel
 * WorkflowExecutions, resolving which WorkflowStep should run next
 * based on step dependencies and conditions.
 *
 * This class:
 *   - Is a singleton — use WorkflowEngine.getInstance() rather than
 *     `new`.
 *   - Performs no execution of any step's actual work — it only
 *     decides which step is next; carrying it out is the
 *     responsibility of whatever calls this engine (e.g.
 *     WorkforceRuntime).
 *   - Contains no AI calls, no database access, and no networking.
 *   - Is dependency-injection ready: WorkflowRegistry is supplied at
 *     construction.
 */
export class WorkflowEngine {
  private static instance: WorkflowEngine | null = null

  private readonly registry: WorkflowRegistry
  private readonly executions = new Map<string, WorkflowExecution>()

  /**
   * Internal record of which step ids have completed for each
   * execution. Kept separate from the public WorkflowExecution shape
   * so that shape stays exactly as specified.
   */
  private readonly completedSteps = new Map<string, Set<string>>()

  /**
   * Internal record of the context each execution was started with,
   * used to evaluate WorkflowStepConditions. Kept separate from the
   * public WorkflowExecution shape for the same reason as
   * completedSteps.
   */
  private readonly executionContexts = new Map<string, Record<string, unknown>>()

  private sequence = 0

  /**
   * Private constructor — WorkflowEngine is a singleton and must be
   * created via getInstance(), never directly.
   */
  private constructor(registry: WorkflowRegistry) {
    this.registry = registry
  }

  /**
   * Retrieves the singleton WorkflowEngine instance, creating it on
   * first call with the supplied WorkflowRegistry.
   *
   * @param registry - An optional WorkflowRegistry to use instead of
   *        a freshly created one. Only used the first time
   *        getInstance() is called.
   * @returns The singleton WorkflowEngine instance.
   */
  public static getInstance(registry?: WorkflowRegistry): WorkflowEngine {
    if (!WorkflowEngine.instance) {
      WorkflowEngine.instance = new WorkflowEngine(registry ?? new WorkflowRegistry())
    }
    return WorkflowEngine.instance
  }

  /**
   * Resets the singleton instance. Intended for test isolation only.
   */
  public static resetInstance(): void {
    WorkflowEngine.instance = null
  }

  /**
   * Starts a new execution of a registered Workflow, transitioning it
   * to RUNNING and resolving its first eligible step.
   *
   * @param workflowId - The id of the Workflow to run.
   * @param context - Contextual data used to evaluate step
   *        conditions for this execution.
   * @returns The newly created WorkflowExecution.
   * @throws Error if no enabled Workflow exists for the given id.
   */
  public startWorkflow(
    workflowId: string,
    context: Record<string, unknown> = {}
  ): WorkflowExecution {
    const workflow = this.requireEnabledWorkflow(workflowId)
    const now = new Date()
    const executionId = this.generateId('execution')

    this.completedSteps.set(executionId, new Set())
    this.executionContexts.set(executionId, context)

    const execution: WorkflowExecution = Object.freeze({
      executionId,
      workflowId: workflow.id,
      status: WorkflowExecutionStatus.RUNNING,
      currentStep: null,
      startedAt: now,
      completedAt: null,
    })

    this.saveExecution(execution)
    this.advance(executionId)

    return this.requireExecution(executionId)
  }

  /**
   * Resolves and returns the next eligible WorkflowStep for a running
   * execution, without altering execution state. A step is eligible
   * when it has not yet completed, every step in its `dependsOn` list
   * has completed, and every one of its conditions is satisfied
   * against the execution's context.
   *
   * @param executionId - The id of the WorkflowExecution to inspect.
   * @returns The next eligible WorkflowStep, or null if none is
   *          currently eligible (including when the workflow is
   *          already complete).
   * @throws Error if no execution exists for the given id.
   */
  public nextStep(executionId: string): WorkflowStep | null {
    const execution = this.requireExecution(executionId)
    const workflow = this.requireWorkflow(execution.workflowId)
    const completed = this.completedSteps.get(executionId) ?? new Set<string>()
    const context = this.executionContexts.get(executionId) ?? {}

    return this.findEligibleStep(workflow, completed, context)
  }

  /**
   * Marks a step as completed for a running execution, then resolves
   * and moves to the next eligible step. If every step in the
   * workflow has completed, the execution transitions to COMPLETED.
   *
   * @param executionId - The id of the WorkflowExecution to advance.
   * @param stepId - The id of the WorkflowStep that has completed.
   * @returns The updated WorkflowExecution.
   * @throws Error if no execution exists for the given id, if the
   *         execution is not RUNNING, or if the step id does not
   *         belong to the execution's workflow.
   */
  public completeStep(executionId: string, stepId: string): WorkflowExecution {
    const execution = this.requireExecution(executionId)
    const workflow = this.requireWorkflow(execution.workflowId)

    if (execution.status !== WorkflowExecutionStatus.RUNNING) {
      throw new Error(
        `WorkflowEngine: cannot complete a step on execution "${executionId}" while it is "${execution.status}".`
      )
    }

    if (!workflow.steps.some((step) => step.id === stepId)) {
      throw new Error(
        `WorkflowEngine: step "${stepId}" does not belong to workflow "${workflow.id}".`
      )
    }

    const completed = this.completedSteps.get(executionId) ?? new Set<string>()
    completed.add(stepId)
    this.completedSteps.set(executionId, completed)

    this.advance(executionId)

    return this.requireExecution(executionId)
  }

  /**
   * Cancels a workflow execution, transitioning it to CANCELLED and
   * recording its completion time. Not reversible.
   *
   * @param executionId - The id of the WorkflowExecution to cancel.
   * @returns The updated WorkflowExecution.
   * @throws Error if no execution exists for the given id.
   */
  public cancelWorkflow(executionId: string): WorkflowExecution {
    const execution = this.requireExecution(executionId)

    const updated: WorkflowExecution = Object.freeze({
      ...execution,
      status: WorkflowExecutionStatus.CANCELLED,
      completedAt: new Date(),
    })

    this.saveExecution(updated)
    return updated
  }

  /**
   * Pauses a running workflow execution.
   *
   * @param executionId - The id of the WorkflowExecution to pause.
   * @returns The updated WorkflowExecution.
   * @throws Error if no execution exists for the given id, or if it
   *         is not currently RUNNING.
   */
  public pauseWorkflow(executionId: string): WorkflowExecution {
    const execution = this.requireExecution(executionId)

    if (execution.status !== WorkflowExecutionStatus.RUNNING) {
      throw new Error(
        `WorkflowEngine: cannot pause execution "${executionId}" while it is "${execution.status}".`
      )
    }

    const updated: WorkflowExecution = Object.freeze({
      ...execution,
      status: WorkflowExecutionStatus.PAUSED,
    })

    this.saveExecution(updated)
    return updated
  }

  /**
   * Resumes a paused workflow execution.
   *
   * @param executionId - The id of the WorkflowExecution to resume.
   * @returns The updated WorkflowExecution.
   * @throws Error if no execution exists for the given id, or if it
   *         is not currently PAUSED.
   */
  public resumeWorkflow(executionId: string): WorkflowExecution {
    const execution = this.requireExecution(executionId)

    if (execution.status !== WorkflowExecutionStatus.PAUSED) {
      throw new Error(
        `WorkflowEngine: cannot resume execution "${executionId}" while it is "${execution.status}".`
      )
    }

    const updated: WorkflowExecution = Object.freeze({
      ...execution,
      status: WorkflowExecutionStatus.RUNNING,
    })

    this.saveExecution(updated)
    return updated
  }

  /**
   * Retrieves a single WorkflowExecution by id.
   *
   * @param executionId - The id of the WorkflowExecution to retrieve.
   * @returns The WorkflowExecution, or undefined if none exists for
   *          the given id.
   */
  public getExecution(executionId: string): WorkflowExecution | undefined {
    return this.executions.get(executionId)
  }

  /**
   * Returns every WorkflowExecution not currently in a terminal state
   * (COMPLETED, FAILED, or CANCELLED).
   */
  public getActiveWorkflows(): WorkflowExecution[] {
    return [...this.executions.values()].filter(
      (execution) =>
        execution.status !== WorkflowExecutionStatus.COMPLETED &&
        execution.status !== WorkflowExecutionStatus.FAILED &&
        execution.status !== WorkflowExecutionStatus.CANCELLED
    )
  }

  /**
   * Recomputes and applies the current step for a running execution:
   * finds the next eligible step and sets it as currentStep, or, if
   * every step has completed, transitions the execution to
   * COMPLETED.
   */
  private advance(executionId: string): void {
    const execution = this.requireExecution(executionId)

    if (execution.status !== WorkflowExecutionStatus.RUNNING) {
      return
    }

    const workflow = this.requireWorkflow(execution.workflowId)
    const completed = this.completedSteps.get(executionId) ?? new Set<string>()

    if (completed.size >= workflow.steps.length) {
      this.saveExecution(
        Object.freeze({
          ...execution,
          status: WorkflowExecutionStatus.COMPLETED,
          currentStep: null,
          completedAt: new Date(),
        })
      )
      return
    }

    const context = this.executionContexts.get(executionId) ?? {}
    const next = this.findEligibleStep(workflow, completed, context)

    this.saveExecution(
      Object.freeze({
        ...execution,
        currentStep: next?.id ?? null,
      })
    )
  }

  /**
   * Finds the first step, in workflow-defined order, that has not yet
   * completed, whose dependencies have all completed, and whose
   * conditions are all satisfied.
   */
  private findEligibleStep(
    workflow: Workflow,
    completed: Set<string>,
    context: Record<string, unknown>
  ): WorkflowStep | null {
    for (const step of workflow.steps) {
      if (completed.has(step.id)) {
        continue
      }

      const dependenciesMet = step.dependsOn.every((depId) => completed.has(depId))
      if (!dependenciesMet) {
        continue
      }

      if (this.conditionsSatisfied(step.conditions, context)) {
        return step
      }
    }

    return null
  }

  /**
   * Evaluates whether every condition on a step holds against the
   * execution's context.
   */
  private conditionsSatisfied(
    conditions: WorkflowStepCondition[],
    context: Record<string, unknown>
  ): boolean {
    return conditions.every((condition) => this.evaluateCondition(condition, context))
  }

  /**
   * Evaluates a single WorkflowStepCondition against the execution's
   * context.
   */
  private evaluateCondition(
    condition: WorkflowStepCondition,
    context: Record<string, unknown>
  ): boolean {
    const actual = context[condition.field]

    switch (condition.operator) {
      case 'equals':
        return actual === condition.value
      case 'notEquals':
        return actual !== condition.value
      case 'exists':
        return actual !== undefined && actual !== null
      case 'notExists':
        return actual === undefined || actual === null
      default:
        return false
    }
  }

  /**
   * Persists a WorkflowExecution record, replacing any previous
   * version for that execution's id.
   */
  private saveExecution(execution: WorkflowExecution): void {
    this.executions.set(execution.executionId, execution)
  }

  /**
   * Retrieves a WorkflowExecution by id or throws if none exists, so
   * calling methods can operate on a guaranteed-defined execution.
   */
  private requireExecution(executionId: string): WorkflowExecution {
    const execution = this.executions.get(executionId)
    if (!execution) {
      throw new Error(`WorkflowEngine: no execution found for id "${executionId}".`)
    }
    return execution
  }

  /**
   * Retrieves a Workflow by id from the registry or throws if none
   * exists, so calling methods can operate on a guaranteed-defined
   * Workflow.
   */
  private requireWorkflow(workflowId: string): Workflow {
    const workflow = this.registry.find(workflowId)
    if (!workflow) {
      throw new Error(`WorkflowEngine: no workflow registered for id "${workflowId}".`)
    }
    return workflow
  }

  /**
   * Retrieves an enabled Workflow by id from the registry or throws
   * if none exists or it is disabled.
   */
  private requireEnabledWorkflow(workflowId: string): Workflow {
    const workflow = this.requireWorkflow(workflowId)
    if (!workflow.enabled) {
      throw new Error(`WorkflowEngine: workflow "${workflowId}" is disabled.`)
    }
    return workflow
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