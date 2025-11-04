#!/bin/bash
# Deploy a single worker to Cloudflare

WORKER=$1

if [ -z "$WORKER" ]; then
    echo "Usage: ./deploy-worker.sh <worker-name>"
    echo ""
    echo "Available workers:"
    echo "  - api-gateway"
    echo "  - billing-analytics"
    echo "  - voice-gateway (not yet implemented)"
    echo "  - call-management (not yet implemented)"
    echo "  - integration-hub (not yet implemented)"
    exit 1
fi

WORKER_DIR="../workers/$WORKER"

if [ ! -d "$WORKER_DIR" ]; then
    echo "❌ Error: Worker '$WORKER' not found in workers/ directory"
    exit 1
fi

echo "🚀 Deploying $WORKER..."
cd "$WORKER_DIR"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "  ↳ Installing dependencies..."
    npm install
fi

# Build if build script exists
if grep -q "\"build\"" package.json; then
    echo "  ↳ Building..."
    npm run build
fi

# Deploy
echo "  ↳ Deploying to Cloudflare..."
wrangler deploy

echo "✅ $WORKER deployed successfully!"
