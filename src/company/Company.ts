/**
 * Company
 *
 * The single, real definition of KyleDev as an operating business entity
 * within KDOS. Not a template, not a placeholder — this is the actual
 * company record the AI workforce, CRM, and platform kernel reference.
 */

export interface CompanyDefinition {
  readonly legalName: string;
  readonly tradingName: string;
  readonly mission: string;
  readonly registrationCountry: string;
  readonly primaryCurrency: "ZAR";
  readonly foundedYear: number;
  readonly headquarters: string;
  readonly industry: string;
  readonly website: string;
}

export const KYLEDEV_COMPANY: CompanyDefinition = {
  legalName: "KyleDev (Pty) Ltd",
  tradingName: "KyleDev",
  mission: "We engineer digital businesses.",
  registrationCountry: "South Africa",
  primaryCurrency: "ZAR",
  foundedYear: 2024,
  headquarters: "Johannesburg, Gauteng, South Africa",
  industry: "Digital Engineering & Technology Consulting",
  website: "https://kyledev.co.za",
};