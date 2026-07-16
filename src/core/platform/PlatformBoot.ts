/**
 * PlatformBoot
 *
 * Coordinates the ordered boot sequence for all known subsystem modules
 * (License Manager, Model Manager, CRM, Workflow Engine, Task Engine,
 * Execution Engine, Project Engine, Proposal Engine, Quotation Engine,
 * Lead Automation, Workforce Runtime): initialize -> loadModules ->
 * verifyModules -> startServices. PlatformBoot does not implement any
 * subsystem itself — it only registers module descriptors in
 * PlatformRegistry and drives their status forward. Not a singleton;
 * PlatformKernel owns a single instance per boot cycle.
 */

import { PlatformModule, PlatformModuleStatus, PlatformRegistry } from "./PlatformRegistry";
import { PlatformEvents } from "./PlatformEvents";

export const KNOWN_PLATFORM_MODULE_NAMES: readonly string[] = [
  "License Manager",
  "Model Manager",
  "CRM",
  "Workflow Engine",
  "Task Engine",
  "Execution Engine",
  "Project Engine",
  "Proposal Engine",
  "Quotation Engine",
  "Lead Automation",
  "Workforce Runtime",
];

export interface PlatformBootResult {
  readonly initialized: boolean;
  readonly loadedModuleIds: readonly string[];
  readonly verifiedModuleIds: readonly string[];
  readonly startedModuleIds: readonly string[];
}

export class PlatformBoot {
  private readonly registry: PlatformRegistry;
  private readonly events: PlatformEvents;

  /**
   * Constructs a PlatformBoot bound to a specific PlatformRegistry and
   * PlatformEvents instance, supplied via dependency injection.
   */
  public constructor(registry: PlatformRegistry, events: PlatformEvents) {
    this.registry = registry;
    this.events = events;
  }

  /**
   * Performs pre-flight initialization: emits a PLATFORM_INITIALIZING
   * event. Returns true once initialization has completed.
   */
  public initialize(): boolean {
    this.events.emit("PLATFORM_INITIALIZING", {});
    return true;
  }

  /**
   * Registers a PlatformModule descriptor for each known module name that
   * is not already registered, then transitions each to LOADED. Returns
   * the ids of modules that were loaded during this call.
   */
  public loadModules(moduleNames: readonly string[] = KNOWN_PLATFORM_MODULE_NAMES): readonly string[] {
    const loadedIds: string[] = [];

    for (const name of moduleNames) {
      const id = PlatformBoot.moduleIdFromName(name);

      const registered = this.registry.has(id)
        ? this.registry.find(id)
        : PlatformModule.create({ id, name });

      if (!this.registry.has(id)) {
        this.registry.register(registered);
      }

      const loaded = registered.withStatus(PlatformModuleStatus.LOADED);
      this.registry.update(loaded);
      loadedIds.push(loaded.id);

      this.events.emit("PLATFORM_MODULE_LOADED", { moduleId: loaded.id, moduleName: loaded.name });
    }

    return loadedIds;
  }

  /**
   * Transitions each currently LOADED module to VERIFIED. Returns the ids
   * of modules verified during this call.
   */
  public verifyModules(): readonly string[] {
    const verifiedIds: string[] = [];

    for (const platformModule of this.registry.listByStatus(PlatformModuleStatus.LOADED)) {
      const verified = platformModule.withStatus(PlatformModuleStatus.VERIFIED);
      this.registry.update(verified);
      verifiedIds.push(verified.id);

      this.events.emit("PLATFORM_MODULE_VERIFIED", { moduleId: verified.id, moduleName: verified.name });
    }

    return verifiedIds;
  }

  /**
   * Transitions each currently VERIFIED module to RUNNING. Returns the ids
   * of modules started during this call.
   */
  public startServices(): readonly string[] {
    const startedIds: string[] = [];

    for (const platformModule of this.registry.listByStatus(PlatformModuleStatus.VERIFIED)) {
      const running = platformModule.withStatus(PlatformModuleStatus.RUNNING);
      this.registry.update(running);
      startedIds.push(running.id);

      this.events.emit("PLATFORM_MODULE_STARTED", { moduleId: running.id, moduleName: running.name });
    }

    return startedIds;
  }

  /**
   * Runs the full boot sequence in order and returns a summary result.
   */
  public runFullSequence(moduleNames: readonly string[] = KNOWN_PLATFORM_MODULE_NAMES): PlatformBootResult {
    const initialized = this.initialize();
    const loadedModuleIds = this.loadModules(moduleNames);
    const verifiedModuleIds = this.verifyModules();
    const startedModuleIds = this.startServices();

    return {
      initialized,
      loadedModuleIds,
      verifiedModuleIds,
      startedModuleIds,
    };
  }

  /**
   * Derives a stable module id from a human-readable module name.
   */
  private static moduleIdFromName(name: string): string {
    return name.trim().toLowerCase().replace(/\s+/g, "-");
  }
}