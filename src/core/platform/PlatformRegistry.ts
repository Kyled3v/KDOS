/**
 * PlatformRegistry
 *
 * Singleton in-memory registry of the subsystem modules known to the
 * Platform Kernel (License Manager, Model Manager, CRM, Workflow Engine,
 * Task Engine, Execution Engine, Project Engine, Proposal Engine,
 * Quotation Engine, Lead Automation, Workforce Runtime, and any future
 * subsystem). The registry holds only module descriptors and status —
 * it never implements subsystem behaviour itself. Uses Map-based storage
 * only. No database, no networking, no external dependencies.
 */

export enum PlatformModuleStatus {
  UNREGISTERED = "UNREGISTERED",
  REGISTERED = "REGISTERED",
  LOADED = "LOADED",
  VERIFIED = "VERIFIED",
  RUNNING = "RUNNING",
  STOPPED = "STOPPED",
  FAILED = "FAILED",
}

export interface PlatformModuleProps {
  readonly id: string;
  readonly name: string;
  readonly status: PlatformModuleStatus;
  readonly registeredAt: Date;
}

const VALID_TRANSITIONS: Readonly<Record<PlatformModuleStatus, readonly PlatformModuleStatus[]>> = {
  [PlatformModuleStatus.UNREGISTERED]: [PlatformModuleStatus.REGISTERED],
  [PlatformModuleStatus.REGISTERED]: [PlatformModuleStatus.LOADED, PlatformModuleStatus.FAILED],
  [PlatformModuleStatus.LOADED]: [PlatformModuleStatus.VERIFIED, PlatformModuleStatus.FAILED],
  [PlatformModuleStatus.VERIFIED]: [PlatformModuleStatus.RUNNING, PlatformModuleStatus.FAILED],
  [PlatformModuleStatus.RUNNING]: [PlatformModuleStatus.STOPPED, PlatformModuleStatus.FAILED],
  [PlatformModuleStatus.STOPPED]: [PlatformModuleStatus.RUNNING],
  [PlatformModuleStatus.FAILED]: [PlatformModuleStatus.REGISTERED],
};

export class PlatformModule {
  public readonly id: string;
  public readonly name: string;
  public readonly status: PlatformModuleStatus;
  public readonly registeredAt: Date;

  private constructor(props: PlatformModuleProps) {
    this.id = props.id;
    this.name = props.name;
    this.status = props.status;
    this.registeredAt = props.registeredAt;
  }

  /**
   * Creates a new PlatformModule descriptor in REGISTERED status.
   */
  public static create(props: { id: string; name: string }): PlatformModule {
    if (!props.id || props.id.trim().length === 0) {
      throw new Error("PlatformModule requires a non-empty id.");
    }
    if (!props.name || props.name.trim().length === 0) {
      throw new Error("PlatformModule requires a non-empty name.");
    }

    return new PlatformModule({
      id: props.id,
      name: props.name,
      status: PlatformModuleStatus.REGISTERED,
      registeredAt: new Date(),
    });
  }

  /**
   * Reconstructs a PlatformModule from a stored snapshot.
   */
  public static fromSnapshot(snapshot: PlatformModuleProps): PlatformModule {
    return new PlatformModule(snapshot);
  }

  /**
   * Returns a new PlatformModule transitioned to the given status.
   * Throws if the transition is not valid from the current status.
   */
  public withStatus(status: PlatformModuleStatus): PlatformModule {
    const allowed = VALID_TRANSITIONS[this.status];

    if (!allowed.includes(status)) {
      throw new Error(
        `Invalid module status transition from "${this.status}" to "${status}" for module "${this.id}".`
      );
    }

    return new PlatformModule({
      id: this.id,
      name: this.name,
      status,
      registeredAt: this.registeredAt,
    });
  }

  /**
   * Returns a plain serialisable snapshot of this module descriptor.
   */
  public toSnapshot(): PlatformModuleProps {
    return {
      id: this.id,
      name: this.name,
      status: this.status,
      registeredAt: this.registeredAt,
    };
  }
}

export class PlatformRegistry {
  private static instance: PlatformRegistry | null = null;

  private readonly modules: Map<string, PlatformModule>;

  private constructor() {
    this.modules = new Map<string, PlatformModule>();
  }

  /**
   * Returns the singleton instance of PlatformRegistry.
   */
  public static getInstance(): PlatformRegistry {
    if (PlatformRegistry.instance === null) {
      PlatformRegistry.instance = new PlatformRegistry();
    }
    return PlatformRegistry.instance;
  }

  /**
   * Resets the singleton instance. Intended for test isolation only.
   */
  public static resetInstance(): void {
    PlatformRegistry.instance = null;
  }

  /**
   * Registers a module descriptor. Throws if a module with the same id
   * already exists.
   */
  public register(platformModule: PlatformModule): void {
    if (this.modules.has(platformModule.id)) {
      throw new Error(`Module with id "${platformModule.id}" is already registered.`);
    }
    this.modules.set(platformModule.id, platformModule);
  }

  /**
   * Replaces an already-registered module descriptor with an updated instance.
   * Throws if no module with that id is registered.
   */
  public update(platformModule: PlatformModule): void {
    if (!this.modules.has(platformModule.id)) {
      throw new Error(`Cannot update unregistered module with id "${platformModule.id}".`);
    }
    this.modules.set(platformModule.id, platformModule);
  }

  /**
   * Removes a module descriptor by id. Throws if no module with that id exists.
   */
  public remove(id: string): void {
    if (!this.modules.has(id)) {
      throw new Error(`Cannot remove unregistered module with id "${id}".`);
    }
    this.modules.delete(id);
  }

  /**
   * Finds a module descriptor by id. Throws if no module with that id exists.
   */
  public find(id: string): PlatformModule {
    const platformModule = this.modules.get(id);
    if (!platformModule) {
      throw new Error(`No module found with id "${id}".`);
    }
    return platformModule;
  }

  /**
   * Returns true if a module with the given id is registered.
   */
  public has(id: string): boolean {
    return this.modules.has(id);
  }

  /**
   * Lists all registered module descriptors.
   */
  public list(): readonly PlatformModule[] {
    return Array.from(this.modules.values());
  }

  /**
   * Lists all module descriptors currently in the given status.
   */
  public listByStatus(status: PlatformModuleStatus): readonly PlatformModule[] {
    return this.list().filter((platformModule) => platformModule.status === status);
  }

  /**
   * Returns the total number of registered modules.
   */
  public count(): number {
    return this.modules.size;
  }
}