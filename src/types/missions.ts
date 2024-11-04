export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type Status = 'available' | 'in_progress' | 'locked' | 'completed';
export type Category = 'Communication' | 'Creativity' | 'Problem Solving' | 'Research';
export type Phase = 'phase_1' | 'phase_2' | 'phase_3' | 'phase_4';

export interface Mission {
  id?: string;
  capability_id?: string;
  title: string;
  description: string;
  objectives: string[];
  tasks: {
    step: string;
    details: string;
  }[];
  success_criteria: string[];
  evaluation_metrics: {
    metric: string;
    target: string;
  }[];
  difficulty: Difficulty;
  category: Category;
  duration: string;
  mainPrerequisite?: string;
  requirements: {
    compute: string;
    memory: string;
    capabilities: string[];
  };
  rewards: {
    xp?: number;
    capabilities?: string[];
    resources?: string[];
  };
  deliverables: string[];
  status: Status;
  phase: Phase;
}
