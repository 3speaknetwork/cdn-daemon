import { MongoClient } from 'mongodb'
const MONGO_HOST = 'localhost:27017'
const url = `mongodb://127.0.0.1:27017`
const mongo = new MongoClient(url)
import Ajv, { ValidateFunction } from 'ajv'

const ajv = new Ajv()

export async function insertOrchestralNode(nodeData: any) {
  try {
    console.log('Inserting Orchestral Node: ', nodeData)
    await mongo.connect()
    const db = mongo.db('spk-cdn-daemon')
    let collection = db.collection('orchesterNode')

    // Additional validation for address as a domain name
    if (!isValidDomainName(nodeData.address)) {
      console.error('Invalid domain name:', nodeData.address)
      throw new Error('Address should be a valid domain name.')
    }

    // Additional validation for a valid DID
    if (!isValidDid(nodeData.did)) {
      console.error('Invalid DID:', nodeData.did)
      throw new Error('DID should be a valid decentralized identifier.')
    }

    // Use findOneAndUpdate with upsert to ensure uniqueness based on 'did'
    const filter = { did: nodeData.did }
    const update = { $set: { ...nodeData, insertedAt: new Date() } }
    const options: any = { upsert: true }

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
