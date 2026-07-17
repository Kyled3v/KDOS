/**
 * ReportingStructure
 *
 * Defines the department taxonomy and reporting-line rules shared by
 * every employee definition in the KyleDev digital organisation. Pure
 * data and lookup logic only — no employee records live here.
 */

export enum Department {
  EXECUTIVE = "EXECUTIVE",
  SALES = "SALES",
  ENGINEERING = "ENGINEERING",
  DELIVERY = "DELIVERY",
  CUSTOMER_SUCCESS = "CUSTOMER_SUCCESS",
  MARKETING = "MARKETING",
  FINANCE = "FINANCE",
  LEGAL = "LEGAL",
  HR = "HR",
  SUPPORT = "SUPPORT",
}

export enum PriorityLevel {
  EXECUTIVE = "EXECUTIVE",
  CRITICAL = "CRITICAL",
  HIGH = "HIGH",
  STANDARD = "STANDARD",
}

export interface ReportingLine {
  readonly employeeId: string;
  readonly reportsTo: string | null;
  readonly manages: readonly string[];
}

export const DEPARTMENT_HEADS: Readonly<Record<Department, string>> = {
  [Department.EXECUTIVE]: "employee-ceo",
  [Department.SALES]: "employee-sales-director",
  [Department.ENGINEERING]: "employee-cto",
  [Department.DELIVERY]: "employee-coo",
  [Department.CUSTOMER_SUCCESS]: "employee-customer-success-manager",
  [Department.MARKETING]: "employee-marketing-director",
  [Department.FINANCE]: "employee-finance-officer",
  [Department.LEGAL]: "employee-legal-advisor",
  [Department.HR]: "employee-hr-manager",
  [Department.SUPPORT]: "employee-support-engineer",
};

/**
 * Validates that a reporting line does not create a self-reference.
 */
export function validateReportingLine(line: ReportingLine): void {
  if (line.reportsTo === line.employeeId) {
    throw new Error(`Employee "${line.employeeId}" cannot report to itself.`);
  }
  if (line.manages.includes(line.employeeId)) {
    throw new Error(`Employee "${line.employeeId}" cannot manage itself.`);
  }
}