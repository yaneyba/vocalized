// Database Record Types
// These match the SQL schema from PLANS.md

// Platform Admins
export interface PlatformAdmin {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: 'super_admin' | 'admin' | 'support';
  is_active: number;
  created_at: number;
  updated_at: number;
  last_login: number | null;
}

export interface AdminActivityLog {
  id: string;
  admin_id: string;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  details: string | null;
  ip_address: string | null;
  timestamp: number;
}

// Client Users
export interface ClientUser {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  is_active: number;
  email_verified: number;
  created_at: number;
  updated_at: number;
  last_login: number | null;
}

// Workspaces
export interface Workspace {
  id: string;
  name: string;
  industry: string | null;
  owner_id: string;
  status: 'active' | 'trial' | 'suspended' | 'cancelled';
  subscription_tier: 'starter' | 'professional' | 'enterprise';
  trial_ends_at: number | null;
  timezone: string;
  created_at: number;
  updated_at: number;
}

export interface WorkspaceMember {
  workspace_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  invited_by: string | null;
  joined_at: number;
}

// Phone Numbers
export interface PhoneNumber {
  id: string;
  workspace_id: string;
  phone_number: string;
  provider: string;
  provider_sid: string | null;
  friendly_name: string | null;
  status: 'active' | 'inactive' | 'porting';
  created_at: number;
}

// Agent Templates
export interface AgentTemplate {
  id: string;
  name: string;
  industry: string;
  description: string | null;
  default_config: string;
  is_public: number;
  created_by_admin_id: string | null;
  created_at: number;
  updated_at: number;
}

// Voice Agents
export interface VoiceAgent {
  id: string;
  workspace_id: string;
  phone_number_id: string | null;
  name: string;
  template_id: string | null;
  config: string;
  voice_provider: string;
  voice_config: string;
  status: 'draft' | 'testing' | 'live' | 'paused';
  created_at: number;
  updated_at: number;
  activated_at: number | null;
}

// Provider Configs
export interface PlatformProviderConfig {
  provider: string;
  api_key_encrypted: string;
  config: string | null;
  priority: number;
  is_enabled: number;
  cost_per_unit: number | null;
  created_at: number;
  updated_at: number;
}

export interface WorkspaceProviderConfig {
  id: string;
  workspace_id: string;
  provider: string;
  uses_platform_key: number;
  api_key_encrypted: string | null;
  config: string | null;
  is_enabled: number;
  created_at: number;
  updated_at: number;
}

export interface WorkspaceProviderStrategy {
  workspace_id: string;
  strategy: 'auto' | 'cost_optimized' | 'quality_first' | 'specific' | 'custom';
  config: string | null;
  fallback_enabled: number;
  updated_at: number;
}

export interface ProviderHealthStatus {
  provider: string;
  region: string;
  status: 'healthy' | 'degraded' | 'down';
  last_check: number;
  error_rate: number;
  avg_latency: number | null;
  details: string | null;
}

// Integrations
export interface WorkspaceIntegration {
  id: string;
  workspace_id: string;
  integration_type: string;
  name: string;
  status: 'pending' | 'connected' | 'error' | 'disconnected';
  auth_type: string;
  credentials_encrypted: string | null;
  config: string | null;
  last_sync_at: number | null;
  last_sync_status: string | null;
  created_at: number;
  updated_at: number;
}

export interface IntegrationSyncLog {
  id: string;
  integration_id: string;
  sync_type: string;
  status: 'started' | 'completed' | 'failed';
  records_synced: number;
  error_message: string | null;
  started_at: number;
  completed_at: number | null;
}

// Calls
export interface Call {
  id: string;
  workspace_id: string;
  agent_id: string;
  phone_number_id: string;
  caller_number: string;
  caller_name: string | null;
  direction: 'inbound' | 'outbound';
  status: 'queued' | 'ringing' | 'in-progress' | 'completed' | 'failed' | 'busy' | 'no-answer';
  provider_call_sid: string | null;
  voice_provider_used: string;
  duration_seconds: number | null;
  recording_url: string | null;
  transcription: string | null;
  summary: string | null;
  sentiment: string | null;
  metadata: string | null;
  cost_total: number | null;
  started_at: number;
  ended_at: number | null;
}

export interface CallEvent {
  id: string;
  call_id: string;
  event_type: string;
  event_data: string | null;
  timestamp: number;
}

// Usage & Billing
export interface UsageRecord {
  id: string;
  workspace_id: string;
  call_id: string | null;
  resource_type: string;
  provider: string;
  quantity: number;
  unit_cost: number;
  total_cost: number;
  markup_percentage: number;
  final_cost: number;
  billing_period_id: string | null;
  created_at: number;
}

export interface BillingPeriod {
  id: string;
  workspace_id: string;
  period_start: number;
  period_end: number;
  subtotal: number;
  subscription_fee: number;
  total_amount: number;
  status: 'current' | 'finalized' | 'paid' | 'overdue';
  stripe_invoice_id: string | null;
  paid_at: number | null;
  created_at: number;
}

export interface WorkspaceBillingSetting {
  workspace_id: string;
  usage_limit_monthly: number | null;
  alert_threshold_percentage: number;
  auto_pause_on_limit: number;
  payment_method_id: string | null;
  billing_email: string | null;
  updated_at: number;
}

// Platform Settings
export interface PlatformSetting {
  key: string;
  value: string;
  description: string | null;
  updated_by_admin_id: string | null;
  updated_at: number;
}

export interface SubscriptionTier {
  tier_name: string;
  display_name: string;
  monthly_fee: number;
  included_minutes: number | null;
  price_per_minute: number;
  max_agents: number | null;
  max_phone_numbers: number | null;
  features: string;
  is_active: number;
  created_at: number;
  updated_at: number;
}
