@echo off
REM MonsterMaker Dashboard - Windows Deployment Script
REM Following Luke's Verified Vercel Deployment Playbook

echo.
echo MonsterMaker Dashboard Deployment
echo ====================================
echo Following your verified deployment method
echo.

REM Check if we're in the right directory
if not exist package.json (
    echo Error: package.json not found
    echo Please run this script from the monstermaker-dashboard directory
    pause
    exit /b 1
)

REM Deploy using your verified method
echo Deploying to Vercel using your token...
echo.
echo Team: Luke's projects
echo Token: nETtsXJd2vwPZEYruRBnxQmG
echo.

REM Run the exact deployment command from your playbook
npx vercel --prod --token nETtsXJd2vwPZEYruRBnxQmG

if errorlevel 1 (
    echo.
    echo Deployment failed
    echo Check the error messages above
    pause
    exit /b 1
) else (
    echo.
    echo ====================================
    echo Deployment successful!
    echo ====================================
    echo.
    echo Your dashboard is now live!
    echo Check the URL above to access it.
    echo.
    pause
)
