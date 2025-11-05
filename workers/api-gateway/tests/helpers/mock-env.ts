import type { Env } from '../../src/types/env';

/**
 * Mock D1 Database for testing
 */
export class MockD1Database implements D1Database {
  private data: Map<string, any[]> = new Map();

  prepare(query: string) {
    const self = this;
    return {
      bind(...values: any[]) {
        return {
          async first() {
            // Simple mock - return first item from appropriate table
            if (query.includes('platform_admins')) {
              const admins = self.data.get('platform_admins') || [];
              return admins[0] || null;
            }
            if (query.includes('client_users')) {
              const users = self.data.get('client_users') || [];
              return users[0] || null;
            }
            if (query.includes('workspaces')) {
              const workspaces = self.data.get('workspaces') || [];
              return workspaces[0] || null;
            }
            if (query.includes('workspace_members')) {
              const members = self.data.get('workspace_members') || [];
              return members[0] || null;
            }
            return null;
          },
          async all() {
            // Return all items from appropriate table
            if (query.includes('workspace_members')) {
              const members = self.data.get('workspace_members') || [];
              return { results: members };
            }
            if (query.includes('workspaces')) {
              const workspaces = self.data.get('workspaces') || [];
              return { results: workspaces };
            }
            return { results: [] };
          },
          async run() {
            // Mock INSERT/UPDATE/DELETE
            return { success: true, meta: {} };
          },
        };
      },
      async first() {
        return this.bind().first();
      },
      async all() {
        return this.bind().all();
      },
      async run() {
        return this.bind().run();
      },
    };
  }

  async dump() {
    return new ArrayBuffer(0);
  }

  async batch(statements: any[]) {
    return statements.map(() => ({ success: true, meta: {} }));
  }

  async exec(query: string) {
    return { count: 0, duration: 0 };
  }

  // Helper methods for testing
  seed(table: string, data: any[]) {
    this.data.set(table, data);
  }

  clear() {
    this.data.clear();
  }
}

/**
 * Mock KV Namespace for testing
 */
export class MockKVNamespace implements KVNamespace {
  private data: Map<string, string> = new Map();

  async get(key: string): Promise<string | null> {
    return this.data.get(key) || null;
  }

  async put(key: string, value: string): Promise<void> {
    this.data.set(key, value);
  }

  async delete(key: string): Promise<void> {
    this.data.delete(key);
  }

  async list(): Promise<any> {
    return { keys: Array.from(this.data.keys()).map(name => ({ name })) };
  }

  async getWithMetadata(key: string): Promise<any> {
    return { value: this.data.get(key) || null, metadata: null };
  }

  // Helper for testing
  clear() {
    this.data.clear();
  }
}

/**
 * Create a mock environment for testing
 */
export function createMockEnv(): Env {
  return {
    DB: new MockD1Database() as any,
    KV: new MockKVNamespace() as any,
    JWT_SECRET: 'test-secret-key-for-testing-only',
    ENVIRONMENT: 'test',
  };
}

/**
 * Seed the mock database with test data
 */
export function seedTestData(env: Env) {
  const db = env.DB as any as MockD1Database;

  // Seed admin
  db.seed('platform_admins', [
    {
      id: 'admin-1',
      email: 'admin@vocalized.test',
      name: 'Test Admin',
      password_hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', // 'password'
      role: 'super_admin',
      is_active: 1,
      created_at: Date.now(),
      updated_at: Date.now(),
    },
  ]);

  // Seed client users
  db.seed('client_users', [
    {
      id: 'user-1',
      email: 'user@test.com',
      name: 'Test User',
      password_hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', // 'password'
      is_active: 1,
      email_verified: 1,
      created_at: Date.now(),
      updated_at: Date.now(),
    },
  ]);

  // Seed workspaces
  db.seed('workspaces', [
    {
      id: 'workspace-1',
      name: 'Test Workspace',
      industry: 'dental',
      owner_id: 'user-1',
      status: 'active',
      subscription_tier: 'professional',
      timezone: 'UTC',
      created_at: Date.now(),
      updated_at: Date.now(),
    },
  ]);

  // Seed workspace members
  db.seed('workspace_members', [
    {
      workspace_id: 'workspace-1',
      user_id: 'user-1',
      role: 'owner',
      invited_by: 'user-1',
      joined_at: Date.now(),
    },
  ]);
}
