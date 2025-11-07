// Test response types
export interface LoginResponse {
  token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
  workspaces?: Array<{
    id: string;
    name: string;
    role: string;
  }>;
}

export interface WorkspaceResponse {
  workspace: {
    id: string;
    name: string;
    industry?: string;
    status: string;
    subscription_tier: string;
    trial_ends_at?: number;
    timezone?: string;
    created_at: number;
  };
  members?: Array<{
    user_id: string;
    email: string;
    role: string;
  }>;
  subscription?: {
    tier: string;
    status: string;
  };
}

export interface WorkspacesListResponse {
  workspaces: Array<{
    id: string;
    name: string;
    role: string;
    status: string;
  }>;
}

export interface MembersListResponse {
  members: Array<{
    user_id: string;
    email: string;
    name?: string;
    role: string;
    joined_at: number;
  }>;
}

export interface ErrorResponse {
  error: string;
  message?: string;
  details?: any;
}

export interface SuccessResponse {
  message: string;
}

export interface AdminAuthResponse {
  token: string;
  refresh_token: string;
  admin: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface AdminMeResponse {
  admin: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface AdminLogoutResponse {
  message: string;
}
