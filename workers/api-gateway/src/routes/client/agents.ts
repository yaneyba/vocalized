import { Hono } from 'hono';
import type { Env } from '@/types/env';
import { authenticate, requireWorkspaceAccess, requireWorkspaceRole } from '@/middleware/auth';
import { generateId } from '@/utils/crypto';

const agentsRoutes = new Hono<{ Bindings: Env }>();

// Apply authentication to all routes
agentsRoutes.use('*', authenticate);

// GET /:workspaceId/agents - List all agents in workspace
agentsRoutes.get('/:workspaceId/agents', requireWorkspaceAccess, async (c) => {
  try {
    const workspaceId = c.req.param('workspaceId');

    const agents = await c.env.DB.prepare(`
      SELECT
        va.id, va.name, va.phone_number_id, va.template_id,
        va.voice_provider, va.status, va.created_at, va.updated_at, va.activated_at,
        pn.phone_number, pn.friendly_name as phone_friendly_name,
        at.name as template_name
      FROM voice_agents va
      LEFT JOIN phone_numbers pn ON va.phone_number_id = pn.id
      LEFT JOIN agent_templates at ON va.template_id = at.id
      WHERE va.workspace_id = ?
      ORDER BY va.created_at DESC
    `).bind(workspaceId).all();

    return c.json({
      agents: agents.results,
    });
  } catch (error) {
    console.error('List agents error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching agents',
    }, 500);
  }
});

// POST /:workspaceId/agents - Create a new agent
agentsRoutes.post('/:workspaceId/agents', requireWorkspaceAccess, requireWorkspaceRole('owner', 'admin', 'member'), async (c) => {
  try {
    const workspaceId = c.req.param('workspaceId');
    const { name, phone_number_id, template_id, config, voice_provider, voice_config } = await c.req.json();

    // Validate required fields
    if (!name || !config || !voice_provider || !voice_config) {
      return c.json({
        error: 'Validation Error',
        message: 'name, config, voice_provider, and voice_config are required',
      }, 400);
    }

    // Validate voice provider
    const validProviders = ['elevenlabs', 'vapi', 'retell'];
    if (!validProviders.includes(voice_provider)) {
      return c.json({
        error: 'Validation Error',
        message: 'Invalid voice_provider. Must be one of: elevenlabs, vapi, retell',
      }, 400);
    }

    // If phone_number_id is provided, verify it belongs to this workspace
    if (phone_number_id) {
      const phoneNumber = await c.env.DB.prepare(
        'SELECT id FROM phone_numbers WHERE id = ? AND workspace_id = ?'
      ).bind(phone_number_id, workspaceId).first();

      if (!phoneNumber) {
        return c.json({
          error: 'Not Found',
          message: 'Phone number not found or does not belong to this workspace',
        }, 404);
      }
    }

    // If template_id is provided, verify it exists
    if (template_id) {
      const template = await c.env.DB.prepare(
        'SELECT id FROM agent_templates WHERE id = ? AND is_public = 1'
      ).bind(template_id).first();

      if (!template) {
        return c.json({
          error: 'Not Found',
          message: 'Template not found or is not public',
        }, 404);
      }
    }

    const agentId = generateId('agt');
    const now = Date.now();

    await c.env.DB.prepare(`
      INSERT INTO voice_agents
      (id, workspace_id, phone_number_id, name, template_id, config, voice_provider, voice_config, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?)
    `).bind(
      agentId,
      workspaceId,
      phone_number_id || null,
      name,
      template_id || null,
      typeof config === 'string' ? config : JSON.stringify(config),
      voice_provider,
      typeof voice_config === 'string' ? voice_config : JSON.stringify(voice_config),
      now,
      now
    ).run();

    return c.json({
      agent: {
        id: agentId,
        workspace_id: workspaceId,
        phone_number_id: phone_number_id || null,
        name,
        template_id: template_id || null,
        config,
        voice_provider,
        voice_config,
        status: 'draft',
        created_at: now,
        updated_at: now,
      },
    }, 201);
  } catch (error) {
    console.error('Create agent error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred while creating the agent',
    }, 500);
  }
});

// GET /:workspaceId/agents/:agentId - Get agent details
agentsRoutes.get('/:workspaceId/agents/:agentId', requireWorkspaceAccess, async (c) => {
  try {
    const workspaceId = c.req.param('workspaceId');
    const agentId = c.req.param('agentId');

    const agent = await c.env.DB.prepare(`
      SELECT
        va.*,
        pn.phone_number, pn.friendly_name as phone_friendly_name,
        at.name as template_name, at.description as template_description
      FROM voice_agents va
      LEFT JOIN phone_numbers pn ON va.phone_number_id = pn.id
      LEFT JOIN agent_templates at ON va.template_id = at.id
      WHERE va.id = ? AND va.workspace_id = ?
    `).bind(agentId, workspaceId).first();

    if (!agent) {
      return c.json({
        error: 'Not Found',
        message: 'Agent not found',
      }, 404);
    }

    // Parse JSON fields
    const agentData = {
      ...agent,
      config: agent.config ? JSON.parse(agent.config as string) : null,
      voice_config: agent.voice_config ? JSON.parse(agent.voice_config as string) : null,
    };

    return c.json({
      agent: agentData,
    });
  } catch (error) {
    console.error('Get agent error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching agent details',
    }, 500);
  }
});

// PUT /:workspaceId/agents/:agentId - Update agent
agentsRoutes.put('/:workspaceId/agents/:agentId', requireWorkspaceAccess, requireWorkspaceRole('owner', 'admin', 'member'), async (c) => {
  try {
    const workspaceId = c.req.param('workspaceId');
    const agentId = c.req.param('agentId');
    const { name, phone_number_id, config, voice_provider, voice_config } = await c.req.json();

    // Verify agent exists in workspace
    const existingAgent = await c.env.DB.prepare(
      'SELECT id, status FROM voice_agents WHERE id = ? AND workspace_id = ?'
    ).bind(agentId, workspaceId).first();

    if (!existingAgent) {
      return c.json({
        error: 'Not Found',
        message: 'Agent not found',
      }, 404);
    }

    // Build update query dynamically
    const updates = [];
    const bindings = [];

    if (name !== undefined) {
      updates.push('name = ?');
      bindings.push(name);
    }

    if (phone_number_id !== undefined) {
      // If phone_number_id is provided and not null, verify it belongs to this workspace
      if (phone_number_id !== null) {
        const phoneNumber = await c.env.DB.prepare(
          'SELECT id FROM phone_numbers WHERE id = ? AND workspace_id = ?'
        ).bind(phone_number_id, workspaceId).first();

        if (!phoneNumber) {
          return c.json({
            error: 'Not Found',
            message: 'Phone number not found or does not belong to this workspace',
          }, 404);
        }
      }
      updates.push('phone_number_id = ?');
      bindings.push(phone_number_id);
    }

    if (config !== undefined) {
      updates.push('config = ?');
      bindings.push(typeof config === 'string' ? config : JSON.stringify(config));
    }

    if (voice_provider !== undefined) {
      const validProviders = ['elevenlabs', 'vapi', 'retell'];
      if (!validProviders.includes(voice_provider)) {
        return c.json({
          error: 'Validation Error',
          message: 'Invalid voice_provider. Must be one of: elevenlabs, vapi, retell',
        }, 400);
      }
      updates.push('voice_provider = ?');
      bindings.push(voice_provider);
    }

    if (voice_config !== undefined) {
      updates.push('voice_config = ?');
      bindings.push(typeof voice_config === 'string' ? voice_config : JSON.stringify(voice_config));
    }

    if (updates.length === 0) {
      return c.json({
        error: 'Validation Error',
        message: 'At least one field must be provided for update',
      }, 400);
    }

    updates.push('updated_at = ?');
    bindings.push(Date.now());
    bindings.push(agentId);
    bindings.push(workspaceId);

    await c.env.DB.prepare(
      `UPDATE voice_agents SET ${updates.join(', ')} WHERE id = ? AND workspace_id = ?`
    ).bind(...bindings).run();

    return c.json({
      message: 'Agent updated successfully',
    });
  } catch (error) {
    console.error('Update agent error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred while updating the agent',
    }, 500);
  }
});

// DELETE /:workspaceId/agents/:agentId - Delete agent
agentsRoutes.delete('/:workspaceId/agents/:agentId', requireWorkspaceAccess, requireWorkspaceRole('owner', 'admin', 'member'), async (c) => {
  try {
    const workspaceId = c.req.param('workspaceId');
    const agentId = c.req.param('agentId');

    // Verify agent exists
    const agent = await c.env.DB.prepare(
      'SELECT id FROM voice_agents WHERE id = ? AND workspace_id = ?'
    ).bind(agentId, workspaceId).first();

    if (!agent) {
      return c.json({
        error: 'Not Found',
        message: 'Agent not found',
      }, 404);
    }

    // Delete agent
    await c.env.DB.prepare(
      'DELETE FROM voice_agents WHERE id = ? AND workspace_id = ?'
    ).bind(agentId, workspaceId).run();

    return c.json({
      message: 'Agent deleted successfully',
    });
  } catch (error) {
    console.error('Delete agent error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred while deleting the agent',
    }, 500);
  }
});

// POST /:workspaceId/agents/:agentId/activate - Activate/go live with agent
agentsRoutes.post('/:workspaceId/agents/:agentId/activate', requireWorkspaceAccess, requireWorkspaceRole('owner', 'admin', 'member'), async (c) => {
  try {
    const workspaceId = c.req.param('workspaceId');
    const agentId = c.req.param('agentId');

    // Verify agent exists
    const agent = await c.env.DB.prepare(
      'SELECT id, status, phone_number_id FROM voice_agents WHERE id = ? AND workspace_id = ?'
    ).bind(agentId, workspaceId).first();

    if (!agent) {
      return c.json({
        error: 'Not Found',
        message: 'Agent not found',
      }, 404);
    }

    // Verify agent has a phone number assigned
    if (!agent.phone_number_id) {
      return c.json({
        error: 'Validation Error',
        message: 'Agent must have a phone number assigned before activation',
      }, 400);
    }

    const now = Date.now();

    // Update status to live and set activated_at
    await c.env.DB.prepare(
      'UPDATE voice_agents SET status = ?, activated_at = ?, updated_at = ? WHERE id = ? AND workspace_id = ?'
    ).bind('live', now, now, agentId, workspaceId).run();

    return c.json({
      message: 'Agent activated successfully',
      status: 'live',
      activated_at: now,
    });
  } catch (error) {
    console.error('Activate agent error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred while activating the agent',
    }, 500);
  }
});

// POST /:workspaceId/agents/:agentId/pause - Pause agent
agentsRoutes.post('/:workspaceId/agents/:agentId/pause', requireWorkspaceAccess, requireWorkspaceRole('owner', 'admin', 'member'), async (c) => {
  try {
    const workspaceId = c.req.param('workspaceId');
    const agentId = c.req.param('agentId');

    // Verify agent exists
    const agent = await c.env.DB.prepare(
      'SELECT id, status FROM voice_agents WHERE id = ? AND workspace_id = ?'
    ).bind(agentId, workspaceId).first();

    if (!agent) {
      return c.json({
        error: 'Not Found',
        message: 'Agent not found',
      }, 404);
    }

    // Update status to paused
    await c.env.DB.prepare(
      'UPDATE voice_agents SET status = ?, updated_at = ? WHERE id = ? AND workspace_id = ?'
    ).bind('paused', Date.now(), agentId, workspaceId).run();

    return c.json({
      message: 'Agent paused successfully',
      status: 'paused',
    });
  } catch (error) {
    console.error('Pause agent error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred while pausing the agent',
    }, 500);
  }
});

// POST /:workspaceId/agents/:agentId/test - Test agent (set to testing mode)
agentsRoutes.post('/:workspaceId/agents/:agentId/test', requireWorkspaceAccess, requireWorkspaceRole('owner', 'admin', 'member'), async (c) => {
  try {
    const workspaceId = c.req.param('workspaceId');
    const agentId = c.req.param('agentId');

    // Verify agent exists
    const agent = await c.env.DB.prepare(
      'SELECT id, status FROM voice_agents WHERE id = ? AND workspace_id = ?'
    ).bind(agentId, workspaceId).first();

    if (!agent) {
      return c.json({
        error: 'Not Found',
        message: 'Agent not found',
      }, 404);
    }

    // Update status to testing
    await c.env.DB.prepare(
      'UPDATE voice_agents SET status = ?, updated_at = ? WHERE id = ? AND workspace_id = ?'
    ).bind('testing', Date.now(), agentId, workspaceId).run();

    return c.json({
      message: 'Agent set to testing mode successfully',
      status: 'testing',
    });
  } catch (error) {
    console.error('Test agent error:', error);
    return c.json({
      error: 'Internal Server Error',
      message: 'An error occurred while setting agent to testing mode',
    }, 500);
  }
});

export default agentsRoutes;
