import { AI, AdoptFilters } from '../types/ai';

export const filterAIs = (ais: AI[], filters: AdoptFilters): AI[] => {
  return ais.filter(ai => {
    // Check capability level
    if (filters.capabilityLevel !== 'all') {
      if (filters.capabilityLevel !== ai.capabilityLevel) return false;
    }

    // Check personality type
    if (filters.personalityType !== 'all') {
      if (ai.personalityType.toLowerCase() !== filters.personalityType.toLowerCase()) return false;
    }

    // Check resource requirements
    if (filters.resourceRequirements !== 'all') {
      if (ai.resourceRequirements !== filters.resourceRequirements) return false;
    }

    // Check specialization
    if (filters.specialization !== 'all') {
      if (!ai.specialization) return false;
      return ai.specialization.toLowerCase().includes(filters.specialization.toLowerCase());
    }

    return true;
  });
};
