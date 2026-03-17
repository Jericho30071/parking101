# Node.js Version Compatibility Solution

## Problem
You have Node.js v22.19.0, which is incompatible with Expo SDK 49.

## Solution Options

### Option 1: Use Node Version Manager (Recommended)
```bash
# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### Option 2: Downgrade Node.js
```bash
# Using nvs (Node Version Switcher)
npx nvs add 18
nvs use 18
```

### Option 3: Use Docker Container
```bash
# Run in Docker with compatible Node version
docker run --rm -it -v $(pwd):/app -p 3000:3000 node:18-alpine npm start
```

### Option 4: Update Project for Compatibility
Update app.json to use Expo SDK 50+ which supports Node.js v22

## Recommended Action
Use Option 1 (nvm) to install Node.js 18, then run:
```bash
nvm install 18 && nvm use 18
npm install
npx expo start
```

This will resolve the SDK compatibility issue.
