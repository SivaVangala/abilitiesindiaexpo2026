@echo off
rem Builds the Abilities India Expo site (Version B) and starts it without Visual Studio, then opens it in the browser.
rem Close this window to stop the site.
cd /d "%~dp0"
node build\build.js
cd /d "%~dp0host\AbilitiesIndiaExpo.Web"
start "" http://localhost:5321
dotnet run --launch-profile http
pause
