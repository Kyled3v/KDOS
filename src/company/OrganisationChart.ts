/**
 * OrganisationChart
 *
 * Assembles every employee definition in the KyleDev digital organisation
 * into a single queryable structure, and validates reporting-line
 * integrity across the whole company. Contains no employee records
 * itself — those are imported from each employee's own file.
 */

import { Department, ReportingLine, validateReportingLine } from "./ReportingStructure";

import { CEO } from "./employees/CEO";
import { COO } from "./employees/COO";
import { CTO } from "./employees/CTO";
import { SALES_DIRECTOR } from "./employees/SalesDirector";
import { BUSINESS_CONSULTANT } from "./employees/BusinessConsultant";
import { PROPOSAL_SPECIALIST } from "./employees/ProposalSpecialist";
import { QUOTATION_SPECIALIST } from "./employees/QuotationSpecialist";
import { SOFTWARE_ARCHITECT } from "./employees/SoftwareArchitect";
import { FRONTEND_LEAD } from "./employees/FrontendLead";
import { BACKEND_LEAD } from "./employees/BackendLead";
import { MOBILE_LEAD } from "./employees/MobileLead";
import { AUTOMATION_ENGINEER } from "./employees/AutomationEngineer";
import { DEVOPS_ENGINEER } from "./employees/DevOpsEngineer";
import { QA_ENGINEER } from "./employees/QAEngineer";
import { PROJECT_MANAGER } from "./employees/ProjectManager";
import { CUSTOMER_SUCCESS_MANAGER } from "./employees/CustomerSuccessManager";
import { MARKETING_DIRECTOR } from "./employees/MarketingDirector";
import { SEO_SPECIALIST } from "./employees/SEOSpecialist";
import { CONTENT_CREATOR } from "./employees/ContentCreator";
import { FINANCE_OFFICER } from "./employees/FinanceOfficer";
import { LEGAL_ADVISOR } from "./employees/LegalAdvisor";
import { HR_MANAGER } from "./employees/HRManager";
import { SUPPORT_ENGINEER } from "./employees/SupportEngineer";

export interface OrganisationEmployeeSummary {
  readonly employeeId: string;
  readonly name: string;
  readonly title: string;
  readonly department: Department;
  readonly reportsTo: string | null;
  readonly manages: readonly string[];
}

const ALL_EMPLOYEES: readonly OrganisationEmployeeSummary[] = [
  CEO,
  COO,
  CTO,
  SALES_DIRECTOR,
  BUSINESS_CONSULTANT,
  PROPOSAL_SPECIALIST,
  QUOTATION_SPECIALIST,
  SOFTWARE_ARCHITECT,
  FRONTEND_LEAD,
  BACKEND_LEAD,
  MOBILE_LEAD,
  AUTOMATION_ENGINEER,
  DEVOPS_ENGINEER,
  QA_ENGINEER,
  PROJECT_MANAGER,
  CUSTOMER_SUCCESS_MANAGER,
  MARKETING_DIRECTOR,
  SEO_SPECIALIST,
  CONTENT_CREATOR,
  FINANCE_OFFICER,
  LEGAL_ADVISOR,
  HR_MANAGER,
  SUPPORT_ENGINEER,
];

export class OrganisationChart {
  private readonly employees: Map<string, OrganisationEmployeeSummary>;

  /**
   * Builds the organisation chart from every known employee definition,
   * validating reporting-line integrity as it goes.
   */
  public constructor(employees: readonly OrganisationEmployeeSummary[] = ALL_EMPLOYEES) {
    this.employees = new Map<string, OrganisationEmployeeSummary>();

    for (const employee of employees) {
      if (this.employees.has(employee.employeeId)) {
        throw new Error(`Duplicate employeeId "${employee.employeeId}" found while building OrganisationChart.`);
      }
      this.employees.set(employee.employeeId, employee);
    }

    for (const employee of employees) {
      const line: ReportingLine = {
        employeeId: employee.employeeId,
        reportsTo: employee.reportsTo,
        manages: employee.manages,
      };
      validateReportingLine(line);

      if (employee.reportsTo !== null && !this.employees.has(employee.reportsTo)) {
        throw new Error(
          `Employee "${employee.employeeId}" reports to unknown employeeId "${employee.reportsTo}".`
        );
      }
    }
  }

  /**
   * Finds an employee summary by id. Throws if not found.
   */
  public find(employeeId: string): OrganisationEmployeeSummary {
    const employee = this.employees.get(employeeId);
    if (!employee) {
      throw new Error(`No employee found with id "${employeeId}".`);
    }
    return employee;
  }

  /**
   * Lists every employee in the organisation.
   */
  public list(): readonly OrganisationEmployeeSummary[] {
    return Array.from(this.employees.values());
  }

  /**
   * Lists every employee within a given department.
   */
  public listByDepartment(department: Department): readonly OrganisationEmployeeSummary[] {
    return this.list().filter((employee) => employee.department === department);
  }

  /**
   * Returns the direct reports of a given employee.
   */
  public directReports(employeeId: string): readonly OrganisationEmployeeSummary[] {
    const employee = this.find(employeeId);
    return employee.manages.map((id) => this.find(id));
  }

  /**
   * Returns the full management chain from an employee up to the CEO.
   */
  public chainOfCommand(employeeId: string): readonly OrganisationEmployeeSummary[] {
    const chain: OrganisationEmployeeSummary[] = [];
    let current: OrganisationEmployeeSummary | null = this.find(employeeId);

    while (current && current.reportsTo !== null) {
      current = this.find(current.reportsTo);
      chain.push(current);
    }

    return chain;
  }

  /**
   * Returns the total headcount in the organisation.
   */
  public headcount(): number {
    return this.employees.size;
  }
}