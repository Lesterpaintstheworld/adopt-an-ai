class TeamError extends AppError {
  constructor(message, statusCode = 400, details = null) {
    super(message, statusCode, details);
    this.name = 'TeamError';
  }
}

class TeamNotFoundError extends TeamError {
  constructor(teamId) {
    super(`Team not found: ${teamId}`, 404);
    this.name = 'TeamNotFoundError';
  }
}

class TeamAccessDeniedError extends TeamError {
  constructor(teamId) {
    super(`Access denied to team: ${teamId}`, 403);
    this.name = 'TeamAccessDeniedError';
  }
}
