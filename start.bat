@echo off
echo starting LAN server...
start "Node Server" cmd /k "node server.js"
timeout /t 2 >nul
start "UI Script" cmd /k "ui.bat"
echo Server sucsesfully booted up!