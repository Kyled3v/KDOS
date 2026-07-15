/**
 * DocumentManager.ts
 *
 * Location: src/core/documents/DocumentManager.ts
 *
 * DocumentManager is the central document repository of KDOS. Every
 * document belongs to one or more of: Project, Client, Employee, or
 * Department, referenced by id.
 *
 * DocumentManager stores metadata only. It never touches actual file
 * bytes, performs no uploads, and has no filesystem or database
 * access — `storagePath` is treated as an opaque reference to wherever
 * the real file lives, owned entirely by whatever storage layer sits
 * outside this class.
 */

/**
 * The category of a stored document.
 */
export enum DocumentType {
  CONTRACT = 'CONTRACT',
  PROPOSAL = 'PROPOSAL',
  INVOICE = 'INVOICE',
  DESIGN = 'DESIGN',
  SPECIFICATION = 'SPECIFICATION',
  REPORT = 'REPORT',
  MEETING_NOTE = 'MEETING_NOTE',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  OTHER = 'OTHER',
}

/**
 * A single document metadata record. May be linked to any
 * combination of project, client, employee, and department — all
 * four are independently optional.
 */
export interface Document {
  readonly id: string
  readonly projectId: string | null
  readonly clientId: string | null
  readonly employeeId: string | null
  readonly departmentId: string | null
  readonly name: string
  readonly description: string
  readonly type: DocumentType
  readonly fileName: string
  readonly mimeType: string
  readonly size: number
  readonly storagePath: string
  readonly version: number
  readonly createdAt: Date
  readonly updatedAt: Date
}

/**
 * The fields required to create a new Document. Every ownership link
 * defaults to null when not supplied; version, id, and timestamps are
 * always assigned by DocumentManager itself.
 */
export interface CreateDocumentInput {
  readonly name: string
  readonly description: string
  readonly type: DocumentType
  readonly fileName: string
  readonly mimeType: string
  readonly size: number
  readonly storagePath: string
  readonly projectId?: string | null
  readonly clientId?: string | null
  readonly employeeId?: string | null
  readonly departmentId?: string | null
}

/**
 * The fields that may be updated on an existing Document. All fields
 * are optional — only supplied fields are changed. When any
 * file-identity field (fileName, mimeType, size, storagePath) is
 * supplied, the document's version is incremented automatically,
 * since those fields represent a new revision of the underlying
 * file; metadata-only edits (name, description, type, ownership
 * links) do not bump the version.
 */
export interface UpdateDocumentInput {
  readonly name?: string
  readonly description?: string
  readonly type?: DocumentType
  readonly fileName?: string
  readonly mimeType?: string
  readonly size?: number
  readonly storagePath?: string
  readonly projectId?: string | null
  readonly clientId?: string | null
  readonly employeeId?: string | null
  readonly departmentId?: string | null
}

/**
 * Generates unique document identifiers. Extracted as an injectable
 * dependency so id generation strategy (uuid, nanoid, sequential,
 * etc.) can be swapped without changing DocumentManager itself.
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
 * The set of fields that, when changed, represent a new revision of
 * the underlying file rather than a metadata-only edit.
 */
const FILE_IDENTITY_FIELDS = ['fileName', 'mimeType', 'size', 'storagePath'] as const

/**
 * DocumentManager
 *
 * Single responsibility: own the full lifecycle of Document metadata
 * records — creation, update, deletion, retrieval, and search —
 * entirely in memory.
 *
 * This class:
 *   - Stores documents in a Map<string, Document>, keyed by document
 *     id.
 *   - Stores metadata only; it never reads, writes, or validates
 *     actual file contents.
 *   - Uses no database or filesystem; all state lives in memory for
 *     the lifetime of this instance.
 *   - Performs no authentication or authorization — callers are
 *     assumed to already be authorized by the time they reach this
 *     class.
 *   - Never mutates a returned Document in place; every change
 *     produces a new, frozen record.
 *   - Is dependency-injection ready: id generation is supplied via
 *     the constructor.
 */
export class DocumentManager {
  /**
   * Internal in-memory document store, keyed by document id.
   */
  private readonly documents = new Map<string, Document>()

  private readonly idGenerator: IdGenerator

  public constructor(idGenerator: IdGenerator = new DefaultIdGenerator()) {
    this.idGenerator = idGenerator
  }

  /**
   * Creates a new Document metadata record at version 1.
   *
   * @param input - The fields describing the new document.
   * @returns The newly created Document.
   */
  public createDocument(input: CreateDocumentInput): Document {
    const now = new Date()

    const document: Document = Object.freeze({
      id: this.idGenerator.generate('doc'),
      projectId: input.projectId ?? null,
      clientId: input.clientId ?? null,
      employeeId: input.employeeId ?? null,
      departmentId: input.departmentId ?? null,
      name: input.name,
      description: input.description,
      type: input.type,
      fileName: input.fileName,
      mimeType: input.mimeType,
      size: input.size,
      storagePath: input.storagePath,
      version: 1,
      createdAt: now,
      updatedAt: now,
    })

    this.documents.set(document.id, document)
    return document
  }

  /**
   * Updates an existing Document with the supplied fields. Fields not
   * present in `input` are left unchanged. Automatically increments
   * `version` when any file-identity field (fileName, mimeType, size,
   * storagePath) is included in the update.
   *
   * @param documentId - The id of the Document to update.
   * @param input - The fields to change.
   * @returns The updated Document.
   * @throws Error if no Document exists for the given id.
   */
  public updateDocument(documentId: string, input: UpdateDocumentInput): Document {
    const document = this.requireDocument(documentId)
    const isNewRevision = this.touchesFileIdentity(input)

    const updated: Document = Object.freeze({
      ...document,
      ...input,
      version: isNewRevision ? document.version + 1 : document.version,
      updatedAt: new Date(),
    })

    this.documents.set(documentId, updated)
    return updated
  }

  /**
   * Permanently removes a Document metadata record from the store.
   * Does not affect any underlying file — callers are responsible
   * for cleaning up the actual file at `storagePath` separately.
   *
   * @param documentId - The id of the Document to delete.
   * @throws Error if no Document exists for the given id.
   */
  public deleteDocument(documentId: string): void {
    this.requireDocument(documentId)
    this.documents.delete(documentId)
  }

  /**
   * Retrieves a single Document by id.
   *
   * @param documentId - The id of the Document to retrieve.
   * @returns The Document, or undefined if no Document exists for
   *          the given id.
   */
  public getDocument(documentId: string): Document | undefined {
    return this.documents.get(documentId)
  }

  /**
   * Retrieves every stored Document, optionally filtered by any
   * combination of project, client, employee, department, and type.
   *
   * @param filter - Optional filters to narrow the result set.
   * @returns The matching Documents.
   */
  public getDocuments(filter?: {
    projectId?: string
    clientId?: string
    employeeId?: string
    departmentId?: string
    type?: DocumentType
  }): Document[] {
    let results = [...this.documents.values()]

    if (filter?.projectId) {
      results = results.filter((document) => document.projectId === filter.projectId)
    }

    if (filter?.clientId) {
      results = results.filter((document) => document.clientId === filter.clientId)
    }

    if (filter?.employeeId) {
      results = results.filter((document) => document.employeeId === filter.employeeId)
    }

    if (filter?.departmentId) {
      results = results.filter((document) => document.departmentId === filter.departmentId)
    }

    if (filter?.type) {
      results = results.filter((document) => document.type === filter.type)
    }

    return results
  }

  /**
   * Retrieves every Document linked to a given project.
   *
   * @param projectId - The id of the owning project.
   * @returns The project's Documents. Empty if the project has none.
   */
  public getProjectDocuments(projectId: string): Document[] {
    return [...this.documents.values()].filter((document) => document.projectId === projectId)
  }

  /**
   * Retrieves every Document linked to a given client.
   *
   * @param clientId - The id of the owning client.
   * @returns The client's Documents. Empty if the client has none.
   */
  public getClientDocuments(clientId: string): Document[] {
    return [...this.documents.values()].filter((document) => document.clientId === clientId)
  }

  /**
   * Searches Documents by a free-text query, matched case-
   * insensitively against name, description, and file name.
   *
   * @param query - The search text.
   * @returns Documents with at least one matching field. Returns
   *          every Document if the query is empty or
   *          whitespace-only.
   */
  public searchDocuments(query: string): Document[] {
    const normalized = query.trim().toLowerCase()

    if (normalized.length === 0) {
      return [...this.documents.values()]
    }

    return [...this.documents.values()].filter((document) =>
      [document.name, document.description, document.fileName]
        .join(' ')
        .toLowerCase()
        .includes(normalized)
    )
  }

  /**
   * Determines whether an update touches any field that represents a
   * new revision of the underlying file, warranting a version bump.
   */
  private touchesFileIdentity(input: UpdateDocumentInput): boolean {
    return FILE_IDENTITY_FIELDS.some((field) => input[field] !== undefined)
  }

  /**
   * Retrieves a Document by id or throws if none exists, so calling
   * methods can operate on a guaranteed-defined Document.
   */
  private requireDocument(documentId: string): Document {
    const document = this.documents.get(documentId)
    if (!document) {
      throw new Error(`DocumentManager: no document found for id "${documentId}".`)
    }
    return document
  }
}