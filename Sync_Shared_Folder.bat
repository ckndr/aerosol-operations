@echo off
setlocal
title Alpha Aerosols - Shared OneDrive MRP & Job Cards Sync
echo ===============================================================================
echo   ALPHA AEROSOLS (KOT ABDUL MALIK) - SHARED FOLDER SYNCHRONIZATION
echo   Target: C:\Users\HP\OneDrive\Aerosol Shared Files\QMS Documentation\AER-SORs\Planing SORs
echo ===============================================================================
echo.

python "%~dp0sync_shared_mrp.py" %*
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Synchronization encountered an issue (Code %ERRORLEVEL%).
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ===============================================================================
echo   SYNCHRONIZATION COMPLETED SUCCESSFULLY!
echo ===============================================================================
pause
