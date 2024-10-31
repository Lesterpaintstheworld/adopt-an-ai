import { AI, AdoptFilters } from '../types/ai';

export const filterAIs = (ais: AI[], filters: AdoptFilters): AI[] => {
  return ais.filter(ai => {
    if (filters.capabilityLevel !== 'all') {
      const capabilityCount = ai.capabilities.length;
      if (filters.capabilityLevel === 'basic' && capabilityCount > 3) return false;
      if (filters.capabilityLevel === 'intermediate' && (capabilityCount <= 3 || capabilityCount > 5)) return false;
      if (filters.capabilityLevel === 'advanced' && capabilityCount <= 5) return false;
    }

    if (filters.personalityType !== 'all') {
      const personality = ai.personality.toLowerCase();
      if (!personality.includes(filters.personalityType.toLowerCase())) return false;
    }

    if (filters.resourceRequirements !== 'all') {
      const avgResources = (ai.resourceRequirements.compute + ai.resourceRequirements.memory) / 2;
      if (filters.resourceRequirements === 'low' && avgResources > 60) return false;
      if (filters.resourceRequirements === 'medium' && (avgResources <= 60 || avgResources > 80)) return false;
      if (filters.resourceRequirements === 'high' && avgResources <= 80) return false;
    }

    if (filters.specialization !== 'all') {
      return ai.specializations.some(spec => 
        spec.toLowerCase().includes(filters.specialization.toLowerCase())
      );
    }

    return true;
  });
};
