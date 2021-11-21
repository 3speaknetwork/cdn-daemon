import { MongoClient, Db, Collection } from 'mongodb'
import { ObjectId } from 'bson'
import * as IPFSHTTP from 'ipfs-http-client'
import { IPFSHTTPClient } from 'ipfs-http-client'

import { ConfigService } from '../config.service'
import { TrackedFile, DhtRecord, PeerInfo } from './db.model'
import { BloomFilter } from 'bloom-filters'
import { CID } from 'multiformats/cid'


import { logger } from '../common/logger.singleton'

import {TrackerService} from './tracker.service'
import {BindingService} from './bindings.service'

function parseCid(ipfsPath) {
    if (!ipfsPath) {
        return null
    }
    const ipfsCid = ipfsPath.replace('ipfs://', '');
    try {
        return CID.parse(ipfsCid);
    } catch (ex) {
        return null;
    }
}
export class CoreService {
    db: Db
    trackedFiles: Collection<TrackedFile>
    dhtRecords: Collection<DhtRecord>
    trackerService: TrackerService
    ipfs: IPFSHTTPClient
    trans: Db
    bindings: BindingService
    imageResized: Collection


    constructor(public readonly mongoClient: MongoClient) {
        this.db = this.mongoClient.db(ConfigService.getConfig().mongoDatabaseName)
        this.trans = this.mongoClient.db('hen_data')
    }


    async start() {
        logger.info(`Starting core service...`)

        // Init collections and indexes
        this.trackedFiles = this.db.collection('trackedFiles')
        this.dhtRecords = this.db.collection('dhtRecords')
        this.imageResized = this.db.collection('imageResized')
        
        this.ipfs = IPFSHTTP.create({ host: ConfigService.getConfig().ipfsHost })
        this.trackerService = new TrackerService(this)
        await this.trackerService.start()
        this.bindings = new BindingService(this)
        await this.bindings.start()
    }
}
