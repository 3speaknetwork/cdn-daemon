echo "Deploying changes..."
# Pull changes from the live branch
git pull

# Build the image with the new changes
docker build . -t spk-cdn-node

docker commit spk-cdn-node_data
# Shut down the existing containers
docker-compose down

# Start the new containers
docker-compose up -d  --remove-orphans
echo "Deployed!"