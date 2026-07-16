/**
 * CompanyProfile.ts
 *
 * Location: src/core/licensing/CompanyProfile.ts
 *
 * CompanyProfile describes the company a License is issued to,
 * including the operational limits and enabled capabilities that
 * apply at the company level. This file defines the CompanyProfile
 * shape only — no logic, no storage, no network access.
 */

/**
 * The release channel a company receives KDOS updates from.
 */
export enum UpdateChannel {
  STABLE = 'STABLE',
  BETA = 'BETA',
  NIGHTLY = 'NIGHTLY',
}

/**
 * The profile of a company operating KDOS. Distinct from License:
 * CompanyProfile describes who the company is and what they're
 * provisioned for, while License governs whether they're currently
 * permitted to run at all.
 */
export interface CompanyProfile {
  readonly companyId: string
  readonly companyName: string
  readonly industry: string
  readonly country: string
  readonly province: string
  readonly employees: number
  readonly enabledModules: string[]
  readonly enabledModels: string[]
  readonly maximumUsers: number
  readonly maximumAIWorkers: number
  readonly updateChannel: UpdateChannel
}