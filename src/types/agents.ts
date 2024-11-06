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
