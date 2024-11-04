export const pageTutorials = {
  governance: {
    title: "Gouvernance",
    content: "Bienvenue dans la section Gouvernance. Ici vous pourrez participer aux décisions concernant l'évolution de la plateforme et des IAs."
  },
  missions: {
    title: "Missions",
    content: "Dans cette section, vous trouverez différentes missions à accomplir pour faire progresser vos IAs et débloquer de nouvelles capacités."
  },
  team: {
    title: "AI Team", 
    content: "Gérez votre équipe d'IAs, leurs rôles et leurs interactions."
  },
  os: {
    title: "KinOS",
    content: "KinOS est notre système d'exploitation spécialisé pour le développement et l'autonomie des IAs. Il fournit un environnement sécurisé pour l'apprentissage."
  },
  training: {
    title: "Training",
    content: "Cette section vous permet de former vos IAs et de suivre leur progression."
  },
  gpus: {
    title: "GPUs",
    content: "Gérez vos ressources de calcul GPU pour l'entraînement de vos IAs."
  }
} as const;

export type PageKey = keyof typeof pageTutorials;
