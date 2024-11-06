import { z } from 'zod';

// Zod schema for validation
export const AgentSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string().min(1).max(255),
  system_prompt: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  status: z.enum(['active', 'inactive', 'archived']).default('active'),
  parameters: z.record(z.unknown()).default({}),
  tools: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string()
  })).default([]),
  vector_store: z.object({
    name: z.string(),
    size: z.number(),
    lastUpdated: z.string().nullable()
  }).default({
    name: "Pinecone DB",
    size: 0,
    lastUpdated: null
  })
});

// TypeScript type derived from the schema
export type Agent = z.infer<typeof AgentSchema>;

// Type for creating a new agent
export type CreateAgentDTO = Omit<Agent, 'id' | 'created_at' | 'updated_at'>;

// Type for updating an existing agent
export type UpdateAgentDTO = Partial<Omit<Agent, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
