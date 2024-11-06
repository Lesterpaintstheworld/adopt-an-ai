import type { CreateAgentDTO, UpdateAgentDTO, Agent } from './database';

// Request types
export type AgentCreationData = CreateAgentDTO;
export type AgentUpdateData = UpdateAgentDTO;

// Response types
export type AgentResponse = Agent;
export type AgentsListResponse = Agent[];

// Error response type
export interface AgentError {
  error: string;
  details?: unknown;
}

// Agent status type
export type AgentStatus = 'active' | 'inactive' | 'archived';

// Agent tool interface
export interface AgentTool {
  id: string;
  name: string;
  description: string;
}

// Agent vector store interface
export interface VectorStore {
  name: string;
  size: number;
  lastUpdated: string | null;
}

// Agent parameters interface
export interface AgentParameters {
  [key: string]: {
    value: number;
    description: string;
  };
}
