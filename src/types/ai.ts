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
export interface AI {
    id: string;
    name: string;
    personalityType: 'analytical' | 'creative' | 'strategic' | 'supportive';
    description: string;
    longDescription?: string;
    capabilityLevel: 'basic' | 'intermediate' | 'advanced';
    specialization: string;
    resourceRequirements: 'low' | 'medium' | 'high';
    imageUrl: string;
    details?: {
        mbti?: string;
        role?: string;
        keyAbilities?: string[];
        uniqueTraits?: string;
        challenges?: string;
        interactionTip?: string;
        funFact?: string;
    };
}
