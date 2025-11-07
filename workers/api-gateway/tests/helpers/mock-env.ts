import type { Env } from '@/types/env';

/**
 * Mock D1 Database for testing
 */
export class MockD1Database implements D1Database {
  private data: Map<string, any[]> = new Map();

  prepare(query: string): D1PreparedStatement {
    const self = this;
    return {
      bind(..._values: any[]) {
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
    } as D1PreparedStatement;
  }

  async dump() {
    return new ArrayBuffer(0);
  }

  async batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]> {
    return statements.map(() => ({ success: true, meta: {}, results: [] as T[] })) as D1Result<T>[];
  }

  async exec(_query: string): Promise<D1ExecResult> {
    return { count: 0, duration: 0 };
  }

  withSession(_constraintOrBookmark?: string): D1DatabaseSession {
    // Return a mock session that delegates to this database
    return {
      exec: this.exec.bind(this),
      prepare: this.prepare.bind(this),
      batch: this.batch.bind(this),
      dump: this.dump.bind(this),
      getBookmark: () => 'mock-bookmark',
    } as D1DatabaseSession;
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
export class MockKVNamespace {
  private data: Map<string, string> = new Map();

  async get(key: string, options?: Partial<KVNamespaceGetOptions<undefined>>): Promise<string | null>;
  async get(key: string, type: 'text'): Promise<string | null>;
  async get<ExpectedValue = unknown>(key: string, type: 'json'): Promise<ExpectedValue | null>;
  async get(key: string, type: 'arrayBuffer'): Promise<ArrayBuffer | null>;
  async get(key: string, type: 'stream'): Promise<ReadableStream | null>;
  async get(key: string, options?: any): Promise<any> {
    const value = this.data.get(key) || null;
    if (!value) return null;

    const typeOrOptions = options;
    if (typeof typeOrOptions === 'string') {
      if (typeOrOptions === 'json') return JSON.parse(value);
      if (typeOrOptions === 'arrayBuffer') return new TextEncoder().encode(value).buffer;
      if (typeOrOptions === 'stream') return new ReadableStream();
    }
    return value;
  }

  async put(key: string, value: string | ArrayBuffer | ArrayBufferView | ReadableStream, _options?: KVNamespacePutOptions): Promise<void> {
    if (typeof value === 'string') {
      this.data.set(key, value);
    } else {
      this.data.set(key, String(value));
    }
  }

  async delete(key: string): Promise<void> {
    this.data.delete(key);
  }

  async list(_options?: KVNamespaceListOptions): Promise<KVNamespaceListResult<unknown, string>> {
    return {
      keys: Array.from(this.data.keys()).map(name => ({ name })),
      list_complete: true,
      cacheStatus: null
    };
  }

  async getWithMetadata<Metadata = unknown>(
    key: string,
    options?: Partial<KVNamespaceGetOptions<undefined>>
  ): Promise<KVNamespaceGetWithMetadataResult<string, Metadata>>;
  async getWithMetadata<Metadata = unknown>(
    key: string,
    type: 'text'
  ): Promise<KVNamespaceGetWithMetadataResult<string, Metadata>>;
  async getWithMetadata<ExpectedValue = unknown, Metadata = unknown>(
    key: string,
    type: 'json'
  ): Promise<KVNamespaceGetWithMetadataResult<ExpectedValue, Metadata>>;
  async getWithMetadata<Metadata = unknown>(
    key: string,
    type: 'arrayBuffer'
  ): Promise<KVNamespaceGetWithMetadataResult<ArrayBuffer, Metadata>>;
  async getWithMetadata<Metadata = unknown>(
    key: string,
    type: 'stream'
  ): Promise<KVNamespaceGetWithMetadataResult<ReadableStream, Metadata>>;
  async getWithMetadata(key: string, _options?: any): Promise<any> {
    return {
      value: this.data.get(key) || null,
      metadata: null,
      cacheStatus: null
    };
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
    SESSIONS: new MockKVNamespace() as any,
    JWT_SECRET: 'test-secret-key-for-testing-only',
    JWT_EXPIRES_IN: '1h',
    JWT_REFRESH_EXPIRES_IN: '7d',
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
