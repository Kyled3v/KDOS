/**
 * PluginManifest
 *
 * Declares the compatibility and access contract a Plugin must satisfy
 * before it can be enabled: which PluginContext permissions it needs,
 * the minimum platform version it requires, and which other plugins
 * must already be installed. Immutable value object, decoupled from
 * Plugin itself so manifest data can be validated independently of
 * runtime enablement state.
 */

export enum PluginPermission {
  READ_CRM = "READ_CRM",
  WRITE_CRM = "WRITE_CRM",
  READ_PROJECTS = "READ_PROJECTS",
  WRITE_PROJECTS = "WRITE_PROJECTS",
  READ_WORKFLOW = "READ_WORKFLOW",
  WRITE_WORKFLOW = "WRITE_WORKFLOW",
  USE_MODEL_MANAGER = "USE_MODEL_MANAGER",
  READ_LICENSE = "READ_LICENSE",
}

export interface PluginManifestProps {
  readonly pluginId: string;
  readonly permissions: readonly PluginPermission[];
  readonly minimumVersion: string;
  readonly requiredPlugins: readonly string[];
}

export class PluginManifest {
  public readonly pluginId: string;
  public readonly permissions: readonly PluginPermission[];
  public readonly minimumVersion: string;
  public readonly requiredPlugins: readonly string[];

  private constructor(props: PluginManifestProps) {
    this.pluginId = props.pluginId;
    this.permissions = props.permissions;
    this.minimumVersion = props.minimumVersion;
    this.requiredPlugins = props.requiredPlugins;
  }

  /**
   * Creates a new PluginManifest for the given plugin id.
   */
  public static create(props: {
    pluginId: string;
    permissions: readonly PluginPermission[];
    minimumVersion: string;
    requiredPlugins?: readonly string[];
  }): PluginManifest {
    if (!props.pluginId || props.pluginId.trim().length === 0) {
      throw new Error("PluginManifest requires a non-empty pluginId.");
    }
    if (!props.minimumVersion || props.minimumVersion.trim().length === 0) {
      throw new Error("PluginManifest requires a non-empty minimumVersion.");
    }

    return new PluginManifest({
      pluginId: props.pluginId,
      permissions: [...props.permissions],
      minimumVersion: props.minimumVersion,
      requiredPlugins: props.requiredPlugins ? [...props.requiredPlugins] : [],
    });
  }

  /**
   * Reconstructs a PluginManifest from a stored snapshot.
   */
  public static fromSnapshot(snapshot: PluginManifestProps): PluginManifest {
    return new PluginManifest(snapshot);
  }

  /**
   * Returns true if this manifest declares the given permission.
   */
  public hasPermission(permission: PluginPermission): boolean {
    return this.permissions.includes(permission);
  }

  /**
   * Returns true if the given platform version satisfies this manifest's
   * minimumVersion, using simple dot-separated numeric comparison
   * (e.g. "2.1.0" >= "2.0.0").
   */
  public isCompatibleWith(platformVersion: string): boolean {
    const required = PluginManifest.parseVersion(this.minimumVersion);
    const actual = PluginManifest.parseVersion(platformVersion);

    for (let i = 0; i < Math.max(required.length, actual.length); i++) {
      const requiredPart = required[i] ?? 0;
      const actualPart = actual[i] ?? 0;

      if (actualPart > requiredPart) {
        return true;
      }
      if (actualPart < requiredPart) {
        return false;
      }
    }

    return true;
  }

  /**
   * Returns true if every plugin id this manifest requires is present in
   * the given set of installed plugin ids.
   */
  public requirementsSatisfiedBy(installedPluginIds: readonly string[]): boolean {
    return this.requiredPlugins.every((requiredId) => installedPluginIds.includes(requiredId));
  }

  /**
   * Returns a plain serialisable snapshot of this manifest.
   */
  public toSnapshot(): PluginManifestProps {
    return {
      pluginId: this.pluginId,
      permissions: this.permissions,
      minimumVersion: this.minimumVersion,
      requiredPlugins: this.requiredPlugins,
    };
  }

  private static parseVersion(version: string): readonly number[] {
    return version.split(".").map((part) => {
      const parsed = Number.parseInt(part, 10);
      return Number.isNaN(parsed) ? 0 : parsed;
    });
  }
}