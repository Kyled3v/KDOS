/**
 * ServiceRegistry
 *
 * Singleton in-memory registry providing lookup access over the master
 * SERVICE_CATALOG. This is the access layer every consuming subsystem
 * (CRM, Proposal Engine, Quotation Engine, Project Engine, Invoice
 * Engine, Sales AI, Marketing AI, Customer Success, website, desktop
 * app) should use rather than importing SERVICE_CATALOG directly, so
 * catalogue access is centralised and consistent. Map-based storage
 * only. No database, no networking, no external dependencies.
 */

import { ServiceCategory } from "./ServiceCategory";
import { ServicePackage, ServicePriority } from "./ServicePackage";
import { SERVICE_CATALOG } from "./ServiceCatalog";

export class ServiceRegistry {
  private static instance: ServiceRegistry | null = null;

  private readonly services: Map<string, ServicePackage>;

  private constructor(catalog: readonly ServicePackage[]) {
    this.services = new Map<string, ServicePackage>();

    for (const service of catalog) {
      if (this.services.has(service.id)) {
        throw new Error(`Duplicate service id "${service.id}" found while seeding ServiceRegistry.`);
      }
      this.services.set(service.id, service);
    }
  }

  /**
   * Returns the singleton instance of ServiceRegistry, seeded from
   * SERVICE_CATALOG on first access.
   */
  public static getInstance(): ServiceRegistry {
    if (ServiceRegistry.instance === null) {
      ServiceRegistry.instance = new ServiceRegistry(SERVICE_CATALOG);
    }
    return ServiceRegistry.instance;
  }

  /**
   * Resets the singleton instance. Intended for test isolation only.
   */
  public static resetInstance(): void {
    ServiceRegistry.instance = null;
  }

  /**
   * Finds a service package by id. Throws if no service with that id exists.
   */
  public find(id: string): ServicePackage {
    const service = this.services.get(id);
    if (!service) {
      throw new Error(`No service found with id "${id}".`);
    }
    return service;
  }

  /**
   * Returns true if a service with the given id exists in the catalogue.
   */
  public has(id: string): boolean {
    return this.services.has(id);
  }

  /**
   * Lists every service in the catalogue.
   */
  public list(): readonly ServicePackage[] {
    return Array.from(this.services.values());
  }

  /**
   * Lists all services within a given category.
   */
  public listByCategory(category: ServiceCategory): readonly ServicePackage[] {
    return this.list().filter((service) => service.category === category);
  }

  /**
   * Lists all services at or above the given priority tier, ordered
   * CORE > HIGH_DEMAND > STANDARD > SPECIALIST.
   */
  public listByPriority(priority: ServicePriority): readonly ServicePackage[] {
    return this.list().filter((service) => service.priority === priority);
  }

  /**
   * Resolves the recommended add-on ServicePackages for a given service id.
   * Throws if the base service id does not exist.
   */
  public resolveAddOns(serviceId: string): readonly ServicePackage[] {
    const service = this.find(serviceId);
    return service.recommendedAddOnIds
      .filter((addOnId) => this.services.has(addOnId))
      .map((addOnId) => this.find(addOnId));
  }

  /**
   * Returns all services whose startingPriceZAR falls within the given
   * inclusive range.
   */
  public listByPriceRange(minZAR: number, maxZAR: number): readonly ServicePackage[] {
    if (maxZAR < minZAR) {
      throw new Error("ServiceRegistry.listByPriceRange requires maxZAR >= minZAR.");
    }
    return this.list().filter(
      (service) =>
        service.pricing.startingPriceZAR >= minZAR && service.pricing.startingPriceZAR <= maxZAR
    );
  }

  /**
   * Returns the total number of services in the catalogue.
   */
  public count(): number {
    return this.services.size;
  }
}