import { Hono } from 'hono';
import type { Env } from '@/types/env';
import { authenticate, requireWorkspaceAccess, requireWorkspaceRole } from '@/middleware/auth';
import { generateId } from '@/utils/crypto';

const phoneNumbersRoutes = new Hono<{ Bindings: Env }>();

// Apply authentication to all routes
phoneNumbersRoutes.use('*', authenticate);

// GET /:workspaceId/phone-numbers - List all phone numbers in workspace
phoneNumbersRoutes.get('/:workspaceId/phone-numbers', requireWorkspaceAccess, async (c) => {
  try {
    const workspaceId = c.req.param('workspaceId');

    const phoneNumbers = await c.env.DB.prepare(`
      SELECT
        pn.id, pn.phone_number, pn.provider, pn.provider_sid,
        pn.friendly_name, pn.status, pn.created_at,
        va.id as assigned_agent_id, va.name as assigned_agent_name
      FROM phone_numbers pn
      LEFT JOIN voice_agents va ON pn.id = va.phone_number_id
      WHERE pn.workspace_id = ?
      ORDER BY pn.created_at DESC
    `).bind(workspaceId).all();

    return c.json({
      phone_numbers: phoneNumbers.results,
    });
  } catch (error) {
    console.error('List phone numbers error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching phone numbers',
    }, 500);
  }
});

// GET /:workspaceId/phone-numbers/available - Search for available phone numbers
phoneNumbersRoutes.get('/:workspaceId/phone-numbers/available', requireWorkspaceAccess, async (c) => {
  try {
    const workspaceId = c.req.param('workspaceId');
    const { area_code, country = 'US', provider = 'twilio' } = c.req.query();

    // Validate workspace exists
    const workspace = await c.env.DB.prepare(
      'SELECT id FROM workspaces WHERE id = ?'
    ).bind(workspaceId).first();

    if (!workspace) {
      return c.json({
        error: 'Not Found',
        message: 'Workspace not found',
      }, 404);
    }

    // Validate provider
    const validProviders = ['twilio', 'telnyx'];
    if (!validProviders.includes(provider)) {
      return c.json({
        error: 'Validation Error',
        message: 'Invalid provider. Must be one of: twilio, telnyx',
      }, 400);
    }

    // TODO: In production, this would make actual API calls to Twilio/Telnyx
    // For now, return mock data
    const mockNumbers = [
      {
        phone_number: `+1${area_code || '415'}5551001`,
        provider,
        friendly_name: `${country} Number`,
        region: area_code || 'CA',
        capabilities: ['voice', 'sms'],
      },
      {
        phone_number: `+1${area_code || '415'}5551002`,
        provider,
        friendly_name: `${country} Number`,
        region: area_code || 'CA',
        capabilities: ['voice', 'sms'],
      },
      {
        phone_number: `+1${area_code || '415'}5551003`,
        provider,
        friendly_name: `${country} Number`,
        region: area_code || 'CA',
        capabilities: ['voice', 'sms'],
      },
    ];

    return c.json({
      available_numbers: mockNumbers,
      provider,
      country,
      area_code: area_code || null,
    });
  } catch (error) {
    console.error('Search available numbers error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred while searching for available numbers',
    }, 500);
  }
});

// POST /:workspaceId/phone-numbers - Purchase/provision a phone number
phoneNumbersRoutes.post('/:workspaceId/phone-numbers', requireWorkspaceAccess, requireWorkspaceRole('owner', 'admin'), async (c) => {
  try {
    const workspaceId = c.req.param('workspaceId');
    const { phone_number, provider, friendly_name } = await c.req.json();

    // Validate required fields
    if (!phone_number || !provider) {
      return c.json({
        error: 'Validation Error',
        message: 'phone_number and provider are required',
      }, 400);
    }

    // Validate provider
    const validProviders = ['twilio', 'telnyx'];
    if (!validProviders.includes(provider)) {
      return c.json({
        error: 'Validation Error',
        message: 'Invalid provider. Must be one of: twilio, telnyx',
      }, 400);
    }

    // Validate phone number format (basic E.164 validation)
    if (!phone_number.match(/^\+[1-9]\d{1,14}$/)) {
      return c.json({
        error: 'Validation Error',
        message: 'Phone number must be in E.164 format (e.g., +14155551234)',
      }, 400);
    }

    // Check if phone number already exists
    const existing = await c.env.DB.prepare(
      'SELECT id FROM phone_numbers WHERE phone_number = ?'
    ).bind(phone_number).first();

    if (existing) {
      return c.json({
        error: 'Conflict',
        message: 'This phone number is already in use',
      }, 409);
    }

    // TODO: In production, this would make actual API call to Twilio/Telnyx to purchase the number
    // For now, we'll just create the database record

    const phoneNumberId = generateId('phn');
    const now = Date.now();

    // Generate mock provider SID
    const providerSid = `${provider === 'twilio' ? 'PN' : 'TN'}${Math.random().toString(36).substring(2, 15)}`;

    await c.env.DB.prepare(`
      INSERT INTO phone_numbers
      (id, workspace_id, phone_number, provider, provider_sid, friendly_name, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'active', ?)
    `).bind(
      phoneNumberId,
      workspaceId,
      phone_number,
      provider,
      providerSid,
      friendly_name || phone_number,
      now
    ).run();

    return c.json({
      phone_number: {
        id: phoneNumberId,
        workspace_id: workspaceId,
        phone_number,
        provider,
        provider_sid: providerSid,
        friendly_name: friendly_name || phone_number,
        status: 'active',
        created_at: now,
      },
    }, 201);
  } catch (error) {
    console.error('Purchase phone number error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred while purchasing the phone number',
    }, 500);
  }
});

// PUT /:workspaceId/phone-numbers/:phoneNumberId - Update phone number
phoneNumbersRoutes.put('/:workspaceId/phone-numbers/:phoneNumberId', requireWorkspaceAccess, requireWorkspaceRole('owner', 'admin'), async (c) => {
  try {
    const workspaceId = c.req.param('workspaceId');
    const phoneNumberId = c.req.param('phoneNumberId');
    const { friendly_name, status } = await c.req.json();

    // Verify phone number exists in workspace
    const phoneNumber = await c.env.DB.prepare(
      'SELECT id FROM phone_numbers WHERE id = ? AND workspace_id = ?'
    ).bind(phoneNumberId, workspaceId).first();

    if (!phoneNumber) {
      return c.json({
        error: 'Not Found',
        message: 'Phone number not found',
      }, 404);
    }

    // Build update query dynamically
    const updates = [];
    const bindings = [];

    if (friendly_name !== undefined) {
      updates.push('friendly_name = ?');
      bindings.push(friendly_name);
    }

    if (status !== undefined) {
      // Validate status
      const validStatuses = ['active', 'inactive', 'porting'];
      if (!validStatuses.includes(status)) {
        return c.json({
          error: 'Validation Error',
          message: 'Invalid status. Must be one of: active, inactive, porting',
        }, 400);
      }
      updates.push('status = ?');
      bindings.push(status);
    }

    if (updates.length === 0) {
      return c.json({
        error: 'Validation Error',
        message: 'At least one field (friendly_name or status) must be provided',
      }, 400);
    }

    bindings.push(phoneNumberId);
    bindings.push(workspaceId);

    await c.env.DB.prepare(
      `UPDATE phone_numbers SET ${updates.join(', ')} WHERE id = ? AND workspace_id = ?`
    ).bind(...bindings).run();

    return c.json({
      message: 'Phone number updated successfully',
    });
  } catch (error) {
    console.error('Update phone number error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred while updating the phone number',
    }, 500);
  }
});

// DELETE /:workspaceId/phone-numbers/:phoneNumberId - Release/delete phone number
phoneNumbersRoutes.delete('/:workspaceId/phone-numbers/:phoneNumberId', requireWorkspaceAccess, requireWorkspaceRole('owner', 'admin'), async (c) => {
  try {
    const workspaceId = c.req.param('workspaceId');
    const phoneNumberId = c.req.param('phoneNumberId');

    // Verify phone number exists
    const phoneNumber = await c.env.DB.prepare(
      'SELECT id, phone_number, provider FROM phone_numbers WHERE id = ? AND workspace_id = ?'
    ).bind(phoneNumberId, workspaceId).first();

    if (!phoneNumber) {
      return c.json({
        error: 'Not Found',
        message: 'Phone number not found',
      }, 404);
    }

    // Check if phone number is assigned to any agents
    const assignedAgent = await c.env.DB.prepare(
      'SELECT id, name FROM voice_agents WHERE phone_number_id = ? AND workspace_id = ?'
    ).bind(phoneNumberId, workspaceId).first();

    if (assignedAgent) {
      return c.json({
        error: 'Conflict',
        message: `Cannot delete phone number. It is currently assigned to agent "${assignedAgent.name}". Please unassign it first.`,
      }, 409);
    }

    // TODO: In production, this would make actual API call to Twilio/Telnyx to release the number

    // Delete phone number
    await c.env.DB.prepare(
      'DELETE FROM phone_numbers WHERE id = ? AND workspace_id = ?'
    ).bind(phoneNumberId, workspaceId).run();

    return c.json({
      message: 'Phone number released successfully',
    });
  } catch (error) {
    console.error('Delete phone number error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred while releasing the phone number',
    }, 500);
  }
});

export default phoneNumbersRoutes;
