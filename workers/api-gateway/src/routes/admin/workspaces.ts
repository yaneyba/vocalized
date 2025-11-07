import { Hono } from 'hono';
import type { Env } from '../../types/env';
import { authenticate, requireAdmin } from '../../middleware/auth';

const workspacesRoutes = new Hono<{ Bindings: Env }>();

// Apply admin authentication middleware to all routes
workspacesRoutes.use('*', authenticate, requireAdmin);

/**
 * GET /admin/workspaces
 * List all workspaces with pagination and filtering
 * Query params:
 *   - page: page number (default: 1)
 *   - limit: items per page (default: 50)
 *   - status: filter by status (active|trial|suspended|cancelled)
 *   - tier: filter by subscription tier
 *   - search: search by workspace name
 */
workspacesRoutes.get('/', async (c) => {
  const db = c.env.DB;

  try {
    // Parse query parameters
    const page = parseInt(c.req.query('page') || '1');
    const limit = Math.min(parseInt(c.req.query('limit') || '50'), 100);
    const offset = (page - 1) * limit;
    const status = c.req.query('status');
    const tier = c.req.query('tier');
    const search = c.req.query('search');

    // Build WHERE conditions
    const conditions: string[] = [];
    const params: any[] = [];

    if (status) {
      conditions.push('w.status = ?');
      params.push(status);
    }

    if (tier) {
      conditions.push('w.subscription_tier = ?');
      params.push(tier);
    }

    if (search) {
      conditions.push('w.name LIKE ?');
      params.push(`%${search}%`);
    }

    const whereClause = conditions.length > 0
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as count
      FROM workspaces w
      ${whereClause}
    `;
    const countResult = await db.prepare(countQuery)
      .bind(...params)
      .first<{ count: number }>();
    const total = countResult?.count || 0;

    // Get workspaces with owner and member count
    const query = `
      SELECT
        w.id,
        w.name,
        w.status,
        w.subscription_tier,
        w.trial_ends_at,
        w.created_at,
        w.updated_at,
        u.id as owner_id,
        u.email as owner_email,
        u.name as owner_name,
        (SELECT COUNT(*) FROM workspace_members WHERE workspace_id = w.id) as member_count,
        (SELECT COUNT(*) FROM voice_agents WHERE workspace_id = w.id) as agent_count,
        (SELECT COUNT(*) FROM calls WHERE workspace_id = w.id) as total_calls,
        (SELECT SUM(duration_seconds) / 60.0 FROM calls WHERE workspace_id = w.id AND duration_seconds IS NOT NULL) as total_minutes
      FROM workspaces w
      LEFT JOIN workspace_members wm ON w.id = wm.workspace_id AND wm.role = 'owner'
      LEFT JOIN client_users u ON wm.user_id = u.id
      ${whereClause}
      ORDER BY w.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const result = await db.prepare(query)
      .bind(...params, limit, offset)
      .all();

    const workspaces = result.results.map((row: any) => ({
      id: row.id,
      name: row.name,
      status: row.status,
      subscription_tier: row.subscription_tier,
      trial_ends_at: row.trial_ends_at,
      created_at: row.created_at,
      updated_at: row.updated_at,
      owner: row.owner_id ? {
        id: row.owner_id,
        email: row.owner_email,
        name: row.owner_name,
      } : null,
      stats: {
        member_count: row.member_count || 0,
        agent_count: row.agent_count || 0,
        total_calls: row.total_calls || 0,
        total_minutes: Math.round(row.total_minutes || 0),
      },
    }));

    return c.json({
      workspaces,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Admin list workspaces error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'Failed to fetch workspaces',
    }, 500);
  }
});

/**
 * GET /admin/workspaces/:id
 * Get detailed workspace information
 */
workspacesRoutes.get('/:id', async (c) => {
  const db = c.env.DB;
  const workspaceId = c.req.param('id');

  try {
    // Get workspace details
    const workspace = await db.prepare(`
      SELECT
        w.*,
        st.tier_name,
        st.monthly_fee,
        st.max_agents,
        st.included_minutes
      FROM workspaces w
      LEFT JOIN subscription_tiers st ON w.subscription_tier = st.tier_name
      WHERE w.id = ?
    `).bind(workspaceId).first();

    if (!workspace) {
      return c.json({
        error: 'Not Found',
        message: 'Workspace not found',
      }, 404);
    }

    // Get owner information
    const owner = await db.prepare(`
      SELECT u.id, u.email, u.name, u.created_at
      FROM client_users u
      JOIN workspace_members wm ON u.id = wm.user_id
      WHERE wm.workspace_id = ? AND wm.role = 'owner'
    `).bind(workspaceId).first();

    // Get members
    const membersResult = await db.prepare(`
      SELECT
        u.id,
        u.email,
        u.name,
        wm.role,
        wm.joined_at
      FROM workspace_members wm
      JOIN client_users u ON wm.user_id = u.id
      WHERE wm.workspace_id = ?
      ORDER BY wm.joined_at
    `).bind(workspaceId).all();

    // Get agents
    const agentsResult = await db.prepare(`
      SELECT
        id,
        name,
        status,
        voice_provider,
        created_at
      FROM voice_agents
      WHERE workspace_id = ?
      ORDER BY created_at DESC
    `).bind(workspaceId).all();

    // Get phone numbers
    const phoneNumbersResult = await db.prepare(`
      SELECT
        id,
        phone_number,
        provider,
        status
      FROM phone_numbers
      WHERE workspace_id = ?
      ORDER BY created_at DESC
    `).bind(workspaceId).all();

    // Get call statistics
    const callStats = await db.prepare(`
      SELECT
        COUNT(*) as total_calls,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_calls,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_calls,
        SUM(duration_seconds) / 60.0 as total_minutes,
        AVG(duration_seconds) as avg_duration
      FROM calls
      WHERE workspace_id = ?
    `).bind(workspaceId).first();

    // Get current billing period with aggregated usage stats
    const currentBillingPeriod = await db.prepare(`
      SELECT
        bp.id,
        bp.period_start,
        bp.period_end,
        bp.total_amount,
        bp.status,
        (SELECT SUM(quantity)
         FROM usage_records
         WHERE billing_period_id = bp.id
         AND resource_type = 'call_minutes') as total_minutes,
        (SELECT COUNT(DISTINCT call_id)
         FROM usage_records
         WHERE billing_period_id = bp.id
         AND call_id IS NOT NULL) as total_calls
      FROM billing_periods bp
      WHERE bp.workspace_id = ?
      ORDER BY bp.period_start DESC
      LIMIT 1
    `).bind(workspaceId).first();

    // Get recent activity (last 10 calls)
    const recentCallsResult = await db.prepare(`
      SELECT
        id,
        direction,
        status,
        duration_seconds,
        started_at,
        ended_at
      FROM calls
      WHERE workspace_id = ?
      ORDER BY started_at DESC
      LIMIT 10
    `).bind(workspaceId).all();

    return c.json({
      workspace: {
        ...workspace,
        tier_info: {
          tier_name: workspace.tier_name,
          monthly_fee: workspace.monthly_fee,
          max_agents: workspace.max_agents,
          included_minutes: workspace.included_minutes,
        },
      },
      owner,
      members: membersResult.results,
      agents: agentsResult.results,
      phone_numbers: phoneNumbersResult.results,
      call_stats: {
        total_calls: callStats?.total_calls || 0,
        completed_calls: callStats?.completed_calls || 0,
        failed_calls: callStats?.failed_calls || 0,
        total_minutes: Math.round(callStats?.total_minutes || 0),
        avg_duration: Math.round(callStats?.avg_duration || 0),
      },
      current_billing_period: currentBillingPeriod || null,
      recent_calls: recentCallsResult.results,
    });
  } catch (error) {
    console.error('Admin get workspace error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'Failed to fetch workspace details',
    }, 500);
  }
});

/**
 * PUT /admin/workspaces/:id
 * Update workspace settings
 * Body: { name?, subscription_tier?, status?, timezone? }
 */
workspacesRoutes.put('/:id', async (c) => {
  const db = c.env.DB;
  const workspaceId = c.req.param('id');

  try {
    const body = await c.req.json();

    // Check if workspace exists
    const workspace = await db.prepare(
      'SELECT id FROM workspaces WHERE id = ?'
    ).bind(workspaceId).first();

    if (!workspace) {
      return c.json({
        error: 'Not Found',
        message: 'Workspace not found',
      }, 404);
    }

    // Validate subscription tier if provided
    if (body.subscription_tier) {
      const tier = await db.prepare(
        'SELECT tier_name FROM subscription_tiers WHERE tier_name = ?'
      ).bind(body.subscription_tier).first();

      if (!tier) {
        return c.json({
          error: 'Bad Request',
          message: 'Invalid subscription tier',
        }, 400);
      }
    }

    // Validate status if provided
    if (body.status && !['active', 'trial', 'suspended', 'cancelled'].includes(body.status)) {
      return c.json({
        error: 'Bad Request',
        message: 'Invalid status. Must be one of: active, trial, suspended, cancelled',
      }, 400);
    }

    // Build dynamic update query
    const updates: string[] = [];
    const params: any[] = [];

    if (body.name !== undefined) {
      updates.push('name = ?');
      params.push(body.name);
    }

    if (body.subscription_tier !== undefined) {
      updates.push('subscription_tier = ?');
      params.push(body.subscription_tier);
    }

    if (body.status !== undefined) {
      updates.push('status = ?');
      params.push(body.status);
    }

    if (body.timezone !== undefined) {
      updates.push('timezone = ?');
      params.push(body.timezone);
    }

    if (updates.length === 0) {
      return c.json({
        error: 'Bad Request',
        message: 'No valid fields to update',
      }, 400);
    }

    // Add updated_at timestamp
    updates.push('updated_at = ?');
    params.push(new Date().toISOString());

    // Add workspace ID for WHERE clause
    params.push(workspaceId);

    // Execute update
    await db.prepare(`
      UPDATE workspaces
      SET ${updates.join(', ')}
      WHERE id = ?
    `).bind(...params).run();

    // Log admin activity
    const auth = c.get('auth');
    await db.prepare(`
      INSERT INTO admin_activity_logs (id, admin_id, action, resource_type, resource_id, details, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      auth.userId,
      'update_workspace',
      'workspace',
      workspaceId,
      JSON.stringify({ updates: body }),
      Math.floor(Date.now() / 1000)
    ).run();

    // Fetch and return updated workspace
    const updatedWorkspace = await db.prepare(
      'SELECT * FROM workspaces WHERE id = ?'
    ).bind(workspaceId).first();

    return c.json({
      message: 'Workspace updated successfully',
      workspace: updatedWorkspace,
    });
  } catch (error) {
    console.error('Admin update workspace error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'Failed to update workspace',
    }, 500);
  }
});

/**
 * POST /admin/workspaces/:id/suspend
 * Suspend a workspace
 * Body: { reason: string }
 */
workspacesRoutes.post('/:id/suspend', async (c) => {
  const db = c.env.DB;
  const workspaceId = c.req.param('id');

  try {
    const body = await c.req.json();
    const reason = body.reason || 'Suspended by admin';

    // Check if workspace exists
    const workspace = await db.prepare(
      'SELECT id, name, status FROM workspaces WHERE id = ?'
    ).bind(workspaceId).first();

    if (!workspace) {
      return c.json({
        error: 'Not Found',
        message: 'Workspace not found',
      }, 404);
    }

    // Check if already suspended
    if (workspace.status === 'suspended') {
      return c.json({
        error: 'Bad Request',
        message: 'Workspace is already suspended',
      }, 400);
    }

    // Update workspace status to suspended
    await db.prepare(`
      UPDATE workspaces
      SET status = 'suspended', updated_at = ?
      WHERE id = ?
    `).bind(new Date().toISOString(), workspaceId).run();

    // Pause all active agents in the workspace
    await db.prepare(`
      UPDATE voice_agents
      SET status = 'paused'
      WHERE workspace_id = ? AND status = 'live'
    `).bind(workspaceId).run();

    // Log admin activity
    const auth = c.get('auth');
    await db.prepare(`
      INSERT INTO admin_activity_logs (id, admin_id, action, resource_type, resource_id, details, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      auth.userId,
      'suspend_workspace',
      'workspace',
      workspaceId,
      JSON.stringify({ reason, previous_status: workspace.status }),
      Math.floor(Date.now() / 1000)
    ).run();

    return c.json({
      message: 'Workspace suspended successfully',
      workspace_id: workspaceId,
      workspace_name: workspace.name,
      previous_status: workspace.status,
      reason,
    });
  } catch (error) {
    console.error('Admin suspend workspace error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'Failed to suspend workspace',
    }, 500);
  }
});

/**
 * POST /admin/workspaces/:id/activate
 * Activate a suspended or trial workspace
 * Body: { subscription_tier?: string }
 */
workspacesRoutes.post('/:id/activate', async (c) => {
  const db = c.env.DB;
  const workspaceId = c.req.param('id');

  try {
    const body = await c.req.json();
    const subscriptionTier = body.subscription_tier;

    // Check if workspace exists
    const workspace = await db.prepare(
      'SELECT id, name, status, subscription_tier FROM workspaces WHERE id = ?'
    ).bind(workspaceId).first();

    if (!workspace) {
      return c.json({
        error: 'Not Found',
        message: 'Workspace not found',
      }, 404);
    }

    // Check if already active
    if (workspace.status === 'active') {
      return c.json({
        error: 'Bad Request',
        message: 'Workspace is already active',
      }, 400);
    }

    // Validate subscription tier if provided
    let finalTier = workspace.subscription_tier;
    if (subscriptionTier) {
      const tier = await db.prepare(
        'SELECT tier_name FROM subscription_tiers WHERE tier_name = ?'
      ).bind(subscriptionTier).first();

      if (!tier) {
        return c.json({
          error: 'Bad Request',
          message: 'Invalid subscription tier',
        }, 400);
      }
      finalTier = subscriptionTier;
    }

    // Update workspace status to active
    const updates = ['status = ?', 'updated_at = ?'];
    const params = ['active', new Date().toISOString()];

    if (subscriptionTier) {
      updates.push('subscription_tier = ?');
      params.push(subscriptionTier);
    }

    params.push(workspaceId);

    await db.prepare(`
      UPDATE workspaces
      SET ${updates.join(', ')}
      WHERE id = ?
    `).bind(...params).run();

    // Log admin activity
    const auth = c.get('auth');
    await db.prepare(`
      INSERT INTO admin_activity_logs (id, admin_id, action, resource_type, resource_id, details, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      auth.userId,
      'activate_workspace',
      'workspace',
      workspaceId,
      JSON.stringify({
        previous_status: workspace.status,
        new_tier: finalTier,
      }),
      Math.floor(Date.now() / 1000)
    ).run();

    return c.json({
      message: 'Workspace activated successfully',
      workspace_id: workspaceId,
      workspace_name: workspace.name,
      previous_status: workspace.status,
      subscription_tier: finalTier,
    });
  } catch (error) {
    console.error('Admin activate workspace error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'Failed to activate workspace',
    }, 500);
  }
});

export default workspacesRoutes;
