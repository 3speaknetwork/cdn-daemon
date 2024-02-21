import { MongoClient, Db, Collection } from 'mongodb'
import { ObjectId } from 'bson'
import * as IPFSHTTP from 'ipfs-http-client'
import { IPFSHTTPClient } from 'ipfs-http-client'

import { ConfigService } from '../config.service'
import { TrackedFile, DhtRecord, PeerInfo } from './db.model'
import { BloomFilter } from 'bloom-filters'
//@ts-ignore

import { logger } from '../common/logger.singleton'

import { TrackerService } from './tracker.service'
import { BindingService } from './bindings.service'

import { Config } from '../configLib'
import path from 'path'
import os from 'os'
import fs from 'fs'

// let CID=_CID.CID
// let CID=Block.CID

async function parseCid(ipfsPath) {
  const { CID } = await import('multiformats')

  if (!ipfsPath) {
    return null
  }
  const ipfsCid = ipfsPath.replace('ipfs://', '')
  try {
    return CID.parse(ipfsCid)
  } catch (ex) {
    return null
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
  config_: Config

  constructor(public readonly mongoClient: MongoClient) {
    this.db = this.mongoClient.db(ConfigService.getConfig().mongoDatabaseName)
    this.trans = this.mongoClient.db('hen_data')
    // Construct the path to the home directory
    const homeDirectory = os.homedir()

    // Construct the full path to the config directory
    const configPath = path.join(homeDirectory, '.speak-cdn', 'config')
    console.log('\n\n\n\n---------------- Adding config path as ', configPath, '\n\n')

    // Check if the directory exists, and create it if not
    if (!fs.existsSync(configPath)) {
      fs.mkdirSync(configPath, { recursive: true })
      console.log('Config directory created.')
    }
    // Use the config path as needed
    this.config_ = new Config(configPath)
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
