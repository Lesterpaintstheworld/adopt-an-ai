interface PerkIconParams {
  name: string;
  capability_id: string;
}

export const getPerkIconUrl = ({ name, capability_id }: PerkIconParams): string => {
  // Retourne une URL d'icône basée sur le nom et l'ID de la capacité
  // Pour l'instant, on peut utiliser une URL par défaut
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${capability_id}`;
};
