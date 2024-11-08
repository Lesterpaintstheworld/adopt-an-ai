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
    description: z.string().optional()
  })
};

const validate = (schema) => (req, res, next) => {
  try {
    req.validated = schema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      error: 'Validation failed',
      details: error.errors
    });
  }
};

module.exports = {
  schemas,
  validate
};
