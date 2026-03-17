@echo off
echo Installing Node Version Manager (NVM)...
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh -o install.sh | bash
echo.
echo NVM installed successfully!
echo Installing Node.js 18...
nvm install 18
nvm use 18
echo Node.js 18 is now active!
echo.
echo Installing dependencies...
npm install
echo.
echo Starting Expo app...
npx expo start
