# CDN daemon



### Installation (Linux)

Execute this in the desired installation directory. For example: `/opt`

```sh
bash <(curl -s https://raw.githubusercontent.com/3speaknetwork/cdn-daemon/main/scripts/install.sh)
```

### Goals

* Image proxy. Retrieves image from a remote URL or IPFS CID then forwads the data to the user
* Image resizer. Resizes an already existing image to a smaller image and/or different format. Returns the raw image or a cached version on IPFS.
* Provide an `/ipfs/` endpoint which is first forwarded through the CDN middleware then to `go-ipfs`
* Block illegal or banned files from being served through the CDN endpoint. Ensure files against blocklist are never served or stored. Currently there is no way to prevent IPFS from serving disallowed files.
* Cache DHT queries of tracked files. Maintain a list of "partners" - the peers storing the content most relevant to the daemon. If daemon can tell IPFS to fetch from this list of nodes.
* Provide a DHT query endpoint for remote nodes to query the DHT cache.

Note: Some of the above goals might not end up in the final version. Instead, they will be implemented in another part of the project.


### Install flow

1) ~~Download install.sh~~ (Done)
2) ~~./install.sh - installs git, and docker/docker-compose, then clones github repo + initializes cryptographic identity~~ (Done)
3) ~~docker-compose build - installs nginx, ipfs, mongodb, nodejs, letsencrypt then installs nodejs deps + compile build~~ (Done)
4) ~~./init-letsencrypt.sh - initializes let's encrypt certificate~~ (Done)
5) Installs systemd service
6) ~~docker-compose up~~
7) Fires up systemd service