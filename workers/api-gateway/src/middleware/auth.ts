import { Context, Next } from 'hono';
import type { Env, AuthContext } from '../types/env';
import { verifyJWT } from '../utils/crypto';

// Extend Hono context to include auth
declare module 'hono' {
  interface ContextVariableMap {
    auth: AuthContext;
  }
}

/**
 * Middleware to authenticate requests using JWT
 */
export async function authenticate(c: Context<{ Bindings: Env }>, next: Next) {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({
      error: 'Unauthorized',
      message: 'Missing or invalid authorization header',
    }, 401);
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  try {
    const payload = await verifyJWT(token, c.env.JWT_SECRET);

    // Store auth context in Hono context
    c.set('auth', {
      userId: payload.sub,
      email: payload.email,
      type: payload.type,
      role: payload.role,
      workspaceId: payload.workspaceId,
    });

    await next();
  } catch (error) {
    console.error('JWT verification failed:', error);
    return c.json({
      error: 'Unauthorized',
      message: 'Invalid or expired token',
    }, 401);
  }
}

/**
 * Middleware to require admin access
 */
export async function requireAdmin(c: Context<{ Bindings: Env }>, next: Next) {
  const auth = c.get('auth');

  if (!auth || auth.type !== 'admin') {
    return c.json({
      error: 'Forbidden',
      message: 'Admin access required',
    }, 403);
  }

  await next();
}

/**
 * Middleware to require specific admin role
 */
export function requireAdminRole(...roles: string[]) {
  return async (c: Context<{ Bindings: Env }>, next: Next) => {
    const auth = c.get('auth');

    if (!auth || auth.type !== 'admin' || !auth.role || !roles.includes(auth.role)) {
      return c.json({
        error: 'Forbidden',
        message: `Required role: ${roles.join(' or ')}`,
      }, 403);
    }

    await next();
  };
}

/**
 * Middleware to require workspace access
 */
export async function requireWorkspaceAccess(c: Context<{ Bindings: Env }>, next: Next) {
  const auth = c.get('auth');
  const workspaceId = c.req.param('workspaceId');

  if (!auth || auth.type !== 'client') {
    return c.json({
      error: 'Forbidden',
      message: 'Client access required',
    }, 403);
  }

  // Check if user is a member of the workspace
  const member = await c.env.DB.prepare(
    'SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?'
  ).bind(workspaceId, auth.userId).first();

  if (!member) {
    return c.json({
      error: 'Forbidden',
      message: 'You do not have access to this workspace',
    }, 403);
  }

  // Store workspace role in context
  c.set('auth', {
    ...auth,
    workspaceId,
    role: member.role as string,
  });

  await next();
}

/**
 * Middleware to require specific workspace role
 */
export function requireWorkspaceRole(...roles: string[]) {
  return async (c: Context<{ Bindings: Env }>, next: Next) => {
    const auth = c.get('auth');

    if (!auth || !auth.role || !roles.includes(auth.role)) {
      return c.json({
        error: 'Forbidden',
        message: `Required workspace role: ${roles.join(' or ')}`,
      }, 403);
    }

    await next();
  };
}
