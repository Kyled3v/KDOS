/**
 * ModelPolicy.ts
 *
 * Location: src/core/models/ModelPolicy.ts
 *
 * ModelPolicy describes which models and capabilities KDOS is
 * permitted to use at runtime. It governs ModelManager's behavior
 * (which models it may switch to, install, or use for a given
 * capability) without knowing anything about how those models are
 * actually served. This file contains no logic, no storage, and no
 * network access — pure policy data.
 */

/**
 * The governance rules ModelManager must respect when selecting,
 * installing, or generating with models.
 */
export interface ModelPolicy {
  readonly allowedModels: string[]
  readonly defaultModel: string
  readonly maximumModels: number
  readonly allowVision: boolean
  readonly allowReasoning: boolean
  readonly allowTools: boolean
}