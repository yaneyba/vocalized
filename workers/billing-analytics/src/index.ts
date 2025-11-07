import { Hono } from 'hono';
import type { BillingPeriod, WorkspaceBillingSettings, PlatformSetting, CallStats } from './types';

interface Env {
  DB: D1Database;
  KV: KVNamespace;
  ENVIRONMENT: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
}

const app = new Hono<{ Bindings: Env }>();

// Health check endpoint
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'billing-analytics',
    environment: c.env.ENVIRONMENT,
    timestamp: Date.now(),
  });
});

// ============================================
// USAGE TRACKING ENDPOINTS
// ============================================

// POST /usage/record - Record usage for a workspace
app.post('/usage/record', async (c) => {
  try {
    const { workspace_id, call_id, resource_type, provider, quantity, unit_cost } = await c.req.json();

    // Validate input
    if (!workspace_id || !resource_type || !provider || !quantity || !unit_cost) {
      return c.json({
        error: 'Validation Error',
        message: 'Missing required fields',
      }, 400);
    }

    // Get markup percentage from platform settings
    const markupSetting = await c.env.DB.prepare(
      "SELECT value FROM platform_settings WHERE key = 'pricing_markup_percentage'"
    ).first<PlatformSetting>();
    const markupPercentage = markupSetting ? parseFloat(markupSetting.value) : 20;

    // Calculate costs
    const totalCost = quantity * unit_cost;
    const finalCost = totalCost * (1 + markupPercentage / 100);

    // Get current billing period
    const now = Date.now();
    const periodStart = new Date(new Date(now).setDate(1)).setHours(0, 0, 0, 0);
    const nextMonth = new Date(new Date(periodStart).setMonth(new Date(periodStart).getMonth() + 1));
    const periodEnd = nextMonth.getTime();

    // Get or create billing period
    let billingPeriod = await c.env.DB.prepare(
      'SELECT id FROM billing_periods WHERE workspace_id = ? AND period_start = ?'
    ).bind(workspace_id, periodStart).first<Pick<BillingPeriod, 'id'>>();

    if (!billingPeriod) {
      const billingPeriodId = crypto.randomUUID();
      await c.env.DB.prepare(`
        INSERT INTO billing_periods
        (id, workspace_id, period_start, period_end, subtotal, subscription_fee, total_amount, status, created_at)
        VALUES (?, ?, ?, ?, 0.0, 0.0, 0.0, 'current', ?)
      `).bind(billingPeriodId, workspace_id, periodStart, periodEnd, now).run();
      billingPeriod = { id: billingPeriodId };
    }

    // Record usage
    const usageId = crypto.randomUUID();
    await c.env.DB.prepare(`
      INSERT INTO usage_records
      (id, workspace_id, call_id, resource_type, provider, quantity, unit_cost, total_cost, markup_percentage, final_cost, billing_period_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      usageId,
      workspace_id,
      call_id || null,
      resource_type,
      provider,
      quantity,
      unit_cost,
      totalCost,
      markupPercentage,
      finalCost,
      billingPeriod.id,
      now
    ).run();

    // Update billing period total
    await c.env.DB.prepare(`
      UPDATE billing_periods
      SET subtotal = subtotal + ?, total_amount = subtotal + subscription_fee
      WHERE id = ?
    `).bind(finalCost, billingPeriod.id).run();

    return c.json({
      usage_id: usageId,
      final_cost: finalCost,
    }, 201);
  } catch (error) {
    console.error('Record usage error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred while recording usage',
    }, 500);
  }
});

// GET /usage/:workspaceId/current - Get current period usage
app.get('/usage/:workspaceId/current', async (c) => {
  try {
    const workspaceId = c.req.param('workspaceId');

    // Get current billing period
    const now = Date.now();
    const periodStart = new Date(new Date(now).setDate(1)).setHours(0, 0, 0, 0);

    const usageRecords = await c.env.DB.prepare(`
      SELECT resource_type, provider, SUM(quantity) as total_quantity, SUM(final_cost) as total_cost
      FROM usage_records
      WHERE workspace_id = ? AND billing_period_id IN (
        SELECT id FROM billing_periods WHERE workspace_id = ? AND period_start = ?
      )
      GROUP BY resource_type, provider
    `).bind(workspaceId, workspaceId, periodStart).all();

    const totalCost = usageRecords.results.reduce((sum, r: any) => sum + r.total_cost, 0);

    return c.json({
      period_start: periodStart,
      usage: usageRecords.results,
      total_cost: totalCost,
    });
  } catch (error) {
    console.error('Get usage error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching usage',
    }, 500);
  }
});

// ============================================
// BILLING ENDPOINTS
// ============================================

// GET /billing/:workspaceId/current - Get current billing period
app.get('/billing/:workspaceId/current', async (c) => {
  try {
    const workspaceId = c.req.param('workspaceId');

    // Get current billing period
    const now = Date.now();
    const periodStart = new Date(new Date(now).setDate(1)).setHours(0, 0, 0, 0);

    const billingPeriod = await c.env.DB.prepare(
      'SELECT * FROM billing_periods WHERE workspace_id = ? AND period_start = ?'
    ).bind(workspaceId, periodStart).first<BillingPeriod>();

    if (!billingPeriod) {
      return c.json({
        error: 'Not Found',
        message: 'No billing period found',
      }, 404);
    }

    // Get usage breakdown
    const usageBreakdown = await c.env.DB.prepare(`
      SELECT resource_type, SUM(quantity) as quantity, SUM(final_cost) as cost
      FROM usage_records
      WHERE billing_period_id = ?
      GROUP BY resource_type
    `).bind(billingPeriod.id).all();

    // Get billing settings
    const settings = await c.env.DB.prepare(
      'SELECT * FROM workspace_billing_settings WHERE workspace_id = ?'
    ).bind(workspaceId).first<WorkspaceBillingSettings>();

    const percentageOfLimit = settings && settings.usage_limit_monthly
      ? (billingPeriod.total_amount / settings.usage_limit_monthly) * 100
      : 0;

    return c.json({
      current_period: {
        start: billingPeriod.period_start,
        end: billingPeriod.period_end,
        subtotal: billingPeriod.subtotal,
        subscription_fee: billingPeriod.subscription_fee,
        total: billingPeriod.total_amount,
        status: billingPeriod.status,
      },
      usage_breakdown: usageBreakdown.results,
      percentage_of_limit: percentageOfLimit,
    });
  } catch (error) {
    console.error('Get billing error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching billing information',
    }, 500);
  }
});

// ============================================
// ANALYTICS ENDPOINTS
// ============================================

// GET /analytics/:workspaceId/overview - Get analytics overview
app.get('/analytics/:workspaceId/overview', async (c) => {
  try {
    const workspaceId = c.req.param('workspaceId');
    const period = c.req.query('period') || 'day'; // day, week, month

    // Calculate time range
    const now = Date.now();
    let startTime = now;
    switch (period) {
      case 'day':
        startTime = now - 24 * 60 * 60 * 1000;
        break;
      case 'week':
        startTime = now - 7 * 24 * 60 * 60 * 1000;
        break;
      case 'month':
        startTime = now - 30 * 24 * 60 * 60 * 1000;
        break;
    }

    // Get call statistics
    const callStats = await c.env.DB.prepare(`
      SELECT
        COUNT(*) as total_calls,
        SUM(duration_seconds) as total_minutes,
        AVG(duration_seconds) as avg_duration,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_calls
      FROM calls
      WHERE workspace_id = ? AND started_at >= ?
    `).bind(workspaceId, startTime).first<CallStats>();

    // Get calls by status
    const callsByStatus = await c.env.DB.prepare(`
      SELECT status, COUNT(*) as count
      FROM calls
      WHERE workspace_id = ? AND started_at >= ?
      GROUP BY status
    `).bind(workspaceId, startTime).all();

    // Get calls by agent
    const callsByAgent = await c.env.DB.prepare(`
      SELECT agent_id, COUNT(*) as count
      FROM calls
      WHERE workspace_id = ? AND started_at >= ?
      GROUP BY agent_id
    `).bind(workspaceId, startTime).all();

    const totalCalls = callStats?.total_calls ?? 0;
    const totalMinutes = callStats?.total_minutes ?? 0;
    const avgDuration = callStats?.avg_duration ?? 0;
    const completedCalls = callStats?.completed_calls ?? 0;

    return c.json({
      period,
      total_calls: totalCalls,
      total_minutes: Math.round(totalMinutes / 60),
      avg_call_duration: Math.round(avgDuration),
      success_rate: totalCalls > 0
        ? (completedCalls / totalCalls) * 100
        : 0,
      calls_by_status: callsByStatus.results,
      calls_by_agent: callsByAgent.results,
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching analytics',
    }, 500);
  }
});

// ============================================
// CRON HANDLERS
// ============================================

async function handleDailyUsageAggregation(_env: Env) {
  console.log('Running daily usage aggregation...');
  // TODO: Aggregate usage data for faster reporting
  // This would create summary records in KV or a separate table
}

async function handleMonthlyBillingFinalization(env: Env) {
  console.log('Running monthly billing finalization...');

  // Get all current billing periods
  const now = Date.now();
  const lastMonth = new Date(new Date(now).setMonth(new Date(now).getMonth() - 1));
  const periodStart = new Date(lastMonth.setDate(1)).setHours(0, 0, 0, 0);

  const periods = await env.DB.prepare(
    "SELECT * FROM billing_periods WHERE status = 'current' AND period_start = ?"
  ).bind(periodStart).all();

  for (const period of periods.results) {
    // Finalize billing period
    await env.DB.prepare(
      "UPDATE billing_periods SET status = 'finalized' WHERE id = ?"
    ).bind(period.id).run();

    // TODO: Create Stripe invoice
    // TODO: Send invoice email
  }

  console.log(`Finalized ${periods.results.length} billing periods`);
}

async function handleHourlyAnalyticsUpdate(_env: Env) {
  console.log('Running hourly analytics update...');
  // TODO: Update analytics cache in KV
  // This would aggregate recent data for faster dashboard loading
}

async function handleDailyAnalyticsAggregation(_env: Env) {
  console.log('Running daily analytics aggregation...');
  // TODO: Create daily analytics snapshots
  // This would create summary records for historical data
}

// Scheduled event handler
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return app.fetch(request, env);
  },

  async scheduled(event: ScheduledEvent, env: Env, _ctx: ExecutionContext): Promise<void> {
    const cron = event.cron;

    try {
      switch (cron) {
        case '0 0 * * *': // Daily at midnight
          await handleDailyUsageAggregation(env);
          break;
        case '0 1 1 * *': // Monthly on 1st at 1 AM
          await handleMonthlyBillingFinalization(env);
          break;
        case '0 * * * *': // Hourly
          await handleHourlyAnalyticsUpdate(env);
          break;
        case '0 2 * * *': // Daily at 2 AM
          await handleDailyAnalyticsAggregation(env);
          break;
        default:
          console.log('Unknown cron schedule:', cron);
      }
    } catch (error) {
      console.error('Cron job error:', error);
    }
  },
};
