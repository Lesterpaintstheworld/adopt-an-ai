class ResponseHandler {
  static success(res, data, status = 200) {
    res.status(status).json({
      success: true,
      data
    });
  }

  static error(res, error) {
    const status = error.statusCode || 500;
    const response = {
      success: false,
      error: error.message
    };

    if (process.env.NODE_ENV === 'development') {
      response.details = error.details;
      response.stack = error.stack;
    }

    res.status(status).json(response);
  }

  static paginated(res, data, pagination) {
    res.status(200).json({
      success: true,
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        pages: Math.ceil(pagination.total / pagination.limit)
      }
    });
  }
}

module.exports = ResponseHandler;
