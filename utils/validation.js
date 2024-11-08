const { z } = require('zod');

const schemas = {
  agent: z.object({
    name: z.string().min(1).max(255),
    system_prompt: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional(),
    parameters: z.record(z.any()).optional(),
    tools: z.array(z.any()).optional()
  }),

  team: z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    status: z.enum(['active', 'inactive', 'archived']).optional()
  }),

  teamMember: z.object({
    userId: z.string().min(1),
    role: z.enum(['owner', 'admin', 'member']).default('member')
  }),

  teamAgent: z.object({
    agentId: z.string().uuid()
  })
};

const validate = (schema) => (req, res, next) => {
  try {
    if (!schema) {
      throw new Error('No validation schema provided');
    }
    req.validated = schema.parse(req.body);
    next();
  } catch (error) {
    next(new ValidationError('Validation failed', error.errors));
  }
};

module.exports = {
  schemas,
  validate
};
