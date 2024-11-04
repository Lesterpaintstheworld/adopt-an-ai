import { Mission } from '../types/missions';

export const loadMissionsForPerk = async (perkId: string): Promise<Mission[]> => {
  try {
    const modules = import.meta.glob('../../content/missions/*.yml', { eager: true });
    const path = `../../content/missions/${perkId}-missions.yml`;
    
    if (path in modules) {
      const module = modules[path];
      return module.default;
    }
    
    console.warn(`No missions found for perk: ${perkId}`);
    return [];
  } catch (error) {
    console.error(`Error loading missions for ${perkId}:`, error);
    return [];
  }
};

export const loadAllMissions = async (): Promise<Mission[]> => {
  try {
    const modules = import.meta.glob('../../content/missions/*.yml', { eager: true });
    const allMissions: Mission[] = [];
    
    for (const path in modules) {
      const module = modules[path];
      const missions = module.default;
      if (Array.isArray(missions)) {
        allMissions.push(...missions);
      }
    }
    
    return allMissions;
  } catch (error) {
    console.error('Error loading all missions:', error);
    return [];
  }
};
