/**
 * Runtime.ts
 *
 * Location: src/core/runtime/Runtime.ts
 *
 * Runtime is the heart of KDOS. Every subsystem communicates through
 * it — nothing talks directly to another module. Runtime owns the
 * application's lifecycle state and its event bus; it contains no
 * database access, no AI calls, no external package dependencies,
 * and no business logic of its own.
 *
 * Runtime is a singleton: exactly one instance exists per process,
 * accessed via Runtime.getInstance(). It remains dependency-injection
 * ready in the sense that matters for a singleton — its RuntimeConfig
 * is supplied by the caller that first initializes it, rather than
 * hardcoded inside this class.
 */

import type { RuntimeConfig } from './RuntimeConfig'
import { RuntimeState } from './RuntimeState'
import type { RuntimeEvent, RuntimeEventHandler } from './RuntimeEvents'
import { RuntimeEventName } from './RuntimeEvents'

/**
 * Runtime
 *
 * Single responsibility: own application lifecycle state and act as
 * the sole communication backbone (publish/subscribe/dispatch)
 * between every other KDOS subsystem.
 *
 * This class:
 *   - Is a singleton — use Runtime.getInstance() rather than `new`.
 *   - Performs no database access, AI calls, or external API calls.
 *   - Depends on no external packages.
 *   - Contains no business logic; it only tracks state and routes
 *     events between subscribers.
 */
export class Runtime {
  private static instance: Runtime | null = null

  private readonly config: RuntimeConfig
  private state: RuntimeState = RuntimeState.OFFLINE
  private readonly handlers = new Map<RuntimeEventName, Set<RuntimeEventHandler>>()
  private eventSequence = 0

  /**
   * Private constructor — Runtime is a singleton and must be created
   * via getInstance(), never directly.
   */
  private constructor(config: RuntimeConfig) {
    this.config = config
  }

  /**
   * Retrieves the singleton Runtime instance, creating it on first
   * call with the supplied RuntimeConfig.
   *
   * @param config - The configuration to boot the Runtime with. Only
   *        used the first time getInstance() is called; ignored on
   *        subsequent calls since the instance already exists.
   * @returns The singleton Runtime instance.
   * @throws Error if called for the first time without a config.
   */
  public static getInstance(config?: RuntimeConfig): Runtime {
    if (!Runtime.instance) {
      if (!config) {
        throw new Error('Runtime: initial call to getInstance() requires a RuntimeConfig.')
      }
      Runtime.instance = new Runtime(config)
    }
    return Runtime.instance
  }

  /**
   * Resets the singleton instance. Intended for test isolation only
   * — production code should never need to call this, since a real
   * process has exactly one Runtime for its entire lifetime.
   */
  public static resetInstance(): void {
    Runtime.instance = null
  }

  /**
   * Boots the Runtime, transitioning it through BOOTING and STARTING
   * states before settling into READY.
   *
   * @throws Error if the Runtime is not currently OFFLINE.
   */
  public async boot(): Promise<void> {
    if (this.state !== RuntimeState.OFFLINE) {
      throw new Error(
        `Runtime: cannot boot from state "${this.state}"; boot() is only valid from OFFLINE.`
      )
    }

    this.setState(RuntimeState.BOOTING)
    this.setState(RuntimeState.STARTING)
    this.setState(RuntimeState.READY)
  }

  /**
   * Shuts the Runtime down, transitioning it through SHUTTING_DOWN
   * before settling into OFFLINE, and clearing all event
   * subscriptions.
   */
  public async shutdown(): Promise<void> {
    if (this.state === RuntimeState.OFFLINE) {
      return
    }

    this.setState(RuntimeState.SHUTTING_DOWN)
    this.handlers.clear()
    this.setState(RuntimeState.OFFLINE)
  }

  /**
   * Restarts the Runtime: shuts it down if not already offline, then
   * boots it again.
   */
  public async restart(): Promise<void> {
    await this.shutdown()
    await this.boot()
  }

  /**
   * Registers a handler for a given RuntimeEventName. Subscribing the
   * same handler function to the same event name more than once has
   * no additional effect — duplicate subscriptions are not created.
   *
   * @param eventName - The event name to listen for.
   * @param handler - The callback to invoke when that event is
   *        published.
   */
  public subscribe(eventName: RuntimeEventName, handler: RuntimeEventHandler): void {
    const existing = this.handlers.get(eventName)
    if (existing) {
      existing.add(handler)
      return
    }
    this.handlers.set(eventName, new Set([handler]))
  }

  /**
   * Removes a previously registered handler for a given
   * RuntimeEventName. Has no effect if the handler was never
   * subscribed to that event name.
   *
   * @param eventName - The event name to stop listening for.
   * @param handler - The callback to remove.
   */
  public unsubscribe(eventName: RuntimeEventName, handler: RuntimeEventHandler): void {
    const existing = this.handlers.get(eventName)
    if (!existing) {
      return
    }

    existing.delete(handler)

    if (existing.size === 0) {
      this.handlers.delete(eventName)
    }
  }

  /**
   * Publishes a fully-formed RuntimeEvent to every handler currently
   * subscribed to its name, invoking them in subscription order and
   * awaiting each in turn. Handler failures are isolated: one
   * throwing or rejecting handler does not prevent the remaining
   * handlers from running and does not reject this call.
   *
   * @param event - The RuntimeEvent to deliver.
   */
  public async publish(event: RuntimeEvent): Promise<void> {
    const registered = this.handlers.get(event.name)
    if (!registered || registered.size === 0) {
      return
    }

    const handlersToInvoke = [...registered]

    for (const handler of handlersToInvoke) {
      await this.invokeSafely(handler, event)
    }
  }

  /**
   * Convenience method that builds a RuntimeEvent from a name and
   * payload (assigning id and timestamp automatically) and publishes
   * it in a single call.
   *
   * @param name - The RuntimeEventName to dispatch.
   * @param payload - The event-specific data to attach.
   */
  public async dispatch(
    name: RuntimeEventName,
    payload: Record<string, unknown> = {}
  ): Promise<void> {
    const event: RuntimeEvent = {
      id: this.generateEventId(name),
      name,
      timestamp: new Date(),
      payload,
    }

    await this.publish(event)
  }

  /**
   * Returns the Runtime's current lifecycle state.
   */
  public getState(): RuntimeState {
    return this.state
  }

  /**
   * Sets the Runtime's lifecycle state directly. Exposed for
   * subsystems that need to signal state transitions Runtime itself
   * doesn't drive (e.g. entering BUSY while heavy work runs, or
   * UPDATING during a system update).
   *
   * @param state - The new RuntimeState.
   */
  public setState(state: RuntimeState): void {
    this.state = state
  }

  /**
   * Returns the RuntimeConfig this instance was booted with.
   */
  public getConfig(): RuntimeConfig {
    return this.config
  }

  /**
   * Invokes a single handler and swallows any synchronous throw or
   * rejected promise it produces, so one failing subscriber can never
   * interrupt delivery to the rest of the subscribers or bubble an
   * exception up through `publish`.
   */
  private async invokeSafely(
    handler: RuntimeEventHandler,
    event: RuntimeEvent
  ): Promise<void> {
    try {
      await handler(event)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      // eslint-disable-next-line no-console
      console.error(
        `Runtime: handler for event "${event.name}" (id: ${event.id}) threw an error: ${message}`
      )
    }
  }

  /**
   * Generates a deterministic-format, collision-resistant event
   * identifier using an internal monotonic sequence rather than
   * relying solely on timestamp precision.
   */
  private generateEventId(name: RuntimeEventName): string {
    this.eventSequence += 1
    return `runtime-event-${name}-${Date.now()}-${this.eventSequence}`
  }
}