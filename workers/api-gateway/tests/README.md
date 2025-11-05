# API Gateway Tests

Comprehensive test suite for the Vocalized API Gateway using Vitest.

## 📁 Test Structure

```
tests/
├── helpers/
│   └── mock-env.ts          # Mock database and environment utilities
├── admin/
│   └── auth.test.ts         # Admin authentication tests (9 tests)
└── client/
    ├── auth.test.ts         # Client authentication tests (12 tests)
    └── workspaces.test.ts   # Workspace management tests (18 tests)
```

## 🚀 Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Specific Test File
```bash
npm test auth.test.ts
```

### Run Tests for Specific Feature
```bash
npm test -- --grep "Admin Authentication"
```

## 📊 Test Coverage

### Current Status (39 tests)

- ✅ **Admin Authentication** (9 tests)
  - Login with valid/invalid credentials
  - Get current admin details
  - Logout functionality
  - Token refresh mechanism

- ✅ **Client Authentication** (12 tests)
  - User signup with validation
  - Login with credentials
  - Get current user + workspaces
  - Logout
  - Password reset flow
  - Email verification

- ✅ **Workspace Management** (18 tests)
  - Create workspaces
  - List user workspaces
  - Get workspace details
  - Update workspace settings
  - Delete workspaces
  - Manage workspace members
  - Update/remove members
  - Role validation

### Pending Tests

- ⏳ Voice Agents (TODO)
- ⏳ Phone Numbers (TODO)
- ⏳ Calls Management (TODO)
- ⏳ Billing & Analytics (TODO)

## 🧪 Test Utilities

### Mock Environment

The `mock-env.ts` helper provides:

- **MockD1Database**: In-memory database for testing
- **MockKVNamespace**: In-memory KV store
- **seedTestData()**: Pre-populate test data
- **createMockEnv()**: Create isolated test environment

Example usage:

```typescript
import { createMockEnv, seedTestData } from './helpers/mock-env';

let env: Env;

beforeEach(() => {
  env = createMockEnv();
  seedTestData(env);
});
```

### Test Data

Default seeded data includes:

**Admin:**
- Email: `admin@vocalized.test`
- Password: `password`
- Role: `super_admin`

**Client User:**
- Email: `user@test.com`
- Password: `password`
- Has 1 workspace

**Workspace:**
- ID: `workspace-1`
- Name: `Test Workspace`
- Owner: `user-1`
- Tier: `professional`

## 📝 Writing New Tests

### Basic Test Structure

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import app from '../../src/index';
import { createMockEnv, seedTestData } from '../helpers/mock-env';
import type { Env } from '../../src/types/env';

describe('Feature Name', () => {
  let env: Env;

  beforeEach(() => {
    env = createMockEnv();
    seedTestData(env);
  });

  describe('POST /endpoint', () => {
    it('should do something', async () => {
      const res = await app.request(
        '/endpoint',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: 'test' }),
        },
        env
      );

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('result');
    });
  });
});
```

### Testing Authenticated Endpoints

```typescript
// Get token first
const loginRes = await app.request('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@test.com',
    password: 'password',
  }),
}, env);

const { token } = await loginRes.json();

// Use token in request
const res = await app.request('/protected-endpoint', {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${token}`,
  },
}, env);
```

## 🎯 Testing Best Practices

### 1. Test Isolation
- Each test should be independent
- Use `beforeEach` to reset state
- Don't rely on test execution order

### 2. Descriptive Names
```typescript
// ✅ Good
it('should return 401 when token is missing')

// ❌ Bad
it('test login')
```

### 3. Test Edge Cases
- Missing required fields
- Invalid data types
- Boundary conditions
- Error scenarios

### 4. Check Response Structure
```typescript
expect(data).toHaveProperty('token');
expect(data.user).toMatchObject({
  email: 'user@test.com',
  name: 'Test User',
});
```

### 5. Test Error Messages
```typescript
const data = await res.json();
expect(data.error).toBe('Validation Error');
expect(data.message).toContain('required');
```

## 🔄 Continuous Integration

Tests run automatically on:
- Pull requests
- Pushes to main branch
- Pre-deployment checks

### GitHub Actions Example
```yaml
- name: Run tests
  run: |
    cd workers/api-gateway
    npm install
    npm test
```

## 📈 Coverage Goals

| Component | Current | Goal |
|-----------|---------|------|
| Authentication | 95% | 95% |
| Workspaces | 90% | 95% |
| Routes | 85% | 90% |
| Middleware | 80% | 90% |
| Utils | 95% | 95% |
| **Overall** | **85%** | **90%** |

## 🐛 Debugging Tests

### Run Single Test
```bash
npm test -- --reporter=verbose auth.test.ts
```

### View Detailed Output
```bash
npm test -- --reporter=verbose
```

### Debug with VSCode
Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Vitest",
  "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
  "args": ["run"],
  "console": "integratedTerminal"
}
```

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Hono Testing Guide](https://hono.dev/docs/guides/testing)
- [Cloudflare Workers Testing](https://developers.cloudflare.com/workers/testing/)

## ✅ Checklist for New Features

When implementing a new feature, ensure:

- [ ] Unit tests for business logic
- [ ] Integration tests for API endpoints
- [ ] Tests for success cases
- [ ] Tests for error cases
- [ ] Tests for authentication/authorization
- [ ] Tests for input validation
- [ ] Update this README if needed

---

**Last Updated**: 2025-11-05
**Total Tests**: 39
**Coverage**: ~85%
