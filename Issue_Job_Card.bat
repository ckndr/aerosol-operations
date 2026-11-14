@echo off
setlocal
title Alpha Aerosols - Production Job Card Issuance
echo ===============================================================================
echo   ALPHA AEROSOLS (KOT ABDUL MALIK) - PRODUCTION JOB CARD ISSUANCE
echo   Zero Windows COM Automation - Pure Python Execution
echo ===============================================================================
echo.
python "%~dp0issue_job_card.py" %*
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Job Card issuance failed with error code %ERRORLEVEL%.
    pause
    exit /b %ERRORLEVEL%
)
echo.
echo ===============================================================================
echo   JOB CARD ISSUANCE COMPLETED SUCCESSFULLY!
echo ===============================================================================
pause
