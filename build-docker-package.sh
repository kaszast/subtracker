#!/bin/bash
set -e

echo "Building Docker image..."
docker build -t subscription-manager:latest .

echo "Creating release directory..."
rm -rf docker-release
mkdir -p docker-release/data

echo "Creating docker-compose.yml for release..."
cat << 'DC' > docker-release/docker-compose.yml
services:
  subscription-manager:
    image: subscription-manager:latest
    container_name: subscription_manager
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - subdata:/app/data
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DATABASE_PATH=/app/data/subscriptions.db

volumes:
  subdata:
    driver: local
DC

echo "Saving Docker image to tar..."
docker save subscription-manager:latest -o docker-release/image.tar

echo "Creating startup scripts..."
cat << 'RUN' > docker-release/start.sh
#!/bin/bash
echo "Loading Docker image..."
docker load -i image.tar
echo "Starting containers..."
docker-compose up -d
echo "SubTracker is running at http://localhost:3000"
RUN
chmod +x docker-release/start.sh

cat << 'RUNWIN' > docker-release/start.bat
@echo off
echo Loading Docker image...
docker load -i image.tar
echo Starting containers...
docker-compose up -d
echo SubTracker is running at http://localhost:3000
RUNWIN

echo "Packaging to subtracker-docker-release.tar.gz..."
tar -czf subtracker-docker-release.tar.gz docker-release
rm -rf docker-release

echo "Done! Package is ready."
