# CDN daemon



### Goals

* Image proxy. Retrieves image from a remote URL or IPFS CID then forwads the data to the user
* Image resizer. Resizes an already existing image to a smaller image and/or different format. Returns the raw image or a cached version on IPFS.
* Provide an `/ipfs/` endpoint which is first forwarded through the CDN middleware then to `go-ipfs`
* Block illegal or banned files from being served through the CDN endpoint. Ensure files against blocklist are never served or stored. Currently there is no way to prevent IPFS from serving disallowed files.
* Cache DHT queries of tracked files. Maintain a list of "partners" - the peers storing the content most relevant to the daemon. If daemon can tell IPFS to fetch from this list of nodes.
* Provide a DHT query endpoint for remote nodes to query the DHT cache.

Note: Some of the above goals might not end up in the final version. Instead, they could be diverted to another section of the project.

#### CDN middleware


### Considerations

Multi-threads. Since this project is primarily going to be written in NodeJS, we need to keep in consideration NodeJS is single threaded. A single nodejs process can provide plenty of throughput for a small application and is fairly efficiency in transfering large amounts of data without a lot of processing inbetween. Afterall entire website backends have been made in nodejs, and more are popping up. Most of the heavy lifting will be put on Mongodb & go-ipfs. We can also optimize by using in memory caching of mongodb queries. However, at scale with potentially thousands to 10s of thousand requests coming through, a single thread will not suffice. There are two ways we can go about solving this. One being running multiple servers load balancing between each server. This is a fine option assuming each server is very small in size and the operator has a lot of them. In most cases this will not be practical for a single operator. For the network, multiple servers will be crucial in reducing the load on any given server. The 2nd more practical option would be starting multiple nodejs processes. An nginx reverse proxy will load balance between each process.
