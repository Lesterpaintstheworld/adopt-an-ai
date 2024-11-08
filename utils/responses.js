const httpResponses = {
  success(res, data, status = 200) {
    res.status(status).json({
      success: true,
      data
    });
  },

  error(res, error, status = 500) {
    res.status(status).json({
      success: false,
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.details : undefined
    });
  },

  unauthorized(res, message = 'Unauthorized') {
    res.status(401).json({
      success: false,
      error: message
    });
  },

  notFound(res, message = 'Resource not found') {
    res.status(404).json({
      success: false,
      error: message
    });
  },

  serverError(res, error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = httpResponses;
