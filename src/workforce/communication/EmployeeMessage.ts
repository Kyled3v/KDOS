/**
 * EmployeeMessage
 *
 * Represents a single message passed between employees via the Message
 * Bus, enabling collaboration and handoff without employees holding
 * direct references to one another. Immutable value object.
 */

export enum MessagePriority {
  LOW = "LOW",
  NORMAL = "NORMAL",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export interface EmployeeMessageProps {
  readonly id: string;
  readonly sender: string;
  readonly receiver: string;
  readonly timestamp: Date;
  readonly priority: MessagePriority;
  readonly payload: Readonly<Record<string, unknown>>;
}

export class EmployeeMessage {
  public readonly id: string;
  public readonly sender: string;
  public readonly receiver: string;
  public readonly timestamp: Date;
  public readonly priority: MessagePriority;
  public readonly payload: Readonly<Record<string, unknown>>;

  private constructor(props: EmployeeMessageProps) {
    this.id = props.id;
    this.sender = props.sender;
    this.receiver = props.receiver;
    this.timestamp = props.timestamp;
    this.priority = props.priority;
    this.payload = props.payload;
  }

  /**
   * Creates a new EmployeeMessage, timestamped at the moment of creation.
   */
  public static create(props: {
    id: string;
    sender: string;
    receiver: string;
    priority: MessagePriority;
    payload: Readonly<Record<string, unknown>>;
  }): EmployeeMessage {
    if (!props.id || props.id.trim().length === 0) {
      throw new Error("EmployeeMessage requires a non-empty id.");
    }
    if (!props.sender || props.sender.trim().length === 0) {
      throw new Error("EmployeeMessage requires a non-empty sender.");
    }
    if (!props.receiver || props.receiver.trim().length === 0) {
      throw new Error("EmployeeMessage requires a non-empty receiver.");
    }
    if (props.sender === props.receiver) {
      throw new Error("EmployeeMessage sender and receiver cannot be the same employee.");
    }

    return new EmployeeMessage({
      id: props.id,
      sender: props.sender,
      receiver: props.receiver,
      timestamp: new Date(),
      priority: props.priority,
      payload: props.payload,
    });
  }

  /**
   * Reconstructs an EmployeeMessage from a stored snapshot.
   */
  public static fromSnapshot(snapshot: EmployeeMessageProps): EmployeeMessage {
    return new EmployeeMessage(snapshot);
  }

  /**
   * Returns a plain serialisable snapshot of this message.
   */
  public toSnapshot(): EmployeeMessageProps {
    return {
      id: this.id,
      sender: this.sender,
      receiver: this.receiver,
      timestamp: this.timestamp,
      priority: this.priority,
      payload: this.payload,
    };
  }
}