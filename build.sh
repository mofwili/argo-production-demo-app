#!/bin/bash
set -e

echo "🔨 Building Book API Docker image..."
echo "====================================="

# Configuration
IMAGE_NAME="book-api"
DOCKER_USER="vatoscripts"
TAG="v1.0.0"

echo "Building: $DOCKER_USER/$IMAGE_NAME:$TAG"
echo ""

# Step 1: Build the image
echo "1. Building Docker image..."
docker build -t $DOCKER_USER/$IMAGE_NAME:$TAG .

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

echo ""

# Step 2: Test the image locally
echo "2. Testing the image..."
docker run -d --name test-container -p 3000:3000 $DOCKER_USER/$IMAGE_NAME:$TAG

echo "Waiting for container to start..."
sleep 5

echo "Testing health endpoint:"
curl -s http://localhost:3000/health | head -1
echo ""

echo "Testing API endpoint:"
curl -s http://localhost:3000/api/books | head -2
echo ""

# Stop and remove test container
docker stop test-container
docker rm test-container

echo "✅ Local test passed!"
echo ""

# Step 3: Tag as latest
echo "3. Tagging as latest..."
docker tag $DOCKER_USER/$IMAGE_NAME:$TAG $DOCKER_USER/$IMAGE_NAME:latest

echo ""
echo "🎉 BUILD COMPLETE!"
echo "=================="
echo "Images created:"
echo "  $DOCKER_USER/$IMAGE_NAME:$TAG"
echo "  $DOCKER_USER/$IMAGE_NAME:latest"
echo ""
echo "To push to Docker Hub:"
echo "  docker push $DOCKER_USER/$IMAGE_NAME:$TAG"
echo "  docker push $DOCKER_USER/$IMAGE_NAME:latest"
echo ""
echo "To run:"
echo "  docker run -d -p 3000:3000 $DOCKER_USER/$IMAGE_NAME:$TAG"
