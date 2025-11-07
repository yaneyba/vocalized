import { Hono } from 'hono';
import type { Env } from '../../types/env';
import { authenticate, requireAdmin } from '../../middleware/auth';

const providersRoutes = new Hono<{ Bindings: Env }>();

// Apply admin authentication middleware to all routes
providersRoutes.use('*', authenticate, requireAdmin);

/**
 * GET /admin/providers
 * List all platform provider configurations
 */
providersRoutes.get('/', async (c) => {
  const db = c.env.DB;

  try {
    // Get all platform provider configs
    const providersResult = await db.prepare(`
      SELECT
        provider,
        config,
        priority,
        is_enabled,
        cost_per_unit,
        created_at,
        updated_at
      FROM platform_provider_configs
      ORDER BY priority ASC, provider ASC
    `).all();

    // For each provider, get health status summary
    const providers = await Promise.all(
      providersResult.results.map(async (provider: any) => {
        const healthResult = await db.prepare(`
          SELECT
            region,
            status,
            last_check,
            error_rate,
            avg_latency
          FROM provider_health_status
          WHERE provider = ?
          ORDER BY region ASC
        `).bind(provider.provider).all();

        // Calculate overall health
        const healthStatuses = healthResult.results.map((h: any) => h.status);
        let overallHealth = 'healthy';
        if (healthStatuses.includes('down')) {
          overallHealth = 'down';
        } else if (healthStatuses.includes('degraded')) {
          overallHealth = 'degraded';
        }

        return {
          provider: provider.provider,
          config: provider.config ? JSON.parse(provider.config) : null,
          priority: provider.priority,
          is_enabled: Boolean(provider.is_enabled),
          cost_per_unit: provider.cost_per_unit,
          created_at: provider.created_at,
          updated_at: provider.updated_at,
          health: {
            overall_status: overallHealth,
            regions: healthResult.results.map((h: any) => ({
              region: h.region,
              status: h.status,
              last_check: h.last_check,
              error_rate: h.error_rate,
              avg_latency: h.avg_latency,
            })),
          },
        };
      })
    );

    // Get usage statistics for each provider
    const providersWithStats = await Promise.all(
      providers.map(async (provider) => {
        const usageResult = await db.prepare(`
          SELECT
            COUNT(DISTINCT workspace_id) as workspace_count,
            COUNT(*) as usage_count,
            SUM(total_cost) as total_cost
          FROM usage_records
          WHERE provider = ?
          AND created_at >= ?
        `).bind(
          provider.provider,
          Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60) // Last 30 days
        ).first();

        return {
          ...provider,
          usage_stats: {
            workspace_count: usageResult?.workspace_count || 0,
            usage_count: usageResult?.usage_count || 0,
            total_cost: usageResult?.total_cost || 0,
          },
        };
      })
    );

    return c.json({
      providers: providersWithStats,
    });
  } catch (error) {
    console.error('Admin list providers error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'Failed to fetch providers',
    }, 500);
  }
});

/**
 * POST /admin/providers
 * Add or configure a new provider
 * Body: { provider, api_key, config?, priority?, cost_per_unit? }
 */
providersRoutes.post('/', async (c) => {
  const db = c.env.DB;

  try {
    const body = await c.req.json();
    const { provider, api_key, config, priority, cost_per_unit } = body;

    // Validate required fields
    if (!provider || !api_key) {
      return c.json({
        error: 'Bad Request',
        message: 'provider and api_key are required',
      }, 400);
    }

    // Validate provider name
    const validProviders = ['elevenlabs', 'vapi', 'retell', 'deepgram', 'bolna'];
    if (!validProviders.includes(provider)) {
      return c.json({
        error: 'Bad Request',
        message: `Invalid provider. Must be one of: ${validProviders.join(', ')}`,
      }, 400);
    }

    // Check if provider already exists
    const existing = await db.prepare(
      'SELECT provider FROM platform_provider_configs WHERE provider = ?'
    ).bind(provider).first();

    if (existing) {
      return c.json({
        error: 'Conflict',
        message: 'Provider already exists. Use PUT to update.',
      }, 409);
    }

    // TODO: In production, encrypt the API key before storing
    // For now, we'll store it as-is (this should be encrypted with a KMS key)
    const api_key_encrypted = api_key;

    // Insert new provider config
    const now = Math.floor(Date.now() / 1000);
    await db.prepare(`
      INSERT INTO platform_provider_configs (
        provider,
        api_key_encrypted,
        config,
        priority,
        is_enabled,
        cost_per_unit,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      provider,
      api_key_encrypted,
      config ? JSON.stringify(config) : null,
      priority || 0,
      1, // enabled by default
      cost_per_unit || 0.0,
      now,
      now
    ).run();

    // Log admin activity
    const auth = c.get('auth');
    await db.prepare(`
      INSERT INTO admin_activity_logs (id, admin_id, action, resource_type, resource_id, details, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      auth.userId,
      'add_provider',
      'provider',
      provider,
      JSON.stringify({ provider, priority, cost_per_unit }),
      now
    ).run();

    return c.json({
      message: 'Provider added successfully',
      provider: {
        provider,
        config: config || null,
        priority: priority || 0,
        is_enabled: true,
        cost_per_unit: cost_per_unit || 0.0,
        created_at: now,
        updated_at: now,
      },
    }, 201);
  } catch (error) {
    console.error('Admin add provider error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'Failed to add provider',
    }, 500);
  }
});

/**
 * PUT /admin/providers/:provider
 * Update provider configuration
 * Body: { api_key?, config?, priority?, is_enabled?, cost_per_unit? }
 */
providersRoutes.put('/:provider', async (c) => {
  const db = c.env.DB;
  const provider = c.req.param('provider');

  try {
    const body = await c.req.json();

    // Check if provider exists
    const existing = await db.prepare(
      'SELECT provider FROM platform_provider_configs WHERE provider = ?'
    ).bind(provider).first();

    if (!existing) {
      return c.json({
        error: 'Not Found',
        message: 'Provider not found',
      }, 404);
    }

    // Build dynamic update query
    const updates: string[] = [];
    const params: any[] = [];

    if (body.api_key !== undefined) {
      // TODO: In production, encrypt the API key
      updates.push('api_key_encrypted = ?');
      params.push(body.api_key);
    }

    if (body.config !== undefined) {
      updates.push('config = ?');
      params.push(JSON.stringify(body.config));
    }

    if (body.priority !== undefined) {
      updates.push('priority = ?');
      params.push(body.priority);
    }

    if (body.is_enabled !== undefined) {
      updates.push('is_enabled = ?');
      params.push(body.is_enabled ? 1 : 0);
    }

    if (body.cost_per_unit !== undefined) {
      updates.push('cost_per_unit = ?');
      params.push(body.cost_per_unit);
    }

    if (updates.length === 0) {
      return c.json({
        error: 'Bad Request',
        message: 'No valid fields to update',
      }, 400);
    }

    // Add updated_at timestamp
    updates.push('updated_at = ?');
    const now = Math.floor(Date.now() / 1000);
    params.push(now);

    // Add provider for WHERE clause
    params.push(provider);

    // Execute update
    await db.prepare(`
      UPDATE platform_provider_configs
      SET ${updates.join(', ')}
      WHERE provider = ?
    `).bind(...params).run();

    // Log admin activity
    const auth = c.get('auth');
    await db.prepare(`
      INSERT INTO admin_activity_logs (id, admin_id, action, resource_type, resource_id, details, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      auth.userId,
      'update_provider',
      'provider',
      provider,
      JSON.stringify({ updates: body }),
      now
    ).run();

    // Fetch and return updated provider
    const updated = await db.prepare(
      'SELECT * FROM platform_provider_configs WHERE provider = ?'
    ).bind(provider).first();

    return c.json({
      message: 'Provider updated successfully',
      provider: {
        ...updated,
        config: updated.config ? JSON.parse(updated.config as string) : null,
        is_enabled: Boolean(updated.is_enabled),
      },
    });
  } catch (error) {
    console.error('Admin update provider error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'Failed to update provider',
    }, 500);
  }
});

/**
 * GET /admin/providers/health
 * Get overall provider health status across all regions
 */
providersRoutes.get('/health', async (c) => {
  const db = c.env.DB;

  try {
    // Get all provider health statuses
    const healthResult = await db.prepare(`
      SELECT
        provider,
        region,
        status,
        last_check,
        error_rate,
        avg_latency,
        details
      FROM provider_health_status
      ORDER BY provider ASC, region ASC
    `).all();

    // Group by provider
    const healthByProvider = healthResult.results.reduce((acc: any, row: any) => {
      if (!acc[row.provider]) {
        acc[row.provider] = {
          provider: row.provider,
          regions: [],
        };
      }

      acc[row.provider].regions.push({
        region: row.region,
        status: row.status,
        last_check: row.last_check,
        error_rate: row.error_rate,
        avg_latency: row.avg_latency,
        details: row.details ? JSON.parse(row.details) : null,
      });

      return acc;
    }, {});

    // Calculate overall health for each provider
    const providersHealth = Object.values(healthByProvider).map((provider: any) => {
      const statuses = provider.regions.map((r: any) => r.status);
      let overallStatus = 'healthy';

      if (statuses.includes('down')) {
        overallStatus = 'down';
      } else if (statuses.includes('degraded')) {
        overallStatus = 'degraded';
      }

      // Calculate average error rate and latency
      const avgErrorRate = provider.regions.reduce((sum: number, r: any) => sum + (r.error_rate || 0), 0) / provider.regions.length;
      const avgLatency = provider.regions.reduce((sum: number, r: any) => sum + (r.avg_latency || 0), 0) / provider.regions.length;

      return {
        ...provider,
        overall_status: overallStatus,
        avg_error_rate: Math.round(avgErrorRate * 100) / 100,
        avg_latency: Math.round(avgLatency),
      };
    });

    // Get platform-wide summary
    const allStatuses = healthResult.results.map((r: any) => r.status);
    let platformStatus = 'healthy';
    if (allStatuses.includes('down')) {
      platformStatus = 'degraded'; // At least one region is down
    } else if (allStatuses.includes('degraded')) {
      platformStatus = 'degraded';
    }

    return c.json({
      platform_status: platformStatus,
      last_updated: Math.max(...healthResult.results.map((r: any) => r.last_check)),
      providers: providersHealth,
    });
  } catch (error) {
    console.error('Admin provider health error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'Failed to fetch provider health',
    }, 500);
  }
});

export default providersRoutes;
