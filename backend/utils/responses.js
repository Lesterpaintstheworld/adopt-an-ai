const formatResponse = (success, data, error = null) => {
  const response = { 
    success,
    timestamp: new Date().toISOString(),
    requestId: crypto.randomUUID()
  };
  
  if (success) {
    response.data = data;
  } else {
    response.error = error.getPublicMessage();
    response.code = error.statusCode || 500;
    response.type = error.name;
    
    if (process.env.NODE_ENV === 'development') {
      response.details = error.details;
      response.stack = error.stack;
      response.context = error.context;
    }
  }
  
  return response;
};

const httpResponses = {
  success(res, data, status = 200) {
    res.status(status).json(formatResponse(true, data));
  },

  created(res, data) {
    res.status(201).json(formatResponse(true, data));
  },

  noContent(res) {
    res.status(204).send();
  },

  error(res, error) {
    const status = error.statusCode || 500;
    res.status(status).json(formatResponse(false, null, error));
  },

  badRequest(res, message, details = null) {
    const error = new ValidationError(message, details);
    res.status(400).json(formatResponse(false, null, error));
  },

  unauthorized(res, message = 'Unauthorized') {
    const error = new AuthError(message);
    res.status(401).json(formatResponse(false, null, error));
  },

  forbidden(res, message = 'Forbidden') {
    const error = new AccessDeniedError(message);
    res.status(403).json(formatResponse(false, null, error));
  },

  notFound(res, resource = 'Resource') {
    const error = new NotFoundError(resource);
    res.status(404).json(formatResponse(false, null, error));
  },

  tooManyRequests(res, message = 'Too many requests') {
    const error = new RateLimitError(message);
    res.status(429).json(formatResponse(false, null, error));
  },

  serviceUnavailable(res, message = 'Service temporarily unavailable') {
    const error = new ServiceError(message);
    res.status(503).json(formatResponse(false, null, error));
  }
};

module.exports = { formatResponse, httpResponses };
