/**
 * WorkforceCoordinator.ts
 *
 * Location: src/core/workforce/orchestrator/WorkforceCoordinator.ts
 *
 * WorkforceCoordinator sits at the boundary between the Executive
 * layer's reasoning output and the Workforce layer's execution
 * machinery. It takes an ExecutivePackage and prepares a
 * WorkforceExecutionPlan: work grouped by department, with employees
 * resolved and assigned from the existing EmployeeRegistry.
 *
 * It coordinates the workforce. It does not run it.
 *
 * NOTE ON IMPORTS:
 * This file imports its dependencies from their existing locations in
 * the architecture rather than redefining them. Adjust the paths
 * below if the actual module locations differ:
 *   - EmployeeRegistry: '../registry/EmployeeRegistry'
 *   - BaseEmployee:     '../employees/BaseEmployee'
 *   - EmployeeDepartment, EmployeeRole: '../types/Employee'
 *   - PlannedUnit:      '../../executive/TaskBreakdownEngine'
 *   - ExecutivePackage: '../../executive/ExecutiveAssistant'
 */

import { EmployeeRegistry } from '../registry/EmployeeRegistry'
import type { BaseEmployee } from '../employees/BaseEmployee'
import type { EmployeeDepartment } from '../types/Employee'
import type { PlannedUnit } from '../../executive/TaskBreakdownEngine'
import type { ExecutivePackage } from '../../executive/ExecutiveAssistant'

/**
 * A single department-scoped unit of workforce assignment: the tasks
 * destined for that department, and the employees resolved to handle
 * them.
 */
export interface WorkforceGroup {
  readonly id: string
  readonly department: EmployeeDepartment
  /** True when this department's tasks have no dependency relationship
   *  between them and the assigned employees can work concurrently. */
  readonly parallel: boolean
  readonly employees: BaseEmployee[]
  readonly tasks: PlannedUnit[]
}

/**
 * The complete, deterministic workforce preparation output for a
 * single ExecutivePackage. Contains no dispatch instructions — only
 * the grouping and assignment data required before dispatch can
 * happen elsewhere in the architecture.
 */
export interface WorkforceExecutionPlan {
  readonly id: string
  readonly createdAt: Date
  readonly groups: WorkforceGroup[]
  readonly totalEmployees: number
  readonly totalTasks: number
  readonly estimatedHours: number
}

/**
 * WorkforceCoordinator
 *
 * Single responsibility: transform an ExecutivePackage into a
 * WorkforceExecutionPlan by resolving employees and grouping planned
 * work by department.
 *
 * This class:
 *   - Performs no AI calls.
 *   - Performs no task execution or dispatch.
 *   - Makes no executive decisions (those belong to DecisionEngine).
 *   - Never mutates the ExecutivePackage it receives.
 *   - Is dependency-injection ready: EmployeeRegistry is supplied via
 *     the constructor rather than constructed internally.
 */
export class WorkforceCoordinator {
  private readonly employeeRegistry: EmployeeRegistry

  public constructor(employeeRegistry: EmployeeRegistry) {
    this.employeeRegistry = employeeRegistry
  }

  /**
   * Prepares a WorkforceExecutionPlan from an ExecutivePackage: tasks
   * are grouped by department, employees are resolved from the
   * EmployeeRegistry for each department, and workforce-level
   * statistics are calculated.
   *
   * @param executivePackage - The reasoning output to prepare work
   *        from. Not modified in any way.
   * @returns A fully-formed WorkforceExecutionPlan.
   */
  public prepare(executivePackage: ExecutivePackage): WorkforceExecutionPlan {
    const tasks = [...executivePackage.plannedUnits]
    const tasksByDepartment = this.groupTasksByDepartment(tasks)
    const groups = this.buildWorkforceGroups(tasksByDepartment)

    const totalEmployees = this.countUniqueEmployees(groups)
    const totalTasks = tasks.length
    const estimatedHours = this.sumEstimatedHours(tasks)

    return Object.freeze({
      id: this.generatePlanId(),
      createdAt: new Date(),
      groups,
      totalEmployees,
      totalTasks,
      estimatedHours,
    })
  }

  /**
   * Groups planned units by their target department, preserving the
   * original task order within each department bucket.
   */
  private groupTasksByDepartment(
    tasks: PlannedUnit[]
  ): Map<EmployeeDepartment, PlannedUnit[]> {
    const grouped = new Map<EmployeeDepartment, PlannedUnit[]>()

    for (const task of tasks) {
      const department = task.department
      const bucket = grouped.get(department)
      if (bucket) {
        bucket.push(task)
      } else {
        grouped.set(department, [task])
      }
    }

    return grouped
  }

  /**
   * Builds one WorkforceGroup per department, resolving available
   * employees for that department from the EmployeeRegistry.
   */
  private buildWorkforceGroups(
    tasksByDepartment: Map<EmployeeDepartment, PlannedUnit[]>
  ): WorkforceGroup[] {
    const groups: WorkforceGroup[] = []

    for (const [department, tasks] of tasksByDepartment.entries()) {
      const employees = this.resolveEmployeesForDepartment(department)

      groups.push(
        Object.freeze({
          id: `workforce-group-${department}`,
          department,
          parallel: this.canRunInParallel(tasks, employees),
          employees,
          tasks: Object.freeze([...tasks]) as PlannedUnit[],
        })
      )
    }

    return groups
  }

  /**
   * Resolves the employees available to handle work for a given
   * department, via the injected EmployeeRegistry. Never mutates the
   * registry or the returned employees.
   */
  private resolveEmployeesForDepartment(
    department: EmployeeDepartment
  ): BaseEmployee[] {
    const employees = this.employeeRegistry.getByDepartment(department)
    return [...employees]
  }

  /**
   * Determines whether a department's tasks can be worked on
   * concurrently: this requires both more than one task and more
   * than one available employee to actually parallelize the work.
   */
  private canRunInParallel(tasks: PlannedUnit[], employees: BaseEmployee[]): boolean {
    return tasks.length > 1 && employees.length > 1
  }

  /**
   * Counts the number of distinct employees assigned across all
   * workforce groups, avoiding double-counting an employee assigned
   * to more than one department.
   */
  private countUniqueEmployees(groups: WorkforceGroup[]): number {
    const uniqueIds = new Set<string>()
    for (const group of groups) {
      for (const employee of group.employees) {
        uniqueIds.add(employee.id)
      }
    }
    return uniqueIds.size
  }

  /**
   * Sums estimated hours across all planned units.
   */
  private sumEstimatedHours(tasks: PlannedUnit[]): number {
    return tasks.reduce((total, task) => total + (task.estimatedHours ?? 0), 0)
  }

  /**
   * Generates a deterministic-format plan identifier.
   */
  private generatePlanId(): string {
    return `workforce-plan-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  }
}