export const pageTutorials = {
  gpus: {
    title: "Gestion des GPUs",
    content: "Ici vous pourrez gérer vos ressources de calcul pour entraîner votre IA."
  },
  myais: {
    title: "Mes IAs",
    content: "Gérez vos IAs, suivez leur évolution et interagissez avec elles."
  },
  missions: {
    title: "Missions",
    content: "Découvrez et accomplissez des missions pour faire progresser vos IAs."
  },
  marketplace: {
    title: "Marketplace",
    content: "Achetez et vendez des capacités et des ressources pour vos IAs."
  },
  settings: {
    title: "Paramètres",
    content: "Configurez vos préférences et gérez votre compte."
  }
} as const;

export type PageKey = keyof typeof pageTutorials;
