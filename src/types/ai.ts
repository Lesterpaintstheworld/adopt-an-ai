export interface AI {
  id: string;
  name: string;
  personality: string;
  capabilities: string[];
  developmentHistory: string[];
  specializations: string[];
  resourceRequirements: {
    compute: number;
    memory: number;
  };
}

export interface AdoptFilters {
  capabilityLevel: 'all' | 'basic' | 'intermediate' | 'advanced';
  personalityType: 'all' | 'analytical' | 'creative' | 'strategic' | 'supportive';
  resourceRequirements: 'all' | 'low' | 'medium' | 'high';
  specialization: string;
}
