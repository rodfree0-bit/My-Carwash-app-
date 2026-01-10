@echo off
REM Script para build y sincronizar iOS en Windows
REM Uso: build-ios.bat

echo 🍎 Building iOS App...
echo.

REM Paso 1: Build web app
echo 📦 Step 1/3: Building web app...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error building web app
    exit /b 1
)

echo ✅ Web app built successfully
echo.

REM Paso 2: Sync to iOS
echo 🔄 Step 2/3: Syncing to iOS...
call npx cap sync ios

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error syncing to iOS
    exit /b 1
)

echo ✅ Synced to iOS successfully
echo.

echo ✅ Done!
echo.
echo Next steps (en macOS):
echo 1. npx cap open ios
echo 2. Add GoogleService-Info.plist to Xcode
echo 3. Configure Signing ^& Capabilities
echo 4. Click Play (▶️) to run
echo.
pause
