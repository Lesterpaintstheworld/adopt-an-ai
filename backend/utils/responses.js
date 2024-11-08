const formatResponse = (success, data, error = null) => {
  const response = { success };
  
  if (success) {
    response.data = data;
  } else {
    response.error = process.env.NODE_ENV === 'production' ? error.getPublicMessage() : error.message;
    if (process.env.NODE_ENV === 'development') {
      response.details = error.details;
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

  badRequest(res, message = 'Bad request', details = null) {
    const error = { message, details, getPublicMessage: () => message };
    res.status(400).json(formatResponse(false, null, error));
  },

  unauthorized(res, message = 'Unauthorized') {
    const error = { message, getPublicMessage: () => message };
    res.status(401).json(formatResponse(false, null, error));
  },

  notFound(res, message = 'Not found', details = null) {
    const error = { message, details, getPublicMessage: () => message };
    res.status(404).json(formatResponse(false, null, error));
  },

  serverError(res, error) {
    const wrappedError = {
      message: error.message,
      details: error.stack,
      getPublicMessage: () => 'Internal server error'
    };
    res.status(500).json(formatResponse(false, null, wrappedError));
  }
};

module.exports = { formatResponse, httpResponses };
