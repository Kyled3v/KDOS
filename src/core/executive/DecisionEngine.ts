/**
 * DecisionEngine.ts
 *
 * Location: src/core/executive/DecisionEngine.ts
 *
 * DecisionEngine is the final reasoning component of the Executive
 * layer. It consumes an ExecutionPlan (produced by ExecutionPlanner)
 * and decides HOW that plan should be executed — it never executes
 * work, never calls AI, and never dispatches employees. It is pure,
 * deterministic business logic layered on top of plan data that
 * already exists.
 */

import type { ExecutionPlan } from './ExecutionPlanner'

/**
 * Strategy under which an ExecutionPlan should be carried out.
 */
export type ExecutionMode = 'Sequential' | 'Parallel' | 'Hybrid'

/**
 * The final executive decision for a given ExecutionPlan. Contains no
 * execution instructions — only guidance for how the plan should be
 * approached by the layers responsible for dispatch.
 */
export interface ExecutiveDecision {
  readonly executionMode: ExecutionMode
  readonly requiresHumanApproval: boolean
  readonly requiresResearch: boolean
  readonly requiresRiskAssessment: boolean
  readonly estimatedCompletionHours: number
  readonly recommendedStartGroup: string
  readonly notes: string[]
}

/**
 * Thresholds used to keep decision-making deterministic and
 * explainable. Centralized here so tuning does not require touching
 * decision logic itself.
 */
const RISK_THRESHOLDS = {
  /** Plans at or above this total estimated hours are treated as
   *  high-effort and therefore higher-risk. */
  HIGH_HOUR_COUNT: 40,
  /** Plans at or above this unit count are treated as structurally
   *  complex and therefore higher-risk. */
  HIGH_UNIT_COUNT: 15,
  /** Critical paths at or above this length (in units) indicate deep
   *  sequential dependency chains. */
  LONG_CRITICAL_PATH: 6,
  /** Critical path hours at or above this share of total estimated
   *  hours indicate the plan is dominated by a sequential bottleneck. */
  CRITICAL_PATH_DOMINANCE_RATIO: 0.7,
} as const

/**
 * DecisionEngine
 *
 * Single responsibility: transform an ExecutionPlan into an
 * ExecutiveDecision describing how the plan should be executed.
 *
 * This class:
 *   - Performs no AI calls.
 *   - Performs no execution, dispatch, or employee communication.
 *   - Never mutates the ExecutionPlan it receives.
 *   - Produces the same decision for the same input, every time.
 *
 * Decision-making authority for KDOS lives entirely in the Executive
 * layer; this class is one deterministic step within it.
 */
export class DecisionEngine {
  /**
   * Produces an ExecutiveDecision describing how the given
   * ExecutionPlan should be carried out.
   *
   * @param plan - A previously-built, immutable ExecutionPlan.
   * @returns A fully-formed ExecutiveDecision. The input plan is not
   *          modified in any way.
   */
  public makeDecision(plan: ExecutionPlan): ExecutiveDecision {
    const notes: string[] = []

    const executionMode = this.determineExecutionMode(plan, notes)
    const requiresRiskAssessment = this.determineRiskAssessment(plan, notes)
    const requiresHumanApproval = this.determineHumanApproval(
      plan,
      requiresRiskAssessment,
      notes
    )
    const requiresResearch = this.determineResearchNeed(plan, notes)
    const estimatedCompletionHours = this.estimateCompletionHours(
      plan,
      executionMode,
      notes
    )
    const recommendedStartGroup = this.determineStartGroup(plan, notes)

    return Object.freeze({
      executionMode,
      requiresHumanApproval,
      requiresResearch,
      requiresRiskAssessment,
      estimatedCompletionHours,
      recommendedStartGroup,
      notes,
    })
  }

  /**
   * Determines whether the plan should run Sequential, Parallel, or
   * Hybrid, based on the shape of its parallel groups.
   *
   * - Sequential: every group contains exactly one unit (no
   *   parallelizable work exists anywhere in the plan).
   * - Parallel: every group is marked parallel (no single-unit,
   *   strictly-sequential bottleneck groups exist).
   * - Hybrid: a mix of the two — some groups can run concurrently,
   *   others cannot.
   */
  private determineExecutionMode(
    plan: ExecutionPlan,
    notes: string[]
  ): ExecutionMode {
    const groups = plan.parallelGroups

    if (groups.length === 0) {
      notes.push('Plan contains no execution groups; defaulting to Sequential mode.')
      return 'Sequential'
    }

    const parallelGroupCount = groups.filter((group) => group.parallel).length
    const sequentialGroupCount = groups.length - parallelGroupCount

    if (parallelGroupCount === 0) {
      notes.push('No stage of this plan contains independent units; recommending Sequential execution.')
      return 'Sequential'
    }

    if (sequentialGroupCount === 0) {
      notes.push('Every stage of this plan contains independent units; recommending Parallel execution.')
      return 'Parallel'
    }

    notes.push(
      `Plan mixes ${parallelGroupCount} parallelizable stage(s) with ${sequentialGroupCount} strictly sequential stage(s); recommending Hybrid execution.`
    )
    return 'Hybrid'
  }

  /**
   * Determines whether the plan is risky enough to warrant a formal
   * risk assessment step before execution begins.
   */
  private determineRiskAssessment(plan: ExecutionPlan, notes: string[]): boolean {
    let risky = false

    if (plan.estimatedHours >= RISK_THRESHOLDS.HIGH_HOUR_COUNT) {
      notes.push(
        `Estimated effort of ${plan.estimatedHours}h meets or exceeds the ${RISK_THRESHOLDS.HIGH_HOUR_COUNT}h risk threshold.`
      )
      risky = true
    }

    if (plan.totalUnits >= RISK_THRESHOLDS.HIGH_UNIT_COUNT) {
      notes.push(
        `Plan contains ${plan.totalUnits} units, meeting or exceeding the ${RISK_THRESHOLDS.HIGH_UNIT_COUNT}-unit complexity threshold.`
      )
      risky = true
    }

    if (plan.criticalPath.length >= RISK_THRESHOLDS.LONG_CRITICAL_PATH) {
      notes.push(
        `Critical path spans ${plan.criticalPath.length} units, indicating a deep sequential dependency chain.`
      )
      risky = true
    }

    const criticalPathHours = this.sumHoursForUnits(plan, plan.criticalPath)
    const dominanceRatio =
      plan.estimatedHours > 0 ? criticalPathHours / plan.estimatedHours : 0

    if (dominanceRatio >= RISK_THRESHOLDS.CRITICAL_PATH_DOMINANCE_RATIO) {
      notes.push(
        `Critical path accounts for ${Math.round(dominanceRatio * 100)}% of total estimated hours, making it a dominant bottleneck.`
      )
      risky = true
    }

    if (!risky) {
      notes.push('Plan falls within normal risk thresholds; no elevated risk detected.')
    }

    return risky
  }

  /**
   * Determines whether the plan requires human sign-off before
   * execution. Any risky plan requires approval; additionally, very
   * large plans require approval regardless of risk score, since
   * scale alone carries organizational impact.
   */
  private determineHumanApproval(
    plan: ExecutionPlan,
    requiresRiskAssessment: boolean,
    notes: string[]
  ): boolean {
    if (requiresRiskAssessment) {
      notes.push('Human approval required because the plan was flagged during risk assessment.')
      return true
    }

    if (plan.totalUnits >= RISK_THRESHOLDS.HIGH_UNIT_COUNT * 2) {
      notes.push('Human approval required due to the sheer scale of the plan, independent of risk score.')
      return true
    }

    notes.push('No human approval required; plan is low-risk and within normal scale.')
    return false
  }

  /**
   * Determines whether upfront research is recommended before
   * execution begins. Triggered when the plan opens with a wide
   * first-stage fan-out, since broad concurrent starts typically
   * indicate unclear or under-specified scope.
   */
  private determineResearchNeed(plan: ExecutionPlan, notes: string[]): boolean {
    const firstGroup = plan.parallelGroups[0]

    if (!firstGroup) {
      return false
    }

    const wideFanOut = firstGroup.parallel && firstGroup.units.length >= 4

    if (wideFanOut) {
      notes.push(
        `Initial stage fans out into ${firstGroup.units.length} concurrent units; recommending upfront research to validate scope before execution.`
      )
      return true
    }

    return false
  }

  /**
   * Estimates total wall-clock completion hours for the plan under
   * the chosen execution mode.
   *
   * - Sequential: sum of every unit's estimated hours (nothing runs
   *   concurrently).
   * - Parallel: the critical path's cumulative hours, since fully
   *   parallel execution is bounded only by the longest dependency
   *   chain.
   * - Hybrid: the greater of the critical path hours and the slowest
   *   individual stage, since sequential stages still gate progress.
   */
  private estimateCompletionHours(
    plan: ExecutionPlan,
    mode: ExecutionMode,
    notes: string[]
  ): number {
    const criticalPathHours = this.sumHoursForUnits(plan, plan.criticalPath)

    if (mode === 'Sequential') {
      notes.push(`Sequential mode: completion estimated at the full ${plan.estimatedHours}h of total plan effort.`)
      return plan.estimatedHours
    }

    if (mode === 'Parallel') {
      notes.push(`Parallel mode: completion bounded by the critical path at ${criticalPathHours}h.`)
      return criticalPathHours
    }

    const slowestStageHours = plan.parallelGroups.reduce((max, group) => {
      const stageHours = group.parallel
        ? Math.max(...group.units.map((unit) => unit.estimatedHours ?? 0), 0)
        : this.sumHoursForUnits(plan, group.units.map((unit) => unit.id))
      return Math.max(max, stageHours)
    }, 0)

    const hybridEstimate = Math.max(criticalPathHours, slowestStageHours)
    notes.push(
      `Hybrid mode: completion estimated at ${hybridEstimate}h, bounded by the critical path (${criticalPathHours}h) and the slowest stage (${slowestStageHours}h).`
    )
    return hybridEstimate
  }

  /**
   * Recommends which execution group should begin first. This is
   * always the earliest stage of the plan, since parallelGroups is
   * already ordered by dependency level.
   */
  private determineStartGroup(plan: ExecutionPlan, notes: string[]): string {
    const firstGroup = plan.parallelGroups[0]

    if (!firstGroup) {
      notes.push('Plan contains no groups; no start group can be recommended.')
      return ''
    }

    notes.push(`Recommended start group is "${firstGroup.id}" (${firstGroup.units.length} unit(s)).`)
    return firstGroup.id
  }

  /**
   * Sums estimated hours for a specific subset of unit ids within a
   * plan, without modifying the plan or its units.
   */
  private sumHoursForUnits(plan: ExecutionPlan, unitIds: string[]): number {
    const idSet = new Set(unitIds)
    return plan.units
      .filter((unit) => idSet.has(unit.id))
      .reduce((total, unit) => total + (unit.estimatedHours ?? 0), 0)
  }
}