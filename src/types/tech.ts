export interface Perk {
  id: string;
  name: string;
  description: string;
  level: number;
  category: string;
  icon?: string;
  prerequisites?: string[];
  unlocked?: boolean;
}

export interface TechTreeContent {
  meta: {
    title: string;
    description: string;
  };
  categories: {
    name: string;
    description: string;
  }[];
  perks: Perk[];
}
