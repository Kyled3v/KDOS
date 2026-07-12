/**
 * The canonical employee domain model for KDOS. This file is the
 * single source of truth for the entire workforce core — every other
 * file in the workforce core depends on these types and only these
 * types.
 */

/**
 * The full catalogue of specialist roles an AI employee may occupy.
 */
export enum EmployeeRole {
  EXECUTIVE_ASSISTANT = "executive-assistant",
  SOFTWARE_ENGINEER = "software-engineer",
  PROJECT_MANAGER = "project-manager",
  MARKETING_STRATEGIST = "marketing-strategist",
  SALES_REPRESENTATIVE = "sales-representative",
  OUTREACH_SPECIALIST = "outreach-specialist",
  FINANCIAL_ANALYST = "financial-analyst",
  SUPPORT_AGENT = "support-agent",
  RESEARCHER = "researcher",
}

/**
 * The department an employee belongs to within KyleDev.
 */
export enum EmployeeDepartment {
  EXECUTIVE = "executive",
  ENGINEERING = "engineering",
  PRODUCT = "product",
  MARKETING = "marketing",
  SALES = "sales",
  FINANCE = "finance",
  SUPPORT = "support",
  RESEARCH = "research",
}

/**
 * The current operational status of an employee.
 */
export type EmployeeStatus =
  | "active"
  | "idle"
  | "busy"
  | "paused"
  | "offline"
  | "error";

/**
 * The urgency level of a unit of work assigned to an employee.
 */
export type EmployeeTaskPriority = "low" | "medium" | "high" | "urgent";

/**
 * The lifecycle status of a task assigned to an employee.
 */
export type EmployeeTaskStatus =
  | "pending"
  | "in-progress"
  | "blocked"
  | "completed"
  | "failed"
  | "cancelled";

/**
 * A unit of work assigned to an employee.
 */
export interface EmployeeTask {
  readonly id: string;
  readonly employeeId: string;
  readonly title: string;
  readonly description: string;
  readonly status: EmployeeTaskStatus;
  readonly priority: EmployeeTaskPriority;
  readonly workflowId: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly dueAt: Date | null;
  readonly completedAt: Date | null;
}

/**
 * The structured outcome of an employee's execution of a task. This is
 * the sole output surface for employee execution — employees never
 * communicate results directly to the user.
 */
export interface EmployeeResult {
  readonly taskId: string;
  readonly employeeId: string;
  readonly success: boolean;
  readonly summary: string;
  readonly output: unknown;
  readonly issues: readonly string[];
  readonly suggestions: readonly string[];
  readonly completedAt: Date;
}

/**
 * Contextual information supplied alongside a task at execution time,
 * scoping the request within the broader system without exposing
 * internal infrastructure to the employee.
 */
export interface EmployeeContext {
  readonly requestId: string;
  readonly workflowId: string | null;
  readonly correlationId: string;
  readonly metadata: Readonly<Record<string, unknown>>;
}

/**
 * The classification of a stored memory entry.
 */
export type EmployeeMemoryType =
  | "short-term"
  | "long-term"
  | "episodic"
  | "procedural";

/**
 * A unit of memory retained by an employee. This shape is the
 * contract the MemoryEngine stores, retrieves, and searches against.
 */
export interface EmployeeMemory {
  readonly id: string;
  readonly employeeId: string;
  readonly type: EmployeeMemoryType;
  readonly content: string;
  readonly context: Readonly<Record<string, unknown>>;
  readonly createdAt: Date;
  readonly expiresAt: Date | null;
}

/**
 * The complete profile record for an AI employee, as returned by
 * Employee.getProfile(). Always includes the employee's current
 * status, department, role, and the timestamp it was last active.
 */
export interface EmployeeProfile {
  readonly id: string;
  readonly name: string;
  readonly role: EmployeeRole;
  readonly department: EmployeeDepartment;
  readonly status: EmployeeStatus;
  readonly lastActive: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * The contract every AI employee in KDOS must implement, regardless of
 * role, department, or seniority. This interface is the single point
 * of integration between the workforce and the systems that dispatch
 * work to it.
 */
export interface Employee {
  readonly id: string;
  readonly name: string;
  readonly role: EmployeeRole;
  readonly department: EmployeeDepartment;
  getProfile(): EmployeeProfile;
  execute(task: EmployeeTask, context: EmployeeContext): Promise<EmployeeResult>;
}