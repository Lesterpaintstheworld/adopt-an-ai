export interface PerkDescription {
  short: string;
  long: string;
}

export interface Perk {
  name: string;
  tag: string;
  description: string | PerkDescription;
  chronologicalOrder?: number;
  prerequisites?: string[];
  capability_id: string;
  [key: string]: any; // Allow string indexing for sanitization
}

export interface PerkFullData extends Perk {
  tag: string;
  dependencies_visualization?: {
    primary_diagram?: string;
  };
  dependencies: {
    prerequisites: {
      [key: string]: Array<{
        capability?: string;
        criticality?: string;
      }>;
    };
    enables?: {
      [key: string]: Array<{
        capability: string;
        relationship?: string;
      }>;
    };
  };
  security_requirements?: {
    access_control?: Array<string | Record<string, any>>;
    compliance?: Array<string | Record<string, any>> | Record<string, any>;
    authentication?: string;
    authorization?: string;
    data_protection?: string;
  };
  success_metrics?: {
    operational_kpis?: Array<{
      metric: string;
      current: string | number | Date;
      target: string | number | Date;
    }>;
  };
  monitoring_and_maintenance?: {
    metrics_collection?: string[];
    alerting?: string[];
  };
  version_control?: {
    version_history: Array<{
      version: string | number;
      date: string | Date;
      changes: string[];
      reviewed_by: string;
      approved_by?: string;
    }>;
  };
  technical_specifications?: {
    core_components?: Array<{
      name: string;
      description: string;
    }>;
    performance_metrics?: {
      [key: string]: string | number;
    };
  };
  risks_and_mitigations?: {
    technical_risks?: Array<{
      risk: string;
      severity: string;
      mitigation: string;
    }>;
    ethical_risks?: Array<{
      risk: string;
      mitigation: string;
    }>;
  };
  documentation?: {
    technical_docs?: string[];
    training_materials?: string[];
  };
  deployment?: {
    strategies: Array<{
      strategy?: string;
      phases?: string[];
    } | string>;
    rollback_procedures: string[];
  };
  future_enhancements?: {
    planned_upgrades: {
      short_term: string[];
      medium_term: string[];
      long_term: string[];
    };
  };
  cmmi_assessment?: {
    current_level: number | string;
    assessment_date: string | Date;
    process_areas: {
      [key: string]: {
        maturity: string | number;
        strengths: string[];
        improvements_needed: string[];
      };
    };
  };
}

export interface PhaseData {
  name: string;
  period: string;
  description: string;
  [key: string]: any; // For layer data
}

export interface TechTree {
  [key: string]: PhaseData;
}
