import { Hono } from 'hono';
import type { Env } from '../../types/env';
import { verifyPassword, signJWT } from '../../utils/crypto';
import { authenticate } from '../../middleware/auth';

const authRoutes = new Hono<{ Bindings: Env }>();

// POST /admin/auth/login
authRoutes.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json();

    // Validate input
    if (!email || !password) {
      return c.json({
        error: 'Validation Error',
        message: 'Email and password are required',
      }, 400);
    }

    // Find admin by email
    const admin = await c.env.DB.prepare(
      'SELECT id, email, name, password_hash, role, is_active FROM platform_admins WHERE email = ?'
    ).bind(email).first();

    if (!admin) {
      return c.json({
        error: 'Authentication Failed',
        message: 'Invalid credentials',
      }, 401);
    }

    // Check if admin is active
    if (!admin.is_active) {
      return c.json({
        error: 'Account Inactive',
        message: 'Your admin account has been deactivated',
      }, 403);
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, admin.password_hash as string);
    if (!isValidPassword) {
      return c.json({
        error: 'Authentication Failed',
        message: 'Invalid credentials',
      }, 401);
    }

    // Update last login
    await c.env.DB.prepare(
      'UPDATE platform_admins SET last_login = ? WHERE id = ?'
    ).bind(Date.now(), admin.id).run();

    // Generate JWT token
    const token = await signJWT(
      {
        sub: admin.id,
        email: admin.email,
        type: 'admin',
        role: admin.role,
      },
      c.env.JWT_SECRET,
      '24h'
    );

    // Generate refresh token (7 days)
    const refreshToken = await signJWT(
      {
        sub: admin.id,
        type: 'admin_refresh',
      },
      c.env.JWT_SECRET,
      '7d'
    );

    // Log admin activity
    await c.env.DB.prepare(`
      INSERT INTO admin_activity_logs
      (id, admin_id, action, resource_type, resource_id, details, ip_address, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      crypto.randomUUID(),
      admin.id,
      'login',
      null,
      null,
      null,
      c.req.header('CF-Connecting-IP') || null,
      Date.now()
    ).run();

    return c.json({
      token,
      refresh_token: refreshToken,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred during login',
    }, 500);
  }
});

// POST /admin/auth/logout
authRoutes.post('/logout', authenticate, async (c) => {
  try {
    const auth = c.get('auth');

    // Log logout activity
    await c.env.DB.prepare(`
      INSERT INTO admin_activity_logs
      (id, admin_id, action, resource_type, resource_id, details, ip_address, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      crypto.randomUUID(),
      auth.userId,
      'logout',
      null,
      null,
      null,
      c.req.header('CF-Connecting-IP') || null,
      Date.now()
    ).run();

    return c.json({
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Admin logout error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred during logout',
    }, 500);
  }
});

// GET /admin/auth/me
authRoutes.get('/me', authenticate, async (c) => {
  try {
    const auth = c.get('auth');

    // Fetch current admin details
    const admin = await c.env.DB.prepare(
      'SELECT id, email, name, role, created_at, last_login FROM platform_admins WHERE id = ?'
    ).bind(auth.userId).first();

    if (!admin) {
      return c.json({
        error: 'Not Found',
        message: 'Admin not found',
      }, 404);
    }

    return c.json({
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        created_at: admin.created_at,
        last_login: admin.last_login,
      },
    });
  } catch (error) {
    console.error('Get admin error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching admin details',
    }, 500);
  }
});

// POST /admin/auth/refresh
authRoutes.post('/refresh', async (c) => {
  try {
    const { refresh_token } = await c.req.json();

    if (!refresh_token) {
      return c.json({
        error: 'Validation Error',
        message: 'Refresh token is required',
      }, 400);
    }

    // Verify refresh token
    const { verifyJWT } = await import('../../utils/crypto');
    const payload = await verifyJWT(refresh_token, c.env.JWT_SECRET);

    if (payload.type !== 'admin_refresh') {
      return c.json({
        error: 'Invalid Token',
        message: 'Invalid refresh token',
      }, 401);
    }

    // Verify admin still exists and is active
    const admin = await c.env.DB.prepare(
      'SELECT id, email, name, role, is_active FROM platform_admins WHERE id = ?'
    ).bind(payload.sub).first();

    if (!admin || !admin.is_active) {
      return c.json({
        error: 'Unauthorized',
        message: 'Admin account not found or inactive',
      }, 401);
    }

    // Generate new access token
    const token = await signJWT(
      {
        sub: admin.id,
        email: admin.email,
        type: 'admin',
        role: admin.role,
      },
      c.env.JWT_SECRET,
      '24h'
    );

    return c.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return c.json({
      error: 'Unauthorized',
      message: 'Invalid or expired refresh token',
    }, 401);
  }
});

export default authRoutes;
