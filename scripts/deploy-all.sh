#!/bin/bash
# Deploy all workers to Cloudflare

set -e

echo "🚀 Deploying Vocalized Platform..."

# Array of workers to deploy
WORKERS=(
    "api-gateway"
    "billing-analytics"
)

# TODO: Add when implemented
# "voice-gateway"
# "call-management"
# "integration-hub"

for worker in "${WORKERS[@]}"; do
    echo ""
    echo "📦 Deploying $worker..."
    cd "../workers/$worker"

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

    echo "✅ $worker deployed"
    cd - > /dev/null
done

echo ""
echo "🎉 All workers deployed successfully!"
echo ""
echo "Workers deployed:"
for worker in "${WORKERS[@]}"; do
    echo "  ✅ $worker"
done
