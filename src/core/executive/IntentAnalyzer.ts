/**
 * The business domain a request belongs to. This is the first and
 * coarsest classification the IntentAnalyzer produces.
 */
export type BusinessDomain =
  | "software"
  | "marketing"
  | "finance"
  | "sales"
  | "research"
  | "operations"
  | "automation"
  | "unknown";

/**
 * The scale of work a request is estimated to require, from a single
 * small deliverable up to a full multi-department initiative.
 */
export type ComplexityLevel = "low" | "medium" | "high" | "enterprise";

/**
 * How urgently a request needs to be addressed.
 */
export type UrgencyLevel = "low" | "medium" | "high" | "critical";

/**
 * The structured output of the IntentAnalyzer: a complete, immediate
 * understanding of a user's request, derived entirely from
 * deterministic analysis of its text.
 */
export interface IntentAnalysis {
  readonly originalRequest: string;
  readonly businessDomain: BusinessDomain;
  readonly objective: string;
  readonly complexity: ComplexityLevel;
  readonly urgency: UrgencyLevel;
  readonly requiresPlanning: boolean;
  readonly requiresResearch: boolean;
  readonly requiresMultipleDepartments: boolean;
  readonly estimatedDepartments: string[];
  readonly confidence: number;
}

/**
 * Keyword signals used to detect the business domain of a request.
 * Order matters: earlier entries take precedence when multiple
 * domains match.
 */
const DOMAIN_SIGNALS: ReadonlyArray<readonly [BusinessDomain, readonly string[]]> = [
  [
    "software",
    [
      "build",
      "develop",
      "code",
      "app",
      "api",
      "database",
      "platform",
      "feature",
      "bug",
      "software",
      "website",
      "integration",
      "system",
    ],
  ],
  [
    "marketing",
    [
      "marketing",
      "campaign",
      "advertis",
      "seo",
      "brand",
      "social media",
      "logo",
      "design",
      "mockup",
      "branding",
      "content",
    ],
  ],
  [
    "finance",
    ["budget", "finance", "financial", "invoice", "revenue", "cost", "pricing", "accounting"],
  ],
  ["sales", ["sales", "sell", "pitch", "prospect", "lead generation", "close a deal"]],
  ["research", ["research", "investigate", "study", "explore options", "market analysis"]],
  [
    "operations",
    ["internal process", "coordinate", "onboarding", "policy", "hiring", "operations"],
  ],
  [
    "automation",
    ["automate", "automation", "workflow", "pipeline", "trigger", "schedule a task"],
  ],
];

/**
 * Keyword signals indicating an enterprise-scale, multi-phase piece of
 * work — typically a complete product or system rather than a single
 * deliverable.
 */
const ENTERPRISE_SCALE_SIGNALS: readonly string[] = [
  "website",
  "platform",
  "application",
  "full-stack",
  "end-to-end",
  "enterprise",
  "system",
];

/**
 * Keyword signals indicating a high-scale, but not enterprise-wide,
 * piece of work.
 */
const HIGH_SCALE_SIGNALS: readonly string[] = [
  "campaign",
  "strategy",
  "integration",
  "migration",
  "redesign",
];

/**
 * Keyword signals indicating a low-scale, single, well-bounded
 * deliverable.
 */
const LOW_SCALE_SIGNALS: readonly string[] = [
  "logo",
  "icon",
  "banner",
  "fix",
  "tweak",
  "small",
  "quick",
  "minor",
];

/**
 * Keyword signals used to detect the urgency of a request.
 */
const URGENCY_SIGNALS: ReadonlyArray<readonly [UrgencyLevel, readonly string[]]> = [
  ["critical", ["urgent", "asap", "immediately", "right now", "critical", "emergency"]],
  ["high", ["important", "priority", "soon", "this week"]],
  ["low", ["eventually", "when you have time", "low priority", "nice to have", "whenever"]],
];

/**
 * Keyword signals identifying a design-specific deliverable within the
 * marketing domain, used to route to a Design department rather than
 * a general Marketing department.
 */
const DESIGN_SIGNALS: readonly string[] = [
  "logo",
  "mockup",
  "wireframe",
  "brand identity",
  "visual design",
  "graphic",
];

/**
 * Keyword signals indicating a request is fundamentally investigative
 * rather than executional.
 */
const RESEARCH_SIGNALS: readonly string[] = [
  "research",
  "investigate",
  "study",
  "market analysis",
  "explore options",
];

/**
 * The IntentAnalyzer is the first component executed after a user
 * submits a request. Its sole responsibility is to understand
 * intent — the business domain, objective, complexity, urgency, and
 * likely departmental footprint of the request. It performs no AI
 * calls, no OpenRouter calls, no dispatch, and has no access to
 * employees or the TaskDispatcher. Every judgement it makes is pure,
 * deterministic keyword and structural analysis of the request text.
 */
export class IntentAnalyzer {
  /**
   * Analyses a raw user request and returns its complete
   * IntentAnalysis. Throws if the request is empty.
   */
  public analyze(request: string): IntentAnalysis {
    if (!request || request.trim().length === 0) {
      throw new Error("IntentAnalyzer: request is required.");
    }

    const objective = this.extractObjective(request);
    const businessDomain = this.detectBusinessDomain(objective);
    const complexity = this.detectComplexity(objective);
    const urgency = this.detectUrgency(objective);
    const estimatedDepartments = this.estimateDepartments(
      objective,
      businessDomain,
      complexity
    );
    const requiresMultipleDepartments = estimatedDepartments.length > 1;
    const requiresResearch = this.detectRequiresResearch(
      objective,
      businessDomain,
      complexity
    );
    const requiresPlanning =
      complexity === "high" || complexity === "enterprise" || requiresMultipleDepartments;
    const confidence = this.computeConfidence(objective, businessDomain);

    return {
      originalRequest: request,
      businessDomain,
      objective,
      complexity,
      urgency,
      requiresPlanning,
      requiresResearch,
      requiresMultipleDepartments,
      estimatedDepartments,
      confidence,
    };
  }

  /**
   * Normalises a raw request into a single analysable objective
   * statement: trimmed, whitespace-collapsed, and stripped of
   * conversational filler that carries no business meaning.
   */
  private extractObjective(request: string): string {
    const collapsed = request.replace(/\s+/g, " ").trim();

    const filler = /^(please|hey|hi|could you|can you|i need you to|i want you to)\s+/i;

    return collapsed.replace(filler, "").trim();
  }

  /**
   * Detects the business domain of an objective from keyword signals.
   * Defaults to "unknown" when no signal matches.
   */
  private detectBusinessDomain(objective: string): BusinessDomain {
    const normalised = objective.toLowerCase();

    for (const [domain, keywords] of DOMAIN_SIGNALS) {
      if (keywords.some((keyword) => normalised.includes(keyword))) {
        return domain;
      }
    }

    return "unknown";
  }

  /**
   * Detects the complexity of an objective from scale-signal keywords.
   * Enterprise-scale signals take precedence, followed by high-scale,
   * then low-scale. Defaults to "medium" when no scale signal matches.
   */
  private detectComplexity(objective: string): ComplexityLevel {
    const normalised = objective.toLowerCase();

    if (ENTERPRISE_SCALE_SIGNALS.some((keyword) => normalised.includes(keyword))) {
      return "enterprise";
    }

    if (HIGH_SCALE_SIGNALS.some((keyword) => normalised.includes(keyword))) {
      return "high";
    }

    if (LOW_SCALE_SIGNALS.some((keyword) => normalised.includes(keyword))) {
      return "low";
    }

    return "medium";
  }

  /**
   * Detects the urgency of an objective from keyword signals. Defaults
   * to "medium" when no signal matches.
   */
  private detectUrgency(objective: string): UrgencyLevel {
    const normalised = objective.toLowerCase();

    for (const [urgency, keywords] of URGENCY_SIGNALS) {
      if (keywords.some((keyword) => normalised.includes(keyword))) {
        return urgency;
      }
    }

    return "medium";
  }

  /**
   * Determines whether a request is fundamentally investigative in
   * nature, either because it explicitly belongs to the research
   * domain, contains research-specific language, or is large enough
   * in scope that an enterprise-scale initiative would reasonably
   * begin with a research phase.
   */
  private detectRequiresResearch(
    objective: string,
    domain: BusinessDomain,
    complexity: ComplexityLevel
  ): boolean {
    if (domain === "research") {
      return true;
    }

    const normalised = objective.toLowerCase();

    if (RESEARCH_SIGNALS.some((keyword) => normalised.includes(keyword))) {
      return true;
    }

    return complexity === "enterprise";
  }

  /**
   * Estimates the departments likely required to fulfil a request,
   * based on its business domain and complexity. Enterprise-scale
   * software requests receive the full product pipeline; smaller
   * requests receive a narrower, domain-specific department set.
   */
  private estimateDepartments(
    objective: string,
    domain: BusinessDomain,
    complexity: ComplexityLevel
  ): string[] {
    const normalised = objective.toLowerCase();

    switch (domain) {
      case "software":
        if (complexity === "enterprise") {
          return ["Software Engineering", "Design", "Marketing", "Testing", "Deployment"];
        }

        if (complexity === "high") {
          return ["Software Engineering", "Testing"];
        }

        return ["Software Engineering"];

      case "marketing":
        if (DESIGN_SIGNALS.some((keyword) => normalised.includes(keyword))) {
          return ["Design"];
        }

        return ["Marketing"];

      case "finance":
        return ["Finance"];

      case "sales":
        return ["Sales"];

      case "research":
        return ["Research"];

      case "operations":
        return ["Operations"];

      case "automation":
        if (complexity === "enterprise" || complexity === "high") {
          return ["Software Engineering", "Automation"];
        }

        return ["Automation"];

      case "unknown":
      default:
        return ["Operations"];
    }
  }

  /**
   * Computes a confidence score for the analysis, based on whether a
   * business domain was successfully identified and how many keyword
   * signals contributed to that identification. An unrecognised
   * domain always yields low confidence.
   */
  private computeConfidence(objective: string, domain: BusinessDomain): number {
    if (domain === "unknown") {
      return 0.3;
    }

    const normalised = objective.toLowerCase();
    const signalEntry = DOMAIN_SIGNALS.find(([candidate]) => candidate === domain);
    const matchCount = signalEntry
      ? signalEntry[1].filter((keyword) => normalised.includes(keyword)).length
      : 0;

    const confidence = 0.6 + matchCount * 0.1;

    return Math.round(Math.min(confidence, 1) * 100) / 100;
  }
}