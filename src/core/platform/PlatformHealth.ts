/**
 * PlatformHealth
 *
 * Immutable snapshot describing the overall health of the platform:
 * whether it is healthy, any accumulated warnings or errors, and its
 * current uptime. Derived by PlatformKernel from PlatformState and the
 * module statuses tracked in PlatformRegistry — this class holds no
 * subsystem logic itself.
 */

export interface PlatformHealthProps {
  readonly healthy: boolean;
  readonly warnings: readonly string[];
  readonly errors: readonly string[];
  readonly uptime: number;
}

export class PlatformHealth {
  public readonly healthy: boolean;
  public readonly warnings: readonly string[];
  public readonly errors: readonly string[];
  public readonly uptime: number;

  private constructor(props: PlatformHealthProps) {
    this.healthy = props.healthy;
    this.warnings = props.warnings;
    this.errors = props.errors;
    this.uptime = props.uptime;
  }

  /**
   * Builds a PlatformHealth snapshot from the given warnings, errors, and
   * uptime. The platform is considered healthy if and only if there are
   * no errors; warnings alone do not affect health.
   */
  public static evaluate(props: {
    warnings: readonly string[];
    errors: readonly string[];
    uptime: number;
  }): PlatformHealth {
    if (props.uptime < 0) {
      throw new Error("PlatformHealth uptime cannot be negative.");
    }

    return new PlatformHealth({
      healthy: props.errors.length === 0,
      warnings: props.warnings,
      errors: props.errors,
      uptime: props.uptime,
    });
  }

  /**
   * Reconstructs a PlatformHealth snapshot from a stored snapshot.
   */
  public static fromSnapshot(snapshot: PlatformHealthProps): PlatformHealth {
    return new PlatformHealth(snapshot);
  }

  /**
   * Returns true if there is at least one warning or error recorded.
   */
  public hasIssues(): boolean {
    return this.warnings.length > 0 || this.errors.length > 0;
  }

  /**
   * Returns a plain serialisable snapshot of this health record.
   */
  public toSnapshot(): PlatformHealthProps {
    return {
      healthy: this.healthy,
      warnings: this.warnings,
      errors: this.errors,
      uptime: this.uptime,
    };
  }
}