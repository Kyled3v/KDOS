/**
 * PluginLoader
 *
 * Drives a Plugin through its physical load lifecycle: constructing its
 * PluginContext, invoking its runtime hooks, and tearing it down again.
 * PluginLoader does not decide *whether* a plugin should be enabled —
 * that policy decision belongs to PluginManager — it only performs the
 * mechanical load/unload/reload operations once instructed. Not a
 * singleton; PluginManager owns a single instance.
 */

import { PluginRegistry } from "./PluginRegistry";
import { PluginContext, PluginContextProps } from "./PluginContext";

/**
 * PluginRuntime
 *
 * The lifecycle hook contract a plugin implementation must satisfy to be
 * loadable. No AI, no networking, no concrete subsystem logic lives here —
 * these hooks are invoked by PluginLoader with a PluginContext already
 * prepared for the plugin in question.
 */
export interface PluginRuntime {
  onLoad(context: PluginContext): void;
  onUnload(): void;
}

export interface PluginLoadResult {
  readonly pluginId: string;
  readonly context: PluginContext;
}

export class PluginLoader {
  private readonly registry: PluginRegistry;
  private readonly loadedRuntimes: Map<string, PluginRuntime>;
  private readonly loadedContexts: Map<string, PluginContext>;

  /**
   * Constructs a PluginLoader bound to a specific PluginRegistry, supplied
   * via dependency injection.
   */
  public constructor(registry: PluginRegistry) {
    this.registry = registry;
    this.loadedRuntimes = new Map<string, PluginRuntime>();
    this.loadedContexts = new Map<string, PluginContext>();
  }

  /**
   * Loads a plugin's runtime: builds its PluginContext from the given
   * capability props and invokes its onLoad hook. Throws if the plugin is
   * not registered, or is already loaded.
   */
  public load(
    pluginId: string,
    runtime: PluginRuntime,
    contextProps: Omit<PluginContextProps, "pluginId">
  ): PluginLoadResult {
    if (!this.registry.has(pluginId)) {
      throw new Error(`Cannot load unregistered plugin "${pluginId}".`);
    }
    if (this.loadedRuntimes.has(pluginId)) {
      throw new Error(`Plugin "${pluginId}" is already loaded.`);
    }

    const context = PluginContext.create({
      pluginId,
      platform: contextProps.platform,
      license: contextProps.license,
      modelManager: contextProps.modelManager,
      workflow: contextProps.workflow,
      crm: contextProps.crm,
    });

    runtime.onLoad(context);

    this.loadedRuntimes.set(pluginId, runtime);
    this.loadedContexts.set(pluginId, context);

    return { pluginId, context };
  }

  /**
   * Unloads a plugin's runtime: invokes its onUnload hook and clears its
   * tracked runtime/context. Throws if the plugin is not currently loaded.
   */
  public unload(pluginId: string): void {
    const runtime = this.loadedRuntimes.get(pluginId);
    if (!runtime) {
      throw new Error(`Cannot unload plugin "${pluginId}" that is not loaded.`);
    }

    runtime.onUnload();

    this.loadedRuntimes.delete(pluginId);
    this.loadedContexts.delete(pluginId);
  }

  /**
   * Reloads a plugin's runtime: unloads the current runtime, then loads
   * the given runtime with fresh context props. Throws if the plugin is
   * not currently loaded.
   */
  public reload(
    pluginId: string,
    runtime: PluginRuntime,
    contextProps: Omit<PluginContextProps, "pluginId">
  ): PluginLoadResult {
    if (!this.loadedRuntimes.has(pluginId)) {
      throw new Error(`Cannot reload plugin "${pluginId}" that is not loaded.`);
    }

    this.unload(pluginId);
    return this.load(pluginId, runtime, contextProps);
  }

  /**
   * Returns true if the given plugin id currently has a loaded runtime.
   */
  public isLoaded(pluginId: string): boolean {
    return this.loadedRuntimes.has(pluginId);
  }

  /**
   * Returns the active PluginContext for a loaded plugin. Throws if the
   * plugin is not currently loaded.
   */
  public getContext(pluginId: string): PluginContext {
    const context = this.loadedContexts.get(pluginId);
    if (!context) {
      throw new Error(`No active context for plugin "${pluginId}"; it is not loaded.`);
    }
    return context;
  }
}