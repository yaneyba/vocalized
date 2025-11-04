import { Context } from 'hono';
import type { Env } from '../types/env';

/**
 * Custom error classes
 */
export class APIError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class ValidationError extends APIError {
  constructor(message: string, details?: any) {
    super(400, message, details);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends APIError {
  constructor(message: string = 'Unauthorized') {
    super(401, message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends APIError {
  constructor(message: string = 'Forbidden') {
    super(403, message);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends APIError {
  constructor(message: string = 'Resource not found') {
    super(404, message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends APIError {
  constructor(message: string = 'Resource already exists') {
    super(409, message);
    this.name = 'ConflictError';
  }
}

/**
 * Error handler helper
 */
export function handleError(c: Context<{ Bindings: Env }>, error: Error | APIError) {
  console.error('Error:', error);

  if (error instanceof APIError) {
    return c.json({
      error: error.name,
      message: error.message,
      details: error.details,
    }, error.statusCode);
  }

  // Generic server error
  return c.json({
    error: 'Internal Server Error',
    message: c.env.ENVIRONMENT === 'production'
      ? 'An unexpected error occurred'
      : error.message,
  }, 500);
}

/**
 * Async error wrapper for route handlers
 */
export function asyncHandler(
  handler: (c: Context<{ Bindings: Env }>) => Promise<Response>
) {
  return async (c: Context<{ Bindings: Env }>) => {
    try {
      return await handler(c);
    } catch (error) {
      return handleError(c, error as Error);
    }
  };
}
