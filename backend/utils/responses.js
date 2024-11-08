const httpResponses = {
  success(res, data, status = 200) {
    res.status(status).json(data);
  },

  created(res, data) {
    res.status(201).json(data);
  },

  noContent(res) {
    res.status(204).send();
  },

  badRequest(res, message = 'Bad request', details = null) {
    res.status(400).json({
      error: message,
      details
    });
  },

  unauthorized(res, message = 'Unauthorized') {
    res.status(401).json({
      error: message
    });
  },

  notFound(res, message = 'Not found', details = null) {
    res.status(404).json({
      error: message,
      details
    });
  },

  serverError(res, error) {
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = httpResponses;
