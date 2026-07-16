/**
 * Model.ts
 *
 * Location: src/core/models/Model.ts
 *
 * Model describes a single AI model known to KDOS — its identity,
 * its capabilities, and its installation/enablement state. This file
 * contains no provider logic, no generation logic, and no network
 * access; it is a pure data shape consumed by ModelRegistry and
 * ModelManager.
 */

/**
 * The model family a Model belongs to (e.g. "llama", "qwen",
 * "mistral"). Kept as a plain string rather than an enum since the
 * set of families is provider- and catalog-dependent and will grow
 * without KDOS needing to change.
 */
export type ModelFamily = string

/**
 * A single AI model KDOS is aware of, whether or not it is currently
 * installed.
 */
export interface Model {
  readonly id: string
  readonly name: string
  readonly family: ModelFamily
  readonly provider: string
  readonly size: number
  readonly installed: boolean
  readonly enabled: boolean
  readonly defaultModel: boolean
  readonly supportsVision: boolean
  readonly supportsReasoning: boolean
  readonly supportsTools: boolean
  readonly supportsCoding: boolean
}