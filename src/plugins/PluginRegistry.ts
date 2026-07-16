/**
 * PluginRegistry
 *
 * Singleton in-memory registry responsible for storing and retrieving
 * Plugin and PluginManifest instances. Uses Map-based storage only. No
 * database, no networking, no external dependencies.
 */

import { Plugin } from "./Plugin";
import { PluginManifest } from "./PluginManifest";

export class PluginRegistry {
  private static instance: PluginRegistry | null = null;

  private readonly plugins: Map<string, Plugin>;
  private readonly manifests: Map<string, PluginManifest>;

  private constructor() {
    this.plugins = new Map<string, Plugin>();
    this.manifests = new Map<string, PluginManifest>();
  }

  /**
   * Returns the singleton instance of PluginRegistry.
   */
  public static getInstance(): PluginRegistry {
    if (PluginRegistry.instance === null) {
      PluginRegistry.instance = new PluginRegistry();
    }
    return PluginRegistry.instance;
  }

  /**
   * Resets the singleton instance. Intended for test isolation only.
   */
  public static resetInstance(): void {
    PluginRegistry.instance = null;
  }

  // ---------------------------------------------------------------------
  // Plugins
  // ---------------------------------------------------------------------

  /**
   * Registers a plugin. Throws if a plugin with the same id already exists.
   */
  public register(plugin: Plugin): void {
    if (this.plugins.has(plugin.id)) {
      throw new Error(`Plugin with id "${plugin.id}" is already registered.`);
    }
    this.plugins.set(plugin.id, plugin);
  }

  /**
   * Replaces an already-registered plugin with an updated instance.
   * Throws if no plugin with that id is registered.
   */
  public update(plugin: Plugin): void {
    if (!this.plugins.has(plugin.id)) {
      throw new Error(`Cannot update unregistered plugin with id "${plugin.id}".`);
    }
    this.plugins.set(plugin.id, plugin);
  }

  /**
   * Removes a plugin and its manifest. Throws if no plugin with that id exists.
   */
  public remove(id: string): void {
    if (!this.plugins.has(id)) {
      throw new Error(`Cannot remove unregistered plugin with id "${id}".`);
    }
    this.plugins.delete(id);
    this.manifests.delete(id);
  }

  /**
   * Finds a plugin by id. Throws if no plugin with that id exists.
   */
  public find(id: string): Plugin {
    const plugin = this.plugins.get(id);
    if (!plugin) {
      throw new Error(`No plugin found with id "${id}".`);
    }
    return plugin;
  }

  /**
   * Returns true if a plugin with the given id is registered.
   */
  public has(id: string): boolean {
    return this.plugins.has(id);
  }

  /**
   * Lists all registered plugins.
   */
  public list(): readonly Plugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Lists all plugins currently enabled.
   */
  public listEnabled(): readonly Plugin[] {
    return this.list().filter((plugin) => plugin.enabled);
  }

  /**
   * Returns the total number of registered plugins.
   */
  public count(): number {
    return this.plugins.size;
  }

  // ---------------------------------------------------------------------
  // Manifests
  // ---------------------------------------------------------------------

  /**
   * Registers a manifest for a plugin. Throws if a manifest for that
   * plugin id already exists, or if no plugin with that id is registered.
   */
  public registerManifest(manifest: PluginManifest): void {
    if (!this.plugins.has(manifest.pluginId)) {
      throw new Error(`Cannot register manifest for unregistered plugin "${manifest.pluginId}".`);
    }
    if (this.manifests.has(manifest.pluginId)) {
      throw new Error(`Manifest already registered for plugin "${manifest.pluginId}".`);
    }
    this.manifests.set(manifest.pluginId, manifest);
  }

  /**
   * Finds the manifest for a given plugin id. Throws if none is registered.
   */
  public findManifest(pluginId: string): PluginManifest {
    const manifest = this.manifests.get(pluginId);
    if (!manifest) {
      throw new Error(`No manifest found for plugin "${pluginId}".`);
    }
    return manifest;
  }

  /**
   * Returns true if a manifest is registered for the given plugin id.
   */
  public hasManifest(pluginId: string): boolean {
    return this.manifests.has(pluginId);
  }
}