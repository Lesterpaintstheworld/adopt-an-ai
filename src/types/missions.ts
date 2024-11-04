export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type Status = 'available' | 'in_progress' | 'locked' | 'completed';
export type Category = 'Communication' | 'Creativity' | 'Problem Solving' | 'Research';

export interface Mission {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: Category;
  duration: string;
  mainPrerequisite?: string;
  requirements: string[];
  rewards: {
    xp?: number;
    capabilities?: string[];
    resources?: string[];
  };
  status: Status;
}
