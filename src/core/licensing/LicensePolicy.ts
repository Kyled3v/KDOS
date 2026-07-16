/**
 * License.ts
 *
 * Location: src/core/licensing/License.ts
 *
 * License is the record that determines whether KDOS Business is
 * permitted to operate for a given company. This file defines the
 * License shape and its possible statuses only — no logic, no
 * storage, no network access.
 */

/**
 * The current status of a License.
 */
export enum LicenseStatus {
  ACTIVE = 'ACTIVE',
  TRIAL = 'TRIAL',
  EXPIRED = 'EXPIRED',
  SUSPENDED = 'SUSPENDED',
  CANCELLED = 'CANCELLED',
}

/**
 * The KDOS product edition a License grants.
 */
export enum LicenseEdition {
  STANDARD = 'STANDARD',
  ENTERPRISE = 'ENTERPRISE',
  WHITE_LABEL = 'WHITE_LABEL',
}

/**
 * A single license record. Governs whether, and under what edition,
 * a company is permitted to operate KDOS.
 */
export interface License {
  readonly licenseId: string
  readonly companyId: string
  readonly companyName: string
  readonly edition: LicenseEdition
  readonly status: LicenseStatus
  readonly issuedAt: Date
  readonly expiresAt: Date
  readonly lastCheck: Date
}