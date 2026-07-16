/**
 * RuntimeState.ts
 *
 * Location: src/core/runtime/RuntimeState.ts
 *
 * RuntimeState enumerates every lifecycle state a Runtime instance
 * can be in, from initial boot through to going offline. This file
 * contains no logic — it is a pure enum definition consumed by
 * Runtime.
 */

/**
 * The lifecycle state of a Runtime instance.
 */
export enum RuntimeState {
  BOOTING = 'BOOTING',
  STARTING = 'STARTING',
  READY = 'READY',
  BUSY = 'BUSY',
  UPDATING = 'UPDATING',
  SHUTTING_DOWN = 'SHUTTING_DOWN',
  OFFLINE = 'OFFLINE',
}