#!/bin/bash
echo "🚀 Deploying Somnia Realm Wars with pnpm..."

# Test build
echo "📦 Testing build with pnpm..."
pnpm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful! Deploying..."
    npx vercel --prod
else
    echo "❌ Build failed! Check errors above."
    exit 1
fi