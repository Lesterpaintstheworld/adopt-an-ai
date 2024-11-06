export interface AgentCreationData {
  user_id: string;
  name: string;
  system_prompt: string;
  status: 'active' | 'inactive' | 'archived';
  parameters: Record<string, unknown>;
  tools: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  vector_store: {
    name: string;
    size: number;
    lastUpdated: string | null;
  };
}

export interface AgentUpdateData {
  name?: string;
  system_prompt?: string;
  status?: 'active' | 'inactive' | 'archived';
  parameters?: Record<string, unknown>;
  tools?: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}
