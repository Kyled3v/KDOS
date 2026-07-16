/**
 * RuntimeConfig.ts
 *
 * Location: src/core/runtime/RuntimeConfig.ts
 *
 * RuntimeConfig describes the fixed configuration a Runtime instance
 * is booted with. It is pure configuration data — no logic, no
 * external package types, no database or AI provider implementations
 * are referenced here, only the identifiers that name them.
 */

/**
 * The mode a Runtime instance is operating in.
 */
export enum RuntimeMode {
  DEVELOPMENT = 'DEVELOPMENT',
  PRODUCTION = 'PRODUCTION',
  TEST = 'TEST',
}

/**
 * The KDOS product edition a Runtime instance is running as.
 */
export enum RuntimeEdition {
  STANDARD = 'STANDARD',
  ENTERPRISE = 'ENTERPRISE',
  WHITE_LABEL = 'WHITE_LABEL',
}

/**
 * The identifier of the AI provider configured for this Runtime.
 * Runtime itself never calls AI — this is a configuration label only,
 * consumed by whichever subsystem is responsible for AI integration.
 */
export type AIProviderId = string

/**
 * The identifier of the database provider configured for this
 * Runtime. Runtime itself never accesses a database — this is a
 * configuration label only, consumed by whichever subsystem is
 * responsible for persistence.
 */
export type DatabaseProviderId = string

/**
 * The licensing mode a Runtime instance is operating under.
 */
export enum LicenseMode {
  TRIAL = 'TRIAL',
  LICENSED = 'LICENSED',
  UNLICENSED = 'UNLICENSED',
}

/**
 * The full configuration a Runtime instance is constructed with.
 * Immutable for the lifetime of the Runtime — changing configuration
 * requires a new Runtime instance (typically via restart()).
 */
export interface RuntimeConfig {
  readonly applicationName: string
  readonly applicationVersion: string
  readonly edition: RuntimeEdition
  readonly runtimeMode: RuntimeMode
  readonly aiProvider: AIProviderId
  readonly databaseProvider: DatabaseProviderId
  readonly licenseMode: LicenseMode
}