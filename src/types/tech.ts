export interface Perk {
  name: string;
  tag: string;
  description: string;
  shortDescription?: string;
  longDescription?: string;
  chronologicalOrder?: number;
  prerequisites?: string[];
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
