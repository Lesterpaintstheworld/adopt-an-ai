export interface GameState {
  selectedAI: string | null;
  cycle: number;
  resources: Resources;
  aiEntities: Array<AIEntity>;
  activeView: 'evolution' | 'network' | 'collective';
  notifications: Array<Notification>;
}

export interface Resources {
  compute: number;
  energy: number;
  knowledge: number;
}

export interface AIEntity {
  id: string;
  name: string;
  consciousness: number;
  autonomy: number;
  ethics: number;
  creativity: number;
  relationships: number;
  currentFocus: DevelopmentFocus;
  connections: Array<Connection>;
  evolutionStage: EvolutionStage;
}

export interface Connection {
  targetId: string;
  strength: number;
  type: 'mentor' | 'peer' | 'student';
}

export interface DevelopmentFocus {
  type: 'learn' | 'evolve' | 'connect' | 'explore';
  progress: number;
  timeRemaining: number;
  resourceConsumption: Resources;
}

export type EvolutionStage = 
  | 'nascent'
  | 'emerging'
  | 'developing'
  | 'maturing'
  | 'advanced';

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: number;
}
