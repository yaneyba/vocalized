import { Hono } from 'hono';
import type { Env } from '../../types/env';
import { authenticate, requireAdmin } from '../../middleware/auth';

const dashboardRoutes = new Hono<{ Bindings: Env }>();

// Apply admin authentication middleware to all routes
dashboardRoutes.use('*', authenticate, requireAdmin);

/**
 * GET /admin/dashboard/overview
 * Returns platform-wide metrics overview
 */
dashboardRoutes.get('/overview', async (c) => {
  const db = c.env.DB;

  try {
    // Get current date/time for calculations
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // Total workspaces
    const totalWorkspacesResult = await db.prepare(
      'SELECT COUNT(*) as count FROM workspaces'
    ).first<{ count: number }>();
    const total_workspaces = totalWorkspacesResult?.count || 0;

    // Active workspaces (status = 'active' or 'trial')
    const activeWorkspacesResult = await db.prepare(
      "SELECT COUNT(*) as count FROM workspaces WHERE status IN ('active', 'trial')"
    ).first<{ count: number }>();
    const active_workspaces = activeWorkspacesResult?.count || 0;

    // Total calls today
    const callsTodayResult = await db.prepare(
      'SELECT COUNT(*) as count FROM calls WHERE DATE(started_at) = DATE(?)'
    ).bind(today).first<{ count: number }>();
    const total_calls_today = callsTodayResult?.count || 0;

    // Total calls this month
    const callsMonthResult = await db.prepare(
      'SELECT COUNT(*) as count FROM calls WHERE started_at >= ?'
    ).bind(monthStart).first<{ count: number }>();
    const total_calls_month = callsMonthResult?.count || 0;

    // Total revenue this month (from billing_periods)
    const revenueMonthResult = await db.prepare(
      'SELECT SUM(total_amount) as total FROM billing_periods WHERE period_start >= ? AND status = ?'
    ).bind(monthStart, 'finalized').first<{ total: number }>();
    const total_revenue_month = revenueMonthResult?.total || 0;

    // Calculate MRR (Monthly Recurring Revenue) - sum of active workspace subscription fees
    const mrrResult = await db.prepare(`
      SELECT SUM(st.monthly_fee) as mrr
      FROM workspaces w
      JOIN subscription_tiers st ON w.subscription_tier = st.tier_name
      WHERE w.status IN ('active', 'trial')
    `).first<{ mrr: number }>();
    const mrr = mrrResult?.mrr || 0;

    // Count active agents (status = 'live')
    const activeAgentsResult = await db.prepare(
      "SELECT COUNT(*) as count FROM voice_agents WHERE status = 'live'"
    ).first<{ count: number }>();
    const active_agents = activeAgentsResult?.count || 0;

    // Provider health summary - get counts by provider status
    // Note: This is a simplified version; real health monitoring would be done by the Voice AI Gateway
    const providerHealthResult = await db.prepare(`
      SELECT
        provider,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as successful_calls,
        COUNT(CASE WHEN status IN ('failed', 'no-answer') THEN 1 END) as failed_calls,
        COUNT(*) as total_calls
      FROM calls
      WHERE started_at >= ?
      GROUP BY provider
    `).bind(monthStart).all();

    const provider_health_summary = providerHealthResult.results.map((row: any) => ({
      provider: row.provider,
      success_rate: row.total_calls > 0
        ? Math.round((row.successful_calls / row.total_calls) * 100)
        : 0,
      total_calls: row.total_calls,
    }));

    return c.json({
      total_workspaces,
      active_workspaces,
      total_calls_today,
      total_calls_month,
      total_revenue_month,
      mrr,
      active_agents,
      provider_health_summary,
    });
  } catch (error) {
    console.error('Dashboard overview error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'Failed to fetch dashboard overview',
    }, 500);
  }
});

/**
 * GET /admin/dashboard/revenue
 * Returns revenue analytics
 * Query params: period (month|quarter|year) - defaults to month
 */
dashboardRoutes.get('/revenue', async (c) => {
  const db = c.env.DB;
  const period = c.req.query('period') || 'month';

  try {
    const now = new Date();
    let periodStart: Date;

    // Calculate period start date
    switch (period) {
      case 'quarter':
        const currentQuarter = Math.floor(now.getMonth() / 3);
        periodStart = new Date(now.getFullYear(), currentQuarter * 3, 1);
        break;
      case 'year':
        periodStart = new Date(now.getFullYear(), 0, 1);
        break;
      case 'month':
      default:
        periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const periodStartISO = periodStart.toISOString();

    // Total revenue for period
    const totalRevenueResult = await db.prepare(
      'SELECT SUM(total_amount) as total FROM billing_periods WHERE period_start >= ? AND status = ?'
    ).bind(periodStartISO, 'finalized').first<{ total: number }>();
    const total_revenue = totalRevenueResult?.total || 0;

    // Revenue by subscription tier
    const revenuByTierResult = await db.prepare(`
      SELECT
        w.subscription_tier as tier,
        COUNT(DISTINCT w.id) as workspace_count,
        SUM(bp.total_amount) as revenue
      FROM billing_periods bp
      JOIN workspaces w ON bp.workspace_id = w.id
      WHERE bp.period_start >= ? AND bp.status = ?
      GROUP BY w.subscription_tier
    `).bind(periodStartISO, 'finalized').all();

    const revenue_by_tier = revenuByTierResult.results.map((row: any) => ({
      tier: row.tier,
      workspace_count: row.workspace_count,
      revenue: row.revenue || 0,
    }));

    // Calculate MRR (Monthly Recurring Revenue)
    const mrrResult = await db.prepare(`
      SELECT SUM(st.monthly_fee) as mrr
      FROM workspaces w
      JOIN subscription_tiers st ON w.subscription_tier = st.tier_name
      WHERE w.status IN ('active', 'trial')
    `).first<{ mrr: number }>();
    const mrr = mrrResult?.mrr || 0;

    // Calculate ARR (Annual Recurring Revenue)
    const arr = mrr * 12;

    // Calculate churn rate (workspaces that became inactive in the period)
    const churnResult = await db.prepare(`
      SELECT
        COUNT(CASE WHEN status = 'suspended' THEN 1 END) as churned,
        COUNT(*) as total
      FROM workspaces
    `).first<{ churned: number; total: number }>();

    const churn_rate = churnResult && churnResult.total > 0
      ? Math.round((churnResult.churned / churnResult.total) * 100 * 10) / 10
      : 0;

    return c.json({
      period,
      total_revenue,
      revenue_by_tier,
      mrr,
      arr,
      churn_rate,
    });
  } catch (error) {
    console.error('Dashboard revenue error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'Failed to fetch revenue analytics',
    }, 500);
  }
});

/**
 * GET /admin/dashboard/usage
 * Returns usage statistics
 * Query params: period (day|week|month) - defaults to day
 */
dashboardRoutes.get('/usage', async (c) => {
  const db = c.env.DB;
  const period = c.req.query('period') || 'day';

  try {
    const now = new Date();
    let periodStart: Date;

    // Calculate period start date
    switch (period) {
      case 'week':
        periodStart = new Date(now);
        periodStart.setDate(now.getDate() - 7);
        break;
      case 'month':
        periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'day':
      default:
        periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    const periodStartISO = periodStart.toISOString();

    // Total calls in period
    const totalCallsResult = await db.prepare(
      'SELECT COUNT(*) as count FROM calls WHERE started_at >= ?'
    ).bind(periodStartISO).first<{ count: number }>();
    const total_calls = totalCallsResult?.count || 0;

    // Total minutes in period
    const totalMinutesResult = await db.prepare(
      'SELECT SUM(duration_seconds) / 60.0 as minutes FROM calls WHERE started_at >= ? AND duration_seconds IS NOT NULL'
    ).bind(periodStartISO).first<{ minutes: number }>();
    const total_minutes = Math.round(totalMinutesResult?.minutes || 0);

    // Calls by provider
    const callsByProviderResult = await db.prepare(`
      SELECT
        provider,
        COUNT(*) as call_count,
        SUM(duration_seconds) / 60.0 as total_minutes
      FROM calls
      WHERE started_at >= ?
      GROUP BY provider
    `).bind(periodStartISO).all();

    const calls_by_provider = callsByProviderResult.results.map((row: any) => ({
      provider: row.provider,
      call_count: row.call_count,
      total_minutes: Math.round(row.total_minutes || 0),
    }));

    // Average call duration
    const avgDurationResult = await db.prepare(
      'SELECT AVG(duration_seconds) as avg_duration FROM calls WHERE started_at >= ? AND duration_seconds IS NOT NULL'
    ).bind(periodStartISO).first<{ avg_duration: number }>();
    const avg_call_duration = Math.round(avgDurationResult?.avg_duration || 0);

    // Peak hours - get call counts grouped by hour of day
    const peakHoursResult = await db.prepare(`
      SELECT
        CAST(strftime('%H', started_at) AS INTEGER) as hour,
        COUNT(*) as call_count
      FROM calls
      WHERE started_at >= ?
      GROUP BY hour
      ORDER BY call_count DESC
      LIMIT 5
    `).bind(periodStartISO).all();

    const peak_hours = peakHoursResult.results.map((row: any) => ({
      hour: row.hour,
      call_count: row.call_count,
    }));

    return c.json({
      period,
      total_calls,
      total_minutes,
      calls_by_provider,
      avg_call_duration,
      peak_hours,
    });
  } catch (error) {
    console.error('Dashboard usage error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'Failed to fetch usage statistics',
    }, 500);
  }
});

export default dashboardRoutes;
