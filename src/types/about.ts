export interface AboutContent {
  hero: {
    headline: string;
    subheadline: string;
  };
  mission: {
    title: string;
    content: string;
    key_points: Array<{
      title: string;
      description: string;
    }>;
  };
  vision: {
    title: string;
    content: string;
    timeline: {
      current_phase: string;
      phases: Array<{
        year: string;
        title: string;
        description: string;
      }>;
    };
  };
  technology: {
    title: string;
    subtitle: string;
    components: Array<{
      name: string;
      description: string;
    }>;
  };
  team: {
    title: string;
    subtitle: string;
    members: Array<{
      name: string;
      description: string;
    }>;
  };
  connect: {
    title: string;
    channels: Array<{
      name: string;
      description: string;
      url: string;
    }>;
  };
}
