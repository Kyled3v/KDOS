/**
 * MessageBus
 *
 * Singleton in-process message bus allowing employees to communicate
 * without holding direct references to one another. Messages are
 * delivered into per-receiver inboxes and drained on request; there is
 * no background delivery loop. Map-based storage only. No networking,
 * no external dependencies.
 */

import { EmployeeMessage, MessagePriority } from "./EmployeeMessage";

const PRIORITY_WEIGHT: Readonly<Record<MessagePriority, number>> = {
  [MessagePriority.URGENT]: 4,
  [MessagePriority.HIGH]: 3,
  [MessagePriority.NORMAL]: 2,
  [MessagePriority.LOW]: 1,
};

export class MessageBus {
  private static instance: MessageBus | null = null;

  private readonly inboxes: Map<string, EmployeeMessage[]>;
  private messageCounter: number;

  private constructor() {
    this.inboxes = new Map<string, EmployeeMessage[]>();
    this.messageCounter = 0;
  }

  /**
   * Returns the singleton instance of MessageBus.
   */
  public static getInstance(): MessageBus {
    if (MessageBus.instance === null) {
      MessageBus.instance = new MessageBus();
    }
    return MessageBus.instance;
  }

  /**
   * Resets the singleton instance. Intended for test isolation only.
   */
  public static resetInstance(): void {
    MessageBus.instance = null;
  }

  /**
   * Sends a message from one employee to another, delivering it into the
   * receiver's inbox ordered by priority (highest first), then by
   * send order.
   */
  public send(input: {
    sender: string;
    receiver: string;
    priority: MessagePriority;
    payload: Readonly<Record<string, unknown>>;
  }): EmployeeMessage {
    const message = EmployeeMessage.create({
      id: `msg-${this.messageCounter++}`,
      sender: input.sender,
      receiver: input.receiver,
      priority: input.priority,
      payload: input.payload,
    });

    const inbox = this.inboxes.get(input.receiver) ?? [];
    inbox.push(message);
    inbox.sort((a, b) => PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority]);
    this.inboxes.set(input.receiver, inbox);

    return message;
  }

  /**
   * Drains and returns every pending message for a receiver, in priority
   * order. Clears the inbox as part of draining.
   */
  public drainInbox(receiver: string): readonly EmployeeMessage[] {
    const inbox = this.inboxes.get(receiver) ?? [];
    this.inboxes.set(receiver, []);
    return inbox;
  }

  /**
   * Returns the pending messages for a receiver without removing them.
   */
  public peekInbox(receiver: string): readonly EmployeeMessage[] {
    return this.inboxes.get(receiver) ?? [];
  }

  /**
   * Returns the number of pending messages for a receiver.
   */
  public inboxSize(receiver: string): number {
    return this.inboxes.get(receiver)?.length ?? 0;
  }

  /**
   * Clears every pending message for a receiver.
   */
  public clearInbox(receiver: string): void {
    this.inboxes.set(receiver, []);
  }
}