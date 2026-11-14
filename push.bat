@echo off
cd /d "%~dp0"
title Push to GitHub – Alpha Aerosols Operations Portal
color 0B

echo =======================================================
echo   Push to GitHub – Alpha Aerosols Operations Portal
echo   Live URL: https://ckndr.github.io/aerosol-operations/
echo   Repo:     https://github.com/ckndr/aerosol-operations
echo =======================================================
echo.

git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git not found in PATH.
    pause
    exit /b 1
)

set /p msg="Commit message (what changed): "
if "%msg%"=="" (
    echo ERROR: Message cannot be empty.
    pause
    exit /b 1
)

echo.
echo [1/3] Synchronizing finalized Master and Job Cards to Shared OneDrive...
python "%~dp0sync_shared_mrp.py" --push

echo.
echo [2/3] Staging changes in local Git repository...
git add .

echo Committing...
git commit -m "%msg%"

echo.
echo [3/3] Pushing to main and gh-pages...
git push origin main
git push origin main:gh-pages

echo.
echo =======================================================
echo   LIVE – Operations Portal updates in ~60 seconds
echo   https://ckndr.github.io/aerosol-operations/
echo   Shared Folder 100%% Synchronized on OneDrive!
echo =======================================================
echo.
pause
