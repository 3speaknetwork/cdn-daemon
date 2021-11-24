apt update
apt install git docker docker-compose

git clone https://github.com/3speaknetwork/cdn-daemon

cd cdn-daemon

docker-compose build
./init-letsencrypt

docker-compose up -d 

