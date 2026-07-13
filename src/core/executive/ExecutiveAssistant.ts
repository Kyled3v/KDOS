/**
 * ExecutiveAssistant.ts
 *
 * Location: src/core/executive/ExecutiveAssistant.ts
 *
 * ExecutiveAssistant is the top-level coordinator of the Executive
 * layer. It owns no execution logic and performs no dispatch — it
 * simply runs an incoming request through the existing reasoning
 * pipeline (analysis -> classification -> breakdown -> planning ->
 * decision) and returns the combined result as an ExecutivePackage.
 *
 * ExecutiveAssistant ONLY thinks. It never dispatches work, never
 * creates employees, never calls TaskDispatcher, and never talks to
 * AI directly — each of those responsibilities belongs to the
 * components it coordinates, or to layers outside the Executive
 * layer entirely.
 */

import { IntentAnalyzer } from './IntentAnalyzer'
import type { Intent } from './IntentAnalyzer'
import { ObjectiveClassifier } from './ObjectiveClassifier'
import type { Objective } from './ObjectiveClassifier'
import { TaskBreakdownEngine } from './TaskBreakdownEngine'
import type { PlannedUnit } from './TaskBreakdownEngine'
import { ExecutionPlanner } from './ExecutionPlanner'
import type { ExecutionPlan } from './ExecutionPlanner'
import { DecisionEngine } from './DecisionEngine'
import type { ExecutiveDecision } from './DecisionEngine'

/**
 * The complete output of a single pass through the Executive
 * reasoning pipeline. This is the sole artifact ExecutiveAssistant
 * produces — it contains only reasoning results, never execution
 * instructions or side effects.
 */
export interface ExecutivePackage {
  readonly intent: Intent
  readonly objective: Objective
  readonly plannedUnits: PlannedUnit[]
  readonly executionPlan: ExecutionPlan
  readonly decision: ExecutiveDecision
}

/**
 * ExecutiveAssistant
 *
 * Single responsibility: coordinate the existing Executive-layer
 * components into one deterministic reasoning pipeline and return the
 * resulting ExecutivePackage.
 *
 * This class:
 *   - Owns instances of IntentAnalyzer, ObjectiveClassifier,
 *     TaskBreakdownEngine, ExecutionPlanner, and DecisionEngine.
 *   - Performs no AI calls of its own.
 *   - Performs no execution, task dispatch, or employee creation.
 *   - Delegates every unit of reasoning to the appropriate component;
 *     it never re-implements their logic.
 */
export class ExecutiveAssistant {
  private readonly intentAnalyzer: IntentAnalyzer
  private readonly objectiveClassifier: ObjectiveClassifier
  private readonly taskBreakdownEngine: TaskBreakdownEngine
  private readonly executionPlanner: ExecutionPlanner
  private readonly decisionEngine: DecisionEngine

  public constructor(
    intentAnalyzer: IntentAnalyzer = new IntentAnalyzer(),
    objectiveClassifier: ObjectiveClassifier = new ObjectiveClassifier(),
    taskBreakdownEngine: TaskBreakdownEngine = new TaskBreakdownEngine(),
    executionPlanner: ExecutionPlanner = new ExecutionPlanner(),
    decisionEngine: DecisionEngine = new DecisionEngine()
  ) {
    this.intentAnalyzer = intentAnalyzer
    this.objectiveClassifier = objectiveClassifier
    this.taskBreakdownEngine = taskBreakdownEngine
    this.executionPlanner = executionPlanner
    this.decisionEngine = decisionEngine
  }

  /**
   * Runs a raw request string through the full Executive reasoning
   * pipeline and returns the resulting ExecutivePackage.
   *
   * Pipeline:
   *   analyze()   -> Intent
   *   classify()  -> Objective
   *   breakdown() -> PlannedUnit[]
   *   createPlan() -> ExecutionPlan
   *   makeDecision() -> ExecutiveDecision
   *
   * @param request - The raw incoming request to reason about.
   * @returns The complete ExecutivePackage for this request. No work
   *          is executed or dispatched as part of producing it.
   */
  public async evaluate(request: string): Promise<ExecutivePackage> {
    const intent = await this.analyze(request)
    const objective = await this.classify(intent)
    const plannedUnits = await this.breakdown(objective)
    const executionPlan = this.createPlan(plannedUnits)
    const decision = this.makeDecision(executionPlan)

    return Object.freeze({
      intent,
      objective,
      plannedUnits,
      executionPlan,
      decision,
    })
  }

  /**
   * Delegates intent analysis to IntentAnalyzer.
   */
  private async analyze(request: string): Promise<Intent> {
    return this.intentAnalyzer.analyze(request)
  }

  /**
   * Delegates objective classification to ObjectiveClassifier.
   */
  private async classify(intent: Intent): Promise<Objective> {
    return this.objectiveClassifier.classify(intent)
  }

  /**
   * Delegates task breakdown to TaskBreakdownEngine.
   */
  private async breakdown(objective: Objective): Promise<PlannedUnit[]> {
    return this.taskBreakdownEngine.breakdown(objective)
  }

  /**
   * Delegates deterministic plan construction to ExecutionPlanner.
   */
  private createPlan(units: PlannedUnit[]): ExecutionPlan {
    return this.executionPlanner.createPlan(units)
  }

  /**
   * Delegates final executive decision-making to DecisionEngine.
   */
  private makeDecision(plan: ExecutionPlan): ExecutiveDecision {
    return this.decisionEngine.makeDecision(plan)
  }
}