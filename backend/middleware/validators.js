const validateAgentCreate = (req, res, next) => {
  const { name, system_prompt } = req.body;
  
  if (!name?.trim()) {
    return res.status(400).json({
      error: 'Validation error',
      details: 'Name is required'
    });
  }

  next();
};

const validateTutorialUpdate = (req, res, next) => {
  const { isComplete, progress } = req.body;
  
  if (typeof isComplete !== 'boolean') {
    return res.status(400).json({
      error: 'Validation error',
      details: 'isComplete must be a boolean'
    });
  }

  next();
};

module.exports = {
  validateAgentCreate,
  validateTutorialUpdate
};
