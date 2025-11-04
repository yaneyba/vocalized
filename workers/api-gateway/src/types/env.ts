// Cloudflare Workers Environment Types

export interface Env {
  // D1 Database
  DB: D1Database;

  // Environment Variables
  ENVIRONMENT: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;

  // Optional: KV Namespace for sessions
  SESSIONS?: KVNamespace;

  // Optional: R2 Bucket for recordings
  RECORDINGS?: R2Bucket;
}

// JWT Payload Types
export interface JWTPayload {
  sub: string; // User/Admin ID
  email: string;
  type: 'admin' | 'client';
  role?: string; // For admins: super_admin, admin, support
  workspaceId?: string; // For clients in workspace context
  iat?: number;
  exp?: number;
}

// Context Types
export interface AuthContext {
  userId: string;
  email: string;
  type: 'admin' | 'client';
  role?: string;
  workspaceId?: string;
}
