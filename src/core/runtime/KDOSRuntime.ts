/**
 * KDOSRuntime.ts
 *
 * Location: src/core/runtime/KDOSRuntime.ts
 *
 * KDOSRuntime is the entry point of KDOS. It owns one instance of
 * every subsystem already built and wires them together into a
 * single pipeline that turns a raw request string into a final
 * response.
 *
 * KDOSRuntime introduces no new reasoning, execution, or storage
 * logic of its own — every step below delegates entirely to the
 * existing component responsible for it. Its only job is
 * orchestration: calling the right method on the right subsystem, in
 * the right order, and publishing a SystemEvent through EventBus at
 * each stage so other subsystems can observe progress without this
 * class needing to know who's listening.
 *
 * Pipeline:
 *   request
 *     -> ExecutiveAssistant.evaluate()
 *     -> WorkforceCoordinator.prepare()
 *     -> TaskQueue.enqueue()
 *     -> WorkflowEngine.createWorkflow()
 *     -> ExecutionEngine.executeAll()
 *     -> MemorySynchronizer.storeBatch()
 *     -> final response
 *
 * NOTE ON IMPORTS:
 * Every dependency below is imported from its existing location
 * rather than redefined here. Adjust the paths if the actual module
 * locations differ:
 *   - ExecutiveAssistant, ExecutivePackage: '../executive/ExecutiveAssistant'
 *   - WorkforceCoordinator, WorkforceExecutionPlan: '../workforce/orchestrator/WorkforceCoordinator'
 *   - TaskQueue: '../workforce/tasks/TaskQueue'
 *   - ExecutionEngine, ExecutionResult: '../workforce/execution/ExecutionEngine'
 *   - WorkflowEngine, Workflow: '../workforce/workflow/WorkflowEngine'
 *   - MemorySynchronizer: '../workforce/memory/MemorySynchronizer'
 *   - EventBus, SystemEvent: '../events/EventBus'
 *   - AIGateway: '../workforce/gateway/AIGateway'
 */

import { ExecutiveAssistant } from '../executive/ExecutiveAssistant'
import type { ExecutivePackage } from '../executive/ExecutiveAssistant'
import { WorkforceCoordinator } from '../workforce/orchestrator/WorkforceCoordinator'
import type { WorkforceExecutionPlan } from '../workforce/orchestrator/WorkforceCoordinator'
import { TaskQueue } from '../workforce/tasks/TaskQueue'
import { ExecutionEngine } from '../workforce/execution/ExecutionEngine'
import type { ExecutionResult } from '../workforce/execution/ExecutionEngine'
import { WorkflowEngine } from '../workforce/workflow/WorkflowEngine'
import type { Workflow } from '../workforce/workflow/WorkflowEngine'
import { MemorySynchronizer } from '../workforce/memory/MemorySynchronizer'
import type { MemoryRecord } from '../workforce/memory/MemorySynchronizer'
import { EventBus } from '../events/EventBus'
import type { SystemEvent } from '../events/EventBus'
import { AIGateway } from '../workforce/gateway/AIGateway'

/**
 * KDOSRuntime
 *
 * Single responsibility: connect every existing KDOS subsystem into
 * one end-to-end pipeline and expose it as a single `execute` call.
 *
 * This class:
 *   - Creates no new business logic — every pipeline step is a direct
 *     delegation to an already-built component.
 *   - Owns its subsystems via constructor-injected instances, so
 *     every dependency can be swapped or mocked from outside.
 *   - Publishes a SystemEvent through EventBus at each pipeline
 *     stage, so subsystems that want to observe runtime progress can
 *     subscribe without KDOSRuntime depending on them directly.
 */
export class KDOSRuntime {
  private readonly executiveAssistant: ExecutiveAssistant
  private readonly workforceCoordinator: WorkforceCoordinator
  private readonly taskQueue: TaskQueue
  private readonly executionEngine: ExecutionEngine
  private readonly workflowEngine: WorkflowEngine
  private readonly memorySynchronizer: MemorySynchronizer
  private readonly eventBus: EventBus
  private readonly aiGateway: AIGateway

  public constructor(
    executiveAssistant: ExecutiveAssistant,
    workforceCoordinator: WorkforceCoordinator,
    taskQueue: TaskQueue,
    executionEngine: ExecutionEngine,
    workflowEngine: WorkflowEngine,
    memorySynchronizer: MemorySynchronizer,
    eventBus: EventBus,
    aiGateway: AIGateway
  ) {
    this.executiveAssistant = executiveAssistant
    this.workforceCoordinator = workforceCoordinator
    this.taskQueue = taskQueue
    this.executionEngine = executionEngine
    this.workflowEngine = workflowEngine
    this.memorySynchronizer = memorySynchronizer
    this.eventBus = eventBus
    this.aiGateway = aiGateway
  }

  /**
   * Runs a raw request string through the full KDOS pipeline and
   * returns the final response.
   *
   * @param request - The raw incoming request to process.
   * @returns A final response string summarizing the outcome of the
   *          request's execution.
   */
  public async execute(request: string): Promise<string> {
    const executivePackage = await this.think(request)
    const workforcePlan = this.coordinateWorkforce(executivePackage)
    this.queueWork(workforcePlan)
    const workflow = this.beginWorkflow(executivePackage)
    const results = await this.runExecution()
    this.recordOutcomes(workflow, results)

    return this.buildResponse(workflow, results)
  }

  /**
   * Runs the incoming request through ExecutiveAssistant to produce
   * an ExecutivePackage, and publishes "ExecutionPlanCreated".
   */
  private async think(request: string): Promise<ExecutivePackage> {
    const executivePackage = await this.executiveAssistant.evaluate(request)

    await this.emit('ExecutionPlanCreated', {
      executionPlanId: executivePackage.executionPlan.id,
      totalUnits: executivePackage.executionPlan.totalUnits,
    })

    return executivePackage
  }

  /**
   * Runs the ExecutivePackage through WorkforceCoordinator to prepare
   * a WorkforceExecutionPlan, and publishes "WorkforcePrepared".
   */
  private coordinateWorkforce(executivePackage: ExecutivePackage): WorkforceExecutionPlan {
    const workforcePlan = this.workforceCoordinator.prepare(executivePackage)

    void this.emit('WorkforcePrepared', {
      workforcePlanId: workforcePlan.id,
      totalEmployees: workforcePlan.totalEmployees,
      totalTasks: workforcePlan.totalTasks,
    })

    return workforcePlan
  }

  /**
   * Enqueues the prepared workforce plan onto TaskQueue, and
   * publishes "TaskQueued".
   */
  private queueWork(workforcePlan: WorkforceExecutionPlan): void {
    this.taskQueue.enqueue(workforcePlan)

    void this.emit('TaskQueued', {
      workforcePlanId: workforcePlan.id,
      queuedCount: this.taskQueue.size(),
    })
  }

  /**
   * Creates and starts a Workflow for this request's ExecutionPlan
   * via WorkflowEngine.
   */
  private beginWorkflow(executivePackage: ExecutivePackage): Workflow {
    const workflow = this.workflowEngine.createWorkflow(executivePackage.executionPlan)
    this.workflowEngine.start(workflow.id)
    return workflow
  }

  /**
   * Drains TaskQueue via ExecutionEngine.executeAll(), and publishes
   * "TaskCompleted" for each successful result and "TaskFailed" for
   * each unsuccessful one.
   */
  private async runExecution(): Promise<ExecutionResult[]> {
    const results = await this.executionEngine.executeAll()

    for (const result of results) {
      void this.emit(result.success ? 'TaskCompleted' : 'TaskFailed', {
        taskId: result.taskId,
        employeeId: result.employeeId,
        success: result.success,
      })
    }

    return results
  }

  /**
   * Feeds each ExecutionResult back into WorkflowEngine to update
   * workflow state, then stores the full batch via
   * MemorySynchronizer. Publishes "WorkflowCompleted" once workflow
   * state has settled.
   */
  private recordOutcomes(workflow: Workflow, results: ExecutionResult[]): void {
    for (const result of results) {
      if (result.success) {
        this.workflowEngine.completeTask(workflow.id, result)
      } else {
        this.workflowEngine.failTask(workflow.id, result)
      }
    }

    const settledWorkflow = this.workflowEngine.getWorkflow(workflow.id) ?? workflow

    this.memorySynchronizer.storeBatch(results, settledWorkflow)

    void this.emit('WorkflowCompleted', {
      workflowId: settledWorkflow.id,
      status: settledWorkflow.status,
      progress: settledWorkflow.progress,
    })
  }

  /**
   * Builds the final response string returned to the caller,
   * summarizing workflow status and task outcomes.
   */
  private buildResponse(workflow: Workflow, results: ExecutionResult[]): string {
    const settledWorkflow = this.workflowEngine.getWorkflow(workflow.id) ?? workflow
    const succeeded = results.filter((result) => result.success).length
    const failed = results.length - succeeded

    return JSON.stringify({
      workflowId: settledWorkflow.id,
      status: settledWorkflow.status,
      progress: settledWorkflow.progress,
      totalTasks: results.length,
      succeeded,
      failed,
    })
  }

  /**
   * Publishes a SystemEvent through EventBus with a generated id and
   * timestamp, so callers only need to supply the event name and
   * payload.
   */
  private async emit(name: string, payload: Record<string, unknown>): Promise<void> {
    const event: SystemEvent = {
      id: this.generateEventId(name),
      name,
      timestamp: new Date(),
      payload,
    }

    await this.eventBus.publish(event)
  }

  /**
   * Generates a deterministic-format event identifier.
   */
  private generateEventId(name: string): string {
    return `event-${name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  }
}