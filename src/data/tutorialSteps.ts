export const pageTutorials = {
  os: [
    {
      target: '[data-tour="os-title"]',
      content: "Welcome to KinOS, our specialized operating system for AI development.",
      placement: 'bottom',
    },
    {
      target: '[data-tour="os-description"]',
      content: "Learn about how KinOS provides a secure environment for AI systems.",
      placement: 'top',
    }
  ],
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
