#!/bin/bash
# Database setup script for Vocalized Platform
# This script creates the D1 database and applies all migrations

set -e

echo "🗄️  Setting up Vocalized Database..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Error: wrangler CLI is not installed"
    echo "Install it with: npm install -g wrangler"
    exit 1
fi

# Database name
DB_NAME="vocalized-db"

# Create D1 database
echo ""
echo "📦 Creating D1 database: $DB_NAME"
wrangler d1 create $DB_NAME || echo "Database may already exist"

echo ""
echo "⚠️  IMPORTANT: Update wrangler.toml files with your database ID"
echo "   The database ID will be shown above ☝️"
echo ""
read -p "Press Enter when you've updated wrangler.toml files, or Ctrl+C to exit..."

# Apply migrations
echo ""
echo "🔄 Applying migrations..."

MIGRATIONS=(
    "0001_platform_admins.sql"
    "0002_client_users_workspaces.sql"
    "0003_phone_numbers_agents.sql"
    "0004_voice_ai_gateway.sql"
    "0005_integrations.sql"
    "0006_calls.sql"
    "0007_usage_billing.sql"
    "0008_platform_settings.sql"
    "0009_seed_data.sql"
)

for migration in "${MIGRATIONS[@]}"; do
    echo "  ↳ Applying: $migration"
    wrangler d1 execute $DB_NAME --local --file="./migrations/$migration"
done

echo ""
echo "✅ Database setup complete!"
echo ""
echo "Next steps:"
echo "  1. Update all wrangler.toml files with your database ID"
echo "  2. Run: cd ../workers/api-gateway && npm run dev"
echo "  3. Test API: curl http://localhost:8787/health"
