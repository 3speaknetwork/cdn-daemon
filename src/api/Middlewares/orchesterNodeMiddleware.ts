import { FindOneAndUpdateOptions, MongoClient } from 'mongodb'
import { ConfigService } from '@/config.service'
import { WithInsertTime } from '@/common/types'
import { NodeStats } from '../controllers/hub.interface'

export type OrchesterNode = {
  endpoint: string
  ipAddress: string
  stats: NodeStats
  did: string
}

export async function insertOrchestralNode(nodeData: OrchesterNode) {
  const mongo = new MongoClient(ConfigService.getConfig().mongoHost)
  try {
    console.log('Inserting Orchestral Node: ', nodeData)
    await mongo.connect()
    const db = mongo.db('spk-cdn-daemon')
    const collection = db.collection<WithInsertTime<OrchesterNode>>('orchesterNode')

    // Use findOneAndUpdate with upsert to ensure uniqueness based on 'did'
    const filter = { did: nodeData.did }
    const update = { $set: { ...nodeData, insertedAt: new Date() } }
    const options: FindOneAndUpdateOptions = { upsert: true }

    await collection.findOneAndUpdate(filter, update, options)

    console.log('Orchestral Node inserted successfully!')
  } catch (error) {
    console.error('Error inserting orchestral node:', error)
  } finally {
    // Close the connection
    await mongo.close()
  }
}

function isValidDomainName(address: string): boolean {
  // Simple domain name validation using a regular expression
  const domainNameRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return domainNameRegex.test(address)
}

function isValidDid(did: string): boolean {
  // Simple DID validation using a regular expression
  const didRegex = /^did:(ion|ethr|key|web):[a-zA-Z0-9-]+$/
  return didRegex.test(did)
}
