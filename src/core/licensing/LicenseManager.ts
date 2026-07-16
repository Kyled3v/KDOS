/**
 * LicenseManager.ts
 *
 * Location: src/core/licensing/LicenseManager.ts
 *
 * LicenseManager is the sole authority governing whether KDOS
 * Business is permitted to operate for a given company. It owns the
 * full lifecycle of a company's License and LicensePolicy —
 * registration, activation, suspension, cancellation, renewal, and
 * validation — entirely in memory.
 *
 * LicenseManager performs no database access, no network calls, and
 * no AI calls. It is a pure, self-contained authority over licensing
 * state.
 */

import type { CompanyProfile } from './CompanyProfile'
import { UpdateChannel } from './CompanyProfile'
import type { License } from './License'
import { LicenseEdition, LicenseStatus } from './License'
import type { LicensePolicy } from './LicensePolicy'

/**
 * The fields required to register a new company and issue its
 * initial (TRIAL) License and default LicensePolicy.
 */
export interface RegisterCompanyInput {
  readonly companyName: string
  readonly industry: string
  readonly country: string
  readonly province: string
  readonly employees: number
  readonly edition?: LicenseEdition
  readonly trialDurationMs?: number
  readonly enabledModules?: string[]
  readonly enabledModels?: string[]
  readonly maximumUsers?: number
  readonly maximumAIWorkers?: number
  readonly updateChannel?: UpdateChannel
}

/**
 * The combined result of registering a new company: its profile,
 * its initial license, and its initial policy.
 */
export interface RegisteredCompany {
  readonly company: CompanyProfile
  readonly license: License
  readonly policy: LicensePolicy
}

/**
 * Default trial length, in milliseconds, used when no explicit
 * trialDurationMs is supplied to registerCompany().
 */
const DEFAULT_TRIAL_DURATION_MS = 14 * 24 * 60 * 60 * 1000 // 14 days

/**
 * Default LicensePolicy limits and entitlements granted to a newly
 * registered company's trial license.
 */
const DEFAULT_POLICY_DEFAULTS: Omit<LicensePolicy, 'licenseId'> = {
  enabledFeatures: [],
  enabledPlugins: [],
  enabledAIModels: [],
  enabledAIWorkers: [],
  maximumStorage: 0,
  maximumProjects: 0,
  maximumClients: 0,
}

/**
 * LicenseManager
 *
 * Single responsibility: own CompanyProfile, License, and
 * LicensePolicy records and manage their lifecycle in memory.
 *
 * This class:
 *   - Is a singleton — use LicenseManager.getInstance() rather than
 *     `new`.
 *   - Uses Map-based in-memory storage only; no database, no
 *     network, no AI.
 *   - Never mutates a returned record in place; every change
 *     produces a new, frozen record.
 */
export class LicenseManager {
  private static instance: LicenseManager | null = null

  /**
   * Internal in-memory company store, keyed by company id.
   */
  private readonly companies = new Map<string, CompanyProfile>()

  /**
   * Internal in-memory license store, keyed by license id.
   */
  private readonly licenses = new Map<string, License>()

  /**
   * Internal in-memory policy store, keyed by license id.
   */
  private readonly policies = new Map<string, LicensePolicy>()

  /**
   * Private constructor — LicenseManager is a singleton and must be
   * created via getInstance(), never directly.
   */
  private constructor() {}

  /**
   * Retrieves the singleton LicenseManager instance, creating it on
   * first call.
   */
  public static getInstance(): LicenseManager {
    if (!LicenseManager.instance) {
      LicenseManager.instance = new LicenseManager()
    }
    return LicenseManager.instance
  }

  /**
   * Resets the singleton instance. Intended for test isolation only.
   */
  public static resetInstance(): void {
    LicenseManager.instance = null
  }

  /**
   * Registers a new company, creating its CompanyProfile and issuing
   * an initial TRIAL License with a default LicensePolicy.
   *
   * @param input - The fields describing the new company.
   * @returns The newly created CompanyProfile, License, and
   *          LicensePolicy.
   */
  public registerCompany(input: RegisterCompanyInput): RegisteredCompany {
    const companyId = this.generateId('company')
    const licenseId = this.generateId('license')
    const now = new Date()
    const trialDuration = input.trialDurationMs ?? DEFAULT_TRIAL_DURATION_MS

    const company: CompanyProfile = Object.freeze({
      companyId,
      companyName: input.companyName,
      industry: input.industry,
      country: input.country,
      province: input.province,
      employees: input.employees,
      enabledModules: input.enabledModules ?? [],
      enabledModels: input.enabledModels ?? [],
      maximumUsers: input.maximumUsers ?? 1,
      maximumAIWorkers: input.maximumAIWorkers ?? 0,
      updateChannel: input.updateChannel ?? UpdateChannel.STABLE,
    })

    const license: License = Object.freeze({
      licenseId,
      companyId,
      companyName: input.companyName,
      edition: input.edition ?? LicenseEdition.STANDARD,
      status: LicenseStatus.TRIAL,
      issuedAt: now,
      expiresAt: new Date(now.getTime() + trialDuration),
      lastCheck: now,
    })

    const policy: LicensePolicy = Object.freeze({
      licenseId,
      ...DEFAULT_POLICY_DEFAULTS,
    })

    this.companies.set(companyId, company)
    this.licenses.set(licenseId, license)
    this.policies.set(licenseId, policy)

    return { company, license, policy }
  }

  /**
   * Activates a license, transitioning its status to ACTIVE.
   *
   * @param licenseId - The id of the License to activate.
   * @returns The updated License.
   * @throws Error if no License exists for the given id.
   */
  public activate(licenseId: string): License {
    return this.transition(licenseId, LicenseStatus.ACTIVE)
  }

  /**
   * Suspends a license, transitioning its status to SUSPENDED. A
   * suspended license can later be reactivated via activate().
   *
   * @param licenseId - The id of the License to suspend.
   * @returns The updated License.
   * @throws Error if no License exists for the given id.
   */
  public suspend(licenseId: string): License {
    return this.transition(licenseId, LicenseStatus.SUSPENDED)
  }

  /**
   * Cancels a license, transitioning its status to CANCELLED. This
   * is treated as a terminal state — a cancelled license is not
   * expected to be reactivated via activate().
   *
   * @param licenseId - The id of the License to cancel.
   * @returns The updated License.
   * @throws Error if no License exists for the given id.
   */
  public cancel(licenseId: string): License {
    return this.transition(licenseId, LicenseStatus.CANCELLED)
  }

  /**
   * Renews a license: extends its expiration and, if it was EXPIRED,
   * returns it to ACTIVE status.
   *
   * @param licenseId - The id of the License to renew.
   * @param extensionMs - How far to extend expiresAt beyond now, in
   *        milliseconds.
   * @returns The renewed License.
   * @throws Error if no License exists for the given id.
   */
  public renew(licenseId: string, extensionMs: number): License {
    const license = this.requireLicense(licenseId)
    const now = new Date()

    const renewed: License = Object.freeze({
      ...license,
      status: license.status === LicenseStatus.EXPIRED ? LicenseStatus.ACTIVE : license.status,
      expiresAt: new Date(now.getTime() + extensionMs),
      lastCheck: now,
    })

    this.licenses.set(licenseId, renewed)
    return renewed
  }

  /**
   * Validates a license: checks its current status and expiration,
   * automatically transitioning it to EXPIRED if its expiresAt has
   * passed while it was still ACTIVE or TRIAL, and refreshes
   * lastCheck regardless of outcome.
   *
   * @param licenseId - The id of the License to validate.
   * @returns true if the license is currently ACTIVE or TRIAL and
   *          not expired; false otherwise.
   * @throws Error if no License exists for the given id.
   */
  public validate(licenseId: string): boolean {
    const license = this.requireLicense(licenseId)
    const now = new Date()
    const hasExpired = license.expiresAt.getTime() <= now.getTime()

    const isLiveStatus =
      license.status === LicenseStatus.ACTIVE || license.status === LicenseStatus.TRIAL

    const nextStatus = isLiveStatus && hasExpired ? LicenseStatus.EXPIRED : license.status

    const checked: License = Object.freeze({
      ...license,
      status: nextStatus,
      lastCheck: now,
    })

    this.licenses.set(licenseId, checked)

    return nextStatus === LicenseStatus.ACTIVE || nextStatus === LicenseStatus.TRIAL
  }

  /**
   * Checks whether a license is currently active, without mutating
   * its lastCheck timestamp. Use validate() when a fresh expiration
   * check (with side effects) is required; use isActive() for a
   * quick, read-only status check.
   *
   * @param licenseId - The id of the License to check.
   * @returns true if the license's status is ACTIVE or TRIAL and it
   *          has not passed its expiresAt.
   * @throws Error if no License exists for the given id.
   */
  public isActive(licenseId: string): boolean {
    const license = this.requireLicense(licenseId)
    const isLiveStatus =
      license.status === LicenseStatus.ACTIVE || license.status === LicenseStatus.TRIAL
    const hasExpired = license.expiresAt.getTime() <= Date.now()

    return isLiveStatus && !hasExpired
  }

  /**
   * Retrieves a company's profile by id.
   *
   * @param companyId - The id of the CompanyProfile to retrieve.
   * @returns The CompanyProfile, or undefined if no company exists
   *          for the given id.
   */
  public getCompany(companyId: string): CompanyProfile | undefined {
    return this.companies.get(companyId)
  }

  /**
   * Retrieves a license's policy by license id.
   *
   * @param licenseId - The id of the License whose policy should be
   *        retrieved.
   * @returns The LicensePolicy, or undefined if no policy exists for
   *          the given license id.
   */
  public getPolicy(licenseId: string): LicensePolicy | undefined {
    return this.policies.get(licenseId)
  }

  /**
   * Retrieves a license by id.
   *
   * @param licenseId - The id of the License to retrieve.
   * @returns The License, or undefined if no License exists for the
   *          given id.
   */
  public getLicense(licenseId: string): License | undefined {
    return this.licenses.get(licenseId)
  }

  /**
   * Applies a status transition to a license, refreshing its
   * lastCheck timestamp in the same update.
   */
  private transition(licenseId: string, status: LicenseStatus): License {
    const license = this.requireLicense(licenseId)

    const updated: License = Object.freeze({
      ...license,
      status,
      lastCheck: new Date(),
    })

    this.licenses.set(licenseId, updated)
    return updated
  }

  /**
   * Retrieves a License by id or throws if none exists, so calling
   * methods can operate on a guaranteed-defined License.
   */
  private requireLicense(licenseId: string): License {
    const license = this.licenses.get(licenseId)
    if (!license) {
      throw new Error(`LicenseManager: no license found for id "${licenseId}".`)
    }
    return license
  }

  /**
   * Generates a deterministic-format, prefixed identifier.
   */
  private generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  }
}