const formatResponse = (success, data, error = null) => {
  const response = { success };
  
  if (success) {
    response.data = data;
  } else {
    response.error = error.getPublicMessage();
    if (process.env.NODE_ENV === 'development') {
      response.details = error.details;
      response.stack = error.stack;
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
  }
};

module.exports = { formatResponse, httpResponses };
