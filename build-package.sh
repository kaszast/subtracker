#!/bin/bash
set -e

echo "Building Next.js app..."
npm run build

echo "Creating release directory..."
rm -rf release
mkdir -p release/subtracker/data

echo "Copying standalone output..."
cp -r .next/standalone/* release/subtracker/
cp -r public release/subtracker/public
mkdir -p release/subtracker/.next
cp -r .next/static release/subtracker/.next/static

echo "Creating startup scripts..."
cat << 'RUN' > release/subtracker/start.sh
#!/bin/bash
export NODE_ENV=production
export PORT=3000
export DATABASE_PATH="./data/subscriptions.db"

echo "Starting SubTracker on http://localhost:3000"
node server.js
RUN
chmod +x release/subtracker/start.sh

cat << 'RUNWIN' > release/subtracker/start.bat
@echo off
set NODE_ENV=production
set PORT=3000
set DATABASE_PATH=.\data\subscriptions.db

echo Starting SubTracker on http://localhost:3000
node server.js
RUNWIN

echo "Packaging to subtracker-release.tar.gz..."
cd release
tar -czf ../subtracker-release.tar.gz subtracker
cd ..
rm -rf release

echo "Done! You can deploy subtracker-release.tar.gz on any machine with Node.js installed."
