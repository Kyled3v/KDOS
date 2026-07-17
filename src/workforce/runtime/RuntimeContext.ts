/**
 * RuntimeContext
 *
 * The bounded set of platform subsystems the Workforce Runtime and
 * Workforce Orchestrator depend on: the Execution Engine, Workflow
 * Engine, Knowledge Engine, Plugin Manager, and License Manager.
 * RuntimeContext contains no implementation of any of these subsystems —
 * it is a dependency-injection boundary, identical in spirit to
 * EmployeeExecutor's ModelManagerPort and PluginContext's capability
 * handles. Concrete instances are supplied by whatever composes the
 * context (typically the bootstrap layer), never constructed here.
 */

/**
 * Marker contracts for each subsystem the runtime may access. Concrete
 * shapes are owned by their respective subsystems; RuntimeContext only
 * needs to know they exist as opaque capability handles.
 */
export interface ExecutionEngineCapability {
  // Marker interface: the Execution Engine capability handle.
}

export interface WorkflowEngineCapability {
  // Marker interface: the Workflow Engine capability handle.
}

export interface KnowledgeEngineCapability {
  // Marker interface: the Knowledge Engine capability handle.
}

export interface PluginManagerCapability {
  // Marker interface: the Plugin Manager capability handle.
}

export interface LicenseManagerCapability {
  // Marker interface: the License Manager capability handle.
}

export interface RuntimeContextProps {
  readonly executionEngine: ExecutionEngineCapability;
  readonly workflowEngine: WorkflowEngineCapability;
  readonly knowledgeEngine: KnowledgeEngineCapability;
  readonly pluginManager: PluginManagerCapability;
  readonly licenseManager: LicenseManagerCapability;
}

export class RuntimeContext {
  public readonly executionEngine: ExecutionEngineCapability;
  public readonly workflowEngine: WorkflowEngineCapability;
  public readonly knowledgeEngine: KnowledgeEngineCapability;
  public readonly pluginManager: PluginManagerCapability;
  public readonly licenseManager: LicenseManagerCapability;

  private constructor(props: RuntimeContextProps) {
    this.executionEngine = props.executionEngine;
    this.workflowEngine = props.workflowEngine;
    this.knowledgeEngine = props.knowledgeEngine;
    this.pluginManager = props.pluginManager;
    this.licenseManager = props.licenseManager;
  }

  /**
   * Creates a new RuntimeContext, wired with the given capability handles
   * via dependency injection.
   */
  public static create(props: RuntimeContextProps): RuntimeContext {
    return new RuntimeContext(props);
  }
}