/**
 * ModelRegistry.ts
 *
 * Location: src/core/models/ModelRegistry.ts
 *
 * ModelRegistry is the in-memory record of every model KDOS knows
 * about — installed or not, enabled or not. It performs no runtime
 * communication of its own; ModelProvider handles talking to the
 * actual AI runtime, and ModelManager coordinates the two. This class
 * is purely a store and its query/mutation surface.
 */

import type { Model } from './Model'

/**
 * ModelRegistry
 *
 * Single responsibility: hold Model records and provide lookup,
 * registration, removal, and enable/disable operations over them.
 *
 * This class:
 *   - Stores models in a Map<string, Model>, keyed by model id.
 *   - Performs no network access and knows nothing about any
 *     concrete AI runtime.
 *   - Never mutates a returned Model in place; every change produces
 *     a new, frozen record.
 *   - Is dependency-injection ready: it takes no external
 *     dependencies, so it can be constructed freely or supplied
 *     wherever a ModelRegistry is required.
 */
export class ModelRegistry {
  /**
   * Internal in-memory model store, keyed by model id.
   */
  private readonly models = new Map<string, Model>()

  /**
   * Registers a model in the registry. If a model with the same id
   * is already registered, it is replaced with the new record.
   *
   * @param model - The Model to register.
   * @returns The registered Model.
   */
  public register(model: Model): Model {
    const frozen = Object.freeze({ ...model })
    this.models.set(frozen.id, frozen)
    return frozen
  }

  /**
   * Removes a model from the registry entirely.
   *
   * @param modelId - The id of the Model to remove.
   * @throws Error if no Model exists for the given id.
   */
  public remove(modelId: string): void {
    this.requireModel(modelId)
    this.models.delete(modelId)
  }

  /**
   * Finds a single model by id.
   *
   * @param modelId - The id of the Model to find.
   * @returns The Model, or undefined if no Model exists for the
   *          given id.
   */
  public find(modelId: string): Model | undefined {
    return this.models.get(modelId)
  }

  /**
   * Finds the model currently marked as the default, if any.
   *
   * @returns The default Model, or undefined if no model is
   *          currently marked as default.
   */
  public findDefault(): Model | undefined {
    return [...this.models.values()].find((model) => model.defaultModel)
  }

  /**
   * Lists every registered model, optionally filtered by
   * installed and/or enabled state.
   *
   * @param filter - Optional filters to narrow the result set.
   * @param filter.installed - If supplied, only models with this
   *        installed state are returned.
   * @param filter.enabled - If supplied, only models with this
   *        enabled state are returned.
   * @returns The matching Models.
   */
  public list(filter?: { installed?: boolean; enabled?: boolean }): Model[] {
    let results = [...this.models.values()]

    if (filter?.installed !== undefined) {
      results = results.filter((model) => model.installed === filter.installed)
    }

    if (filter?.enabled !== undefined) {
      results = results.filter((model) => model.enabled === filter.enabled)
    }

    return results
  }

  /**
   * Marks a model as enabled.
   *
   * @param modelId - The id of the Model to enable.
   * @returns The updated Model.
   * @throws Error if no Model exists for the given id.
   */
  public enable(modelId: string): Model {
    return this.setEnabled(modelId, true)
  }

  /**
   * Marks a model as disabled.
   *
   * @param modelId - The id of the Model to disable.
   * @returns The updated Model.
   * @throws Error if no Model exists for the given id.
   */
  public disable(modelId: string): Model {
    return this.setEnabled(modelId, false)
  }

  /**
   * Applies an enabled/disabled state change to a model.
   */
  private setEnabled(modelId: string, enabled: boolean): Model {
    const model = this.requireModel(modelId)

    const updated: Model = Object.freeze({
      ...model,
      enabled,
    })

    this.models.set(modelId, updated)
    return updated
  }

  /**
   * Retrieves a Model by id or throws if none exists, so calling
   * methods can operate on a guaranteed-defined Model.
   */
  private requireModel(modelId: string): Model {
    const model = this.models.get(modelId)
    if (!model) {
      throw new Error(`ModelRegistry: no model found for id "${modelId}".`)
    }
    return model
  }
}