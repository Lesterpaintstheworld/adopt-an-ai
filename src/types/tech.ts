export interface Perk {
  name: string;
  tag: string;
  description: string;
  shortDescription?: string;
  longDescription?: string;
  chronologicalOrder?: number;
  prerequisites?: string[];
  capability_id?: string;
  [key: string]: any; // Allow string indexing for sanitization
}

export interface PerkFullData {
  capability_id: string;
  name: string;
  tag: string;
  version_control: {
    current_version: string;
    last_updated: string;
    version_history: Array<{
      version: string;
      date: string;
      changes: string[];
      reviewed_by: string;
      approved_by?: string;
    }>;
  };
  description: {
    short: string;
    long: string;
  };
  technical_specifications: {
    core_components: Array<{
      name: string;
      description: string;
    }>;
    performance_metrics: {
      base_compute: {
        cpu: string;
        memory: string;
        storage: string;
      };
      guaranteed_uptime: string;
      response_time: string;
    };
  };
  dependencies: {
    prerequisites: {
      infrastructure: string[];
      system: string[];
    };
    enables: {
      compute_layer: string[];
      model_layer: string[];
    };
  };
  risks_and_mitigations: {
    technical_risks: Array<{
      risk: string;
      mitigation: string;
      severity: string;
    }>;
    ethical_risks: Array<{
      risk: string;
      mitigation: string;
    }>;
  };
  success_metrics: {
    operational_kpis: Array<{
      metric: string;
      target: string;
      current: string;
    }>;
    adoption_metrics: Array<{
      metric: string;
      target: string;
      current: string;
    }>;
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
