# Migration Guide - New Project Structure

**Date**: 2025-11-04
**Purpose**: Guide for migrating to the new structure following the deployment pattern

---

## 🎯 What Changed

The project has been restructured to match the official deployment pattern specified in [plans/8. DEPLOYMENT & CONFIGURATION.md](plans/8.%20DEPLOYMENT%20%26%20CONFIGURATION.md).

### Old Structure → New Structure

```
OLD:                                    NEW:
workspace/vocalized-api/           →   workers/api-gateway/
workspace/vocalized-billing/       →   workers/billing-analytics/
workspace/vocalized/               →   frontend/client-portal/
workspace/vocalized-admin/         →   frontend/admin-portal/
workspace/docs/                    →   docs/
```

---

## ✅ Completed Migrations

1. ✅ **API Gateway** moved to `workers/api-gateway/`
2. ✅ **Billing & Analytics** moved to `workers/billing-analytics/`
3. ✅ **Database migrations** moved to `database/migrations/`
4. ✅ **Documentation** moved to `docs/`
5. ✅ **Deployment scripts** created in `scripts/`

---

## 📝 Update Your Local Environment

### 1. Update Git Remote Paths

If you have any bookmarks or scripts pointing to old paths, update them:

```bash
# Old paths
cd workspace/vocalized-api

# New paths
cd workers/api-gateway
```

### 2. Update Import Paths (if needed)

The internal structure within each worker remains the same, so imports should work without changes.

### 3. Update Development Commands

**Old commands:**
```bash
cd workspace/vocalized-api
npm run dev
```

**New commands:**
```bash
cd workers/api-gateway
npm run dev
```

### 4. Update wrangler.toml References

Database references in `wrangler.toml` files now point to shared D1 database:

```toml
[[d1_databases]]
binding = "DB"
database_name = "vocalized-db"
database_id = "your-database-id-here"  # Update this!
```

---

## 🔄 For CI/CD Pipelines

Update any CI/CD configurations to use new paths:

**GitHub Actions example:**
```yaml
# OLD
- name: Deploy API
  run: |
    cd workspace/vocalized-api
    npm run deploy

# NEW
- name: Deploy API
  run: |
    cd workers/api-gateway
    npm run deploy
```

---

## 📦 Workspace Configuration

The root `package.json` workspace configuration should be updated:

**Old:**
```json
{
  "workspaces": [
    "workspace/vocalized",
    "workspace/vocalized-admin",
    "workspace/vocalized-api"
  ]
}
```

**New:**
```json
{
  "workspaces": [
    "frontend/client-portal",
    "frontend/admin-portal",
    "workers/api-gateway",
    "workers/billing-analytics"
  ]
}
```

---

## 🗑️ Cleanup Old Structure

Once you've verified everything works, you can remove the old `workspace/` directory:

```bash
# Backup first (optional)
tar -czf workspace-backup-$(date +%Y%m%d).tar.gz workspace/

# Then remove
rm -rf workspace/
```

---

## 🧪 Verification Checklist

Test these to ensure migration was successful:

- [ ] API Gateway starts: `cd workers/api-gateway && npm run dev`
- [ ] Billing Worker starts: `cd workers/billing-analytics && npm run dev`
- [ ] Database migrations work: `cd database && ./setup.sh`
- [ ] Client Portal starts: `npm run dev --workspace client-portal`
- [ ] Admin Portal starts: `npm run dev --workspace admin-portal`
- [ ] Health check works: `curl http://localhost:8787/health`
- [ ] Authentication works: Test login/signup endpoints
- [ ] Deployment works: `cd scripts && ./deploy-worker.sh api-gateway`

---

## 📊 Benefits of New Structure

### 1. **Follows Best Practices**
- Matches Cloudflare Workers microservices pattern
- Clear separation between workers and frontend
- Industry-standard project layout

### 2. **Better Organization**
- Workers grouped in `workers/`
- Frontend apps in `frontend/`
- Database files in `database/`
- Scripts centralized in `scripts/`

### 3. **Easier Deployment**
- Each worker independently deployable
- Automated deployment scripts
- Consistent configuration across workers

### 4. **Scalability**
- Easy to add new workers
- Clear worker boundaries
- Independent versioning possible

---

## 🚨 Common Issues & Solutions

### Issue: "Cannot find module" errors

**Solution**: Reinstall dependencies in new location
```bash
cd workers/api-gateway
rm -rf node_modules package-lock.json
npm install
```

### Issue: Database not found

**Solution**: Update database ID in all `wrangler.toml` files
```bash
# Run database setup
cd database
./setup.sh

# Copy the database ID and update all wrangler.toml files
```

### Issue: Port already in use

**Solution**: Workers use different ports by default
```
API Gateway:         8787
Billing Analytics:   8788 (configure in wrangler.toml)
Voice Gateway:       8789
Call Management:     8790
Integration Hub:     8791
```

---

## 📞 Need Help?

- Check [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for detailed structure
- Review [IMPLEMENTATION_PROGRESS.md](IMPLEMENTATION_PROGRESS.md) for status
- See [plans/8. DEPLOYMENT & CONFIGURATION.md](plans/8.%20DEPLOYMENT%20%26%20CONFIGURATION.md) for original spec

---

**Migration Completed**: 2025-11-04
**Old Structure**: Can be removed after verification
**New Structure**: Follows official deployment pattern
