import { Hono } from 'hono';
import type { Env } from '@/types/env';
import { authenticate, requireWorkspaceAccess, requireWorkspaceRole } from '@/middleware/auth';
import { generateId } from '@/utils/crypto';

const callsRoutes = new Hono<{ Bindings: Env }>();

// Apply authentication to all routes
callsRoutes.use('*', authenticate);

// GET /:workspaceId/calls - List all calls in workspace
callsRoutes.get('/:workspaceId/calls', requireWorkspaceAccess, async (c) => {
  try {
    const workspaceId = c.req.param('workspaceId');
    const {
      status,
      direction,
      agent_id,
      limit = '50',
      offset = '0',
      start_date,
      end_date
    } = c.req.query();

    // Build query dynamically with filters
    let query = `
      SELECT
        c.id, c.caller_number, c.caller_name, c.direction, c.status,
        c.duration_seconds, c.started_at, c.ended_at, c.cost_total,
        c.sentiment, c.voice_provider_used,
        va.name as agent_name, va.id as agent_id,
        pn.phone_number, pn.friendly_name as phone_friendly_name
      FROM calls c
      JOIN voice_agents va ON c.agent_id = va.id
      JOIN phone_numbers pn ON c.phone_number_id = pn.id
      WHERE c.workspace_id = ?
    `;

    const bindings: any[] = [workspaceId];

    // Add filters
    if (status) {
      query += ' AND c.status = ?';
      bindings.push(status);
    }

    if (direction) {
      query += ' AND c.direction = ?';
      bindings.push(direction);
    }

    if (agent_id) {
      query += ' AND c.agent_id = ?';
      bindings.push(agent_id);
    }

    if (start_date) {
      query += ' AND c.started_at >= ?';
      bindings.push(parseInt(start_date));
    }

    if (end_date) {
      query += ' AND c.started_at <= ?';
      bindings.push(parseInt(end_date));
    }

    query += ' ORDER BY c.started_at DESC LIMIT ? OFFSET ?';
    bindings.push(parseInt(limit), parseInt(offset));

    const calls = await c.env.DB.prepare(query).bind(...bindings).all();

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM calls WHERE workspace_id = ?';
    const countBindings: any[] = [workspaceId];

    if (status) {
      countQuery += ' AND status = ?';
      countBindings.push(status);
    }
    if (direction) {
      countQuery += ' AND direction = ?';
      countBindings.push(direction);
    }
    if (agent_id) {
      countQuery += ' AND agent_id = ?';
      countBindings.push(agent_id);
    }

    const totalResult = await c.env.DB.prepare(countQuery).bind(...countBindings).first();
    const total = (totalResult?.total as number) || 0;

    return c.json({
      calls: calls.results,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        has_more: parseInt(offset) + calls.results.length < total,
      },
    });
  } catch (error) {
    console.error('List calls error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching calls',
    }, 500);
  }
});

// GET /:workspaceId/calls/live - Get currently active calls
callsRoutes.get('/:workspaceId/calls/live', requireWorkspaceAccess, async (c) => {
  try {
    const workspaceId = c.req.param('workspaceId');

    const liveCalls = await c.env.DB.prepare(`
      SELECT
        c.id, c.caller_number, c.caller_name, c.direction, c.status,
        c.started_at, c.voice_provider_used,
        va.name as agent_name, va.id as agent_id,
        pn.phone_number, pn.friendly_name as phone_friendly_name
      FROM calls c
      JOIN voice_agents va ON c.agent_id = va.id
      JOIN phone_numbers pn ON c.phone_number_id = pn.id
      WHERE c.workspace_id = ?
        AND c.status IN ('queued', 'ringing', 'in-progress')
      ORDER BY c.started_at DESC
    `).bind(workspaceId).all();

    return c.json({
      live_calls: liveCalls.results,
      count: liveCalls.results.length,
    });
  } catch (error) {
    console.error('Get live calls error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching live calls',
    }, 500);
  }
});

// GET /:workspaceId/calls/:callId - Get call details
callsRoutes.get('/:workspaceId/calls/:callId', requireWorkspaceAccess, async (c) => {
  try {
    const workspaceId = c.req.param('workspaceId');
    const callId = c.req.param('callId');

    const call = await c.env.DB.prepare(`
      SELECT
        c.*,
        va.name as agent_name, va.voice_provider as agent_voice_provider,
        pn.phone_number, pn.friendly_name as phone_friendly_name, pn.provider as phone_provider
      FROM calls c
      JOIN voice_agents va ON c.agent_id = va.id
      JOIN phone_numbers pn ON c.phone_number_id = pn.id
      WHERE c.id = ? AND c.workspace_id = ?
    `).bind(callId, workspaceId).first();

    if (!call) {
      return c.json({
        error: 'Not Found',
        message: 'Call not found',
      }, 404);
    }

    // Get call events
    const events = await c.env.DB.prepare(`
      SELECT id, event_type, event_data, timestamp
      FROM call_events
      WHERE call_id = ?
      ORDER BY timestamp ASC
    `).bind(callId).all();

    // Parse JSON fields
    const callData = {
      ...call,
      metadata: call.metadata ? JSON.parse(call.metadata as string) : null,
      events: events.results.map(e => ({
        ...e,
        event_data: e.event_data ? JSON.parse(e.event_data as string) : null,
      })),
    };

    return c.json({
      call: callData,
    });
  } catch (error) {
    console.error('Get call details error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching call details',
    }, 500);
  }
});

// GET /:workspaceId/calls/:callId/recording - Get call recording URL
callsRoutes.get('/:workspaceId/calls/:callId/recording', requireWorkspaceAccess, async (c) => {
  try {
    const workspaceId = c.req.param('workspaceId');
    const callId = c.req.param('callId');

    const call = await c.env.DB.prepare(
      'SELECT id, recording_url, status FROM calls WHERE id = ? AND workspace_id = ?'
    ).bind(callId, workspaceId).first();

    if (!call) {
      return c.json({
        error: 'Not Found',
        message: 'Call not found',
      }, 404);
    }

    if (!call.recording_url) {
      return c.json({
        error: 'Not Found',
        message: 'Recording not available for this call',
      }, 404);
    }

    // TODO: In production, generate a signed URL for R2 access with expiration
    // For now, return the recording URL
    return c.json({
      recording_url: call.recording_url,
      call_id: call.id,
      // expires_at: Date.now() + (3600 * 1000), // 1 hour from now
    });
  } catch (error) {
    console.error('Get call recording error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching the call recording',
    }, 500);
  }
});

// GET /:workspaceId/calls/:callId/transcription - Get call transcription
callsRoutes.get('/:workspaceId/calls/:callId/transcription', requireWorkspaceAccess, async (c) => {
  try {
    const workspaceId = c.req.param('workspaceId');
    const callId = c.req.param('callId');

    const call = await c.env.DB.prepare(
      'SELECT id, transcription, summary, sentiment FROM calls WHERE id = ? AND workspace_id = ?'
    ).bind(callId, workspaceId).first();

    if (!call) {
      return c.json({
        error: 'Not Found',
        message: 'Call not found',
      }, 404);
    }

    if (!call.transcription) {
      return c.json({
        error: 'Not Found',
        message: 'Transcription not available for this call',
      }, 404);
    }

    return c.json({
      call_id: call.id,
      transcription: call.transcription,
      summary: call.summary || null,
      sentiment: call.sentiment || null,
    });
  } catch (error) {
    console.error('Get call transcription error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching the call transcription',
    }, 500);
  }
});

// POST /:workspaceId/calls/outbound - Initiate an outbound call
callsRoutes.post('/:workspaceId/calls/outbound', requireWorkspaceAccess, requireWorkspaceRole('owner', 'admin', 'member'), async (c) => {
  try {
    const workspaceId = c.req.param('workspaceId');
    const { agent_id, to_number, caller_id } = await c.req.json();

    // Validate required fields
    if (!agent_id || !to_number) {
      return c.json({
        error: 'Validation Error',
        message: 'agent_id and to_number are required',
      }, 400);
    }

    // Validate phone number format (E.164)
    if (!to_number.match(/^\+[1-9]\d{1,14}$/)) {
      return c.json({
        error: 'Validation Error',
        message: 'to_number must be in E.164 format (e.g., +14155551234)',
      }, 400);
    }

    // Verify agent exists and is in the workspace
    const agent = await c.env.DB.prepare(`
      SELECT va.id, va.name, va.status, va.phone_number_id, va.voice_provider,
             pn.phone_number, pn.provider
      FROM voice_agents va
      LEFT JOIN phone_numbers pn ON va.phone_number_id = pn.id
      WHERE va.id = ? AND va.workspace_id = ?
    `).bind(agent_id, workspaceId).first();

    if (!agent) {
      return c.json({
        error: 'Not Found',
        message: 'Agent not found',
      }, 404);
    }

    if (agent.status !== 'live') {
      return c.json({
        error: 'Validation Error',
        message: 'Agent must be in live status to make outbound calls',
      }, 400);
    }

    if (!agent.phone_number_id) {
      return c.json({
        error: 'Validation Error',
        message: 'Agent must have a phone number assigned',
      }, 400);
    }

    // TODO: In production, this would make actual API call to Twilio/Telnyx
    // For now, create a mock call record

    const callId = generateId('call');
    const now = Date.now();

    const fromNumber = caller_id || agent.phone_number;

    await c.env.DB.prepare(`
      INSERT INTO calls
      (id, workspace_id, agent_id, phone_number_id, caller_number, direction, status,
       provider_call_sid, voice_provider_used, started_at)
      VALUES (?, ?, ?, ?, ?, 'outbound', 'queued', ?, ?, ?)
    `).bind(
      callId,
      workspaceId,
      agent_id,
      agent.phone_number_id,
      to_number,
      `MOCK_${Math.random().toString(36).substring(2, 15)}`, // Mock provider SID
      agent.voice_provider,
      now
    ).run();

    // Create initial call event
    await c.env.DB.prepare(`
      INSERT INTO call_events
      (id, call_id, event_type, event_data, timestamp)
      VALUES (?, ?, 'initiated', ?, ?)
    `).bind(
      generateId('evt'),
      callId,
      JSON.stringify({ to: to_number, from: fromNumber }),
      now
    ).run();

    return c.json({
      call: {
        id: callId,
        agent_id,
        agent_name: agent.name,
        to_number,
        from_number: fromNumber,
        status: 'queued',
        started_at: now,
      },
      message: 'Outbound call initiated. Note: This is a mock implementation. Production would integrate with Twilio/Telnyx.',
    }, 201);
  } catch (error) {
    console.error('Initiate outbound call error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred while initiating the call',
    }, 500);
  }
});

export default callsRoutes;
