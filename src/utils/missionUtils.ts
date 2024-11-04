import { Mission } from '../types/missions';

export const loadMissionsForPerk = async (perkId: string): Promise<Mission[]> => {
  try {
    const modules = import.meta.glob('../../content/missions/*.yml', { eager: true }) as Record<string, { default: Mission[] }>;
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
    const modules = import.meta.glob('../../content/missions/*.yml', { eager: true }) as Record<string, { default: Mission[] }>;
    const allMissions: Mission[] = [];
    
    for (const path in modules) {
      try {
        const module = modules[path];
        const missions = module.default;
        if (Array.isArray(missions)) {
          // Add id if missing and ensure unique capability_ids
          const processedMissions = missions.map((mission, index) => ({
            ...mission,
            id: mission.id || `${mission?.capability_id || 'mission'}-${index}`,
          }));
          allMissions.push(...processedMissions);
        }
      } catch (error) {
        console.warn(`Error loading missions from ${path}:`, error);
      }
    }
    
    // Remove duplicates based on id
    const uniqueMissions = allMissions.reduce((acc: Mission[], current) => {
      const exists = acc.find(m => m.id === current.id);
      if (!exists) {
        acc.push(current);
      } else {
        console.warn(`Duplicate mission id found: ${current.id}`);
      }
      return acc;
    }, []);
    
    return uniqueMissions;
  } catch (error) {
    console.error('Error loading all missions:', error);
    return [];
  }
};
