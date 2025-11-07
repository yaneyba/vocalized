-- ============================================
-- CALLS
-- All phone calls handled by the platform
-- ============================================

CREATE TABLE calls (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL,
    agent_id TEXT NOT NULL,
    phone_number_id TEXT NOT NULL,
    caller_number TEXT NOT NULL, -- E.164 format
    caller_name TEXT, -- If available from caller ID
    direction TEXT NOT NULL CHECK(direction IN ('inbound', 'outbound')),
    status TEXT NOT NULL CHECK(status IN ('queued', 'ringing', 'in-progress', 'completed', 'failed', 'busy', 'no-answer')),
    provider_call_sid TEXT, -- Twilio/Telnyx call ID
    voice_provider_used TEXT NOT NULL, -- Which AI provider handled this call
    duration_seconds INTEGER,
    recording_url TEXT, -- R2 URL
    transcription TEXT,
    summary TEXT, -- AI-generated call summary
    sentiment TEXT, -- positive, neutral, negative
    metadata TEXT, -- JSON: intent, extracted entities, custom fields
    cost_total REAL, -- Total cost for this call
    started_at INTEGER NOT NULL,
    ended_at INTEGER,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
    FOREIGN KEY (agent_id) REFERENCES voice_agents(id) ON DELETE CASCADE,
    FOREIGN KEY (phone_number_id) REFERENCES phone_numbers(id) ON DELETE CASCADE
);

CREATE INDEX idx_call_workspace ON calls(workspace_id);
CREATE INDEX idx_call_agent ON calls(agent_id);
CREATE INDEX idx_call_started ON calls(started_at);
CREATE INDEX idx_call_status ON calls(status);
CREATE INDEX idx_call_direction ON calls(direction);

-- Call Events (for real-time tracking)
CREATE TABLE call_events (
    id TEXT PRIMARY KEY,
    call_id TEXT NOT NULL,
    event_type TEXT NOT NULL, -- initiated, answered, transferred, ended, error
    event_data TEXT, -- JSON
    timestamp INTEGER NOT NULL,
    FOREIGN KEY (call_id) REFERENCES calls(id) ON DELETE CASCADE
);

CREATE INDEX idx_event_call ON call_events(call_id);
CREATE INDEX idx_event_timestamp ON call_events(timestamp);
