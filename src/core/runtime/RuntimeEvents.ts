/**
 * RuntimeEvents.ts
 *
 * Location: src/core/runtime/RuntimeEvents.ts
 *
 * RuntimeEvents enumerates every named event that can flow through
 * the Runtime's publish/subscribe mechanism, and defines the shape of
 * a single RuntimeEvent instance. This file contains no logic — it is
 * pure event vocabulary consumed by Runtime.
 */

/**
 * Every named event a Runtime instance can publish or that a
 * subsystem can subscribe to.
 */
export enum RuntimeEventName {
  CLIENT_CREATED = 'CLIENT_CREATED',
  PROJECT_CREATED = 'PROJECT_CREATED',
  TASK_CREATED = 'TASK_CREATED',
  DOCUMENT_CREATED = 'DOCUMENT_CREATED',
  LEAD_CREATED = 'LEAD_CREATED',
  INVOICE_CREATED = 'INVOICE_CREATED',
  LICENSE_CHANGED = 'LICENSE_CHANGED',
  EMPLOYEE_CREATED = 'EMPLOYEE_CREATED',
  SYSTEM_UPDATE = 'SYSTEM_UPDATE',
}

/**
 * A single event flowing through the Runtime. `payload` carries
 * whatever event-specific data the publisher wants to attach; the
 * Runtime itself never inspects or interprets it.
 */
export interface RuntimeEvent {
  readonly id: string
  readonly name: RuntimeEventName
  readonly timestamp: Date
  readonly payload: Record<string, unknown>
}

/**
 * A subscriber callback invoked with a RuntimeEvent. May be
 * synchronous or asynchronous.
 */
export type RuntimeEventHandler = (event: RuntimeEvent) => Promise<void> | void