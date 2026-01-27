@echo off
echo Testing build for Vercel deployment...
echo.

echo Installing dependencies...
call npm install

echo.
echo Building application...
call npm run build

echo.
if %ERRORLEVEL% EQU 0 (
    echo ✅ Build successful! Ready for Vercel deployment.
    echo.
    echo Next steps:
    echo 1. Push your code to GitHub/GitLab/Bitbucket
    echo 2. Connect your repository to Vercel
    echo 3. Configure environment variables in Vercel dashboard
    echo 4. Deploy!
    echo.
    echo See DEPLOYMENT.md for detailed instructions.
) else (
    echo ❌ Build failed. Please check the errors above.
)

pause