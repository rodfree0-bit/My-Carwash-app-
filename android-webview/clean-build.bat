@echo off
set "JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot"
set "PATH=%JAVA_HOME%\bin;%PATH%"
echo Stopping Gradle daemon...
call gradlew.bat --stop
echo Cleaning build...
call gradlew.bat clean
echo Done!
