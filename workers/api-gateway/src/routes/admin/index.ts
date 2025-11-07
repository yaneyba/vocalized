import { Hono } from 'hono';
import type { Env } from '../../types/env';

const adminRoutes = new Hono<{ Bindings: Env }>();

// Admin authentication routes
import authRoutes from './auth';
adminRoutes.route('/auth', authRoutes);

// Admin dashboard routes
import dashboardRoutes from './dashboard';
adminRoutes.route('/dashboard', dashboardRoutes);

// Admin workspaces routes
import workspacesRoutes from './workspaces';
adminRoutes.route('/workspaces', workspacesRoutes);

// Admin providers routes
import providersRoutes from './providers';
adminRoutes.route('/providers', providersRoutes);

// TODO: Add other admin route modules
// import userRoutes from './users';
// import templateRoutes from './templates';
// import integrationRoutes from './integrations';
// import callRoutes from './calls';
// import analyticsRoutes from './analytics';
// import billingRoutes from './billing';
// import configRoutes from './config';
// import logsRoutes from './logs';
// adminRoutes.route('/workspaces', workspaceRoutes);
// adminRoutes.route('/users', userRoutes);
// adminRoutes.route('/providers', providerRoutes);
// adminRoutes.route('/templates', templateRoutes);
// adminRoutes.route('/integrations', integrationRoutes);
// adminRoutes.route('/calls', callRoutes);
// adminRoutes.route('/analytics', analyticsRoutes);
// adminRoutes.route('/billing', billingRoutes);
// adminRoutes.route('/config', configRoutes);
// adminRoutes.route('/logs', logsRoutes);

// Temporary: List all admin routes
adminRoutes.get('/', (c) => {
  return c.json({
    message: 'Admin API',
    routes: [
      '/admin/auth/*',
      '/admin/dashboard/*',
      '/admin/workspaces/*',
      '/admin/providers/*',
      // Will be added:
      // '/admin/users/*',
      // '/admin/templates/*',
      // '/admin/integrations/*',
      // '/admin/calls/*',
      // '/admin/analytics/*',
      // '/admin/billing/*',
      // '/admin/config/*',
      // '/admin/logs/*',
    ],
  });
});

export default adminRoutes;
