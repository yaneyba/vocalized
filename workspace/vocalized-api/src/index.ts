import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import type { Env } from './types/env';

// Import route handlers (will be created)
import adminRoutes from './routes/admin';
import clientRoutes from './routes/client';

const app = new Hono<{ Bindings: Env }>();

// Global Middleware
app.use('*', logger());

// CORS Configuration
app.use('*', cors({
  origin: [
    'http://localhost:5173',        // Customer app dev
    'http://localhost:4173',        // Admin app dev
    'https://app.vocalized.app',    // Customer app production
    'https://admin.vocalized.app',  // Admin app production
  ],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 86400, // 24 hours
  credentials: true,
}));

// Health check endpoint
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    environment: c.env.ENVIRONMENT,
    timestamp: Date.now(),
  });
});

// API Routes
app.route('/admin', adminRoutes);
app.route('/', clientRoutes); // Client routes at root level

// 404 Handler
app.notFound((c) => {
  return c.json({
    error: 'Not Found',
    message: 'The requested resource was not found',
    path: c.req.path,
  }, 404);
});

// Global Error Handler
app.onError((err, c) => {
  console.error('Global error:', err);

  // Check if it's a known error type
  if (err.message.includes('Unauthorized')) {
    return c.json({
      error: 'Unauthorized',
      message: 'Authentication required',
    }, 401);
  }

  if (err.message.includes('Forbidden')) {
    return c.json({
      error: 'Forbidden',
      message: 'You do not have permission to access this resource',
    }, 403);
  }

  // Generic server error
  return c.json({
    error: 'Internal Server Error',
    message: c.env.ENVIRONMENT === 'production'
      ? 'An unexpected error occurred'
      : err.message,
  }, 500);
});

export default app;
