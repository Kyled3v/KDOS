/**
 * PluginManager
 *
 * Singleton service owning plugin lifecycle policy: installation,
 * uninstallation, enablement, and disablement, and the platform's
 * one-time plugin subsystem initialization. Delegates storage to
 * PluginRegistry and mechanical load/unload work to PluginLoader.
 * Enforces manifest compatibility (minimum platform version, required
 * plugins) and dependency ordering before any plugin is enabled. The
 * License Manager's role — deciding *whether* a plugin is licensed — is
 * represented here only via an injected LicenseGate port; no license
 * logic is implemented in this file.
 */

import { Plugin } from "./Plugin";
import { PluginManifest } from "./PluginManifest";
import { PluginRegistry } from "./PluginRegistry";
import { PluginLoader, PluginRuntime } from "./PluginLoader";
import { PluginContextProps } from "./PluginContext";

/**
 * LicenseGate
 *
 * Dependency-injection boundary describing what PluginManager needs from
 * the License Manager to decide whether a plugin may be enabled. The
 * concrete implementation is owned and supplied by the License Manager,
 * not by this file.
 */
export interface LicenseGate {
  isPluginLicensed(pluginId: string): boolean;
}

export interface InstallPluginInput {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly author: string;
  readonly dependencies?: readonly string[];
  readonly manifest: Omit
    { pluginId: string; permissions: PluginManifest["permissions"]; minimumVersion: string; requiredPlugins?: readonly string[] },
    "pluginId"
  >;
}

export interface EnablePluginInput {
  readonly pluginId: string;
  readonly platformVersion: string;
  readonly runtime: PluginRuntime;
  readonly contextProps: Omit<PluginContextProps, "pluginId">;
}

export class PluginManager {
  private static instance: PluginManager | null = null;

  private readonly registry: PluginRegistry;
  private readonly loader: PluginLoader;
  private readonly licenseGate: LicenseGate;

  private initialized: boolean;

  private constructor(registry: PluginRegistry, loader: PluginLoader, licenseGate: LicenseGate) {
    this.registry = registry;
    this.loader = loader;
    this.licenseGate = licenseGate;
    this.initialized = false;
  }

  /**
   * Returns the singleton instance of PluginManager.
   * Accepts optional dependency overrides for dependency injection in tests.
   */
  public static getInstance(
    registry?: PluginRegistry,
    loader?: PluginLoader,
    licenseGate?: LicenseGate
  ): PluginManager {
    if (PluginManager.instance === null) {
      const resolvedRegistry = registry ?? PluginRegistry.getInstance();
      PluginManager.instance = new PluginManager(
        resolvedRegistry,
        loader ?? new PluginLoader(resolvedRegistry),
        licenseGate ?? { isPluginLicensed: () => true }
      );
    }
    return PluginManager.instance;
  }

  /**
   * Resets the singleton instance. Intended for test isolation only.
   */
  public static resetInstance(): void {
    PluginManager.instance = null;
  }

  /**
   * Initializes the plugin subsystem. Idempotent-guarded: throws if
   * already initialized. Performs no plugin loading itself — it only
   * marks the subsystem ready to accept install/enable calls.
   */
  public initialize(): void {
    if (this.initialized) {
      throw new Error("PluginManager has already been initialized.");
    }
    this.initialized = true;
  }

  /**
   * Installs a new plugin: registers its Plugin descriptor and
   * PluginManifest. Throws if the plugin subsystem has not been
   * initialized, or if a plugin with the same id is already installed.
   */
  public install(input: InstallPluginInput): Plugin {
    this.assertInitialized();

    const plugin = Plugin.create({
      id: input.id,
      name: input.name,
      version: input.version,
      author: input.author,
      dependencies: input.dependencies,
    });

    this.registry.register(plugin);

    const manifest = PluginManifest.create({
      pluginId: plugin.id,
      permissions: input.manifest.permissions,
      minimumVersion: input.manifest.minimumVersion,
      requiredPlugins: input.manifest.requiredPlugins,
    });

    this.registry.registerManifest(manifest);

    return plugin;
  }

  /**
   * Uninstalls a plugin: unloads its runtime if currently loaded, then
   * transitions it to UNINSTALLED and removes it from the registry.
   */
  public uninstall(pluginId: string): void {
    this.assertInitialized();

    const plugin = this.registry.find(pluginId);

    if (this.loader.isLoaded(pluginId)) {
      this.loader.unload(pluginId);
    }

    const uninstalled = plugin.withUninstalled();
    this.registry.update(uninstalled);
    this.registry.remove(pluginId);
  }

  /**
   * Enables a plugin: validates manifest compatibility (platform version,
   * required plugins already installed) and license entitlement, loads
   * its runtime via PluginLoader, and transitions it to ENABLED. Throws
   * if any validation fails.
   */
  public enable(input: EnablePluginInput): Plugin {
    this.assertInitialized();

    const plugin = this.registry.find(input.pluginId);
    const manifest = this.registry.findManifest(input.pluginId);

    if (!manifest.isCompatibleWith(input.platformVersion)) {
      throw new Error(
        `Plugin "${input.pluginId}" requires platform version >= "${manifest.minimumVersion}", but platform is "${input.platformVersion}".`
      );
    }

    const installedIds = this.registry.list().map((installed) => installed.id);
    if (!manifest.requirementsSatisfiedBy(installedIds)) {
      throw new Error(`Plugin "${input.pluginId}" has unmet required plugin dependencies.`);
    }

    if (!this.licenseGate.isPluginLicensed(input.pluginId)) {
      throw new Error(`Plugin "${input.pluginId}" is not licensed for use.`);
    }

    this.loader.load(input.pluginId, input.runtime, input.contextProps);

    const enabled = plugin.withEnabled();
    this.registry.update(enabled);

    return enabled;
  }

  /**
   * Disables a plugin: unloads its runtime via PluginLoader and
   * transitions it to DISABLED.
   */
  public disable(pluginId: string): Plugin {
    this.assertInitialized();

    const plugin = this.registry.find(pluginId);

    if (this.loader.isLoaded(pluginId)) {
      this.loader.unload(pluginId);
    }

    const disabled = plugin.withDisabled();
    this.registry.update(disabled);

    return disabled;
  }

  private assertInitialized(): void {
    if (!this.initialized) {
      throw new Error("PluginManager has not been initialized. Call initialize() first.");
    }
  }
}