import { Hono } from 'hono';
import type { Env } from '@/types/env';
import { authenticate, requireWorkspaceAccess, requireWorkspaceRole } from '@/middleware/auth';
import { generateId } from '@/utils/crypto';
import agentsRoutes from './agents';
import phoneNumbersRoutes from './phone-numbers';
import callsRoutes from './calls';

const workspacesRoutes = new Hono<{ Bindings: Env }>();

// Apply authentication to all routes
workspacesRoutes.use('*', authenticate);

// Mount sub-routes
workspacesRoutes.route('/', agentsRoutes);
workspacesRoutes.route('/', phoneNumbersRoutes);
workspacesRoutes.route('/', callsRoutes);

// POST /workspaces - Create a new workspace
workspacesRoutes.post('/', async (c) => {
  try {
    const auth = c.get('auth');
    const { name, industry, timezone } = await c.req.json();

    // Validate input
    if (!name) {
      return c.json({
        error: 'Validation Error',
        message: 'Workspace name is required',
      }, 400);
    }

    const workspaceId = generateId('wks');
    const now = Date.now();

    // Create workspace
    await c.env.DB.prepare(`
      INSERT INTO workspaces
      (id, name, industry, owner_id, status, subscription_tier, timezone, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'trial', 'starter', ?, ?, ?)
    `).bind(
      workspaceId,
      name,
      industry || null,
      auth.userId,
      timezone || 'UTC',
      now,
      now
    ).run();

    // Add owner as a member
    await c.env.DB.prepare(`
      INSERT INTO workspace_members
      (workspace_id, user_id, role, invited_by, joined_at)
      VALUES (?, ?, 'owner', ?, ?)
    `).bind(workspaceId, auth.userId, auth.userId, now).run();

    // Set trial end date (14 days)
    const trialEndsAt = now + (14 * 24 * 60 * 60 * 1000);
    await c.env.DB.prepare(
      'UPDATE workspaces SET trial_ends_at = ? WHERE id = ?'
    ).bind(trialEndsAt, workspaceId).run();

    return c.json({
      workspace: {
        id: workspaceId,
        name,
        industry,
        owner_id: auth.userId,
        status: 'trial',
        subscription_tier: 'starter',
        timezone: timezone || 'UTC',
        trial_ends_at: trialEndsAt,
        created_at: now,
      },
    }, 201);
  } catch (error) {
    console.error('Create workspace error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred while creating the workspace',
    }, 500);
  }
});

// GET /workspaces - List user's workspaces
workspacesRoutes.get('/', async (c) => {
  try {
    const auth = c.get('auth');

    const workspaces = await c.env.DB.prepare(`
      SELECT
        w.id, w.name, w.industry, w.status, w.subscription_tier, w.timezone,
        w.trial_ends_at, w.created_at, wm.role
      FROM workspaces w
      JOIN workspace_members wm ON w.id = wm.workspace_id
      WHERE wm.user_id = ?
      ORDER BY wm.joined_at DESC
    `).bind(auth.userId).all();

    return c.json({
      workspaces: workspaces.results,
    });
  } catch (error) {
    console.error('List workspaces error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching workspaces',
    }, 500);
  }
});

// GET /workspaces/:workspaceId - Get workspace details
workspacesRoutes.get('/:workspaceId', requireWorkspaceAccess, async (c) => {
  try {
    const workspaceId = c.req.param('workspaceId');

    // Get workspace details
    const workspace = await c.env.DB.prepare(`
      SELECT
        w.*, u.name as owner_name, u.email as owner_email
      FROM workspaces w
      JOIN client_users u ON w.owner_id = u.id
      WHERE w.id = ?
    `).bind(workspaceId).first();

    if (!workspace) {
      return c.json({
        error: 'Not Found',
        message: 'Workspace not found',
      }, 404);
    }

    // Get workspace members
    const members = await c.env.DB.prepare(`
      SELECT
        wm.user_id, wm.role, wm.joined_at,
        u.name, u.email
      FROM workspace_members wm
      JOIN client_users u ON wm.user_id = u.id
      WHERE wm.workspace_id = ?
      ORDER BY wm.joined_at ASC
    `).bind(workspaceId).all();

    // Get subscription tier details
    const tier = await c.env.DB.prepare(
      'SELECT * FROM subscription_tiers WHERE tier_name = ?'
    ).bind(workspace.subscription_tier).first();

    return c.json({
      workspace: {
        id: workspace.id,
        name: workspace.name,
        industry: workspace.industry,
        owner_id: workspace.owner_id,
        owner_name: workspace.owner_name,
        owner_email: workspace.owner_email,
        status: workspace.status,
        subscription_tier: workspace.subscription_tier,
        timezone: workspace.timezone,
        trial_ends_at: workspace.trial_ends_at,
        created_at: workspace.created_at,
        updated_at: workspace.updated_at,
      },
      members: members.results,
      subscription: tier || null,
    });
  } catch (error) {
    console.error('Get workspace error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching workspace details',
    }, 500);
  }
});

// PUT /workspaces/:workspaceId - Update workspace
workspacesRoutes.put('/:workspaceId', requireWorkspaceAccess, requireWorkspaceRole('owner', 'admin'), async (c) => {
  try {
    const workspaceId = c.req.param('workspaceId');
    const { name, timezone } = await c.req.json();

    // Validate input
    if (!name && !timezone) {
      return c.json({
        error: 'Validation Error',
        message: 'At least one field (name or timezone) is required',
      }, 400);
    }

    // Build update query dynamically
    const updates = [];
    const bindings = [];

    if (name) {
      updates.push('name = ?');
      bindings.push(name);
    }
    if (timezone) {
      updates.push('timezone = ?');
      bindings.push(timezone);
    }

    updates.push('updated_at = ?');
    bindings.push(Date.now());
    bindings.push(workspaceId);

    await c.env.DB.prepare(
      `UPDATE workspaces SET ${updates.join(', ')} WHERE id = ?`
    ).bind(...bindings).run();

    return c.json({
      message: 'Workspace updated successfully',
    });
  } catch (error) {
    console.error('Update workspace error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred while updating the workspace',
    }, 500);
  }
});

// DELETE /workspaces/:workspaceId - Delete workspace (owner only)
workspacesRoutes.delete('/:workspaceId', requireWorkspaceAccess, requireWorkspaceRole('owner'), async (c) => {
  try {
    const workspaceId = c.req.param('workspaceId');

    // Delete workspace (cascade will handle related records)
    await c.env.DB.prepare(
      'DELETE FROM workspaces WHERE id = ?'
    ).bind(workspaceId).run();

    return c.json({
      message: 'Workspace deleted successfully',
    });
  } catch (error) {
    console.error('Delete workspace error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred while deleting the workspace',
    }, 500);
  }
});

// GET /workspaces/:workspaceId/members - Get workspace members
workspacesRoutes.get('/:workspaceId/members', requireWorkspaceAccess, async (c) => {
  try {
    const workspaceId = c.req.param('workspaceId');

    const members = await c.env.DB.prepare(`
      SELECT
        wm.user_id, wm.role, wm.joined_at,
        u.name, u.email, u.last_login
      FROM workspace_members wm
      JOIN client_users u ON wm.user_id = u.id
      WHERE wm.workspace_id = ?
      ORDER BY wm.joined_at ASC
    `).bind(workspaceId).all();

    return c.json({
      members: members.results,
    });
  } catch (error) {
    console.error('Get members error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching members',
    }, 500);
  }
});

// POST /workspaces/:workspaceId/members - Invite member
workspacesRoutes.post('/:workspaceId/members', requireWorkspaceAccess, requireWorkspaceRole('owner', 'admin'), async (c) => {
  try {
    const auth = c.get('auth');
    const workspaceId = c.req.param('workspaceId');
    const { email, role } = await c.req.json();

    // Validate input
    if (!email || !role) {
      return c.json({
        error: 'Validation Error',
        message: 'Email and role are required',
      }, 400);
    }

    // Validate role
    const validRoles = ['admin', 'member', 'viewer'];
    if (!validRoles.includes(role)) {
      return c.json({
        error: 'Validation Error',
        message: 'Invalid role. Must be one of: admin, member, viewer',
      }, 400);
    }

    // Find user by email
    const user = await c.env.DB.prepare(
      'SELECT id FROM client_users WHERE email = ?'
    ).bind(email).first();

    if (!user) {
      return c.json({
        error: 'Not Found',
        message: 'User with this email not found',
      }, 404);
    }

    // Check if user is already a member
    const existingMember = await c.env.DB.prepare(
      'SELECT user_id FROM workspace_members WHERE workspace_id = ? AND user_id = ?'
    ).bind(workspaceId, user.id).first();

    if (existingMember) {
      return c.json({
        error: 'Conflict',
        message: 'User is already a member of this workspace',
      }, 409);
    }

    // Add member
    await c.env.DB.prepare(`
      INSERT INTO workspace_members
      (workspace_id, user_id, role, invited_by, joined_at)
      VALUES (?, ?, ?, ?, ?)
    `).bind(workspaceId, user.id, role, auth.userId, Date.now()).run();

    // TODO: Send invitation email

    return c.json({
      message: 'Member invited successfully',
    }, 201);
  } catch (error) {
    console.error('Invite member error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred while inviting the member',
    }, 500);
  }
});

// PUT /workspaces/:workspaceId/members/:userId - Update member role
workspacesRoutes.put('/:workspaceId/members/:userId', requireWorkspaceAccess, requireWorkspaceRole('owner', 'admin'), async (c) => {
  try {
    const workspaceId = c.req.param('workspaceId');
    const userId = c.req.param('userId');
    const { role } = await c.req.json();

    // Validate role
    const validRoles = ['admin', 'member', 'viewer'];
    if (!role || !validRoles.includes(role)) {
      return c.json({
        error: 'Validation Error',
        message: 'Invalid role. Must be one of: admin, member, viewer',
      }, 400);
    }

    // Check if member exists
    const member = await c.env.DB.prepare(
      'SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?'
    ).bind(workspaceId, userId).first();

    if (!member) {
      return c.json({
        error: 'Not Found',
        message: 'Member not found',
      }, 404);
    }

    // Prevent changing owner role
    if (member.role === 'owner') {
      return c.json({
        error: 'Forbidden',
        message: 'Cannot change the role of the workspace owner',
      }, 403);
    }

    // Update role
    await c.env.DB.prepare(
      'UPDATE workspace_members SET role = ? WHERE workspace_id = ? AND user_id = ?'
    ).bind(role, workspaceId, userId).run();

    return c.json({
      message: 'Member role updated successfully',
    });
  } catch (error) {
    console.error('Update member error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred while updating the member',
    }, 500);
  }
});

// DELETE /workspaces/:workspaceId/members/:userId - Remove member
workspacesRoutes.delete('/:workspaceId/members/:userId', requireWorkspaceAccess, requireWorkspaceRole('owner', 'admin'), async (c) => {
  try {
    const workspaceId = c.req.param('workspaceId');
    const userId = c.req.param('userId');

    // Check if member exists
    const member = await c.env.DB.prepare(
      'SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?'
    ).bind(workspaceId, userId).first();

    if (!member) {
      return c.json({
        error: 'Not Found',
        message: 'Member not found',
      }, 404);
    }

    // Prevent removing owner
    if (member.role === 'owner') {
      return c.json({
        error: 'Forbidden',
        message: 'Cannot remove the workspace owner',
      }, 403);
    }

    // Remove member
    await c.env.DB.prepare(
      'DELETE FROM workspace_members WHERE workspace_id = ? AND user_id = ?'
    ).bind(workspaceId, userId).run();

    return c.json({
      message: 'Member removed successfully',
    });
  } catch (error) {
    console.error('Remove member error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred while removing the member',
    }, 500);
  }
});

export default workspacesRoutes;
