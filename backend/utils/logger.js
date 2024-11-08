const logger = {
  info: (message, data = {}) => {
    console.log({
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      ...data
    });
  },
  error: (message, error, data = {}) => {
    console.error({
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      error: {
        message: error.message,
        stack: error.stack,
        code: error.code
      },
      ...data
    });
  }
};

module.exports = logger;
