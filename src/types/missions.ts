export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type Status = 'available' | 'in_progress' | 'locked' | 'completed';
export type Category = 'Communication' | 'Creativity' | 'Problem Solving' | 'Research';
export type Phase = 'phase_1' | 'phase_2' | 'phase_3' | 'phase_4';

export interface Mission {
  id?: string;
  capability_id?: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: Category;
  duration: string;
  objectives: string[];
  success_criteria: string[];
  requirements: Record<string, string>;
  mainPrerequisite?: string;
  rewards: {
    xp?: number;
    capabilities?: string[];
    resources?: string[];
  };
  deliverables: string[];
  status: Status;
  phase: Phase;
}
