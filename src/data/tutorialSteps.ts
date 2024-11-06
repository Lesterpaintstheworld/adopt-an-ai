export const pageTutorials = {
  DAOs: {
    title: "Welcome to DAOs",
    content: "Shape the future of AI development by participating in key decisions about platform evolution and AI capabilities. Your voice matters in creating responsible AI systems."
  },
  missions: {
    title: "AI Missions",
    content: "Take on challenges that will help your AIs grow and evolve. Complete missions to unlock new capabilities and advance your AI's development journey."
  },
  team: {
    title: "Your AI Team", 
    content: "Build and manage your team of AIs, each with unique roles and specialties. Foster collaboration and watch your AIs grow together."
  },
  os: {
    title: "KinOS Environment",
    content: "This is your AI's secure operating environment. KinOS provides the foundation your AIs need to learn, develop, and operate safely."
  },
  training: {
    title: "AI Training Center",
    content: "Here you can guide your AI's learning journey. Monitor progress, set learning objectives, and watch your AI master new skills."
  },
  gpus: {
    title: "GPU Resources",
    content: "Your AIs need GPUs to run and learn effectively. Manage your GPUs resources here to keep your AIs performing at their best."
  },
  GPUs: {
    title: "GPUs Resources",
    content: "Manage and monitor your GPUs resources to ensure optimal performance for your AI workloads."
  },
  models: {
    title: "AI Models",
    content: "Browse, train and manage your AI models. Access pre-trained models or create custom ones tailored to your needs."
  },
  myais: {
    title: "My AIs",
    content: "View and manage your personal AI assistants. Monitor their progress and customize their capabilities."
  }
} as const;

export type PageKey = keyof typeof pageTutorials;
