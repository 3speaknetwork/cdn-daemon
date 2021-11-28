
echo -e "\u001b[33m######## Beginning Install ##########\u001b[0m"

sleep 2;

apt update
apt install -y git docker docker-compose

git clone https://github.com/3speaknetwork/cdn-daemon

cd cdn-daemon

docker-compose build
chmod +x ./init-letsencrypt.sh

docker-compose down #safety precaution

docker-compose up -d 

docker exec -i -t spk-cdn-node npx ts-node ./scripts/setup.ts

./init-letsencrypt.sh

hostname=`cat './data/creds-live/hostname'`
echo -e "\u001b[33m##################################"
echo -e  "\u001b[33m##### Installation Complete ######"
echo -e "\u001b[33m########### Thank You ############"
echo -e "\u001b[33m##################################"

echo -e "\u001b[31mHostname: \u001b[35m $hostname"

echo -e "\u001b[0mThe above is the domain name of your node. This is where you can access the ipfs gateway, image proxy, etc."

echo -e "Please make a copy of your keys located in \u001b[35m./data/creds-live/keys\u001b[0m"

echo -e "NOTE: do not execute this script unless you are installing from scratch."
echo -e "\u001b[33m##################################"
echo -e "\u001b[0m"