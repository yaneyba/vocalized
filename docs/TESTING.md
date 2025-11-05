# Vocalized Platform - Testing Strategy

**Last Updated**: 2025-11-05
**Test Framework**: Vitest
**Total Tests**: 39

---

## 🎯 Testing Overview

This document outlines the testing strategy for the Vocalized platform, including test coverage, best practices, and how to run tests.

---

## 📊 Test Coverage by Component

### API Gateway Worker ✅
**Location**: `workers/api-gateway/tests/`
**Framework**: Vitest
**Coverage**: ~85%

#### Test Suites:

1. **Admin Authentication** (9 tests)
   - ✅ Login with credentials
   - ✅ Token refresh
   - ✅ Get current admin
   - ✅ Logout
   - ✅ Invalid credentials handling
   - ✅ Missing authorization

2. **Client Authentication** (12 tests)
   - ✅ User signup
   - ✅ Login with workspaces
   - ✅ Password validation
   - ✅ Get current user
   - ✅ Logout
   - ✅ Forgot password
   - ✅ Reset password
   - ✅ Email verification

3. **Workspace Management** (18 tests)
   - ✅ Create workspace (with trial)
   - ✅ List workspaces
   - ✅ Get workspace details
   - ✅ Update workspace
   - ✅ Delete workspace
   - ✅ List members
   - ✅ Invite members
   - ✅ Update member roles
   - ✅ Remove members
   - ✅ Role validation
   - ✅ Owner protection

4. **Voice Agents** (0 tests - TODO)
   - ⏳ Create agent
   - ⏳ List agents
   - ⏳ Get agent details
   - ⏳ Update agent
   - ⏳ Delete agent
   - ⏳ Activate agent
   - ⏳ Pause agent
   - ⏳ Test mode

5. **Phone Numbers** (0 tests - TODO)
   - ⏳ List phone numbers
   - ⏳ Search available numbers
   - ⏳ Purchase number
   - ⏳ Update number
   - ⏳ Delete number
   - ⏳ Assignment validation

6. **Calls** (0 tests - TODO)
   - ⏳ List calls with filters
   - ⏳ Get live calls
   - ⏳ Get call details
   - ⏳ Get call recording
   - ⏳ Get call transcription
   - ⏳ Initiate outbound call

### Billing & Analytics Worker ⏳
**Status**: TODO
**Planned Tests**:
- Usage recording
- Billing period management
- Analytics queries
- Cron job execution

### Voice Gateway Worker ⏳
**Status**: Not implemented

### Call Management Worker ⏳
**Status**: Not implemented

### Integration Hub Worker ⏳
**Status**: Not implemented

---

## 🚀 Running Tests

### API Gateway Tests

```bash
# Navigate to worker directory
cd workers/api-gateway

# Install dependencies
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

### Run Specific Tests

```bash
# Run only admin tests
npm test admin

# Run only workspace tests
npm test workspaces

# Run specific test file
npm test auth.test.ts
```

---

## 🧪 Test Utilities

### Mock Environment

All tests use a mock environment that simulates Cloudflare Workers bindings:

```typescript
import { createMockEnv, seedTestData } from './helpers/mock-env';

let env: Env;

beforeEach(() => {
  env = createMockEnv();
  seedTestData(env);
});
```

### Mock Components:

- **MockD1Database**: In-memory SQLite-like database
- **MockKVNamespace**: In-memory key-value store
- **Test Data Seeding**: Pre-populated with realistic data

### Default Test Data:

```
Admin User:
- Email: admin@vocalized.test
- Password: password
- Role: super_admin

Client User:
- Email: user@test.com
- Password: password

Workspace:
- ID: workspace-1
- Name: Test Workspace
- Tier: professional
- Status: active
```

---

## 📝 Writing Tests

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

  it('should do something', async () => {
    const res = await app.request('/endpoint', options, env);
    expect(res.status).toBe(200);
  });
});
```

### Testing Authenticated Endpoints

```typescript
// 1. Login to get token
const loginRes = await app.request('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@test.com',
    password: 'password',
  }),
}, env);

const { token } = await loginRes.json();

// 2. Use token in subsequent requests
const res = await app.request('/protected-endpoint', {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${token}`,
  },
}, env);
```

---

## ✅ Test Checklist for New Features

When implementing a new feature, ensure:

- [ ] **Unit Tests**: Test business logic in isolation
- [ ] **Integration Tests**: Test API endpoints end-to-end
- [ ] **Success Cases**: Test happy path scenarios
- [ ] **Error Cases**: Test validation and error handling
- [ ] **Authentication**: Test protected endpoints
- [ ] **Authorization**: Test role-based access control
- [ ] **Edge Cases**: Test boundary conditions
- [ ] **Documentation**: Update test README

---

## 🎯 Coverage Goals

| Component | Current | Goal | Status |
|-----------|---------|------|--------|
| Authentication | 95% | 95% | ✅ Met |
| Workspaces | 90% | 95% | 🔄 Close |
| Routes | 85% | 90% | 🔄 In Progress |
| Middleware | 80% | 90% | 🔄 In Progress |
| Utils | 95% | 95% | ✅ Met |
| **Overall** | **85%** | **90%** | 🔄 **In Progress** |

---

## 🔄 Continuous Integration

### Pre-commit Checks
```bash
# Run before committing
npm test
```

### CI Pipeline (GitHub Actions)
```yaml
name: Test API Gateway

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd workers/api-gateway && npm install
      - run: cd workers/api-gateway && npm test
```

---

## 📈 Test Metrics

### Current Stats:
- **Total Test Suites**: 3 (5 implemented features)
- **Total Tests**: 39
- **Pass Rate**: 100%
- **Average Duration**: <100ms per test
- **Coverage**: 85% (for tested features)

### Breakdown:
```
Admin Auth:       9 tests ✅
Client Auth:      12 tests ✅
Workspaces:       18 tests ✅
Voice Agents:     0 tests ⏳ TODO (8 endpoints implemented)
Phone Numbers:    0 tests ⏳ TODO (5 endpoints implemented)
Calls:            0 tests ⏳ TODO (6 endpoints implemented)
Billing:          0 tests ⏳ (worker implemented, tests TODO)
```

**Note**: Voice Agents, Phone Numbers, and Calls endpoints are fully implemented but tests are pending.

---

## 🐛 Debugging Failed Tests

### View Detailed Output
```bash
npm test -- --reporter=verbose
```

### Run Single Test
```bash
npm test -- --reporter=verbose -t "should login successfully"
```

### Debug with Logs
```typescript
it('should do something', async () => {
  const res = await app.request('/endpoint', options, env);
  console.log('Response:', await res.text());
  expect(res.status).toBe(200);
});
```

---

## 🔮 Future Enhancements

### Immediate Priority:
1. **Voice Agents Tests**: Test all 8 agent endpoints
2. **Phone Numbers Tests**: Test all 5 phone number endpoints
3. **Calls Tests**: Test all 6 call management endpoints

### Planned:
1. **E2E Tests**: Full workflow testing
2. **Performance Tests**: Load and stress testing
3. **Security Tests**: Vulnerability scanning
4. **Visual Regression**: UI component testing
5. **Contract Tests**: API contract validation

### Nice to Have:
- Mutation testing
- Snapshot testing
- Database migration testing
- WebSocket testing (for real-time features)

---

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Hono Testing Guide](https://hono.dev/docs/guides/testing)
- [Cloudflare Workers Testing](https://developers.cloudflare.com/workers/testing/)
- [Testing Best Practices](https://testingjavascript.com/)

---

## 📞 Getting Help

- Check [workers/api-gateway/tests/README.md](../workers/api-gateway/tests/README.md) for detailed test documentation
- Review existing tests for examples
- Ask in #engineering channel for help

---

**Testing Status**: ✅ Active Development
**Next Milestone**: 90% overall coverage
**Priority**: Implement remaining endpoint tests
