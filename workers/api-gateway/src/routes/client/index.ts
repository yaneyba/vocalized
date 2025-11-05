import { Hono } from 'hono';
import type { Env } from '@/types/env';

const clientRoutes = new Hono<{ Bindings: Env }>();

// Client authentication routes
import authRoutes from './auth';
import workspaceRoutes from './workspaces';

clientRoutes.route('/auth', authRoutes);
clientRoutes.route('/workspaces', workspaceRoutes);

// TODO: Add other client route modules
// import templateRoutes from './templates';
// import agentRoutes from './agents';
// import phoneRoutes from './phone-numbers';
// import callRoutes from './calls';
// import analyticsRoutes from './analytics';
// import billingRoutes from './billing';
// import webhookRoutes from './webhooks';

// clientRoutes.route('/templates', templateRoutes);
// clientRoutes.route('/agents', agentRoutes);
// clientRoutes.route('/phone-numbers', phoneRoutes);
// clientRoutes.route('/calls', callRoutes);
// clientRoutes.route('/analytics', analyticsRoutes);
// clientRoutes.route('/billing', billingRoutes);
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
