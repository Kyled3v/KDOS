/**
 * ModelManager.ts
 *
 * Location: src/core/models/ModelManager.ts
 *
 * ModelManager is the only door KDOS has to AI model generation. It
 * never talks to Ollama, LM Studio, LocalAI, or any other runtime
 * directly — it holds a single injected ModelProvider and delegates
 * every runtime interaction to it, while enforcing ModelPolicy and
 * keeping ModelRegistry in sync.
 *
 * The rest of KDOS depends only on ModelManager. Swapping the
 * underlying runtime later means providing a different ModelProvider
 * implementation — nothing else in KDOS changes.
 */

import type { Model } from './Model'
import type {
  ModelGenerationRequest,
  ModelGenerationResponse,
  ModelProvider,
} from './ModelProvider'
import type { ModelPolicy } from './ModelPolicy'
import { ModelRegistry } from './ModelRegistry'

/**
 * ModelManager
 *
 * Single responsibility: mediate every AI model interaction in KDOS
 * through a single injected ModelProvider, enforcing ModelPolicy and
 * keeping ModelRegistry as the up-to-date source of truth for known
 * models.
 *
 * This class:
 *   - Is a singleton — use ModelManager.getInstance() rather than
 *     `new`.
 *   - Depends on ModelProvider only through its interface; it
 *     contains no concrete runtime implementation.
 *   - Enforces ModelPolicy (allowed models, capability gating,
 *     maximum installed models) on every operation that touches a
 *     model.
 *   - Is dependency-injection ready: ModelProvider, ModelPolicy, and
 *     ModelRegistry are all supplied at construction.
 */
export class ModelManager {
  private static instance: ModelManager | null = null

  private readonly provider: ModelProvider
  private policy: ModelPolicy
  private readonly registry: ModelRegistry

  /**
   * Private constructor — ModelManager is a singleton and must be
   * created via getInstance(), never directly.
   */
  private constructor(provider: ModelProvider, policy: ModelPolicy, registry: ModelRegistry) {
    this.provider = provider
    this.policy = policy
    this.registry = registry
  }

  /**
   * Retrieves the singleton ModelManager instance, creating it on
   * first call with the supplied dependencies.
   *
   * @param provider - The ModelProvider to delegate runtime
   *        operations to. Only used the first time getInstance() is
   *        called.
   * @param policy - The ModelPolicy to enforce. Only used the first
   *        time getInstance() is called.
   * @param registry - An optional ModelRegistry to use instead of a
   *        freshly created one. Only used the first time
   *        getInstance() is called.
   * @returns The singleton ModelManager instance.
   * @throws Error if called for the first time without a provider
   *         and policy.
   */
  public static getInstance(
    provider?: ModelProvider,
    policy?: ModelPolicy,
    registry?: ModelRegistry
  ): ModelManager {
    if (!ModelManager.instance) {
      if (!provider || !policy) {
        throw new Error(
          'ModelManager: initial call to getInstance() requires a ModelProvider and ModelPolicy.'
        )
      }
      ModelManager.instance = new ModelManager(provider, policy, registry ?? new ModelRegistry())
    }
    return ModelManager.instance
  }

  /**
   * Resets the singleton instance. Intended for test isolation only.
   */
  public static resetInstance(): void {
    ModelManager.instance = null
  }

  /**
   * Generates a response using the requested model, after verifying
   * the model is allowed, enabled, and installed, and that any
   * requested capability is permitted by policy.
   *
   * @param request - The generation request.
   * @returns The generation result.
   * @throws Error if the requested model is not registered, not
   *         installed, not enabled, not permitted by policy, or if
   *         the underlying provider call fails.
   */
  public async generate(request: ModelGenerationRequest): Promise<ModelGenerationResponse> {
    const model = this.requireUsableModel(request.modelId)
    this.enforceCapabilityPolicy(model)

    return this.provider.generate(request)
  }

  /**
   * Switches KDOS's active default model to the given model,
   * installing it first if it is not already installed.
   *
   * @param modelId - The id of the model to switch to.
   * @returns The new default Model.
   * @throws Error if the model is not permitted by policy.
   */
  public async switchModel(modelId: string): Promise<Model> {
    this.enforceAllowedByPolicy(modelId)

    const existing = this.registry.find(modelId)
    if (!existing || !existing.installed) {
      await this.install(modelId)
    }

    return this.setDefault(modelId)
  }

  /**
   * Installs a model via the underlying provider and registers the
   * result in the registry, subject to ModelPolicy's allowed-model
   * list and maximum installed model count.
   *
   * @param modelId - The id of the model to install.
   * @returns The installed Model.
   * @throws Error if the model is not permitted by policy, or if
   *         installing it would exceed the policy's maximumModels.
   */
  public async install(modelId: string): Promise<Model> {
    this.enforceAllowedByPolicy(modelId)

    const currentlyInstalled = this.registry.list({ installed: true })
    const alreadyInstalled = currentlyInstalled.some((model) => model.id === modelId)

    if (!alreadyInstalled && currentlyInstalled.length >= this.policy.maximumModels) {
      throw new Error(
        `ModelManager: cannot install model "${modelId}"; maximum of ${this.policy.maximumModels} installed models reached.`
      )
    }

    const installed = await this.provider.installModel(modelId)
    return this.registry.register(installed)
  }

  /**
   * Uninstalls a model via the underlying provider and removes it
   * from the registry.
   *
   * @param modelId - The id of the model to uninstall.
   * @throws Error if no such model is registered.
   */
  public async uninstall(modelId: string): Promise<void> {
    await this.provider.removeModel(modelId)
    this.registry.remove(modelId)
  }

  /**
   * Retrieves the currently configured default model.
   *
   * @returns The default Model, or undefined if none is set.
   */
  public getDefault(): Model | undefined {
    return this.registry.findDefault()
  }

  /**
   * Sets a model as the default, unmarking any previous default.
   * Does not install the model — use switchModel() when installation
   * should happen automatically.
   *
   * @param modelId - The id of the model to mark as default.
   * @returns The new default Model.
   * @throws Error if no such model is registered, or if it is not
   *         permitted by policy.
   */
  public setDefault(modelId: string): Model {
    this.enforceAllowedByPolicy(modelId)

    const target = this.requireModel(modelId)
    const previousDefault = this.registry.findDefault()

    if (previousDefault && previousDefault.id !== modelId) {
      this.registry.register(
        Object.freeze({ ...previousDefault, defaultModel: false })
      )
    }

    const updated = this.registry.register(Object.freeze({ ...target, defaultModel: true }))
    return updated
  }

  /**
   * Checks whether the underlying provider (and therefore the AI
   * runtime it wraps) is reachable and healthy.
   *
   * @returns true if the provider responded successfully.
   */
  public async healthCheck(): Promise<boolean> {
    return this.provider.healthCheck()
  }

  /**
   * Returns the ModelRegistry backing this ModelManager, for callers
   * that need direct read access to registered models.
   */
  public getRegistry(): ModelRegistry {
    return this.registry
  }

  /**
   * Verifies a model is registered, installed, and enabled, and
   * permitted by policy, throwing a descriptive Error otherwise.
   */
  private requireUsableModel(modelId: string): Model {
    this.enforceAllowedByPolicy(modelId)

    const model = this.requireModel(modelId)

    if (!model.installed) {
      throw new Error(`ModelManager: model "${modelId}" is not installed.`)
    }

    if (!model.enabled) {
      throw new Error(`ModelManager: model "${modelId}" is disabled.`)
    }

    return model
  }

  /**
   * Throws if a model's capabilities are not permitted by the
   * current ModelPolicy.
   */
  private enforceCapabilityPolicy(model: Model): void {
    if (model.supportsVision && !this.policy.allowVision) {
      throw new Error(`ModelManager: vision capability is not permitted by policy.`)
    }

    if (model.supportsReasoning && !this.policy.allowReasoning) {
      throw new Error(`ModelManager: reasoning capability is not permitted by policy.`)
    }

    if (model.supportsTools && !this.policy.allowTools) {
      throw new Error(`ModelManager: tool use is not permitted by policy.`)
    }
  }

  /**
   * Throws if a model id is not present in the policy's allowed
   * model list.
   */
  private enforceAllowedByPolicy(modelId: string): void {
    if (!this.policy.allowedModels.includes(modelId)) {
      throw new Error(`ModelManager: model "${modelId}" is not permitted by policy.`)
    }
  }

  /**
   * Retrieves a Model by id from the registry or throws if none
   * exists, so calling methods can operate on a guaranteed-defined
   * Model.
   */
  private requireModel(modelId: string): Model {
    const model = this.registry.find(modelId)
    if (!model) {
      throw new Error(`ModelManager: no model registered for id "${modelId}".`)
    }
    return model
  }
}