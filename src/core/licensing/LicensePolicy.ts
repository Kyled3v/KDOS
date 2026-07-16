/**
 * LicensePolicy.ts
 *
 * Location: src/core/licensing/LicensePolicy.ts
 *
 * LicensePolicy describes what a License actually entitles a company
 * to: which features, plugins, AI models, and AI workers are enabled,
 * and what usage limits apply. This file defines the LicensePolicy
 * shape only — no logic, no storage, no network access.
 */

/**
 * The entitlements and usage limits granted by a License.
 */
export interface LicensePolicy {
  readonly licenseId: string
  readonly enabledFeatures: string[]
  readonly enabledPlugins: string[]
  readonly enabledAIModels: string[]
  readonly enabledAIWorkers: string[]
  readonly maximumStorage: number
  readonly maximumProjects: number
  readonly maximumClients: number
}