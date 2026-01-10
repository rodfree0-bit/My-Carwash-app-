# Script para desplegar funciones usando gcloud directamente
# Este script bypasea Firebase CLI y usa Google Cloud CLI

Write-Host "🚀 Desplegando Firebase Functions usando Google Cloud CLI..." -ForegroundColor Green

# Verificar si gcloud está instalado
$gcloudInstalled = Get-Command gcloud -ErrorAction SilentlyContinue

if (-not $gcloudInstalled) {
    Write-Host "❌ Google Cloud CLI no está instalado." -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor, instala Google Cloud CLI desde:" -ForegroundColor Yellow
    Write-Host "https://cloud.google.com/sdk/docs/install" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Después de instalarlo, ejecuta:" -ForegroundColor Yellow
    Write-Host "  gcloud auth login" -ForegroundColor Cyan
    Write-Host "  gcloud config set project my-carwashapp-e6aba" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

Write-Host "✅ Google Cloud CLI encontrado" -ForegroundColor Green

# Configurar proyecto
Write-Host "📋 Configurando proyecto..." -ForegroundColor Cyan
gcloud config set project my-carwashapp-e6aba

# Desplegar funciones
Write-Host ""
Write-Host "📦 Desplegando funciones..." -ForegroundColor Cyan
Write-Host ""

Set-Location functions

# Desplegar cada función
Write-Host "1/6 Desplegando onNewOrderCreated..." -ForegroundColor Yellow
gcloud functions deploy onNewOrderCreated `
    --gen2 `
    --runtime=nodejs18 `
    --region=us-central1 `
    --source=. `
    --entry-point=onNewOrderCreated `
    --trigger-event-filters="type=google.cloud.firestore.document.v1.created" `
    --trigger-event-filters="database=(default)" `
    --trigger-location=us-central1 `
    --trigger-event-filters-path-pattern="document=orders/{orderId}"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ onNewOrderCreated desplegada" -ForegroundColor Green
}
else {
    Write-Host "❌ Error desplegando onNewOrderCreated" -ForegroundColor Red
}

Write-Host ""
Write-Host "2/6 Desplegando onOrderStatusUpdated..." -ForegroundColor Yellow
gcloud functions deploy onOrderStatusUpdated `
    --gen2 `
    --runtime=nodejs18 `
    --region=us-central1 `
    --source=. `
    --entry-point=onOrderStatusUpdated `
    --trigger-event-filters="type=google.cloud.firestore.document.v1.updated" `
    --trigger-event-filters="database=(default)" `
    --trigger-location=us-central1 `
    --trigger-event-filters-path-pattern="document=orders/{orderId}"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ onOrderStatusUpdated desplegada" -ForegroundColor Green
}
else {
    Write-Host "❌ Error desplegando onOrderStatusUpdated" -ForegroundColor Red
}

Write-Host ""
Write-Host "3/6 Desplegando onNewIssueReported..." -ForegroundColor Yellow
gcloud functions deploy onNewIssueReported `
    --gen2 `
    --runtime=nodejs18 `
    --region=us-central1 `
    --source=. `
    --entry-point=onNewIssueReported `
    --trigger-event-filters="type=google.cloud.firestore.document.v1.created" `
    --trigger-event-filters="database=(default)" `
    --trigger-location=us-central1 `
    --trigger-event-filters-path-pattern="document=issues/{issueId}"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ onNewIssueReported desplegada" -ForegroundColor Green
}
else {
    Write-Host "❌ Error desplegando onNewIssueReported" -ForegroundColor Red
}

Write-Host ""
Write-Host "4/6 Desplegando onNewWasherApplication..." -ForegroundColor Yellow
gcloud functions deploy onNewWasherApplication `
    --gen2 `
    --runtime=nodejs18 `
    --region=us-central1 `
    --source=. `
    --entry-point=onNewWasherApplication `
    --trigger-event-filters="type=google.cloud.firestore.document.v1.created" `
    --trigger-event-filters="database=(default)" `
    --trigger-location=us-central1 `
    --trigger-event-filters-path-pattern="document=washer_applications/{applicationId}"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ onNewWasherApplication desplegada" -ForegroundColor Green
}
else {
    Write-Host "❌ Error desplegando onNewWasherApplication" -ForegroundColor Red
}

Write-Host ""
Write-Host "5/6 Desplegando onNewMessage..." -ForegroundColor Yellow
gcloud functions deploy onNewMessage `
    --gen2 `
    --runtime=nodejs18 `
    --region=us-central1 `
    --source=. `
    --entry-point=onNewMessage `
    --trigger-event-filters="type=google.cloud.firestore.document.v1.created" `
    --trigger-event-filters="database=(default)" `
    --trigger-location=us-central1 `
    --trigger-event-filters-path-pattern="document=messages/{messageId}"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ onNewMessage desplegada" -ForegroundColor Green
}
else {
    Write-Host "❌ Error desplegando onNewMessage" -ForegroundColor Red
}

Write-Host ""
Write-Host "6/6 Desplegando onWasherApproved..." -ForegroundColor Yellow
gcloud functions deploy onWasherApproved `
    --gen2 `
    --runtime=nodejs18 `
    --region=us-central1 `
    --source=. `
    --entry-point=onWasherApproved `
    --trigger-event-filters="type=google.cloud.firestore.document.v1.created" `
    --trigger-event-filters="database=(default)" `
    --trigger-location=us-central1 `
    --trigger-event-filters-path-pattern="document=approved_washers/{email}"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ onWasherApproved desplegada" -ForegroundColor Green
}
else {
    Write-Host "❌ Error desplegando onWasherApproved" -ForegroundColor Red
}

cd ..

Write-Host ""
Write-Host "🎉 Proceso completado!" -ForegroundColor Green
Write-Host ""
Write-Host "Verifica las funciones en:" -ForegroundColor Cyan
Write-Host "https://console.firebase.google.com/project/my-carwashapp-e6aba/functions" -ForegroundColor Blue
