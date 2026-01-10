@echo off
echo ========================================
echo   DESPLEGAR REGLAS DE FIRESTORE
echo ========================================
echo.
echo Este script desplegara las nuevas reglas de Firestore
echo para que los clientes se guarden correctamente.
echo.
pause

cd /d "%~dp0"

echo.
echo Desplegando reglas de Firestore...
echo.

firebase deploy --only firestore:rules

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   EXITO! Reglas desplegadas
    echo ========================================
    echo.
    echo Ahora puedes:
    echo 1. Registrar cuentas nuevas
    echo 2. Los clientes se guardaran permanentemente
    echo 3. Iniciar sesion como Admin para verlos todos
    echo.
) else (
    echo.
    echo ========================================
    echo   ERROR al desplegar
    echo ========================================
    echo.
    echo Opciones:
    echo 1. Asegurate de tener Firebase CLI instalado
    echo 2. Ejecuta: npm install -g firebase-tools
    echo 3. Ejecuta: firebase login
    echo 4. O usa Firebase Console manualmente
    echo.
    echo Ver DEPLOY_FIRESTORE_RULES.md para mas opciones
    echo.
)

pause
