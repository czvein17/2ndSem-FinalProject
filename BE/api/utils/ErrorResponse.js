class ErrorResponse extends Error {
  constructor(statusCode, message, data) {
    super(message);
    this.statusCode = statusCode;
    this.errorData = data;
    this.isOperational = true;
  }
}

module.exports = ErrorResponse;
