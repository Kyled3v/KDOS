/**
 * ServiceContainer
 *
 * Singleton dependency-injection container holding the single shared
 * instance of every KDOS subsystem singleton service (License Manager,
 * Model Manager, CRM, Workflow Engine, Execution Engine, Task Engine,
 * Proposal Engine, Quotation Engine, Project Engine, Lead Automation,
 * Workforce Runtime). ServiceContainer does not construct or implement
 * any subsystem itself — it only holds references handed to it by
 * ModuleLoader, keyed by a stable service token, and hands them back out
 * on request. Map-based storage only. No networking, no database, no
 * external dependencies.
 */

export enum ServiceToken {
  LICENSE_MANAGER = "LICENSE_MANAGER",
  MODEL_MANAGER = "MODEL_MANAGER",
  CRM = "CRM",
  WORKFLOW_ENGINE = "WORKFLOW_ENGINE",
  EXECUTION_ENGINE = "EXECUTION_ENGINE",
  TASK_MANAGER = "TASK_MANAGER",
  PROPOSAL_GENERATOR = "PROPOSAL_GENERATOR",
  QUOTATION_GENERATOR = "QUOTATION_GENERATOR",
  PROJECT_MANAGER = "PROJECT_MANAGER",
  LEAD_AUTOMATION = "LEAD_AUTOMATION",
  WORKFORCE_RUNTIME = "WORKFORCE_RUNTIME",
}

export class ServiceContainer {
  private static instance: ServiceContainer | null = null;

  private readonly services: Map<ServiceToken, unknown>;

  private constructor() {
    this.services = new Map<ServiceToken, unknown>();
  }

  /**
   * Returns the singleton instance of ServiceContainer.
   */
  public static getInstance(): ServiceContainer {
    if (ServiceContainer.instance === null) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  /**
   * Resets the singleton instance. Intended for test isolation only.
   */
  public static resetInstance(): void {
    ServiceContainer.instance = null;
  }

  /**
   * Registers a service instance under the given token. Throws if a
   * service is already registered under that token.
   */
  public register<T>(token: ServiceToken, service: T): void {
    if (this.services.has(token)) {
      throw new Error(`Service already registered for token "${token}".`);
    }
    this.services.set(token, service);
  }

  /**
   * Replaces an already-registered service instance for the given token.
   * Throws if no service is registered under that token.
   */
  public replace<T>(token: ServiceToken, service: T): void {
    if (!this.services.has(token)) {
      throw new Error(`Cannot replace unregistered service for token "${token}".`);
    }
    this.services.set(token, service);
  }

  /**
   * Resolves a service instance by token, cast to the requested type.
   * Throws if no service is registered under that token.
   */
  public resolve<T>(token: ServiceToken): T {
    const service = this.services.get(token);
    if (service === undefined) {
      throw new Error(`No service registered for token "${token}".`);
    }
    return service as T;
  }

  /**
   * Returns true if a service is registered under the given token.
   */
  public has(token: ServiceToken): boolean {
    return this.services.has(token);
  }

  /**
   * Removes a registered service by token. Throws if none is registered.
   */
  public remove(token: ServiceToken): void {
    if (!this.services.has(token)) {
      throw new Error(`Cannot remove unregistered service for token "${token}".`);
    }
    this.services.delete(token);
  }

  /**
   * Lists all currently registered service tokens.
   */
  public listTokens(): readonly ServiceToken[] {
    return Array.from(this.services.keys());
  }

  /**
   * Returns the number of currently registered services.
   */
  public count(): number {
    return this.services.size;
  }

  /**
   * Clears every registered service. Intended for test isolation only.
   */
  public clear(): void {
    this.services.clear();
  }
}