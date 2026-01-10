@echo off
REM Configurar JAVA_HOME para el proyecto Android
setx JAVA_HOME "C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot"
setx PATH "%PATH%;C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot\bin"

echo.
echo ========================================
echo JAVA_HOME configurado correctamente!
echo ========================================
echo.
echo JAVA_HOME = C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot
echo.
echo IMPORTANTE: Cierra y vuelve a abrir tu terminal para que los cambios surtan efecto.
echo.
echo Para verificar, ejecuta: java -version
echo.
pause
