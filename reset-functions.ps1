Write-Host "🧹 Eliminando funciones fallidas anteriores..." -ForegroundColor Yellow

# Intentar eliminar las funciones para limpiar triggers incorrectos (us-central1 vs nam5)
# El flag --quiet evita que pida confirmacion

Write-Host "1/6 Eliminando onNewOrderCreated..."
gcloud functions delete onNewOrderCreated --region=us-central1 --gen2 --quiet

Write-Host "2/6 Eliminando onOrderStatusUpdated..."
gcloud functions delete onOrderStatusUpdated --region=us-central1 --gen2 --quiet

Write-Host "3/6 Eliminando onNewIssueReported..."
gcloud functions delete onNewIssueReported --region=us-central1 --gen2 --quiet

Write-Host "4/6 Eliminando onNewWasherApplication..."
gcloud functions delete onNewWasherApplication --region=us-central1 --gen2 --quiet

Write-Host "5/6 Eliminando onNewMessage..."
gcloud functions delete onNewMessage --region=us-central1 --gen2 --quiet

Write-Host "6/6 Eliminando onWasherApproved..."
gcloud functions delete onWasherApproved --region=us-central1 --gen2 --quiet

Write-Host ""
Write-Host "✅ Limpieza completada. Ahora puedes ejecutar .\deploy-functions.ps1 de nuevo." -ForegroundColor Green
