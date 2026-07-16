/**
 * PlatformKernel
 *
 * Singleton kernel of the KDOS operating system. Knows about every
 * subsystem module (License Manager, Model Manager, CRM, Workflow Engine,
 * Task Engine, Execution Engine, Project Engine, Proposal Engine,
 * Quotation Engine, Lead Automation, Workforce Runtime) purely through
 * their registered PlatformModule descriptors — it never implements any
 * of them. The kernel coordinates boot, shutdown, restart, and health
 * reporting by delegating to PlatformBoot, PlatformState, PlatformHealth,
 * PlatformEvents, and PlatformRegistry.
 */

import { PlatformBoot, KNOWN_PLATFORM_MODULE_NAMES } from "./PlatformBoot";
import { PlatformState, PlatformEnvironment } from "./PlatformState";
import { PlatformEvents } from "./PlatformEvents";
import { PlatformHealth } from "./PlatformHealth";
import { PlatformModuleStatus, PlatformRegistry } from "./PlatformRegistry";

export interface PlatformKernelConfig {
  readonly version: string;
  readonly edition: string;
  readonly environment: PlatformEnvironment;
}

export class PlatformKernel {
  private static instance: PlatformKernel | null = null;

  private readonly registry: PlatformRegistry;
  private readonly events: PlatformEvents;
  private readonly boot: PlatformBoot;

  private state: PlatformState;
  private warnings: string[];
  private errors: string[];

  private constructor(
    registry: PlatformRegistry,
    events: PlatformEvents,
    boot: PlatformBoot,
    config: PlatformKernelConfig
  ) {
    this.registry = registry;
    this.events = events;
    this.boot = boot;
    this.state = PlatformState.create({
      version: config.version,
      edition: config.edition,
      environment: config.environment,
    });
    this.warnings = [];
    this.errors = [];
  }

  /**
   * Returns the singleton instance of PlatformKernel. On first call, a
   * config must be supplied (or defaults are used); subsequent calls
   * ignore the config parameter and return the existing instance.
   * Accepts optional dependency overrides for dependency injection in tests.
   */
  public static getInstance(
    config: PlatformKernelConfig = {
      version: "1.0.0",
      edition: "KDOS",
      environment: PlatformEnvironment.DEVELOPMENT,
    },
    registry?: PlatformRegistry,
    events?: PlatformEvents,
    boot?: PlatformBoot
  ): PlatformKernel {
    if (PlatformKernel.instance === null) {
      const resolvedRegistry = registry ?? PlatformRegistry.getInstance();
      const resolvedEvents = events ?? PlatformEvents.getInstance();
      const resolvedBoot = boot ?? new PlatformBoot(resolvedRegistry, resolvedEvents);

      PlatformKernel.instance = new PlatformKernel(resolvedRegistry, resolvedEvents, resolvedBoot, config);
    }
    return PlatformKernel.instance;
  }

  /**
   * Resets the singleton instance. Intended for test isolation only.
   */
  public static resetInstance(): void {
    PlatformKernel.instance = null;
  }

  /**
   * Boots the platform: runs the full PlatformBoot sequence over the given
   * module names, transitions PlatformState to booted, and emits a
   * PLATFORM_BOOTED event. Throws if already booted, or records module
   * loading/verification/start failures as errors rather than throwing,
   * since partial subsystem failure should not crash the kernel itself.
   */
  public boot(moduleNames: readonly string[] = KNOWN_PLATFORM_MODULE_NAMES): PlatformState {
    if (this.state.booted) {
      throw new Error("PlatformKernel is already booted.");
    }

    this.warnings = [];
    this.errors = [];

    try {
      const result = this.boot.runFullSequence(moduleNames);

      if (result.startedModuleIds.length < moduleNames.length) {
        this.warnings.push(
          `Only ${result.startedModuleIds.length} of ${moduleNames.length} modules reached RUNNING status.`
        );
      }
    } catch (error) {
      const reason = error instanceof Error ? error.message : "Unknown boot error.";
      this.errors.push(reason);
    }

    this.state = this.state.withBooted();
    this.events.emit("PLATFORM_BOOTED", { startedAt: this.state.startedAt });

    return this.state;
  }

  /**
   * Shuts down the platform: transitions every RUNNING module to STOPPED,
   * transitions PlatformState to not-booted, and emits a
   * PLATFORM_SHUTDOWN event. Throws if not currently booted.
   */
  public shutdown(): PlatformState {
    if (!this.state.booted) {
      throw new Error("PlatformKernel is not booted and cannot be shut down.");
    }

    for (const platformModule of this.registry.listByStatus(PlatformModuleStatus.RUNNING)) {
      const stopped = platformModule.withStatus(PlatformModuleStatus.STOPPED);
      this.registry.update(stopped);
      this.events.emit("PLATFORM_MODULE_STOPPED", { moduleId: stopped.id, moduleName: stopped.name });
    }

    this.state = this.state.withShutdown();
    this.events.emit("PLATFORM_SHUTDOWN", {});

    return this.state;
  }

  /**
   * Restarts the platform: shuts down if currently booted, then boots
   * again over the given module names.
   */
  public restart(moduleNames: readonly string[] = KNOWN_PLATFORM_MODULE_NAMES): PlatformState {
    if (this.state.booted) {
      this.shutdown();
    }

    this.events.emit("PLATFORM_RESTARTING", {});
    return this.boot(moduleNames);
  }

  /**
   * Returns the current PlatformState snapshot.
   */
  public getState(): PlatformState {
    return this.state;
  }

  /**
   * Returns the current PlatformHealth snapshot, derived from accumulated
   * warnings/errors and, if booted, current uptime. Any module in FAILED
   * status contributes an additional error entry.
   */
  public getHealth(): PlatformHealth {
    const moduleFailures = this.registry
      .listByStatus(PlatformModuleStatus.FAILED)
      .map((platformModule) => `Module "${platformModule.name}" is in FAILED status.`);

    const uptime = this.state.booted ? this.state.uptime() : 0;

    return PlatformHealth.evaluate({
      warnings: this.warnings,
      errors: [...this.errors, ...moduleFailures],
      uptime,
    });
  }
}