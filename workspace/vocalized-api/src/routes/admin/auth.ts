import { Hono } from 'hono';
import type { Env } from '../../types/env';

const authRoutes = new Hono<{ Bindings: Env }>();

// POST /admin/auth/login
authRoutes.post('/login', async (c) => {
  // TODO: Implement admin login
  return c.json({
    message: 'Admin login endpoint - to be implemented',
  }, 501);
});

// POST /admin/auth/logout
authRoutes.post('/logout', async (c) => {
  // TODO: Implement admin logout
  return c.json({
    message: 'Admin logout endpoint - to be implemented',
  }, 501);
});

// GET /admin/auth/me
authRoutes.get('/me', async (c) => {
  // TODO: Implement get current admin
  return c.json({
    message: 'Get current admin endpoint - to be implemented',
  }, 501);
});

// POST /admin/auth/refresh
authRoutes.post('/refresh', async (c) => {
  // TODO: Implement token refresh
  return c.json({
    message: 'Token refresh endpoint - to be implemented',
  }, 501);
});

export default authRoutes;
