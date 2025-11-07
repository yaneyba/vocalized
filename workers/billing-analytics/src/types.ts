// Database record types
export interface BillingPeriod {
  id: string;
  workspace_id: string;
  period_start: number;
  period_end: number;
  subtotal: number;
  subscription_fee: number;
  total_amount: number;
  status: 'current' | 'finalized' | 'paid';
  created_at: number;
  finalized_at?: number;
}

export interface UsageRecord {
  id: string;
  workspace_id: string;
  call_id?: string;
  resource_type: string;
  provider: string;
  quantity: number;
  unit_cost: number;
  total_cost: number;
  markup_percentage: number;
  final_cost: number;
  billing_period_id: string;
  created_at: number;
}

export interface WorkspaceBillingSettings {
  workspace_id: string;
  stripe_customer_id?: string;
  payment_method_id?: string;
  billing_email?: string;
  usage_limit_monthly?: number;
  auto_recharge_enabled: boolean;
  auto_recharge_threshold?: number;
  auto_recharge_amount?: number;
  created_at: number;
  updated_at: number;
}

export interface PlatformSetting {
  key: string;
  value: string;
  description?: string;
  updated_at: number;
}

export interface Call {
  id: string;
  workspace_id: string;
  agent_id: string;
  phone_number_id: string;
  direction: 'inbound' | 'outbound';
  from_number: string;
  to_number: string;
  status: 'initiated' | 'ringing' | 'in-progress' | 'completed' | 'failed' | 'busy' | 'no-answer' | 'cancelled';
  duration_seconds?: number;
  started_at: number;
  ended_at?: number;
  recording_url?: string;
  transcript?: string;
  created_at: number;
}

// Analytics aggregation types
export interface CallStats {
  total_calls: number;
  total_minutes: number;
  avg_duration: number;
  completed_calls: number;
}
