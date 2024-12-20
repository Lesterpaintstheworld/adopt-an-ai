export interface PerkVersion {
  version: string;
  date: string;
  changes: string[];
  reviewed_by: string;
  approved_by?: string;
}

export interface PerkVersionControl {
  current_version: string;
  last_updated: string;
  version_history: PerkVersion[];
}

export interface PerkPerformanceMetrics {
  baseline: Record<string, string | number>;
  targets: Record<string, string | number>;
  constraints: string[];
}

export interface PerkTechnicalSpecification {
  core_components: Array<{
    name: string;
    description: string;
    features: string[];
    requirements: string[];
  }>;
  performance_metrics: PerkPerformanceMetrics;
}

export interface DependencyItem {
  capability?: string;
  criticality?: string;
  relationship?: string;
  security_aspects?: string[];
}

export interface DependenciesSection {
  prerequisites?: Record<string, Array<string | DependencyItem>>;
  enables?: Record<string, Array<string | DependencyItem>>;
  security?: {
    authentication?: string[];
    authorization?: string[];
    compliance?: string[];
    data_protection?: string;
  };
  dependencies_visualization?: {
    format?: string;
    primary_diagram?: string;
  };
}

export interface PerkSecurityRequirements {
  authentication: string[];
  authorization: string[];
  compliance: string[];
  data_protection: string;
  incident_response?: {
    plan: string[];
    procedures: string[];
  };
}

export interface PerkFullData {
  capability_id: string;
  name: string;
  version_control: PerkVersionControl;
  description: {
    short: string;
    long: string;
  };
  technical_specifications: PerkTechnicalSpecification;
  security_requirements?: PerkSecurityRequirements;
  dependencies?: DependenciesSection;
  dependencies_and_security?: DependenciesSection;
  [key: string]: any;
}
