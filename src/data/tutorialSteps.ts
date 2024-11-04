export const pageTutorials = {
  governance: {
    title: "Governance",
    content: "Welcome to the Governance section. Here you can participate in decisions about the evolution of the platform and AIs."
  },
  missions: {
    title: "Missions",
    content: "In this section, you'll find various missions to accomplish to advance your AIs and unlock new capabilities."
  },
  team: {
    title: "AI Team", 
    content: "Manage your AI team, their roles and interactions."
  },
  os: {
    title: "KinOS",
    content: "KinOS is our specialized operating system for AI development and autonomy. It provides a secure environment for learning."
  },
  training: {
    title: "Training",
    content: "This section allows you to train your AIs and track their progress."
  },
  gpus: {
    title: "GPUs",
    content: "Manage your GPU computing resources for training your AIs."
  }
} as const;

export type PageKey = keyof typeof pageTutorials;
