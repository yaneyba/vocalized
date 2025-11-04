import { Hono } from 'hono';
import type { Env } from '../../types/env';

const clientRoutes = new Hono<{ Bindings: Env }>();

// Client authentication routes
import authRoutes from './auth';
clientRoutes.route('/auth', authRoutes);

// TODO: Add other client route modules
// import workspaceRoutes from './workspaces';
// import templateRoutes from './templates';
// import webhookRoutes from './webhooks';

// clientRoutes.route('/workspaces', workspaceRoutes);
// clientRoutes.route('/templates', templateRoutes);
// clientRoutes.route('/webhooks', webhookRoutes);

// Temporary: List all client routes
clientRoutes.get('/', (c) => {
  return c.json({
    message: 'Vocalized API',
    version: '1.0.0',
    routes: [
      '/auth/*',
      '/workspaces/*',
      '/templates/*',
      '/webhooks/*',
    ],
  });
});

export default clientRoutes;
