/**
 * ExecutionContext.ts
 *
 * Location: src/core/workforce/runtime/ExecutionContext.ts
 *
 * ExecutionContext carries the identifying information every piece of
 * work executed through WorkforceRuntime needs: who requested it,
 * which workflow and employee it belongs to, and enough correlation
 * data to trace it end to end. This file contains no logic — it is a
 * pure data shape.
 */

/**
 * The identifying and correlating information attached to a single
 * unit of work as it flows through WorkforceRuntime.
 */
export interface ExecutionContext {
  readonly requestId: string
  readonly workflowId: string
  readonly employeeId: string
  readonly companyId: string
  readonly userId: string
  readonly correlationId: string
  readonly metadata: Record<string, unknown>
}