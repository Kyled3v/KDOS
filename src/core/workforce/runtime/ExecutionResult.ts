/**
 * ExecutionResult.ts
 *
 * Location: src/core/workforce/runtime/ExecutionResult.ts
 *
 * ExecutionResult records the outcome of a single unit of work
 * carried out through WorkforceRuntime. This file contains no logic —
 * it is a pure data shape produced by WorkforceRuntime.execute().
 */

/**
 * The recorded outcome of a single executed task.
 */
export interface ExecutionResult {
  readonly success: boolean
  readonly employeeId: string
  readonly taskId: string
  readonly executionTime: number
  readonly summary: string
  readonly output: string
  readonly errors: string[]
  readonly warnings: string[]
}