import { CoreService } from "./core.service";
import NodeSchedule from 'node-schedule'
import { CID } from 'multiformats/cid'
import { Collection } from "mongodb";
import { DhtRecord, TrackedFile } from "./db.model";
import { logger } from "../common/logger.singleton";
import PQueue from "p-queue/dist";

export class TrackerService {
    self: CoreService;
    dhtRecords: Collection<DhtRecord>
    trackedFiles: Collection<TrackedFile>
    
    constructor(self) {
        this.self = self;

        this.refreshPins = this.refreshPins.bind(this)
    }

    
    async singleQuery(ipfsHash) {
        const CidInfo = CID.parse(ipfsHash)
        //console.log(CidInfo)
        for await (let dhtProv of this.self.ipfs.dht.findProvs(CidInfo, {timeout: 15000})) {
            const convert = CID.create(1, 0x00, CidInfo.multihash)
            const record = await this.dhtRecords.findOne({
                peer_id: dhtProv.id,
                ipfsHash: CidInfo.toString()
            })
            if(record) {
                logger.info(`Discovered existing DHT record: ${dhtProv.id} provides ${CidInfo.toString()}`)
                await this.dhtRecords.findOneAndUpdate(record, {
                    $set: {
                        last_pinged: new Date(),
                        last_updated: new Date()
                    }
                })
            } else {
                logger.info(`Discovered new DHT record: ${dhtProv.id} provides ${CidInfo.toString()}`)
                await this.dhtRecords.insertOne({
                    ipfsHash: CidInfo.toString(),
                    peer_id: dhtProv.id,
                    first_seen: new Date(),
                    last_pinged: new Date(),
                    last_updated: new Date()
                })
            }
            try {
                //const info = await this.self.ipfs.dht.findPeer(dhtProv.id)
                //console.log(JSON.parse(JSON.stringify(info)))

            } catch {

            }
        }
    }

    async queryConnect(ipfsHash) {
        const CidInfo = CID.parse(ipfsHash)
        const convert = CID.create(1, 0x00, CidInfo.multihash)
        
        for await(let item of this.dhtRecords.find({
            ipfsHash: CidInfo.toString()
        })) {
            void (async () => {
                logger.info(`Connecting to ${item.peer_id}`)
                try { 
                    await this.self.ipfs.swarm.connect(`/p2p/${item.peer_id}`)
                    logger.info(`Connection success: ${item.peer_id}`)
                } catch {
                    logger.info(`Connection failed: ${item.peer_id}`)
                }
            })()
        }
    }
    async refreshPins() {
        logger.info('Refreshing pins')
        const queue = new PQueue({concurrency: 1024})
        for await(let item of this.trackedFiles.find({

        }, {skip: 25 * 1000})) {
            queue.add(async() => {
                await this.singleQuery(item.ipfsHash)
            })
        }
        await queue.onIdle()
        logger.info('Refreshing pins complete')
    }
    async addPin(pinCid) {
        const record = await this.trackedFiles.findOne({
            ipfsHash: pinCid.toString()
        })
        if(!record) {
            logger.info(`Adding new pin: ${pinCid}`)
            await this.trackedFiles.insertOne({
                ipfsHash: pinCid.toString(),
                last_pinged: new Date(),
                last_updated: new Date(),
                first_seen: new Date(),
                expiration: null
            })
        }
    }
    async start() {
        this.dhtRecords = this.self.dhtRecords;
        this.trackedFiles = this.self.trackedFiles;
        //NodeSchedule.scheduleJob('* * * * *', this.refreshPins)
        //this.refreshPins()
        //this.singleQuery('bagiacgzah24drzou2jlkixpblbgbg6nxfrasoklzttzoht5hixhxz3rlncyq')
        //this.queryConnect('bagiacgzah24drzou2jlkixpblbgbg6nxfrasoklzttzoht5hixhxz3rlncyq')
    }
}