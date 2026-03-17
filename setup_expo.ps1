Write-Host "Setting up Expo development environment..."

# Download and install NVM
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh" -OutFile "install_nvm.ps1" | powershell -Command

Write-Host "NVM installed successfully!"

# Install and use Node.js 18
& "install_nvm.ps1"
& nvm install 18
& nvm use 18

Write-Host "Node.js 18 is now active!"

# Install dependencies
Write-Host "Installing dependencies..."
& npm install

Write-Host "Dependencies installed!"

# Start Expo app
Write-Host "Starting Expo app..."
& npx expo start
