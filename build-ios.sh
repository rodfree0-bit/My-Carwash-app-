#!/bin/bash

# Script para build y sincronizar iOS
# Uso: ./build-ios.sh

echo "🍎 Building iOS App..."
echo ""

# Paso 1: Build web app
echo "📦 Step 1/3: Building web app..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error building web app"
    exit 1
fi

echo "✅ Web app built successfully"
echo ""

# Paso 2: Sync to iOS
echo "🔄 Step 2/3: Syncing to iOS..."
npx cap sync ios

if [ $? -ne 0 ]; then
    echo "❌ Error syncing to iOS"
    exit 1
fi

echo "✅ Synced to iOS successfully"
echo ""

# Paso 3: Open Xcode
echo "🚀 Step 3/3: Opening Xcode..."
npx cap open ios

echo ""
echo "✅ Done! Xcode should open now."
echo ""
echo "Next steps:"
echo "1. Add GoogleService-Info.plist to Xcode"
echo "2. Configure Signing & Capabilities"
echo "3. Click Play (▶️) to run"
