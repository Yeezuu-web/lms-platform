class ErrorHandler extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    // Ensure the stack trace is captured
    Error.captureStackTrace(this, this.constructor);
  }

  // Method to send error response
  public sendErrorResponse(res: any): void {
    res.status(this.statusCode).json({
      status: 'error',
      message: this.message,
    });
  }
}

export default ErrorHandler;
