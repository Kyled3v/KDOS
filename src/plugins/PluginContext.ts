/**
 * PluginContext
 *
 * The bounded set of platform capabilities exposed to a Plugin at
 * runtime: the platform kernel itself, the license manager, the model
 * manager, the workflow engine, and the CRM. PluginContext contains no
 * implementation of any of these subsystems — it is a dependency-
 * injection boundary, identical in spirit to EmployeeExecutor's
 * ModelManagerPort. Concrete instances are supplied by whatever composes
 * the context (typically PluginManager), never constructed here.
 */

/**
 * Marker contracts for each subsystem a plugin may access. Concrete
 * shapes are owned by their respective subsystems; PluginContext only
 * needs to know they exist as opaque capability handles.
 */
export interface PlatformCapability {
  // Marker interface: the Platform Kernel capability handle.
}

export interface LicenseCapability {
  // Marker interface: the License Manager capability handle.
}

export interface ModelManagerCapability {
  // Marker interface: the Model Manager capability handle.
}

export interface WorkflowCapability {
  // Marker interface: the Workflow Engine capability handle.
}

export interface CrmCapability {
  // Marker interface: the CRM capability handle.
}

export interface PluginContextProps {
  readonly pluginId: string;
  readonly platform: PlatformCapability;
  readonly license: LicenseCapability;
  readonly modelManager: ModelManagerCapability;
  readonly workflow: WorkflowCapability;
  readonly crm: CrmCapability;
}

export class PluginContext {
  public readonly pluginId: string;
  public readonly platform: PlatformCapability;
  public readonly license: LicenseCapability;
  public readonly modelManager: ModelManagerCapability;
  public readonly workflow: WorkflowCapability;
  public readonly crm: CrmCapability;

  private constructor(props: PluginContextProps) {
    this.pluginId = props.pluginId;
    this.platform = props.platform;
    this.license = props.license;
    this.modelManager = props.modelManager;
    this.workflow = props.workflow;
    this.crm = props.crm;
  }

  /**
   * Creates a new PluginContext bound to a specific plugin id, wired with
   * the given capability handles via dependency injection.
   */
  public static create(props: PluginContextProps): PluginContext {
    if (!props.pluginId || props.pluginId.trim().length === 0) {
      throw new Error("PluginContext requires a non-empty pluginId.");
    }

    return new PluginContext(props);
  }

  /**
   * Returns a new PluginContext for a different plugin id, reusing the
   * same underlying capability handles. Useful when a single set of
   * platform capabilities is shared across multiple plugin contexts.
   */
  public forPlugin(pluginId: string): PluginContext {
    return PluginContext.create({
      pluginId,
      platform: this.platform,
      license: this.license,
      modelManager: this.modelManager,
      workflow: this.workflow,
      crm: this.crm,
    });
  }
}