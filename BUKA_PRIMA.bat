@echo off
title PRIMA+ Launcher
echo Menyalakan PRIMA+ ...
powershell -NoProfile -Command "$c = Get-NetTCPConnection -LocalPort 3100 -State Listen -ErrorAction SilentlyContinue; if (-not $c) { Start-Process node -ArgumentList 'node_modules/next/dist/bin/next','start','-p','3100' -WorkingDirectory 'D:\opsi2026\prima-web' -WindowStyle Hidden; Start-Sleep -Seconds 5 }"
start "" http://localhost:3100
echo Selesai. Browser akan terbuka di http://localhost:3100
timeout /t 3 >nul
