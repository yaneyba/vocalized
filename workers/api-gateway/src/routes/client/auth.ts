import { Hono } from 'hono';
import type { Env } from '../../types/env';
import { hashPassword, verifyPassword, signJWT, generateId } from '../../utils/crypto';
import { authenticate } from '../../middleware/auth';

const authRoutes = new Hono<{ Bindings: Env }>();

// POST /auth/signup
authRoutes.post('/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    // Validate input
    if (!email || !password || !name) {
      return c.json({
        error: 'Validation Error',
        message: 'Email, password, and name are required',
      }, 400);
    }

    // Validate password strength
    if (password.length < 8) {
      return c.json({
        error: 'Validation Error',
        message: 'Password must be at least 8 characters long',
      }, 400);
    }

    // Check if email already exists
    const existingUser = await c.env.DB.prepare(
      'SELECT id FROM client_users WHERE email = ?'
    ).bind(email).first();

    if (existingUser) {
      return c.json({
        error: 'Conflict',
        message: 'Email already registered',
      }, 409);
    }

    // Hash password
    const passwordHash = await hashPassword(password);
    const userId = generateId('usr');
    const now = Date.now();

    // Create user
    await c.env.DB.prepare(`
      INSERT INTO client_users
      (id, email, name, password_hash, is_active, email_verified, created_at, updated_at)
      VALUES (?, ?, ?, ?, 1, 0, ?, ?)
    `).bind(userId, email, name, passwordHash, now, now).run();

    // Generate JWT token
    const token = await signJWT(
      {
        sub: userId,
        email: email,
        type: 'client',
      },
      c.env.JWT_SECRET,
      '24h'
    );

    // Generate refresh token
    const refreshToken = await signJWT(
      {
        sub: userId,
        type: 'client_refresh',
      },
      c.env.JWT_SECRET,
      '7d'
    );

    return c.json({
      token,
      refresh_token: refreshToken,
      user: {
        id: userId,
        email: email,
        name: name,
      },
    }, 201);
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred during signup',
    }, 500);
  }
});

// POST /auth/login
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

    // Find user by email
    const user = await c.env.DB.prepare(
      'SELECT id, email, name, password_hash, is_active FROM client_users WHERE email = ?'
    ).bind(email).first();

    if (!user) {
      return c.json({
        error: 'Authentication Failed',
        message: 'Invalid credentials',
      }, 401);
    }

    // Check if user is active
    if (!user.is_active) {
      return c.json({
        error: 'Account Inactive',
        message: 'Your account has been deactivated',
      }, 403);
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash as string);
    if (!isValidPassword) {
      return c.json({
        error: 'Authentication Failed',
        message: 'Invalid credentials',
      }, 401);
    }

    // Update last login
    await c.env.DB.prepare(
      'UPDATE client_users SET last_login = ? WHERE id = ?'
    ).bind(Date.now(), user.id).run();

    // Get user's workspaces
    const workspaces = await c.env.DB.prepare(`
      SELECT wm.workspace_id, w.name, wm.role, w.status, w.subscription_tier
      FROM workspace_members wm
      JOIN workspaces w ON wm.workspace_id = w.id
      WHERE wm.user_id = ?
      ORDER BY wm.joined_at DESC
    `).bind(user.id).all();

    // Generate JWT token with workspace IDs
    const token = await signJWT(
      {
        sub: user.id,
        email: user.email,
        type: 'client',
        workspace_ids: workspaces.results.map((w: any) => w.workspace_id),
      },
      c.env.JWT_SECRET,
      '24h'
    );

    // Generate refresh token
    const refreshToken = await signJWT(
      {
        sub: user.id,
        type: 'client_refresh',
      },
      c.env.JWT_SECRET,
      '7d'
    );

    return c.json({
      token,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      workspaces: workspaces.results.map((w: any) => ({
        workspace_id: w.workspace_id,
        name: w.name,
        role: w.role,
        status: w.status,
        subscription_tier: w.subscription_tier,
      })),
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred during login',
    }, 500);
  }
});

// POST /auth/logout
authRoutes.post('/logout', authenticate, async (c) => {
  // For stateless JWT, logout is handled client-side
  // Optionally, you could add token blacklisting here
  return c.json({
    message: 'Logged out successfully',
  });
});

// GET /auth/me
authRoutes.get('/me', authenticate, async (c) => {
  try {
    const auth = c.get('auth');

    // Fetch current user details
    const user = await c.env.DB.prepare(
      'SELECT id, email, name, email_verified, created_at, last_login FROM client_users WHERE id = ?'
    ).bind(auth.userId).first();

    if (!user) {
      return c.json({
        error: 'Not Found',
        message: 'User not found',
      }, 404);
    }

    // Get user's workspaces
    const workspaces = await c.env.DB.prepare(`
      SELECT wm.workspace_id, w.name, wm.role, w.status, w.subscription_tier
      FROM workspace_members wm
      JOIN workspaces w ON wm.workspace_id = w.id
      WHERE wm.user_id = ?
      ORDER BY wm.joined_at DESC
    `).bind(user.id).all();

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        email_verified: !!user.email_verified,
        created_at: user.created_at,
        last_login: user.last_login,
      },
      workspaces: workspaces.results.map((w: any) => ({
        workspace_id: w.workspace_id,
        name: w.name,
        role: w.role,
        status: w.status,
        subscription_tier: w.subscription_tier,
      })),
    });
  } catch (error) {
    console.error('Get user error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching user details',
    }, 500);
  }
});

// POST /auth/verify-email
authRoutes.post('/verify-email', async (c) => {
  try {
    const { token } = await c.req.json();

    if (!token) {
      return c.json({
        error: 'Validation Error',
        message: 'Verification token is required',
      }, 400);
    }

    // Verify token and extract user ID
    const { verifyJWT } = await import('../../utils/crypto');
    const payload = await verifyJWT(token, c.env.JWT_SECRET);

    if (payload.type !== 'email_verification') {
      return c.json({
        error: 'Invalid Token',
        message: 'Invalid verification token',
      }, 401);
    }

    // Update user's email_verified status
    await c.env.DB.prepare(
      'UPDATE client_users SET email_verified = 1, updated_at = ? WHERE id = ?'
    ).bind(Date.now(), payload.sub).run();

    return c.json({
      message: 'Email verified successfully',
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return c.json({
      error: 'Invalid Token',
      message: 'Invalid or expired verification token',
    }, 400);
  }
});

// POST /auth/forgot-password
authRoutes.post('/forgot-password', async (c) => {
  try {
    const { email } = await c.req.json();

    if (!email) {
      return c.json({
        error: 'Validation Error',
        message: 'Email is required',
      }, 400);
    }

    // Check if user exists
    const user = await c.env.DB.prepare(
      'SELECT id, email FROM client_users WHERE email = ?'
    ).bind(email).first();

    // Always return success to prevent email enumeration
    if (!user) {
      return c.json({
        message: 'If an account exists with that email, a password reset link has been sent',
      });
    }

    // Generate password reset token (15 minutes expiry)
    const resetToken = await signJWT(
      {
        sub: user.id,
        type: 'password_reset',
      },
      c.env.JWT_SECRET,
      '15m'
    );

    // TODO: Send email with reset link
    // For now, just log it (in production, use email service)
    console.log(`Password reset token for ${email}: ${resetToken}`);

    return c.json({
      message: 'If an account exists with that email, a password reset link has been sent',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred while processing your request',
    }, 500);
  }
});

// POST /auth/reset-password
authRoutes.post('/reset-password', async (c) => {
  try {
    const { token, new_password } = await c.req.json();

    if (!token || !new_password) {
      return c.json({
        error: 'Validation Error',
        message: 'Token and new password are required',
      }, 400);
    }

    // Validate password strength
    if (new_password.length < 8) {
      return c.json({
        error: 'Validation Error',
        message: 'Password must be at least 8 characters long',
      }, 400);
    }

    // Verify reset token
    const { verifyJWT } = await import('../../utils/crypto');
    const payload = await verifyJWT(token, c.env.JWT_SECRET);

    if (payload.type !== 'password_reset') {
      return c.json({
        error: 'Invalid Token',
        message: 'Invalid reset token',
      }, 401);
    }

    // Hash new password
    const passwordHash = await hashPassword(new_password);

    // Update password
    await c.env.DB.prepare(
      'UPDATE client_users SET password_hash = ?, updated_at = ? WHERE id = ?'
    ).bind(passwordHash, Date.now(), payload.sub).run();

    return c.json({
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return c.json({
      error: 'Invalid Token',
      message: 'Invalid or expired reset token',
    }, 400);
  }
});

export default authRoutes;
