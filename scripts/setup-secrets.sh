#!/bin/bash
# Setup secrets for all Cloudflare Workers

set -e

echo "🔐 Setting up secrets for Vocalized workers..."
echo ""

# API Gateway secrets
echo "📦 API Gateway secrets:"
cd ../workers/api-gateway
echo "  Setting JWT_SECRET..."
wrangler secret put JWT_SECRET

# Billing & Analytics secrets
echo ""
echo "📦 Billing & Analytics secrets:"
cd ../billing-analytics
echo "  Setting STRIPE_SECRET_KEY..."
wrangler secret put STRIPE_SECRET_KEY
echo "  Setting STRIPE_WEBHOOK_SECRET..."
wrangler secret put STRIPE_WEBHOOK_SECRET

# TODO: Add when workers are implemented
# Voice Gateway
# echo ""
# echo "📦 Voice Gateway secrets:"
# cd ../voice-gateway
# wrangler secret put ELEVENLABS_API_KEY
# wrangler secret put DEEPGRAM_API_KEY
# wrangler secret put VAPI_API_KEY
# wrangler secret put RETELL_API_KEY

# Call Management
# echo ""
# echo "📦 Call Management secrets:"
# cd ../call-management
# wrangler secret put TWILIO_ACCOUNT_SID
# wrangler secret put TWILIO_AUTH_TOKEN

# Integration Hub
# echo ""
# echo "📦 Integration Hub secrets:"
# cd ../integration-hub
# wrangler secret put GOOGLE_CLIENT_ID
# wrangler secret put GOOGLE_CLIENT_SECRET
# wrangler secret put SALESFORCE_CLIENT_ID
# wrangler secret put SALESFORCE_CLIENT_SECRET
# wrangler secret put HUBSPOT_CLIENT_ID
# wrangler secret put HUBSPOT_CLIENT_SECRET

echo ""
echo "✅ Secrets setup complete!"
