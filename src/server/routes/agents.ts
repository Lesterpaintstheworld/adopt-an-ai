import express, { Request, Response } from 'express';
import { z } from 'zod';
import type { ZodError } from 'zod';
import { AgentSchema } from '../../types/database';
import { auth } from '../middleware/auth';
import { db } from '../db';

interface AuthRequest extends Request {
  user: {
    id: string;
  };
}

const router = express.Router();

// GET /api/agents - Get all agents for the authenticated user
router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const agents = await db.agent.findMany({
      where: {
        user_id: req.user.id
      },
      orderBy: {
        created_at: 'desc'
      }
    });
    res.json(agents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

// GET /api/agents/:id - Get a specific agent
router.get('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const agent = await db.agent.findFirst({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });
    
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    res.json(agent);
  } catch (error) {
    console.error('Error fetching agent:', error);
    res.status(500).json({ error: 'Failed to fetch agent' });
  }
});

// POST /api/agents - Create a new agent
router.post('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const agentData = AgentSchema.omit({ 
      id: true, 
      user_id: true, 
      created_at: true, 
      updated_at: true 
    }).parse(req.body);

    const agent = await db.agent.create({
      data: {
        ...agentData,
        user_id: req.user.id,
      }
    });

    res.status(201).json(agent);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Invalid agent data', 
        details: (error as ZodError).errors 
      });
    }
    console.error('Error creating agent:', error);
    res.status(500).json({ error: 'Failed to create agent' });
  }
});

// PUT /api/agents/:id - Update an agent
router.put('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    // First verify the agent belongs to the user
    const existingAgent = await db.agent.findFirst({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!existingAgent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const agentData = AgentSchema.omit({ 
      id: true, 
      user_id: true, 
      created_at: true, 
      updated_at: true 
    }).partial().parse(req.body);

    const updatedAgent = await db.agent.update({
      where: { id: req.params.id },
      data: agentData
    });

    res.json(updatedAgent);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid agent data', details: error.errors });
    }
    console.error('Error updating agent:', error);
    res.status(500).json({ error: 'Failed to update agent' });
  }
});

// DELETE /api/agents/:id - Delete an agent
router.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    // First verify the agent belongs to the user
    const existingAgent = await db.agent.findFirst({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!existingAgent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    await db.agent.delete({
      where: { id: req.params.id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting agent:', error);
    res.status(500).json({ error: 'Failed to delete agent' });
  }
});

export default router;
