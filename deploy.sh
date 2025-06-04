#!/bin/bash

# Deployment script for Vercel
echo "🚀 Preparing for Vercel deployment..."

# Sync source files to root
echo "📋 Syncing source files to root directory..."
cp -r src/* .

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "✅ Ready for deployment!"
echo "Run 'vercel --prod' to deploy to production"
