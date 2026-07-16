/**
 * Plugin
 *
 * Represents a single installable extension within KDOS's plugin
 * architecture (CRM, Finance, HR, Projects, Marketing, Automation,
 * Analytics, Proposal, Quotation, Customer Success, AI Workforce, and
 * any future business feature). Immutable value object; mutation methods
 * return new instances rather than modifying state in place. A Plugin
 * carries only identity, versioning, and enablement state — manifest
 * details (permissions, required plugins, minimum platform version)
 * live in the separate PluginManifest.
 */

export enum PluginStatus {
  INSTALLED = "INSTALLED",
  ENABLED = "ENABLED",
  DISABLED = "DISABLED",
  UNINSTALLED = "UNINSTALLED",
}

export interface PluginProps {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly author: string;
  readonly dependencies: readonly string[];
  readonly enabled: boolean;
  readonly status: PluginStatus;
  readonly installedAt: Date;
}

const VALID_TRANSITIONS: Readonly<Record<PluginStatus, readonly PluginStatus[]>> = {
  [PluginStatus.INSTALLED]: [PluginStatus.ENABLED, PluginStatus.UNINSTALLED],
  [PluginStatus.ENABLED]: [PluginStatus.DISABLED, PluginStatus.UNINSTALLED],
  [PluginStatus.DISABLED]: [PluginStatus.ENABLED, PluginStatus.UNINSTALLED],
  [PluginStatus.UNINSTALLED]: [],
};

export class Plugin {
  public readonly id: string;
  public readonly name: string;
  public readonly version: string;
  public readonly author: string;
  public readonly dependencies: readonly string[];
  public readonly enabled: boolean;
  public readonly status: PluginStatus;
  public readonly installedAt: Date;

  private constructor(props: PluginProps) {
    this.id = props.id;
    this.name = props.name;
    this.version = props.version;
    this.author = props.author;
    this.dependencies = props.dependencies;
    this.enabled = props.enabled;
    this.status = props.status;
    this.installedAt = props.installedAt;
  }

  /**
   * Creates a new Plugin in INSTALLED status, disabled by default.
   */
  public static create(props: {
    id: string;
    name: string;
    version: string;
    author: string;
    dependencies?: readonly string[];
  }): Plugin {
    if (!props.id || props.id.trim().length === 0) {
      throw new Error("Plugin requires a non-empty id.");
    }
    if (!props.name || props.name.trim().length === 0) {
      throw new Error("Plugin requires a non-empty name.");
    }
    if (!props.version || props.version.trim().length === 0) {
      throw new Error("Plugin requires a non-empty version.");
    }
    if (!props.author || props.author.trim().length === 0) {
      throw new Error("Plugin requires a non-empty author.");
    }

    return new Plugin({
      id: props.id,
      name: props.name,
      version: props.version,
      author: props.author,
      dependencies: props.dependencies ? [...props.dependencies] : [],
      enabled: false,
      status: PluginStatus.INSTALLED,
      installedAt: new Date(),
    });
  }

  /**
   * Reconstructs a Plugin from a stored snapshot.
   */
  public static fromSnapshot(snapshot: PluginProps): Plugin {
    return new Plugin(snapshot);
  }

  /**
   * Returns a new Plugin transitioned to ENABLED status.
   * Throws if the transition is not valid from the current status.
   */
  public withEnabled(): Plugin {
    return this.withStatus(PluginStatus.ENABLED, true);
  }

  /**
   * Returns a new Plugin transitioned to DISABLED status.
   * Throws if the transition is not valid from the current status.
   */
  public withDisabled(): Plugin {
    return this.withStatus(PluginStatus.DISABLED, false);
  }

  /**
   * Returns a new Plugin transitioned to UNINSTALLED status.
   * Throws if the transition is not valid from the current status.
   */
  public withUninstalled(): Plugin {
    return this.withStatus(PluginStatus.UNINSTALLED, false);
  }

  /**
   * Returns true if this plugin declares the given plugin id as a dependency.
   */
  public dependsOn(pluginId: string): boolean {
    return this.dependencies.includes(pluginId);
  }

  /**
   * Returns a plain serialisable snapshot of this plugin.
   */
  public toSnapshot(): PluginProps {
    return {
      id: this.id,
      name: this.name,
      version: this.version,
      author: this.author,
      dependencies: this.dependencies,
      enabled: this.enabled,
      status: this.status,
      installedAt: this.installedAt,
    };
  }

  private withStatus(status: PluginStatus, enabled: boolean): Plugin {
    const allowed = VALID_TRANSITIONS[this.status];

    if (!allowed.includes(status)) {
      throw new Error(
        `Invalid plugin status transition from "${this.status}" to "${status}" for plugin "${this.id}".`
      );
    }

    return new Plugin({
      id: this.id,
      name: this.name,
      version: this.version,
      author: this.author,
      dependencies: this.dependencies,
      enabled,
      status,
      installedAt: this.installedAt,
    });
  }
}