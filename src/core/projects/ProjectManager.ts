/**
 * ProjectManager.ts
 *
 * Location: src/core/projects/ProjectManager.ts
 *
 * ProjectManager is the central project management module of KDOS.
 * Every project belongs to exactly one client and owns Tasks,
 * Documents, Milestones, Invoices, and Activity managed elsewhere in
 * the architecture — this file is responsible only for the Project
 * record itself.
 *
 * This file contains no AI logic, no authentication, and no
 * persistence beyond an in-memory store — it is a pure domain/data
 * layer.
 */

/**
 * The lifecycle status of a project.
 */
export enum ProjectStatus {
  PLANNING = 'PLANNING',
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON_HOLD',
  REVIEW = 'REVIEW',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

/**
 * A single project record, owned by exactly one client.
 */
export interface Project {
  readonly id: string
  readonly clientId: string
  readonly name: string
  readonly description: string
  readonly status: ProjectStatus
  readonly budget: number
  readonly deadline: Date | null
  readonly createdAt: Date
  readonly updatedAt: Date
}

/**
 * The fields required to create a new Project. Status defaults to
 * PLANNING when not supplied; timestamps and id are always assigned
 * by ProjectManager itself.
 */
export interface CreateProjectInput {
  readonly clientId: string
  readonly name: string
  readonly description: string
  readonly budget: number
  readonly deadline?: Date | null
  readonly status?: ProjectStatus
}

/**
 * The fields that may be updated on an existing Project. All fields
 * are optional — only supplied fields are changed. clientId is
 * intentionally excluded: reassigning a project to a different
 * client is a distinct operation from an ordinary update and is out
 * of scope for this class.
 */
export interface UpdateProjectInput {
  readonly name?: string
  readonly description?: string
  readonly status?: ProjectStatus
  readonly budget?: number
  readonly deadline?: Date | null
}

/**
 * Generates unique project identifiers. Extracted as an injectable
 * dependency so id generation strategy (uuid, nanoid, sequential,
 * etc.) can be swapped without changing ProjectManager itself.
 */
export interface IdGenerator {
  generate(prefix: string): string
}

/**
 * Default IdGenerator implementation, used when no IdGenerator is
 * injected.
 */
class DefaultIdGenerator implements IdGenerator {
  public generate(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  }
}

/**
 * ProjectManager
 *
 * Single responsibility: own the full lifecycle of Project records —
 * creation, update, archival, restoration, deletion, retrieval, and
 * search — entirely in memory.
 *
 * This class:
 *   - Uses no database or filesystem; all state lives in memory for
 *     the lifetime of this instance.
 *   - Performs no AI calls.
 *   - Performs no authentication or authorization — callers are
 *     assumed to already be authorized by the time they reach this
 *     class.
 *   - Never mutates a returned Project in place; every change
 *     produces a new, frozen record.
 *   - Is dependency-injection ready: id generation is supplied via
 *     the constructor.
 */
export class ProjectManager {
  /**
   * Internal in-memory project store, keyed by project id.
   */
  private readonly projects = new Map<string, Project>()

  private readonly idGenerator: IdGenerator

  public constructor(idGenerator: IdGenerator = new DefaultIdGenerator()) {
    this.idGenerator = idGenerator
  }

  /**
   * Creates a new Project record.
   *
   * @param input - The fields describing the new project.
   * @returns The newly created Project.
   */
  public createProject(input: CreateProjectInput): Project {
    const now = new Date()

    const project: Project = Object.freeze({
      id: this.idGenerator.generate('project'),
      clientId: input.clientId,
      name: input.name,
      description: input.description,
      status: input.status ?? ProjectStatus.PLANNING,
      budget: input.budget,
      deadline: input.deadline ?? null,
      createdAt: now,
      updatedAt: now,
    })

    this.projects.set(project.id, project)
    return project
  }

  /**
   * Updates an existing Project with the supplied fields. Fields not
   * present in `input` are left unchanged.
   *
   * @param projectId - The id of the Project to update.
   * @param input - The fields to change.
   * @returns The updated Project.
   * @throws Error if no Project exists for the given id.
   */
  public updateProject(projectId: string, input: UpdateProjectInput): Project {
    const project = this.requireProject(projectId)

    const updated: Project = Object.freeze({
      ...project,
      ...input,
      updatedAt: new Date(),
    })

    this.projects.set(projectId, updated)
    return updated
  }

  /**
   * Archives a Project by setting its status to ARCHIVED. Idempotent
   * — archiving an already-archived project simply refreshes its
   * updatedAt timestamp.
   *
   * @param projectId - The id of the Project to archive.
   * @returns The archived Project.
   * @throws Error if no Project exists for the given id.
   */
  public archiveProject(projectId: string): Project {
    return this.updateProject(projectId, { status: ProjectStatus.ARCHIVED })
  }

  /**
   * Restores an archived Project back to ACTIVE status.
   *
   * @param projectId - The id of the Project to restore.
   * @returns The restored Project.
   * @throws Error if no Project exists for the given id.
   */
  public restoreProject(projectId: string): Project {
    return this.updateProject(projectId, { status: ProjectStatus.ACTIVE })
  }

  /**
   * Permanently removes a Project record from the store. Unlike
   * archiveProject, this is not reversible — the record is gone.
   *
   * @param projectId - The id of the Project to delete.
   * @throws Error if no Project exists for the given id.
   */
  public deleteProject(projectId: string): void {
    this.requireProject(projectId)
    this.projects.delete(projectId)
  }

  /**
   * Retrieves a single Project by id.
   *
   * @param projectId - The id of the Project to retrieve.
   * @returns The Project, or undefined if no Project exists for the
   *          given id.
   */
  public getProject(projectId: string): Project | undefined {
    return this.projects.get(projectId)
  }

  /**
   * Retrieves every stored Project, optionally filtered by client
   * and/or status.
   *
   * @param filter - Optional filters to narrow the result set.
   * @param filter.clientId - If supplied, only Projects belonging to
   *        this client are returned.
   * @param filter.status - If supplied, only Projects with this
   *        status are returned.
   * @returns The matching Projects.
   */
  public getProjects(filter?: { clientId?: string; status?: ProjectStatus }): Project[] {
    let results = [...this.projects.values()]

    if (filter?.clientId) {
      results = results.filter((project) => project.clientId === filter.clientId)
    }

    if (filter?.status) {
      results = results.filter((project) => project.status === filter.status)
    }

    return results
  }

  /**
   * Searches Projects by a free-text query, matched case-
   * insensitively against name and description.
   *
   * @param query - The search text.
   * @returns Projects with at least one matching field. Returns
   *          every Project if the query is empty or whitespace-only.
   */
  public searchProjects(query: string): Project[] {
    const normalized = query.trim().toLowerCase()

    if (normalized.length === 0) {
      return [...this.projects.values()]
    }

    return [...this.projects.values()].filter((project) =>
      [project.name, project.description].join(' ').toLowerCase().includes(normalized)
    )
  }

  /**
   * Retrieves a Project by id or throws if none exists, so calling
   * methods can operate on a guaranteed-defined Project.
   */
  private requireProject(projectId: string): Project {
    const project = this.projects.get(projectId)
    if (!project) {
      throw new Error(`ProjectManager: no project found for id "${projectId}".`)
    }
    return project
  }
}