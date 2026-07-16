/**
 * PlatformEvents
 *
 * Singleton in-process event bus used by the Platform Kernel and its
 * coordinated subsystems to broadcast lifecycle events (boot phases,
 * module status changes, shutdown, health changes) without those
 * subsystems needing direct references to one another. Map-based
 * subscriber storage only. No networking, no external dependencies.
 */

export interface PlatformEvent {
  readonly type: string;
  readonly payload: Readonly<Record<string, unknown>>;
  readonly emittedAt: Date;
}

export type PlatformEventHandler = (event: PlatformEvent) => void;

export class PlatformEvents {
  private static instance: PlatformEvents | null = null;

  private readonly subscribers: Map<string, Map<string, PlatformEventHandler>>;
  private subscriptionCounter: number;

  private constructor() {
    this.subscribers = new Map<string, Map<string, PlatformEventHandler>>();
    this.subscriptionCounter = 0;
  }

  /**
   * Returns the singleton instance of PlatformEvents.
   */
  public static getInstance(): PlatformEvents {
    if (PlatformEvents.instance === null) {
      PlatformEvents.instance = new PlatformEvents();
    }
    return PlatformEvents.instance;
  }

  /**
   * Resets the singleton instance. Intended for test isolation only.
   */
  public static resetInstance(): void {
    PlatformEvents.instance = null;
  }

  /**
   * Emits an event of the given type to all current subscribers of that
   * type. Subscribers are invoked synchronously, in subscription order.
   */
  public emit(type: string, payload: Readonly<Record<string, unknown>> = {}): void {
    if (!type || type.trim().length === 0) {
      throw new Error("PlatformEvents requires a non-empty event type.");
    }

    const event: PlatformEvent = {
      type,
      payload,
      emittedAt: new Date(),
    };

    const handlers = this.subscribers.get(type);
    if (!handlers) {
      return;
    }

    for (const handler of handlers.values()) {
      handler(event);
    }
  }

  /**
   * Subscribes a handler to events of the given type. Returns a
   * subscription id that must be used to unsubscribe later.
   */
  public subscribe(type: string, handler: PlatformEventHandler): string {
    if (!type || type.trim().length === 0) {
      throw new Error("PlatformEvents requires a non-empty event type.");
    }

    const subscriptionId = `sub-${this.subscriptionCounter++}`;

    const existing = this.subscribers.get(type) ?? new Map<string, PlatformEventHandler>();
    existing.set(subscriptionId, handler);
    this.subscribers.set(type, existing);

    return subscriptionId;
  }

  /**
   * Unsubscribes a previously registered handler using its subscription id.
   * Throws if no such subscription exists for the given type.
   */
  public unsubscribe(type: string, subscriptionId: string): void {
    const handlers = this.subscribers.get(type);
    if (!handlers || !handlers.has(subscriptionId)) {
      throw new Error(
        `No subscription with id "${subscriptionId}" found for event type "${type}".`
      );
    }

    handlers.delete(subscriptionId);
    if (handlers.size === 0) {
      this.subscribers.delete(type);
    }
  }

  /**
   * Returns the number of active subscribers for the given event type.
   */
  public subscriberCount(type: string): number {
    return this.subscribers.get(type)?.size ?? 0;
  }
}