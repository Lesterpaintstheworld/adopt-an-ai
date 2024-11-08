const validation = {
  isValidUUID(str) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  },

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  sanitizeInput(str) {
    return str.trim().replace(/[<>]/g, '');
  },

  validateRequired(obj, fields) {
    const missing = fields.filter(field => !obj[field]);
    if (missing.length > 0) {
      return {
        isValid: false,
        error: `Missing required fields: ${missing.join(', ')}`
      };
    }
    return { isValid: true };
  }
};

module.exports = validation;
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
  }),

  chat: z.object({
    messages: z.array(z.object({
      role: z.enum(['system', 'user', 'assistant']),
      content: z.string()
    })),
    temperature: z.number().min(0).max(2).optional(),
    max_tokens: z.number().positive().optional()
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
