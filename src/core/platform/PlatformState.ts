/**
 * PlatformState
 *
 * Immutable snapshot of the Platform Kernel's current lifecycle state:
 * whether it has booted, when it started, and which version/edition/
 * environment it is running as. Owned and transitioned exclusively by
 * PlatformKernel.
 */

export enum PlatformEnvironment {
  DEVELOPMENT = "DEVELOPMENT",
  STAGING = "STAGING",
  PRODUCTION = "PRODUCTION",
}

export interface PlatformStateProps {
  readonly booted: boolean;
  readonly startedAt: Date | null;
  readonly version: string;
  readonly edition: string;
  readonly environment: PlatformEnvironment;
}

export class PlatformState {
  public readonly booted: boolean;
  public readonly startedAt: Date | null;
  public readonly version: string;
  public readonly edition: string;
  public readonly environment: PlatformEnvironment;

  private constructor(props: PlatformStateProps) {
    this.booted = props.booted;
    this.startedAt = props.startedAt;
    this.version = props.version;
    this.edition = props.edition;
    this.environment = props.environment;
  }

  /**
   * Creates the initial, un-booted PlatformState for the given version/edition/environment.
   */
  public static create(props: {
    version: string;
    edition: string;
    environment: PlatformEnvironment;
  }): PlatformState {
    if (!props.version || props.version.trim().length === 0) {
      throw new Error("PlatformState requires a non-empty version.");
    }
    if (!props.edition || props.edition.trim().length === 0) {
      throw new Error("PlatformState requires a non-empty edition.");
    }

    return new PlatformState({
      booted: false,
      startedAt: null,
      version: props.version,
      edition: props.edition,
      environment: props.environment,
    });
  }

  /**
   * Reconstructs a PlatformState from a stored snapshot.
   */
  public static fromSnapshot(snapshot: PlatformStateProps): PlatformState {
    return new PlatformState(snapshot);
  }

  /**
   * Returns a new PlatformState marked as booted, timestamped at the
   * moment of transition. Throws if already booted.
   */
  public withBooted(): PlatformState {
    if (this.booted) {
      throw new Error("PlatformState is already booted.");
    }

    return new PlatformState({
      booted: true,
      startedAt: new Date(),
      version: this.version,
      edition: this.edition,
      environment: this.environment,
    });
  }

  /**
   * Returns a new PlatformState marked as not booted, clearing startedAt.
   * Throws if not currently booted.
   */
  public withShutdown(): PlatformState {
    if (!this.booted) {
      throw new Error("PlatformState is not booted and cannot be shut down.");
    }

    return new PlatformState({
      booted: false,
      startedAt: null,
      version: this.version,
      edition: this.edition,
      environment: this.environment,
    });
  }

  /**
   * Returns the uptime in milliseconds since startedAt, relative to the
   * given reference time. Throws if not currently booted.
   */
  public uptime(referenceTime: Date = new Date()): number {
    if (!this.booted || !this.startedAt) {
      throw new Error("PlatformState is not booted and has no uptime.");
    }
    return referenceTime.getTime() - this.startedAt.getTime();
  }

  /**
   * Returns a plain serialisable snapshot of this state.
   */
  public toSnapshot(): PlatformStateProps {
    return {
      booted: this.booted,
      startedAt: this.startedAt,
      version: this.version,
      edition: this.edition,
      environment: this.environment,
    };
  }
}