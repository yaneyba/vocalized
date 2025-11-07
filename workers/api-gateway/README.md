# Vocalized API

Cloudflare Workers API for the Vocalized Voice AI Platform.

## Tech Stack

- **Runtime**: Cloudflare Workers
- **Framework**: Hono
- **Database**: Cloudflare D1 (SQLite)
- **Language**: TypeScript

## Project Structure

```
src/
├── index.ts              # Main application entry point
├── routes/               # API route handlers
│   ├── admin/           # Admin API routes
│   └── client/          # Client API routes
├── middleware/          # Middleware (auth, errors, etc.)
├── db/                  # Database utilities
├── types/               # TypeScript type definitions
└── utils/               # Utility functions

schema/
└── migrations/          # SQL migration files
```

## Setup

1. **Install dependencies:**
   ```bash
   cd workspace/vocalized-api
   npm install
   ```

2. **Create D1 database:**
   ```bash
   npm run db:create
   ```

   Copy the database ID from the output and add it to `wrangler.toml`.

3. **Run migrations:**
   ```bash
   npm run db:migrate:local  # For local development
   npm run db:migrate        # For remote database
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start local development server
- `npm run deploy` - Deploy to production
- `npm run deploy:staging` - Deploy to staging
- `npm run db:create` - Create new D1 database
- `npm run db:migrate` - Run migrations on remote database
- `npm run db:migrate:local` - Run migrations locally
- `npm run db:console` - Open database console
- `npm run cf-typegen` - Generate Cloudflare types

## Environment Variables

Set in `wrangler.toml`:

- `ENVIRONMENT` - Environment name (development, staging, production)
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_EXPIRES_IN` - JWT token expiration (default: 7d)
- `JWT_REFRESH_EXPIRES_IN` - Refresh token expiration (default: 30d)

## API Endpoints

### Admin API (`/admin`)

- **Authentication**: `/admin/auth/*` ✅
- **Dashboard**: `/admin/dashboard/*` ✅
  - `GET /admin/dashboard/overview` - Platform metrics
  - `GET /admin/dashboard/revenue` - Revenue analytics
  - `GET /admin/dashboard/usage` - Usage statistics
- **Workspaces**: `/admin/workspaces/*` ⏳
- **Users**: `/admin/users/*` ⏳
- **Providers**: `/admin/providers/*` ⏳
- **Templates**: `/admin/templates/*` ⏳
- **Integrations**: `/admin/integrations/*` ⏳
- **Calls**: `/admin/calls/*` ⏳
- **Analytics**: `/admin/analytics/*` ⏳
- **Billing**: `/admin/billing/*` ⏳
- **Configuration**: `/admin/config/*` ⏳
- **Logs**: `/admin/logs/*` ⏳

### Client API (`/`)

- **Authentication**: `/auth/*` ✅
- **Workspaces**: `/workspaces/*` ✅
  - Full CRUD operations
  - Member management
  - Role-based access control
- **Voice Agents**: `/workspaces/:id/agents/*` ✅
  - 8 endpoints (list, create, update, delete, activate, pause, test)
- **Phone Numbers**: `/workspaces/:id/phone-numbers/*` ✅
  - 5 endpoints (list, search available, provision, update, delete)
- **Calls**: `/workspaces/:id/calls/*` ✅
  - 6 endpoints (list, live, details, recording, transcription, outbound)
- **Templates**: `/templates/*` ⏳
- **Integrations**: `/workspaces/:id/integrations/*` ⏳
- **Analytics**: `/workspaces/:id/analytics/*` ⏳
- **Billing**: `/workspaces/:id/billing/*` ⏳
- **Webhooks**: `/webhooks/*` ⏳

## Development

### Local Testing

```bash
npm run dev
```

The API will be available at `http://localhost:8787`

### Database Queries

Use the D1 console to test queries:

```bash
npm run db:console:local -- --command "SELECT * FROM platform_admins"
```

### Deployment

Deploy to staging:
```bash
npm run deploy:staging
```

Deploy to production:
```bash
npm run deploy:production
```

## Database Schema

The database schema is defined in `schema/migrations/`. See the migrations folder for details on all 22 tables:

- Platform Admins (2 tables)
- Client Users (1 table)
- Workspaces (2 tables)
- Phone Numbers (1 table)
- Agent Templates (1 table)
- Voice Agents (1 table)
- Voice AI Gateway (4 tables)
- Integrations (2 tables)
- Calls (2 tables)
- Usage & Billing (4 tables)
- Platform Settings (2 tables)

## Authentication

The API uses JWT tokens for authentication:

- **Admin tokens**: Include `type: 'admin'` and `role` in payload
- **Client tokens**: Include `type: 'client'` and optional `workspaceId`

### Protected Routes

Use middleware to protect routes:

```typescript
import { authenticate, requireAdmin } from './middleware/auth';

// Require authentication
app.get('/protected', authenticate, (c) => { ... });

// Require admin access
app.get('/admin-only', authenticate, requireAdmin, (c) => { ... });
```

## Error Handling

The API uses custom error classes for consistent error responses:

```typescript
import { NotFoundError, ValidationError } from './middleware/errors';

throw new NotFoundError('User not found');
throw new ValidationError('Invalid email format');
```
