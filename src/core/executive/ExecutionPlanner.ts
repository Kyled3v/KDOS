/**
 * ExecutionPlanner.ts
 *
 * Location: src/core/executive/ExecutionPlanner.ts
 *
 * NOTE ON IMPORTS:
 * `PlannedUnit` is treated as an existing type produced upstream by the
 * planning stage of the Executive layer (e.g. TaskBreakdownEngine). This
 * file does NOT redefine it — it imports it. Adjust the import path below
 * to match wherever `PlannedUnit` is actually declared in the existing
 * codebase; no new model is created here.
 */

import type { PlannedUnit } from './TaskBreakdownEngine'

/**
 * A single node in the execution graph, grouped with any other units
 * that can be executed at the same stage.
 */
export interface ExecutionGroup {
  /** Deterministic identifier for this group (stage index based). */
  readonly id: string
  /** True if the units in this group have no dependency relationship
   *  between them and may be executed concurrently. */
  readonly parallel: boolean
  /** Units belonging to this group, in stable input order. */
  readonly units: readonly PlannedUnit[]
}

/**
 * The final, deterministic execution plan derived from a set of
 * PlannedUnit objects. Contains no AI-derived data and performs no
 * execution or dispatch of any kind.
 */
export interface ExecutionPlan {
  readonly id: string
  readonly objectiveId: string
  readonly createdAt: Date
  readonly totalUnits: number
  readonly estimatedHours: number
  /** Ordered sequence of unit ids representing the longest
   *  (most time-consuming) dependency chain in the plan. */
  readonly criticalPath: string[]
  /** Units grouped into sequential execution stages. Units within a
   *  stage marked `parallel: true` may run concurrently. */
  readonly parallelGroups: ExecutionGroup[]
  /** The original units, preserved and unmodified. */
  readonly units: readonly PlannedUnit[]
}

/**
 * ExecutionPlanner
 *
 * Single responsibility: convert a list of PlannedUnit objects into a
 * deterministic ExecutionPlan.
 *
 * This class:
 *   - Performs no AI calls.
 *   - Performs no execution or task dispatch.
 *   - Communicates with no employees or services.
 *   - Never mutates the PlannedUnit inputs it receives.
 *   - Produces the same output for the same input, every time.
 *
 * All decision-making authority remains in the Executive layer that
 * calls this planner; this class is a pure transformation step.
 */
export class ExecutionPlanner {
  /**
   * Builds a deterministic ExecutionPlan from a flat list of PlannedUnit
   * objects, using each unit's declared dependencies to compute a
   * critical path and to group independent units for parallel execution.
   *
   * @param units - The planned units to organize into an execution plan.
   * @returns A fully-formed, immutable ExecutionPlan.
   * @throws Error if a circular dependency is detected among the units,
   *         since a deterministic plan cannot be produced in that case.
   */
  public createPlan(units: PlannedUnit[]): ExecutionPlan {
    const unitList = [...units]
    const unitsById = this.indexById(unitList)

    this.assertNoCycles(unitList, unitsById)

    const levels = this.computeDependencyLevels(unitList, unitsById)
    const parallelGroups = this.buildParallelGroups(unitList, levels)
    const criticalPath = this.computeCriticalPath(unitList, unitsById)
    const estimatedHours = this.sumEstimatedHours(unitList)

    return Object.freeze({
      id: this.generatePlanId(),
      objectiveId: this.resolveObjectiveId(unitList),
      createdAt: new Date(),
      totalUnits: unitList.length,
      estimatedHours,
      criticalPath,
      parallelGroups,
      units: Object.freeze([...unitList]),
    })
  }

  /**
   * Indexes units by id for O(1) dependency lookups.
   */
  private indexById(units: PlannedUnit[]): Map<string, PlannedUnit> {
    const map = new Map<string, PlannedUnit>()
    for (const unit of units) {
      map.set(unit.id, unit)
    }
    return map
  }

  /**
   * Sums the estimated hours across all units.
   */
  private sumEstimatedHours(units: PlannedUnit[]): number {
    return units.reduce((total, unit) => total + (unit.estimatedHours ?? 0), 0)
  }

  /**
   * Resolves a shared objectiveId across the unit set. All units in a
   * single plan are expected to share the same objective; the first
   * unit's objectiveId is used as the source of truth.
   */
  private resolveObjectiveId(units: PlannedUnit[]): string {
    return units.length > 0 ? units[0].objectiveId : ''
  }

  /**
   * Detects circular dependencies via depth-first traversal. A
   * deterministic plan is impossible in the presence of a cycle, so
   * this throws rather than silently producing an incomplete plan.
   */
  private assertNoCycles(
    units: PlannedUnit[],
    unitsById: Map<string, PlannedUnit>
  ): void {
    const VISITING = 1
    const VISITED = 2
    const state = new Map<string, number>()

    const visit = (unitId: string, chain: string[]): void => {
      const status = state.get(unitId)
      if (status === VISITED) {
        return
      }
      if (status === VISITING) {
        throw new Error(
          `ExecutionPlanner: circular dependency detected involving unit "${unitId}" (chain: ${[...chain, unitId].join(' -> ')})`
        )
      }

      state.set(unitId, VISITING)
      const unit = unitsById.get(unitId)
      const dependencies = unit?.dependencies ?? []
      for (const depId of dependencies) {
        if (!unitsById.has(depId)) {
          continue
        }
        visit(depId, [...chain, unitId])
      }
      state.set(unitId, VISITED)
    }

    for (const unit of units) {
      visit(unit.id, [])
    }
  }

  /**
   * Computes a dependency "level" for each unit: the length of the
   * longest dependency chain leading into it. Units with no
   * dependencies are level 0. Units at the same level share no
   * dependency relationship with one another and are therefore safe
   * to execute in parallel.
   */
  private computeDependencyLevels(
    units: PlannedUnit[],
    unitsById: Map<string, PlannedUnit>
  ): Map<string, number> {
    const levels = new Map<string, number>()

    const resolveLevel = (unitId: string): number => {
      const cached = levels.get(unitId)
      if (cached !== undefined) {
        return cached
      }

      const unit = unitsById.get(unitId)
      const dependencies = (unit?.dependencies ?? []).filter((depId) =>
        unitsById.has(depId)
      )

      const level =
        dependencies.length === 0
          ? 0
          : 1 + Math.max(...dependencies.map((depId) => resolveLevel(depId)))

      levels.set(unitId, level)
      return level
    }

    for (const unit of units) {
      resolveLevel(unit.id)
    }

    return levels
  }

  /**
   * Groups units into ordered ExecutionGroups based on dependency
   * level. Group order is preserved from level 0 upward; unit order
   * within a group follows original input order for determinism.
   */
  private buildParallelGroups(
    units: PlannedUnit[],
    levels: Map<string, number>
  ): ExecutionGroup[] {
    const maxLevel = units.reduce(
      (max, unit) => Math.max(max, levels.get(unit.id) ?? 0),
      0
    )

    const groups: ExecutionGroup[] = []

    for (let level = 0; level <= maxLevel; level++) {
      const unitsAtLevel = units.filter((unit) => levels.get(unit.id) === level)
      if (unitsAtLevel.length === 0) {
        continue
      }

      groups.push(
        Object.freeze({
          id: `group-${level}`,
          parallel: unitsAtLevel.length > 1,
          units: Object.freeze([...unitsAtLevel]),
        })
      )
    }

    return groups
  }

  /**
   * Computes the critical path: the sequence of unit ids forming the
   * longest cumulative-hour chain through the dependency graph, using
   * a standard longest-path-in-a-DAG (critical path method) approach.
   */
  private computeCriticalPath(
    units: PlannedUnit[],
    unitsById: Map<string, PlannedUnit>
  ): string[] {
    const cumulativeHours = new Map<string, number>()
    const predecessor = new Map<string, string | null>()

    const resolve = (unitId: string): number => {
      const cached = cumulativeHours.get(unitId)
      if (cached !== undefined) {
        return cached
      }

      const unit = unitsById.get(unitId)
      const ownHours = unit?.estimatedHours ?? 0
      const dependencies = (unit?.dependencies ?? []).filter((depId) =>
        unitsById.has(depId)
      )

      if (dependencies.length === 0) {
        cumulativeHours.set(unitId, ownHours)
        predecessor.set(unitId, null)
        return ownHours
      }

      let bestDep: string | null = null
      let bestHours = -Infinity
      for (const depId of dependencies) {
        const depHours = resolve(depId)
        if (depHours > bestHours) {
          bestHours = depHours
          bestDep = depId
        }
      }

      const total = ownHours + Math.max(bestHours, 0)
      cumulativeHours.set(unitId, total)
      predecessor.set(unitId, bestDep)
      return total
    }

    for (const unit of units) {
      resolve(unit.id)
    }

    let endUnitId: string | null = null
    let maxHours = -Infinity
    for (const unit of units) {
      const hours = cumulativeHours.get(unit.id) ?? 0
      if (hours > maxHours) {
        maxHours = hours
        endUnitId = unit.id
      }
    }

    const path: string[] = []
    let cursor = endUnitId
    while (cursor !== null) {
      path.push(cursor)
      cursor = predecessor.get(cursor) ?? null
    }

    return path.reverse()
  }

  /**
   * Generates a deterministic-format plan identifier. Uses a
   * timestamp-based value; callers requiring strict reproducibility
   * across repeated calls with identical inputs should treat `id` as
   * metadata rather than a hash of plan content.
   */
  private generatePlanId(): string {
    return `plan-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  }
}