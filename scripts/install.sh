apt update
apt install -y git docker docker-compose

git clone https://github.com/3speaknetwork/cdn-daemon

cd cdn-daemon

docker-compose build
docker exec -i -t spk-cdn-node npx ts-node ./scripts/setup.ts
chmod +x ./init-letsencrypt.sh
./init-letsencrypt.sh

docker commit spk-cdn-node_data
docker-compose down #safety precaution

docker-compose up -d 