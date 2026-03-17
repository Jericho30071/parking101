@echo off
echo Setting up Expo development environment...
echo.

echo Downloading NVM...
powershell -Command "& {curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh -OutFile install_nvm.ps1} | powershell -Command" -Title "Installing NVM" -WindowStyle Hidden

echo NVM installed successfully!

echo Installing Node.js 18...
powershell -Command "& {& 'install_nvm.ps1'}" -Title "Installing Node.js" -WindowStyle Hidden

echo Node.js 18 is now active!
powershell -Command "& {& 'nvm use 18'}" -Title "Setting Node Version" -WindowStyle Hidden

echo.
echo Installing dependencies...
powershell -Command "npm install" -Title "Installing Dependencies" -WindowStyle Hidden

echo Dependencies installed!
echo.
echo Starting Expo app...
powershell -Command "npx expo start" -Title "Starting Expo App" -WindowStyle Hidden

pause
